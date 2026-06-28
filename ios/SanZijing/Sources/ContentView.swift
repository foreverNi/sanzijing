import SwiftUI
import UIKit

struct ContentView: View {
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var settings = PlaybackSettings()
    @StateObject private var audioService = AudioService()
    @StateObject private var recordingService = RecordingService()

    @State private var currentPageIndex = 0
    @State private var autoMode = false
    @State private var autoRound = 0
    @State private var locked = false
    @State private var manualPagePlayback = false
    @State private var showSettings = false
    @State private var showQuickRecording = false
    @State private var showRecordingManager = false
    @State private var pendingAutoTask: Task<Void, Never>?

    private let pages = ContentRepository.pages

    var body: some View {
        NavigationStack {
            ZStack {
                if pages.isEmpty {
                    ContentUnavailableView("内容加载失败", systemImage: "exclamationmark.triangle", description: Text("未能读取 ContentData.json"))
                } else {
                    pageContent
                }

                if locked {
                    lockOverlay
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("三字经故事乐园")
                        .font(.headline)
                }
                ToolbarItem(placement: .topBarLeading) {
                    Button(recordingService.isRecording ? "停止" : "录制") {
                        if recordingService.isRecording {
                            recordingService.stop(keepFile: true)
                        } else {
                            stopAutoMode()
                            showQuickRecording = true
                        }
                    }
                    .disabled(locked && !recordingService.isRecording)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("设置") {
                        showSettings = true
                    }
                    .disabled(locked || recordingService.isRecording)
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsSheet(
                    selectedSource: $settings.selectedAudioSource,
                    showRecordingManager: $showRecordingManager
                )
            }
            .sheet(isPresented: $showQuickRecording) {
                QuickRecordingSheet(
                    page: currentPage,
                    recordingService: recordingService
                )
            }
            .sheet(isPresented: $showRecordingManager) {
                RecordingManagerSheet(
                    page: currentPage,
                    recordingService: recordingService
                )
            }
            .onAppear(perform: restoreProgress)
            .onChange(of: scenePhase) { _, phase in
                if phase != .active {
                    saveProgress(wasPlaying: audioService.isPlaying)
                }
            }
        }
    }

    private var currentPage: ClassicPage {
        pages[min(max(currentPageIndex, 0), max(0, pages.count - 1))]
    }

    private var pageContent: some View {
        ScrollView {
            VStack(spacing: 14) {
                Text("第 \(currentPage.number) 页 / 共 \(pages.count) 页")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .padding(.top, 8)

                verseCard
                illustrationView
                storySection
                actionButtons

                Text(statusText)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity, minHeight: 20)
                    .padding(.bottom, 24)
            }
            .padding(.horizontal, 20)
        }
        .background(Color(.systemGroupedBackground))
        .gesture(
            DragGesture(minimumDistance: 64)
                .onEnded { value in
                    guard !locked, !recordingService.isRecording else { return }
                    guard abs(value.translation.width) > abs(value.translation.height) * 1.5 else { return }
                    changePage(value.translation.width < 0 ? 1 : -1)
                }
        )
    }

