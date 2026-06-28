import Foundation

final class PlaybackSettings: ObservableObject {
    @Published var selectedAudioSource: AudioSource {
        didSet { defaults.set(selectedAudioSource.rawValue, forKey: Keys.audioSource) }
    }

    private let defaults = UserDefaults.standard

    init() {
        let rawValue = defaults.string(forKey: Keys.audioSource) ?? AudioSource.builtin.rawValue
        selectedAudioSource = AudioSource(rawValue: rawValue) ?? .builtin
    }

    func loadProgress(pageCount: Int) -> PlaybackState {
        let pageIndex = defaults.integer(forKey: Keys.pageIndex)
        let rawKind = defaults.string(forKey: Keys.kind)
        return PlaybackState(
            pageIndex: pageIndex >= 0 && pageIndex < pageCount ? pageIndex : 0,
            kind: rawKind.flatMap(SpeechKind.init(rawValue:)),
            position: defaults.double(forKey: Keys.position),
            wasPlaying: defaults.bool(forKey: Keys.wasPlaying),
            manualPagePlayback: defaults.bool(forKey: Keys.manualPagePlayback)
        )
    }

    func saveProgress(_ state: PlaybackState) {
        defaults.set(state.pageIndex, forKey: Keys.pageIndex)
        defaults.set(state.kind?.rawValue ?? "", forKey: Keys.kind)
        defaults.set(state.position, forKey: Keys.position)
        defaults.set(state.wasPlaying, forKey: Keys.wasPlaying)
        defaults.set(state.manualPagePlayback, forKey: Keys.manualPagePlayback)
    }

    private enum Keys {
        static let audioSource = "audio_source"
        static let pageIndex = "progress_page"
        static let kind = "progress_kind"
        static let position = "progress_position_seconds"
        static let wasPlaying = "progress_was_playing"
        static let manualPagePlayback = "progress_manual_page"
    }
}
