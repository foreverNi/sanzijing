import SwiftUI

struct ClassicPage: Codable, Identifiable, Equatable {
    let number: Int
    let verse: String
    let pinyin: String
    let story: String
    let moral: String
    let animation: String
    let backgroundColor: String
    let accentColor: String

    var id: Int { number }
}

enum AudioSource: String, CaseIterable, Identifiable, Codable {
    case builtin
    case mom
    case dad
    case custom

    var id: String { rawValue }

    var label: String {
        switch self {
        case .builtin: "APP自带音频"
        case .mom: "妈妈录制"
        case .dad: "爸爸录制"
        case .custom: "自定义录制"
        }
    }

    static var recordableSources: [AudioSource] {
        [.mom, .dad, .custom]
    }
}

enum SpeechKind: String, CaseIterable, Identifiable, Codable {
    case verse
    case story

    var id: String { rawValue }

    var label: String {
        switch self {
        case .verse: "读三字经"
        case .story: "讲故事"
        }
    }
}

struct PlaybackState: Codable {
    var pageIndex: Int
    var kind: SpeechKind?
    var position: TimeInterval
    var wasPlaying: Bool
    var manualPagePlayback: Bool
}

extension Color {
    init(argbHex: String) {
        var value = argbHex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        if value.count == 8 {
            value.removeFirst(2)
        }
        let scanner = Scanner(string: value)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255.0,
            green: Double((rgb >> 8) & 0xFF) / 255.0,
            blue: Double(rgb & 0xFF) / 255.0
        )
    }
}