    private var verseCard: some View {
        VStack(spacing: 8) {
            Text(currentPage.verse)
                .font(.system(.largeTitle, design: .serif).weight(.bold))
                .multilineTextAlignment(.center)
                .minimumScaleFactor(0.72)

            Text(currentPage.pinyin)
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(18)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color(argbHex: currentPage.accentColor).opacity(0.25))
        )
    }

    private var illustrationView: some View {
        Group {
            if let image = pageImage(currentPage.number) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
            } else {
                VStack(spacing: 8) {
                    Image(systemName: "photo")
                        .font(.largeTitle)
                    Text(currentPage.animation)
                        .font(.caption)
                }
                .foregroundStyle(.secondary)
            }
        }
        .frame(height: 180)
        .frame(maxWidth: .infinity)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(Color(argbHex: currentPage.accentColor).opacity(0.35))
        )
        .background(Color(argbHex: currentPage.backgroundColor), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var storySection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("故事解说")
                .font(.headline)

            Text(currentPage.story)
                .font(.body)
                .lineSpacing(3)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 16, style: .continuous))

            Text("小小启示：\(currentPage.moral)")
                .font(.body.weight(.semibold))
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(14)
                .background(Color(.tertiarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private var actionButtons: some View {
        VStack(spacing: 10) {
            Button {
                speakManualPage()
            } label: {
                Label("播放", systemImage: "play.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(locked || recordingService.isRecording)

            Button {
                autoMode ? stopAutoMode() : startAutoMode()
            } label: {
                Label(autoMode ? "停止自动播放" : "自动播放", systemImage: autoMode ? "stop.fill" : "repeat")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .controlSize(.large)
            .disabled(recordingService.isRecording || locked)
        }
    }

    private var lockOverlay: some View {
        ZStack {
            Color.black.opacity(0.35)
                .ignoresSafeArea()

            VStack(spacing: 16) {
                Text("自动播放已锁定")
                    .font(.title3.bold())
                Text("长按下方按钮停止自动播放")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Button("长按停止") {}
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    .simultaneousGesture(
                        LongPressGesture(minimumDuration: 0.9)
                            .onEnded { _ in
                                stopAutoMode()
                            }
                    )
            }
            .padding(24)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            .padding(28)
        }
    }

    private var statusText: String {
        if recordingService.isRecording || !recordingService.statusText.isEmpty {
            return recordingService.statusText
        }
        return audioService.statusText
    }

    private func pageImage(_ number: Int) -> UIImage? {
        let name = "page_\(String(format: "%03d", number))"
        guard let url = Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "illustrations") else {
            AppLogger.error("Missing illustration \(name).png")
            return nil
        }
        return UIImage(contentsOfFile: url.path)
    }

    private func changePage(_ direction: Int) {
        let nextIndex = currentPageIndex + direction
        guard pages.indices.contains(nextIndex) else { return }
        manualPagePlayback = false
        stopAutoMode()
        audioService.stop()
        currentPageIndex = nextIndex
        saveProgress(wasPlaying: false)
    }

    private func speakManualPage(startKind: SpeechKind = .verse, startPosition: TimeInterval = 0) {
        stopAutoMode(stopAudio: false)
        manualPagePlayback = true
        audioService.statusText = "正在播放当前页..."
        play(kind: startKind, utteranceId: startKind == .verse ? "manual-page-verse" : "manual-page-story", startPosition: startPosition)
    }

    private func startAutoMode() {
        manualPagePlayback = false
        autoMode = true
        locked = true
        autoRound = 0
        audioService.statusText = "自动播放：每页读三字经、讲故事各 3 次。"
        runAutoRound()
    }

    private func stopAutoMode(stopAudio: Bool = true) {
        autoMode = false
        locked = false
        autoRound = 0
        pendingAutoTask?.cancel()
        pendingAutoTask = nil
        if stopAudio {
            audioService.stop()
        }
    }

    private func runAutoRound() {
        guard autoMode else { return }
        if autoRound >= 3 {
            audioService.statusText = "本页播放完成，1 分钟后进入下一页。"
            pendingAutoTask?.cancel()
            pendingAutoTask = Task {
                try? await Task.sleep(for: .seconds(60))
                await MainActor.run {
                    guard autoMode else { return }
                    currentPageIndex = (currentPageIndex + 1) % pages.count
                    autoRound = 0
                    runAutoRound()
                }
            }
            return
        }
        audioService.statusText = "自动播放第 \(autoRound + 1) / 3 轮：读三字经。"
        play(kind: .verse, utteranceId: "auto-verse-\(autoRound)")
    }

    private func play(kind: SpeechKind, utteranceId: String, startPosition: TimeInterval = 0) {
        audioService.play(
            page: currentPage,
            kind: kind,
            source: settings.selectedAudioSource,
            utteranceId: utteranceId,
            startPosition: startPosition,
            completion: handleSpeechDone
        )
    }

    private func handleSpeechDone(_ utteranceId: String) {
        if manualPagePlayback, utteranceId == "manual-page-verse" {
            audioService.statusText = "正在播放故事..."
            play(kind: .story, utteranceId: "manual-page-story")
            return
        }
        if manualPagePlayback, utteranceId == "manual-page-story" {
            manualPagePlayback = false
            audioService.statusText = ""
            saveProgress(wasPlaying: false)
            return
        }
        guard autoMode else {
            audioService.statusText = ""
            saveProgress(wasPlaying: false)
            return
        }
        if utteranceId.hasPrefix("auto-verse-") {
            audioService.statusText = "自动播放第 \(autoRound + 1) / 3 轮：讲故事。"
            play(kind: .story, utteranceId: "auto-story-\(autoRound)")
        } else if utteranceId.hasPrefix("auto-story-") {
            autoRound += 1
            runAutoRound()
        }
    }

    private func restoreProgress() {
        guard !pages.isEmpty else { return }
        let progress = settings.loadProgress(pageCount: pages.count)
        currentPageIndex = progress.pageIndex
        if progress.wasPlaying, let kind = progress.kind {
            AppLogger.info("Restoring playback page \(progress.pageIndex + 1), \(kind.rawValue)")
            Task {
                try? await Task.sleep(for: .milliseconds(250))
                await MainActor.run {
                    manualPagePlayback = progress.manualPagePlayback
                    audioService.statusText = "已恢复到上次播放位置..."
                    if progress.manualPagePlayback {
                        speakManualPage(startKind: kind, startPosition: progress.position)
                    } else {
                        play(kind: kind, utteranceId: "manual-page-\(kind.rawValue)", startPosition: progress.position)
                    }
                }
            }
        }
    }

    private func saveProgress(wasPlaying: Bool) {
        settings.saveProgress(
            PlaybackState(
                pageIndex: currentPageIndex,
                kind: wasPlaying ? audioService.currentKind : nil,
                position: wasPlaying ? audioService.currentPosition : 0,
                wasPlaying: wasPlaying,
                manualPagePlayback: wasPlaying && manualPagePlayback
            )
        )
    }
}

private struct SettingsSheet: View {
    @Binding var selectedSource: AudioSource
    @Binding var showRecordingManager: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Picker("播放音源", selection: $selectedSource) {
                    ForEach(AudioSource.allCases) { source in
                        Text(source.label).tag(source)
                    }
                }

                Button("录音管理") {
                    dismiss()
                    showRecordingManager = true
                }

                Link("系统语音设置", destination: URL(string: UIApplication.openSettingsURLString)!)
            }
            .navigationTitle("设置")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("完成") { dismiss() }
                }
            }
        }
    }
}

