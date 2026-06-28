import AVFoundation
import Foundation

@MainActor
final class RecordingService: NSObject, ObservableObject {
    @Published var isRecording = false
    @Published var statusText = ""
    @Published var activeSource: AudioSource?
    @Published var activeKind: SpeechKind?

    private var recorder: AVAudioRecorder?
    private var previewPlayer: AVAudioPlayer?
    private var currentURL: URL?

    static func audioURL(source: AudioSource, kind: SpeechKind, pageNumber: Int) -> URL {
        let directory = documentsDirectory
            .appendingPathComponent("user_audio", isDirectory: true)
            .appendingPathComponent(source.rawValue, isDirectory: true)
        return directory.appendingPathComponent("\(kind.rawValue)_\(String(format: "%03d", pageNumber)).m4a")
    }

    static func hasRecording(source: AudioSource, kind: SpeechKind, pageNumber: Int) -> Bool {
        let url = audioURL(source: source, kind: kind, pageNumber: pageNumber)
        return FileManager.default.fileExists(atPath: url.path)
    }

    func start(source: AudioSource, kind: SpeechKind, pageNumber: Int) {
        guard source != .builtin else {
            return
        }
        Task {
            let granted = await requestPermission()
            if granted {
                beginRecording(source: source, kind: kind, pageNumber: pageNumber)
            } else {
                statusText = "未授权麦克风，无法录音。"
                AppLogger.error(statusText)
            }
        }
    }

    func stop(keepFile: Bool) {
        guard isRecording else {
            return
        }
        recorder?.stop()
        recorder = nil
        isRecording = false
        if !keepFile, let currentURL {
            try? FileManager.default.removeItem(at: currentURL)
            statusText = "录音未保存"
        } else {
            statusText = "录音已保存"
        }
        activeSource = nil
        activeKind = nil
        currentURL = nil
    }

    func delete(source: AudioSource, kind: SpeechKind, pageNumber: Int) {
        let url = Self.audioURL(source: source, kind: kind, pageNumber: pageNumber)
        do {
            try FileManager.default.removeItem(at: url)
            statusText = "录音已删除"
        } catch {
            statusText = "删除录音失败：\(error.localizedDescription)"
            AppLogger.error(statusText)
        }
    }

    func preview(source: AudioSource, kind: SpeechKind, pageNumber: Int) {
        let url = Self.audioURL(source: source, kind: kind, pageNumber: pageNumber)
        guard FileManager.default.fileExists(atPath: url.path) else {
            statusText = "这段还没有录音"
            return
        }
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio)
            try AVAudioSession.sharedInstance().setActive(true)
            previewPlayer = try AVAudioPlayer(contentsOf: url)
            previewPlayer?.play()
            statusText = "正在试听录音..."
        } catch {
            statusText = "试听失败：\(error.localizedDescription)"
            AppLogger.error(statusText)
        }
    }

    private func requestPermission() async -> Bool {
        switch AVAudioApplication.shared.recordPermission {
        case .granted:
            return true
        case .denied:
            return false
        case .undetermined:
            return await withCheckedContinuation { continuation in
                AVAudioApplication.requestRecordPermission { granted in
                    continuation.resume(returning: granted)
                }
            }
        @unknown default:
            return false
        }
    }

    private func beginRecording(source: AudioSource, kind: SpeechKind, pageNumber: Int) {
        let url = Self.audioURL(source: source, kind: kind, pageNumber: pageNumber)
        do {
            try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
            try AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .spokenAudio, options: [.defaultToSpeaker])
            try AVAudioSession.sharedInstance().setActive(true)
            recorder = try AVAudioRecorder(
                url: url,
                settings: [
                    AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
                    AVSampleRateKey: 44_100,
                    AVNumberOfChannelsKey: 1,
                    AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue,
                    AVEncoderBitRateKey: 96_000
                ]
            )
            recorder?.record()
            currentURL = url
            activeSource = source
            activeKind = kind
            isRecording = true
            statusText = "正在录制\(source.label)：\(kind.label)"
        } catch {
            statusText = "录音启动失败：\(error.localizedDescription)"
            AppLogger.error(statusText)
            try? FileManager.default.removeItem(at: url)
        }
    }

    private static var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }
}
