import AVFoundation
import Foundation

@MainActor
final class AudioService: NSObject, ObservableObject {
    @Published var statusText = ""
    @Published var isPlaying = false

    private var audioPlayer: AVAudioPlayer?
    private var speechSynthesizer = AVSpeechSynthesizer()
    private var completion: ((String) -> Void)?
    private var activeUtteranceId = ""
    private var activeKind: SpeechKind?

    override init() {
        super.init()
        speechSynthesizer.delegate = self
    }

    var currentKind: SpeechKind? {
        activeKind
    }

    var currentPosition: TimeInterval {
        audioPlayer?.currentTime ?? 0
    }

    func play(
        page: ClassicPage,
        kind: SpeechKind,
        source: AudioSource,
        utteranceId: String,
        startPosition: TimeInterval = 0,
        completion: @escaping (String) -> Void
    ) {
        stop()
        self.completion = completion
        activeUtteranceId = utteranceId
        activeKind = kind

        if source != .builtin, playUserRecording(page: page, kind: kind, source: source, startPosition: startPosition) {
            statusText = "正在播放\(source.label)..."
            return
        }

        if playBundledAudio(page: page, kind: kind, startPosition: startPosition) {
            statusText = "正在播放内置语音..."
            return
        }

        AppLogger.info("Bundled audio missing, falling back to iOS speech for page \(page.number) \(kind.rawValue)")
        speakWithSystemVoice(page: page, kind: kind)
    }

    func stop() {
        audioPlayer?.stop()
        audioPlayer = nil
        speechSynthesizer.stopSpeaking(at: .immediate)
        isPlaying = false
        completion = nil
        activeKind = nil
    }

    private func playUserRecording(page: ClassicPage, kind: SpeechKind, source: AudioSource, startPosition: TimeInterval) -> Bool {
        let url = RecordingService.audioURL(source: source, kind: kind, pageNumber: page.number)
        guard FileManager.default.fileExists(atPath: url.path) else {
            return false
        }
        return playAudio(url: url, startPosition: startPosition)
    }

    private func playBundledAudio(page: ClassicPage, kind: SpeechKind, startPosition: TimeInterval) -> Bool {
        let name = "\(kind.rawValue)_\(String(format: "%03d", page.number))"
        guard let url = Bundle.main.url(forResource: name, withExtension: "wav", subdirectory: "audio") else {
            statusText = "内置语音文件缺失：audio/\(name).wav"
            AppLogger.error(statusText)
            return false
        }
        return playAudio(url: url, startPosition: startPosition)
    }

    private func playAudio(url: URL, startPosition: TimeInterval) -> Bool {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio)
            try AVAudioSession.sharedInstance().setActive(true)
            let player = try AVAudioPlayer(contentsOf: url)
            player.delegate = self
            player.prepareToPlay()
            if startPosition > 0, startPosition < max(0, player.duration - 0.5) {
                player.currentTime = startPosition
            }
            audioPlayer = player
            isPlaying = player.play()
            return isPlaying
        } catch {
            AppLogger.error("Audio playback failed: \(error.localizedDescription)")
            statusText = "音频播放失败：\(error.localizedDescription)"
            return false
        }
    }

    private func speakWithSystemVoice(page: ClassicPage, kind: SpeechKind) {
        let text = kind == .verse ? page.verse : "\(page.story)。\(page.moral)"
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "zh-CN") ?? AVSpeechSynthesisVoice(language: "zh-Hans")
        utterance.rate = 0.42
        utterance.pitchMultiplier = 1.08
        if utterance.voice == nil {
            statusText = "系统中文语音不可用，请在 iOS 设置中添加中文语音。"
            AppLogger.error(statusText)
            isPlaying = false
            completion?(activeUtteranceId)
            return
        }
        statusText = "正在使用系统语音朗读..."
        isPlaying = true
        speechSynthesizer.speak(utterance)
    }

    private func completePlayback() {
        let utteranceId = activeUtteranceId
        isPlaying = false
        audioPlayer = nil
        activeKind = nil
        let handler = completion
        completion = nil
        handler?(utteranceId)
    }
}

extension AudioService: AVAudioPlayerDelegate {
    nonisolated func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        Task { @MainActor in
            completePlayback()
        }
    }

    nonisolated func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        Task { @MainActor in
            statusText = "音频解码失败：\(error?.localizedDescription ?? "未知错误")"
            AppLogger.error(statusText)
            completePlayback()
        }
    }
}

extension AudioService: AVSpeechSynthesizerDelegate {
    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        Task { @MainActor in
            completePlayback()
        }
    }

    nonisolated func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        Task { @MainActor in
            isPlaying = false
        }
    }
}