private struct QuickRecordingSheet: View {
    let page: ClassicPage
    @ObservedObject var recordingService: RecordingService
    @Environment(\.dismiss) private var dismiss
    @State private var source: AudioSource = .mom
    @State private var kind: SpeechKind = .verse
    @State private var showOverwrite = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text("第 \(page.number) 页 / 共 \(ContentRepository.pages.count) 页")
                    Picker("角色", selection: $source) {
                        ForEach(AudioSource.recordableSources) { source in
                            Text(source.label).tag(source)
                        }
                    }
                    Picker("内容", selection: $kind) {
                        ForEach(SpeechKind.allCases) { kind in
                            Text(kind.label).tag(kind)
                        }
                    }
                }

                Section {
                    Button(recordingService.isRecording ? "停止并保存" : "开始录制") {
                        if recordingService.isRecording {
                            recordingService.stop(keepFile: true)
                            dismiss()
                        } else if RecordingService.hasRecording(source: source, kind: kind, pageNumber: page.number) {
                            showOverwrite = true
                        } else {
                            recordingService.start(source: source, kind: kind, pageNumber: page.number)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }

                if !recordingService.statusText.isEmpty {
                    Text(recordingService.statusText)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("开始录制")
            .confirmationDialog("当前段已有录音，是否覆盖？", isPresented: $showOverwrite, titleVisibility: .visible) {
                Button("覆盖", role: .destructive) {
                    recordingService.start(source: source, kind: kind, pageNumber: page.number)
                }
                Button("取消", role: .cancel) {}
            }
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("关闭") {
                        if recordingService.isRecording {
                            recordingService.stop(keepFile: false)
                        }
                        dismiss()
                    }
                }
            }
        }
    }
}

private struct RecordingManagerSheet: View {
    let page: ClassicPage
    @ObservedObject var recordingService: RecordingService
    @Environment(\.dismiss) private var dismiss
    @State private var source: AudioSource = .mom

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text("第 \(page.number) 页 / 共 \(ContentRepository.pages.count) 页")
                    Picker("录音角色", selection: $source) {
                        ForEach(AudioSource.recordableSources) { source in
                            Text(source.label).tag(source)
                        }
                    }
                }

                ForEach(SpeechKind.allCases) { kind in
                    Section(kind.label) {
                        let exists = RecordingService.hasRecording(source: source, kind: kind, pageNumber: page.number)
                        Text(exists ? "已录制" : "未录制")
                            .foregroundStyle(.secondary)

                        Button(recordingService.isRecording && recordingService.activeKind == kind ? "停止并保存" : "录制") {
                            if recordingService.isRecording {
                                recordingService.stop(keepFile: true)
                            } else {
                                recordingService.start(source: source, kind: kind, pageNumber: page.number)
                            }
                        }

                        Button("试听") {
                            recordingService.preview(source: source, kind: kind, pageNumber: page.number)
                        }
                        .disabled(!exists || recordingService.isRecording)

                        Button("删除", role: .destructive) {
                            recordingService.delete(source: source, kind: kind, pageNumber: page.number)
                        }
                        .disabled(!exists || recordingService.isRecording)
                    }
                }

                if !recordingService.statusText.isEmpty {
                    Text(recordingService.statusText)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("录音管理")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("完成") { dismiss() }
                }
            }
        }
    }
}
