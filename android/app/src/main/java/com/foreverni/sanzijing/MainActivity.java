package com.foreverni.sanzijing;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Locale;

public final class MainActivity extends Activity {
    private static final int RECORD_AUDIO_REQUEST_CODE = 41;
    private static final int PAGE_PAUSE_MS = 60_000;
    private static final int UNLOCK_HOLD_MS = 900;
    private static final int SWIPE_THRESHOLD_DP = 80;
    private static final String PREFS_NAME = "sanzijing_settings";
    private static final String PREF_AUDIO_SOURCE = "audio_source";
    private static final String PREF_PROGRESS_PAGE = "progress_page";
    private static final String PREF_PROGRESS_KIND = "progress_kind";
    private static final String PREF_PROGRESS_POSITION_MS = "progress_position_ms";
    private static final String PREF_PROGRESS_WAS_PLAYING = "progress_was_playing";
    private static final String PREF_PROGRESS_MANUAL_PAGE = "progress_manual_page";
    private static final String SOURCE_BUILTIN = "builtin";
    private static final String SOURCE_MOM = "mom";
    private static final String SOURCE_DAD = "dad";
    private static final String SOURCE_CUSTOM = "custom";
    private static final int EYE_BACKGROUND = Color.rgb(247, 250, 242);
    private static final int PANEL_BACKGROUND = Color.rgb(255, 253, 246);
    private static final int TEXT_PRIMARY = Color.rgb(48, 66, 54);
    private static final int TEXT_SECONDARY = Color.rgb(93, 112, 97);
    private static final int ACTION_GREEN = Color.rgb(91, 140, 106);

    private final Handler handler = new Handler(Looper.getMainLooper());
    private int currentPageIndex = 0;
    private int autoRound = 0;
    private boolean autoMode = false;
    private boolean ttsReady = false;
    private boolean locked = false;
    private boolean ttsFallbackAttempted = false;
    private boolean isRecording = false;
    private boolean manualPagePlayback = false;
    private String selectedAudioSource = SOURCE_BUILTIN;
    private String recordingProfile = SOURCE_MOM;
    private String pendingRecordingKind;
    private String pendingRecordingProfile;
    private String activeSpeechKind = "";
    private String pendingResumeKind;
    private String activeSpeechText = "";
    private String activeSpeechBaseId = "";
    private int pendingResumePositionMs = 0;
    private boolean pendingResumeManualPage = false;
    private File pendingSpeechFile;
    private File currentRecordingFile;
    private MediaPlayer currentSpeechPlayer;
    private MediaRecorder mediaRecorder;
    private AlertDialog recordingDialog;
    private Runnable pendingAutoRunnable;
    private Runnable pendingUnlockRunnable;
    private Runnable pendingSpeechTimeoutRunnable;
    private SharedPreferences preferences;

    private FrameLayout root;
    private LinearLayout content;
    private LinearLayout recordingDialogContent;
    private TextView pageIndicator;
    private TextView verseText;
    private TextView pinyinText;
    private NativeAnimationView sceneView;
    private TextView storyText;
    private TextView moralText;
    private TextView statusText;
    private TextView lockHint;
    private Button playButton;
    private Button autoButton;
    private Button recordButton;
    private Button settingsButton;
    private Button ttsSettingsButton;
    private View lockOverlay;
    private TextToSpeech textToSpeech;
    private float touchStartX;
    private float touchStartY;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        selectedAudioSource = normalizeAudioSource(preferences.getString(PREF_AUDIO_SOURCE, SOURCE_BUILTIN));
        restoreSavedPage();
        buildLayout();
        renderPage();
        schedulePlaybackResumeIfNeeded();
    }

    @Override
    protected void onPause() {
        savePlaybackProgress(isSpeechPlayerPlaying());
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        stopAutoMode();
        stopRecording(false);
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        super.onDestroy();
    }

    private void configureTts() {
        textToSpeech = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            if (ttsReady) {
                int localeResult = chooseChineseVoice();
                textToSpeech.setAudioAttributes(new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .build());
                textToSpeech.setSpeechRate(0.86f);
                textToSpeech.setPitch(1.08f);
                ttsReady = localeResult >= TextToSpeech.LANG_AVAILABLE;
            }
            runOnUiThread(() -> {
                ttsSettingsButton.setVisibility(ttsReady ? View.GONE : View.VISIBLE);
                statusText.setText(ttsReady ? "" : ttsDiagnostic("当前系统 TTS 不支持普通话"));
            });
        });
        textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                runOnUiThread(() -> {
                    if (isSynthUtterance(utteranceId)) {
                        statusText.setText("正在生成系统 TTS 语音...");
                        return;
                    }
                    clearSpeechTimeout();
                    if (!autoMode) {
                        statusText.setText("正在朗读...");
                    }
                });
            }

            @Override
            public void onDone(String utteranceId) {
                if (isSynthUtterance(utteranceId)) {
                    runOnUiThread(() -> playSynthesizedSpeech(baseSynthId(utteranceId)));
                    return;
                }
                runOnUiThread(() -> clearSpeechTimeout());
                if (isLastSpeechChunk(utteranceId)) {
                    runOnUiThread(() -> handleSpeechDone(baseSpeechId(utteranceId)));
                }
            }

            @Override
            public void onError(String utteranceId) {
                runOnUiThread(() -> {
                    clearSpeechTimeout();
                    if (!ttsFallbackAttempted && activeSpeechText != null && !activeSpeechText.isEmpty()) {
                        ttsFallbackAttempted = true;
                        textToSpeech.setLanguage(Locale.getDefault());
                        statusText.setText("正在使用系统默认 TTS 重试...");
                        synthesizeSpeech(activeSpeechText, activeSpeechBaseId);
                        return;
                    }
                    ttsSettingsButton.setVisibility(View.VISIBLE);
                    statusText.setText(ttsDiagnostic("系统 TTS 播放失败"));
                    stopAutoMode();
                });
            }

            @Override
            public void onError(String utteranceId, int errorCode) {
                onError(utteranceId);
            }
        });
    }

    private void buildLayout() {
        root = new FrameLayout(this);
        ScrollView scrollView = new ScrollView(this);
        scrollView.setFillViewport(true);
        scrollView.setBackgroundColor(EYE_BACKGROUND);

        content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(18), dp(16), dp(18), dp(28));
        scrollView.addView(content, new ScrollView.LayoutParams(
            ScrollView.LayoutParams.MATCH_PARENT,
            ScrollView.LayoutParams.WRAP_CONTENT
        ));

        LinearLayout topBar = row();
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        TextView title = label("三字经故事乐园", 25, TEXT_PRIMARY, Typeface.BOLD);
        title.setGravity(Gravity.CENTER_VERTICAL);
        topBar.addView(title, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));

        recordButton = topButton("录制");
        settingsButton = topButton("设置");
        topBar.addView(recordButton, topButtonLayout());
        topBar.addView(settingsButton, topButtonLayout());
        content.addView(topBar, matchWrap());

        pageIndicator = label("", 15, TEXT_SECONDARY, Typeface.NORMAL);
        pageIndicator.setGravity(Gravity.CENTER);
        content.addView(pageIndicator, matchWrap());

        verseText = label("", 30, TEXT_PRIMARY, Typeface.BOLD);
        verseText.setGravity(Gravity.CENTER);
        verseText.setPadding(dp(14), dp(18), dp(14), dp(6));
        content.addView(verseText, panelLayout());

        pinyinText = label("", 17, TEXT_SECONDARY, Typeface.NORMAL);
        pinyinText.setGravity(Gravity.CENTER);
        pinyinText.setPadding(dp(10), dp(0), dp(10), dp(10));
        content.addView(pinyinText, matchWrap());

        sceneView = new NativeAnimationView(this);
        content.addView(sceneView, sceneLayout());

        TextView storyTitle = label("故事解说", 20, TEXT_PRIMARY, Typeface.BOLD);
        storyTitle.setPadding(0, dp(10), 0, dp(8));
        content.addView(storyTitle, matchWrap());

        storyText = label("", 17, TEXT_PRIMARY, Typeface.NORMAL);
        storyText.setLineSpacing(dp(2), 1.0f);
        storyText.setPadding(dp(14), dp(14), dp(14), dp(14));
        content.addView(storyText, panelLayout());

        moralText = label("", 16, TEXT_SECONDARY, Typeface.BOLD);
        moralText.setPadding(dp(14), dp(12), dp(14), dp(12));
        content.addView(moralText, panelLayout());

        playButton = actionButton("播放");
        content.addView(playButton, autoButtonLayout());

        autoButton = actionButton("自动播放");
        content.addView(autoButton, autoButtonLayout());

        ttsSettingsButton = actionButton("语音设置");
        ttsSettingsButton.setVisibility(View.GONE);
        content.addView(ttsSettingsButton, autoButtonLayout());

        statusText = label("", 15, TEXT_SECONDARY, Typeface.NORMAL);
        statusText.setGravity(Gravity.CENTER);
        statusText.setPadding(0, dp(10), 0, 0);
        content.addView(statusText, matchWrap());

        scrollView.setOnTouchListener((v, event) -> handlePageSwipe(event));
        recordButton.setOnClickListener(v -> {
            if (isRecording) {
                stopRecording(true);
            } else {
                showQuickRecordingDialog();
            }
        });
        settingsButton.setOnClickListener(v -> showSettingsDialog());
        playButton.setOnClickListener(v -> speakManualPage());
        autoButton.setOnClickListener(v -> {
            if (autoMode) {
                stopAutoMode();
            } else {
                startAutoMode();
            }
        });
        ttsSettingsButton.setOnClickListener(v -> openTtsSettings());

        root.addView(scrollView);
        buildLockOverlay();
        setContentView(root);
    }

    private void buildLockOverlay() {
        FrameLayout overlay = new FrameLayout(this);
        overlay.setPadding(dp(18), dp(18), dp(18), dp(28));
        overlay.setBackgroundColor(Color.TRANSPARENT);
        overlay.setVisibility(View.GONE);

        lockHint = label("自动播放已锁定  ·  三指按住左上、右上、下方中央解锁", 15, Color.WHITE, Typeface.BOLD);
        lockHint.setGravity(Gravity.CENTER);
        lockHint.setPadding(dp(14), dp(10), dp(14), dp(10));
        lockHint.setBackground(rounded(Color.argb(218, 37, 54, 45), Color.argb(230, 154, 190, 163)));
        FrameLayout.LayoutParams hintParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT,
            Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
        );
        overlay.addView(lockHint, hintParams);

        overlay.setOnTouchListener((v, event) -> {
            handleUnlockTouch(v, event);
            return true;
        });
        lockOverlay = overlay;
        root.addView(lockOverlay, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
    }

    private void renderPage() {
        ClassicPage page = page();
        content.setBackgroundColor(blend(page.backgroundColor, EYE_BACKGROUND, 0.78f));
        int softAccent = blend(page.accentColor, EYE_BACKGROUND, 0.58f);
        verseText.setBackground(rounded(PANEL_BACKGROUND, softAccent));
        storyText.setBackground(rounded(PANEL_BACKGROUND, softAccent));
        moralText.setBackground(rounded(blend(page.backgroundColor, PANEL_BACKGROUND, 0.7f), softAccent));
        pageIndicator.setText("第 " + (currentPageIndex + 1) + " 页 / 共 " + ContentRepository.PAGES.length + " 页");
        verseText.setText(page.verse);
        pinyinText.setText(page.pinyin);
        storyText.setText(page.story);
        moralText.setText("小小启示：" + page.moral);
        sceneView.setPage(page);
        updateRecordingControls();
        if (!autoMode) {
            statusText.setText("");
        }
    }

    private boolean handlePageSwipe(MotionEvent event) {
        if (locked || isRecording) {
            return false;
        }
        if (event.getActionMasked() == MotionEvent.ACTION_DOWN) {
            touchStartX = event.getX();
            touchStartY = event.getY();
            return false;
        }
        if (event.getActionMasked() != MotionEvent.ACTION_UP) {
            return false;
        }
        float deltaX = event.getX() - touchStartX;
        float deltaY = event.getY() - touchStartY;
        if (Math.abs(deltaX) < dp(SWIPE_THRESHOLD_DP) || Math.abs(deltaX) < Math.abs(deltaY) * 1.5f) {
            return false;
        }
        if (deltaX < 0) {
            changePageBySwipe(1);
        } else {
            changePageBySwipe(-1);
        }
        return true;
    }

    private void changePageBySwipe(int direction) {
        int nextIndex = currentPageIndex + direction;
        if (nextIndex < 0 || nextIndex >= ContentRepository.PAGES.length) {
            return;
        }
        manualPagePlayback = false;
        stopAutoMode();
        if (textToSpeech != null) {
            textToSpeech.stop();
        }
        releaseSpeechPlayer();
        currentPageIndex = nextIndex;
        renderPage();
        savePlaybackProgress(false);
    }

    private void speakManualPage() {
        stopAutoMode();
        manualPagePlayback = true;
        statusText.setText("正在播放当前页...");
        speak("verse", "manual-page-verse");
    }

    private void restoreSavedPage() {
        int savedPage = preferences.getInt(PREF_PROGRESS_PAGE, 0);
        if (savedPage >= 0 && savedPage < ContentRepository.PAGES.length) {
            currentPageIndex = savedPage;
        }
        if (preferences.getBoolean(PREF_PROGRESS_WAS_PLAYING, false)) {
            String kind = preferences.getString(PREF_PROGRESS_KIND, "");
            if ("verse".equals(kind) || "story".equals(kind)) {
                pendingResumeKind = kind;
                pendingResumePositionMs = Math.max(0, preferences.getInt(PREF_PROGRESS_POSITION_MS, 0));
                pendingResumeManualPage = preferences.getBoolean(PREF_PROGRESS_MANUAL_PAGE, false);
            }
        }
    }

    private void schedulePlaybackResumeIfNeeded() {
        if (pendingResumeKind == null) {
            return;
        }
        handler.postDelayed(() -> {
            String kind = pendingResumeKind;
            int positionMs = pendingResumePositionMs;
            boolean resumeManualPage = pendingResumeManualPage;
            pendingResumeKind = null;
            pendingResumePositionMs = 0;
            pendingResumeManualPage = false;
            if (isRecording || locked) {
                return;
            }
            manualPagePlayback = resumeManualPage;
            statusText.setText("已恢复到上次播放位置...");
            speak(kind, resumeManualPage && "story".equals(kind) ? "manual-page-story" : "manual-page-" + kind, positionMs);
        }, 250);
    }

    private void savePlaybackProgress(boolean wasPlaying) {
        int positionMs = 0;
        if (wasPlaying && currentSpeechPlayer != null) {
            try {
                positionMs = Math.max(0, currentSpeechPlayer.getCurrentPosition());
            } catch (IllegalStateException ignored) {
                positionMs = 0;
            }
        }
        preferences.edit()
            .putInt(PREF_PROGRESS_PAGE, currentPageIndex)
            .putString(PREF_PROGRESS_KIND, wasPlaying ? activeSpeechKind : "")
            .putInt(PREF_PROGRESS_POSITION_MS, wasPlaying ? positionMs : 0)
            .putBoolean(PREF_PROGRESS_WAS_PLAYING, wasPlaying)
            .putBoolean(PREF_PROGRESS_MANUAL_PAGE, wasPlaying && manualPagePlayback)
            .apply();
    }

    private boolean isSpeechPlayerPlaying() {
        if (currentSpeechPlayer == null) {
            return false;
        }
        try {
            return currentSpeechPlayer.isPlaying();
        } catch (IllegalStateException ignored) {
            return false;
        }
    }

    private void startAutoMode() {
        manualPagePlayback = false;
        autoMode = true;
        autoRound = 0;
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        autoButton.setText("停止自动播放");
        setLocked(true);
        statusText.setText("自动播放：每页读三字经、讲故事各 3 次。");
        runAutoRound();
    }

    private void stopAutoMode() {
        manualPagePlayback = false;
        autoMode = false;
        autoRound = 0;
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (pendingAutoRunnable != null) {
            handler.removeCallbacks(pendingAutoRunnable);
        }
        if (pendingUnlockRunnable != null) {
            handler.removeCallbacks(pendingUnlockRunnable);
        }
        clearSpeechTimeout();
        pendingAutoRunnable = null;
        pendingUnlockRunnable = null;
        setLocked(false);
        if (textToSpeech != null) {
            textToSpeech.stop();
        }
        releaseSpeechPlayer();
        if (autoButton != null) {
            autoButton.setText("自动播放");
        }
    }

    private void runAutoRound() {
        if (!autoMode) {
            return;
        }
        if (autoRound >= 3) {
            statusText.setText("本页播放完成，1 分钟后进入下一页。");
            pendingAutoRunnable = () -> {
                if (!autoMode) {
                    return;
                }
                currentPageIndex = (currentPageIndex + 1) % ContentRepository.PAGES.length;
                autoRound = 0;
                renderPage();
                runAutoRound();
            };
            handler.postDelayed(pendingAutoRunnable, PAGE_PAUSE_MS);
            return;
        }
        statusText.setText("自动播放第 " + (autoRound + 1) + " / 3 轮：读三字经。");
        speak("verse", "auto-verse-" + autoRound);
    }

    private void handleSpeechDone(String utteranceId) {
        if (utteranceId == null) {
            return;
        }
        if (manualPagePlayback && utteranceId.equals("manual-page-verse")) {
            statusText.setText("正在播放故事...");
            speak("story", "manual-page-story");
            return;
        }
        if (manualPagePlayback && utteranceId.equals("manual-page-story")) {
            manualPagePlayback = false;
            statusText.setText("");
            savePlaybackProgress(false);
            return;
        }
        if (!autoMode) {
            statusText.setText("");
            savePlaybackProgress(false);
            return;
        }
        if (utteranceId.startsWith("auto-verse-")) {
            statusText.setText("自动播放第 " + (autoRound + 1) + " / 3 轮：讲故事。");
            speak("story", "auto-story-" + autoRound);
        } else if (utteranceId.startsWith("auto-story-")) {
            autoRound++;
            runAutoRound();
        }
    }

    private boolean ensureTtsReady() {
        if (ttsReady) {
            return true;
        }
        if (textToSpeech == null) {
            statusText.setText("内置语音缺失，正在尝试系统 TTS...");
            configureTts();
            return false;
        }
        ttsSettingsButton.setVisibility(View.VISIBLE);
        statusText.setText(ttsDiagnostic("系统 TTS 正在初始化或不支持中文语音"));
        Toast.makeText(this, "请先安装或启用中文系统 TTS", Toast.LENGTH_SHORT).show();
        return false;
    }

    private void speak(String kind, String utteranceId) {
        speak(kind, utteranceId, 0);
    }

    private void speak(String kind, String utteranceId, int startPositionMs) {
        ClassicPage page = page();
        String text = "verse".equals(kind)
            ? page.verse
            : page.story + "。" + page.moral;
        activeSpeechKind = kind;
        activeSpeechText = text;
        activeSpeechBaseId = utteranceId;
        ttsFallbackAttempted = false;
        if (!SOURCE_BUILTIN.equals(selectedAudioSource)
            && playUserSpeech(selectedAudioSource, kind, utteranceId, startPositionMs)) {
            return;
        }
        if (playBundledSpeech(kind, utteranceId, startPositionMs)) {
            return;
        }
        if (!ensureTtsReady()) {
            return;
        }
        synthesizeSpeech(text, utteranceId);
    }

    private boolean playUserSpeech(String profile, String kind, String utteranceId, int startPositionMs) {
        File audioFile = userAudioFile(profile, kind, currentPageIndex + 1);
        if (!audioFile.exists() || audioFile.length() == 0) {
            return false;
        }
        releaseSpeechPlayer();
        clearSpeechTimeout();
        currentSpeechPlayer = new MediaPlayer();
        currentSpeechPlayer.setAudioAttributes(new AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .build());
        try {
            currentSpeechPlayer.setDataSource(audioFile.getAbsolutePath());
            currentSpeechPlayer.setOnCompletionListener(player -> {
                releaseSpeechPlayer();
                handleSpeechDone(utteranceId);
            });
            currentSpeechPlayer.setOnErrorListener((player, what, extra) -> {
                releaseSpeechPlayer();
                if (!playBundledSpeech(kind, utteranceId, startPositionMs)) {
                    statusText.setText("用户录音无法播放，且内置语音缺失：" + what + "/" + extra);
                    stopAutoMode();
                }
                return true;
            });
            currentSpeechPlayer.prepare();
            seekSpeechPlayer(startPositionMs);
            currentSpeechPlayer.start();
            statusText.setText("正在播放" + audioSourceLabel(profile) + "...");
            return true;
        } catch (IOException error) {
            releaseSpeechPlayer();
            return false;
        }
    }

    private void seekSpeechPlayer(int startPositionMs) {
        if (currentSpeechPlayer == null || startPositionMs <= 0) {
            return;
        }
        try {
            int duration = currentSpeechPlayer.getDuration();
            int safePosition = duration > 0
                ? Math.min(startPositionMs, Math.max(0, duration - 500))
                : startPositionMs;
            if (safePosition > 0) {
                currentSpeechPlayer.seekTo(safePosition);
            }
        } catch (IllegalStateException ignored) {
            // If the platform cannot seek this source, resume from the start of the segment.
        }
    }

    private boolean playBundledSpeech(String kind, String utteranceId, int startPositionMs) {
        releaseSpeechPlayer();
        clearSpeechTimeout();
        String audioPath = "audio/" + kind + "_" + String.format(Locale.US, "%03d", currentPageIndex + 1) + ".wav";
        try (AssetFileDescriptor descriptor = getAssets().openFd(audioPath)) {
            currentSpeechPlayer = new MediaPlayer();
            currentSpeechPlayer.setAudioAttributes(new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .build());
            currentSpeechPlayer.setDataSource(
                descriptor.getFileDescriptor(),
                descriptor.getStartOffset(),
                descriptor.getLength()
            );
            currentSpeechPlayer.setOnCompletionListener(player -> {
                releaseSpeechPlayer();
                handleSpeechDone(utteranceId);
            });
            currentSpeechPlayer.setOnErrorListener((player, what, extra) -> {
                releaseSpeechPlayer();
                statusText.setText("内置语音播放失败：" + what + "/" + extra);
                stopAutoMode();
                return true;
            });
            currentSpeechPlayer.prepare();
            seekSpeechPlayer(startPositionMs);
            currentSpeechPlayer.start();
            statusText.setText("正在播放内置语音...");
            ttsSettingsButton.setVisibility(View.GONE);
            return true;
        } catch (IOException error) {
            return false;
        }
    }

    private void synthesizeSpeech(String text, String utteranceId) {
        releaseSpeechPlayer();
        clearSpeechTimeout();
        try {
            pendingSpeechFile = File.createTempFile("sanzijing-tts-", ".wav", getCacheDir());
        } catch (IOException error) {
            statusText.setText("无法创建语音缓存文件。");
            stopAutoMode();
            return;
        }

        Bundle params = new Bundle();
        params.putString(TextToSpeech.Engine.KEY_PARAM_STREAM, String.valueOf(AudioManager.STREAM_MUSIC));
        int result = textToSpeech.synthesizeToFile(text, params, pendingSpeechFile, "synth:" + utteranceId);
        if (result == TextToSpeech.ERROR) {
            ttsSettingsButton.setVisibility(View.VISIBLE);
            statusText.setText(ttsDiagnostic("系统 TTS 无法合成语音"));
            stopAutoMode();
            return;
        }
        statusText.setText("正在生成系统 TTS 语音...");
        scheduleSpeechTimeout(15_000, "系统 TTS 合成超时");
    }

    private void speakChunks(String text, String utteranceId) {
        List<String> chunks = splitSpeechText(text);
        if (chunks.isEmpty()) {
            handleSpeechDone(utteranceId);
            return;
        }
        for (int i = 0; i < chunks.size(); i++) {
            int queueMode = i == 0 ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD;
            String chunkId = utteranceId + "#" + i + "/" + chunks.size();
            Bundle params = new Bundle();
            params.putString(TextToSpeech.Engine.KEY_PARAM_STREAM, String.valueOf(AudioManager.STREAM_MUSIC));
            int result = textToSpeech.speak(chunks.get(i), queueMode, params, chunkId);
            if (result == TextToSpeech.ERROR) {
                ttsSettingsButton.setVisibility(View.VISIBLE);
                statusText.setText(ttsDiagnostic("系统 TTS 播放失败"));
                stopAutoMode();
                return;
            }
        }
        scheduleSpeechTimeout(6_000, "系统 TTS 没有开始发声");
    }

    private void scheduleSpeechTimeout(int timeoutMs, String message) {
        clearSpeechTimeout();
        pendingSpeechTimeoutRunnable = () -> {
            ttsSettingsButton.setVisibility(View.VISIBLE);
            statusText.setText(ttsDiagnostic(message));
            stopAutoMode();
        };
        handler.postDelayed(pendingSpeechTimeoutRunnable, timeoutMs);
    }

    private void clearSpeechTimeout() {
        if (pendingSpeechTimeoutRunnable != null) {
            handler.removeCallbacks(pendingSpeechTimeoutRunnable);
            pendingSpeechTimeoutRunnable = null;
        }
    }

    private List<String> splitSpeechText(String text) {
        String normalized = text == null ? "" : text.replaceAll("\\s+", "");
        List<String> chunks = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (int i = 0; i < normalized.length(); i++) {
            char c = normalized.charAt(i);
            current.append(c);
            boolean boundary = c == '。' || c == '！' || c == '？' || c == '；' || c == '，';
            if ((boundary && current.length() >= 24) || current.length() >= 80) {
                chunks.add(current.toString());
                current.setLength(0);
            }
        }
        if (current.length() > 0) {
            chunks.add(current.toString());
        }
        return chunks;
    }

    private boolean isLastSpeechChunk(String utteranceId) {
        if (utteranceId == null) {
            return false;
        }
        int slash = utteranceId.lastIndexOf('/');
        int hash = utteranceId.lastIndexOf('#');
        if (slash < 0 || hash < 0 || slash <= hash) {
            return true;
        }
        int index = Integer.parseInt(utteranceId.substring(hash + 1, slash));
        int total = Integer.parseInt(utteranceId.substring(slash + 1));
        return index == total - 1;
    }

    private String baseSpeechId(String utteranceId) {
        if (utteranceId == null) {
            return null;
        }
        int hash = utteranceId.lastIndexOf('#');
        return hash < 0 ? utteranceId : utteranceId.substring(0, hash);
    }

    private boolean isSynthUtterance(String utteranceId) {
        return utteranceId != null && utteranceId.startsWith("synth:");
    }

    private String baseSynthId(String utteranceId) {
        return utteranceId == null ? null : utteranceId.replaceFirst("^synth:", "");
    }

    private void playSynthesizedSpeech(String utteranceId) {
        clearSpeechTimeout();
        if (pendingSpeechFile == null || !pendingSpeechFile.exists() || pendingSpeechFile.length() == 0) {
            ttsSettingsButton.setVisibility(View.VISIBLE);
            statusText.setText(ttsDiagnostic("系统 TTS 没有生成可播放音频"));
            stopAutoMode();
            return;
        }
        releaseSpeechPlayer();
        currentSpeechPlayer = new MediaPlayer();
        currentSpeechPlayer.setAudioAttributes(new AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .build());
        try {
            currentSpeechPlayer.setDataSource(pendingSpeechFile.getAbsolutePath());
            currentSpeechPlayer.setOnCompletionListener(player -> {
                releaseSpeechPlayer();
                handleSpeechDone(utteranceId);
            });
            currentSpeechPlayer.setOnErrorListener((player, what, extra) -> {
                releaseSpeechPlayer();
                ttsSettingsButton.setVisibility(View.VISIBLE);
                statusText.setText("系统 TTS 已生成音频，但播放失败：" + what + "/" + extra);
                stopAutoMode();
                return true;
            });
            currentSpeechPlayer.prepare();
            currentSpeechPlayer.start();
            statusText.setText("正在朗读...");
        } catch (IOException error) {
            releaseSpeechPlayer();
            statusText.setText("系统 TTS 音频播放失败：" + error.getMessage());
            stopAutoMode();
        }
    }

    private void releaseSpeechPlayer() {
        if (currentSpeechPlayer != null) {
            currentSpeechPlayer.release();
            currentSpeechPlayer = null;
        }
        if (pendingSpeechFile != null) {
            pendingSpeechFile.delete();
            pendingSpeechFile = null;
        }
    }

    private int chooseChineseVoice() {
        int result = textToSpeech.setLanguage(Locale.SIMPLIFIED_CHINESE);
        if (result >= TextToSpeech.LANG_AVAILABLE) {
            return result;
        }
        result = textToSpeech.setLanguage(Locale.CHINA);
        if (result >= TextToSpeech.LANG_AVAILABLE) {
            return result;
        }
        result = textToSpeech.setLanguage(Locale.CHINESE);
        if (result >= TextToSpeech.LANG_AVAILABLE) {
            return result;
        }
        return result;
    }

    private String ttsDiagnostic(String prefix) {
        if (textToSpeech == null) {
            return prefix + "。TTS 引擎尚未初始化。";
        }
        String engine = textToSpeech.getDefaultEngine();
        int zhCn = textToSpeech.isLanguageAvailable(Locale.SIMPLIFIED_CHINESE);
        int zh = textToSpeech.isLanguageAvailable(Locale.CHINESE);
        return prefix + "。默认引擎：" + (engine == null ? "未找到" : engine)
            + "；可见引擎：" + visibleTtsEngines()
            + "；普通话支持码：" + zhCn
            + "；中文支持码：" + zh
            + "。请点击“语音设置”安装或启用中文语音包。";
    }

    private String visibleTtsEngines() {
        List<TextToSpeech.EngineInfo> engines = textToSpeech.getEngines();
        if (engines == null || engines.isEmpty()) {
            return "未找到";
        }
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < engines.size(); i++) {
            if (i > 0) {
                builder.append(",");
            }
            builder.append(engines.get(i).name);
        }
        return builder.toString();
    }

    private void openTtsSettings() {
        Intent intent = new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            try {
                startActivity(new Intent("com.android.settings.TTS_SETTINGS"));
            } catch (ActivityNotFoundException ignored) {
                try {
                    startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
                } catch (ActivityNotFoundException ignoredAgain) {
                    Toast.makeText(this, "无法打开系统语音设置，请手动检查文字转语音配置", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    private void showSettingsDialog() {
        if (isRecording || locked) {
            return;
        }
        String[] items = {
            "播放音源：" + audioSourceLabel(selectedAudioSource),
            "录音管理",
            "系统语音设置"
        };
        new AlertDialog.Builder(this)
            .setTitle("设置")
            .setItems(items, (dialog, which) -> {
                if (which == 0) {
                    showAudioSourceDialog();
                } else if (which == 1) {
                    showRecordingDialog();
                } else {
                    openTtsSettings();
                }
            })
            .setNegativeButton("关闭", null)
            .show();
    }

    private void showAudioSourceDialog() {
        String[] labels = {"APP自带音频", "妈妈录制", "爸爸录制", "自定义录制"};
        String[] values = {SOURCE_BUILTIN, SOURCE_MOM, SOURCE_DAD, SOURCE_CUSTOM};
        int checked = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i].equals(selectedAudioSource)) {
                checked = i;
                break;
            }
        }
        new AlertDialog.Builder(this)
            .setTitle("播放音源")
            .setSingleChoiceItems(labels, checked, (dialog, which) -> {
                selectedAudioSource = values[which];
                preferences.edit().putString(PREF_AUDIO_SOURCE, selectedAudioSource).apply();
                updateAudioSourceButton();
                dialog.dismiss();
            })
            .setNegativeButton("取消", null)
            .show();
    }

    private void showQuickRecordingDialog() {
        if (isRecording || locked) {
            return;
        }
        stopAutoMode();
        final String[] profiles = {SOURCE_MOM, SOURCE_DAD, SOURCE_CUSTOM};
        final String[] kinds = {"verse", "story"};
        final int[] selectedProfile = {0};
        final int[] selectedKind = {0};

        LinearLayout dialogContent = new LinearLayout(this);
        dialogContent.setOrientation(LinearLayout.VERTICAL);
        dialogContent.setPadding(dp(8), dp(4), dp(8), 0);

        TextView pageLabel = label("第 " + (currentPageIndex + 1) + " 页 / 共 "
            + ContentRepository.PAGES.length + " 页", 16, TEXT_PRIMARY, Typeface.BOLD);
        pageLabel.setGravity(Gravity.CENTER);
        dialogContent.addView(pageLabel, matchWrap());

        Button profileButton = actionButton("角色：妈妈录制");
        Button kindButton = actionButton("内容：读三字经");
        dialogContent.addView(profileButton, dialogButtonLayout());
        dialogContent.addView(kindButton, dialogButtonLayout());

        profileButton.setOnClickListener(v -> new AlertDialog.Builder(this)
            .setTitle("选择录音角色")
            .setSingleChoiceItems(new String[]{"妈妈录制", "爸爸录制", "自定义录制"},
                selectedProfile[0], (dialog, which) -> {
                    selectedProfile[0] = which;
                    profileButton.setText("角色：" + audioSourceLabel(profiles[which]));
                    dialog.dismiss();
                })
            .setNegativeButton("取消", null)
            .show());

        kindButton.setOnClickListener(v -> new AlertDialog.Builder(this)
            .setTitle("选择录制内容")
            .setSingleChoiceItems(new String[]{"读三字经", "讲故事"}, selectedKind[0],
                (dialog, which) -> {
                    selectedKind[0] = which;
                    kindButton.setText("内容：" + kindLabel(kinds[which]));
                    dialog.dismiss();
                })
            .setNegativeButton("取消", null)
            .show());

        AlertDialog dialog = new AlertDialog.Builder(this)
            .setTitle("开始录制")
            .setView(dialogContent)
            .setPositiveButton("开始", null)
            .setNegativeButton("取消", null)
            .create();
        dialog.setOnShowListener(d -> dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
            String profile = profiles[selectedProfile[0]];
            String kind = kinds[selectedKind[0]];
            beginQuickRecording(profile, kind, dialog);
        }));
        dialog.show();
    }

    private void beginQuickRecording(String profile, String kind, AlertDialog dialog) {
        File file = userAudioFile(profile, kind, currentPageIndex + 1);
        if (file.exists()) {
            new AlertDialog.Builder(this)
                .setTitle("覆盖录音")
                .setMessage("当前页的" + audioSourceLabel(profile) + "「" + kindLabel(kind)
                    + "」已有录音，是否覆盖？")
                .setPositiveButton("覆盖", (confirmDialog, which) -> {
                    dialog.dismiss();
                    startRecording(profile, kind);
                })
                .setNegativeButton("取消", null)
                .show();
            return;
        }
        dialog.dismiss();
        startRecording(profile, kind);
    }

    private void showRecordingDialog() {
        stopAutoMode();
        recordingDialogContent = new LinearLayout(this);
        recordingDialogContent.setOrientation(LinearLayout.VERTICAL);
        recordingDialogContent.setPadding(dp(8), dp(6), dp(8), 0);
        recordingDialog = new AlertDialog.Builder(this)
            .setTitle("录制管理")
            .setView(recordingDialogContent)
            .setNegativeButton("关闭", null)
            .create();
        recordingDialog.setOnDismissListener(dialog -> {
            if (isRecording) {
                stopRecording(false);
            }
            recordingDialog = null;
            recordingDialogContent = null;
        });
        recordingDialog.show();
        refreshRecordingDialog();
    }

    private void refreshRecordingDialog() {
        if (recordingDialogContent == null) {
            return;
        }
        recordingDialogContent.removeAllViews();

        TextView pageLabel = label("第 " + (currentPageIndex + 1) + " 页 / 共 "
            + ContentRepository.PAGES.length + " 页", 16, TEXT_PRIMARY, Typeface.BOLD);
        pageLabel.setGravity(Gravity.CENTER);
        recordingDialogContent.addView(pageLabel, matchWrap());

        Button profileButton = actionButton("录音角色：" + audioSourceLabel(recordingProfile));
        profileButton.setOnClickListener(v -> showRecordingProfileDialog());
        LinearLayout.LayoutParams profileParams = autoButtonLayout();
        profileParams.setMargins(0, dp(8), 0, dp(8));
        recordingDialogContent.addView(profileButton, profileParams);

        addRecordingSection("读三字经", "verse");
        addRecordingSection("讲故事", "story");
    }

    private void showRecordingProfileDialog() {
        String[] labels = {"妈妈录制", "爸爸录制", "自定义录制"};
        String[] values = {SOURCE_MOM, SOURCE_DAD, SOURCE_CUSTOM};
        int checked = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i].equals(recordingProfile)) {
                checked = i;
                break;
            }
        }
        new AlertDialog.Builder(this)
            .setTitle("选择录音角色")
            .setSingleChoiceItems(labels, checked, (dialog, which) -> {
                recordingProfile = values[which];
                refreshRecordingDialog();
                dialog.dismiss();
            })
            .setNegativeButton("取消", null)
            .show();
    }

    private void addRecordingSection(String title, String kind) {
        File file = userAudioFile(recordingProfile, kind, currentPageIndex + 1);
        TextView titleView = label(title + (file.exists() ? "：已录制" : "：未录制"), 15, TEXT_PRIMARY, Typeface.BOLD);
        titleView.setPadding(0, dp(8), 0, dp(4));
        recordingDialogContent.addView(titleView, matchWrap());

        LinearLayout controls = row();
        Button recordButton = actionButton(isRecording && kind.equals(pendingRecordingKind)
            && recordingProfile.equals(pendingRecordingProfile) ? "停止" : "录制");
        Button previewButton = actionButton("试听");
        Button deleteButton = actionButton("删除");
        controls.addView(recordButton, weightedButtonLayout());
        controls.addView(previewButton, weightedButtonLayout());
        controls.addView(deleteButton, weightedButtonLayout());
        recordingDialogContent.addView(controls, matchWrap());

        recordButton.setEnabled(!isRecording || (kind.equals(pendingRecordingKind)
            && recordingProfile.equals(pendingRecordingProfile)));
        previewButton.setEnabled(!isRecording && file.exists() && file.length() > 0);
        deleteButton.setEnabled(!isRecording && file.exists());

        recordButton.setOnClickListener(v -> {
            if (isRecording) {
                stopRecording(true);
                return;
            }
            if (file.exists()) {
                new AlertDialog.Builder(this)
                    .setTitle("覆盖录音")
                    .setMessage("当前段已有录音，是否重新录制并覆盖？")
                    .setPositiveButton("覆盖", (dialog, which) -> startRecording(recordingProfile, kind))
                    .setNegativeButton("取消", null)
                    .show();
            } else {
                startRecording(recordingProfile, kind);
            }
        });
        previewButton.setOnClickListener(v -> playRecordingPreview(file));
        deleteButton.setOnClickListener(v -> new AlertDialog.Builder(this)
            .setTitle("删除录音")
            .setMessage("确定删除这段录音？")
            .setPositiveButton("删除", (dialog, which) -> {
                if (file.delete()) {
                    Toast.makeText(this, "录音已删除", Toast.LENGTH_SHORT).show();
                }
                refreshRecordingDialog();
            })
            .setNegativeButton("取消", null)
            .show());
    }

    private void startRecording(String profile, String kind) {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingRecordingProfile = profile;
            pendingRecordingKind = kind;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, RECORD_AUDIO_REQUEST_CODE);
            return;
        }
        manualPagePlayback = false;
        stopAutoMode();
        releaseSpeechPlayer();
        pendingRecordingProfile = profile;
        pendingRecordingKind = kind;
        currentRecordingFile = userAudioFile(profile, kind, currentPageIndex + 1);
        File parent = currentRecordingFile.getParentFile();
        if (parent != null && !parent.exists() && !parent.mkdirs()) {
            Toast.makeText(this, "无法创建录音目录", Toast.LENGTH_SHORT).show();
            return;
        }
        if (currentRecordingFile.exists() && !currentRecordingFile.delete()) {
            Toast.makeText(this, "无法覆盖旧录音", Toast.LENGTH_SHORT).show();
            return;
        }
        mediaRecorder = new MediaRecorder();
        try {
            mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            mediaRecorder.setAudioEncodingBitRate(96_000);
            mediaRecorder.setAudioSamplingRate(44_100);
            mediaRecorder.setOutputFile(currentRecordingFile.getAbsolutePath());
            mediaRecorder.prepare();
            mediaRecorder.start();
            isRecording = true;
            statusText.setText("正在录制" + audioSourceLabel(profile) + "：" + kindLabel(kind));
            updateRecordingControls();
            refreshRecordingDialog();
        } catch (IOException | RuntimeException error) {
            releaseRecorder();
            if (currentRecordingFile != null) {
                currentRecordingFile.delete();
            }
            currentRecordingFile = null;
            pendingRecordingKind = null;
            pendingRecordingProfile = null;
            Toast.makeText(this, "录音启动失败：" + error.getMessage(), Toast.LENGTH_LONG).show();
            updateRecordingControls();
            refreshRecordingDialog();
        }
    }

    private void stopRecording(boolean keepFile) {
        if (!isRecording && mediaRecorder == null) {
            return;
        }
        try {
            if (mediaRecorder != null) {
                mediaRecorder.stop();
            }
        } catch (RuntimeException error) {
            keepFile = false;
        } finally {
            releaseRecorder();
        }
        isRecording = false;
        if (!keepFile && currentRecordingFile != null) {
            currentRecordingFile.delete();
        }
        if (keepFile && currentRecordingFile != null && currentRecordingFile.exists()
            && currentRecordingFile.length() > 0) {
            Toast.makeText(this, "录音已保存", Toast.LENGTH_SHORT).show();
            statusText.setText("录音已保存：" + audioSourceLabel(pendingRecordingProfile)
                + " " + kindLabel(pendingRecordingKind));
        } else if (currentRecordingFile != null) {
            currentRecordingFile.delete();
            statusText.setText("录音未保存");
        }
        currentRecordingFile = null;
        pendingRecordingKind = null;
        pendingRecordingProfile = null;
        updateRecordingControls();
        refreshRecordingDialog();
    }

    private void releaseRecorder() {
        if (mediaRecorder != null) {
            mediaRecorder.release();
            mediaRecorder = null;
        }
    }

    private void playRecordingPreview(File file) {
        if (!file.exists() || file.length() == 0) {
            Toast.makeText(this, "这段还没有录音", Toast.LENGTH_SHORT).show();
            return;
        }
        stopAutoMode();
        releaseSpeechPlayer();
        currentSpeechPlayer = new MediaPlayer();
        currentSpeechPlayer.setAudioAttributes(new AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .build());
        try {
            currentSpeechPlayer.setDataSource(file.getAbsolutePath());
            currentSpeechPlayer.setOnCompletionListener(player -> {
                releaseSpeechPlayer();
                statusText.setText("");
            });
            currentSpeechPlayer.prepare();
            currentSpeechPlayer.start();
            statusText.setText("正在试听录音...");
        } catch (IOException error) {
            releaseSpeechPlayer();
            Toast.makeText(this, "试听失败：" + error.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != RECORD_AUDIO_REQUEST_CODE) {
            return;
        }
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            if (pendingRecordingProfile != null && pendingRecordingKind != null) {
                startRecording(pendingRecordingProfile, pendingRecordingKind);
            }
        } else {
            pendingRecordingProfile = null;
            pendingRecordingKind = null;
            Toast.makeText(this, "未授权麦克风，无法录音", Toast.LENGTH_LONG).show();
        }
    }

    private void updateAudioSourceButton() {
        if (statusText != null) {
            statusText.setText("当前音源：" + audioSourceLabel(selectedAudioSource));
        }
    }

    private void updateRecordingControls() {
        if (autoButton != null) {
            autoButton.setEnabled(!isRecording && !locked);
        }
        if (playButton != null) {
            playButton.setEnabled(!locked && !isRecording);
        }
        if (settingsButton != null) {
            settingsButton.setEnabled(!locked && !isRecording);
        }
        if (recordButton != null) {
            recordButton.setEnabled(!locked || isRecording);
            recordButton.setText(isRecording ? "停止" : "录制");
            recordButton.setBackground(rounded(isRecording ? Color.rgb(178, 73, 68) : ACTION_GREEN,
                isRecording ? Color.rgb(178, 73, 68) : ACTION_GREEN));
        }
    }

    private File userAudioFile(String profile, String kind, int pageNumber) {
        return new File(new File(getFilesDir(), "user_audio/" + normalizeAudioSource(profile)),
            kind + "_" + String.format(Locale.US, "%03d", pageNumber) + ".m4a");
    }

    private String normalizeAudioSource(String value) {
        if (SOURCE_MOM.equals(value) || SOURCE_DAD.equals(value) || SOURCE_CUSTOM.equals(value)) {
            return value;
        }
        return SOURCE_BUILTIN;
    }

    private String audioSourceLabel(String source) {
        if (SOURCE_MOM.equals(source)) {
            return "妈妈录制";
        }
        if (SOURCE_DAD.equals(source)) {
            return "爸爸录制";
        }
        if (SOURCE_CUSTOM.equals(source)) {
            return "自定义录制";
        }
        return "APP自带音频";
    }

    private String kindLabel(String kind) {
        return "story".equals(kind) ? "讲故事" : "读三字经";
    }

    private void setLocked(boolean shouldLock) {
        locked = shouldLock;
        if (lockOverlay != null) {
            lockOverlay.setVisibility(locked ? View.VISIBLE : View.GONE);
        }
        updateRecordingControls();
    }

    private void handleUnlockTouch(View view, MotionEvent event) {
        if (!locked) {
            return;
        }
        if (event.getActionMasked() == MotionEvent.ACTION_UP
            || event.getActionMasked() == MotionEvent.ACTION_CANCEL
            || event.getPointerCount() < 3) {
            cancelUnlock();
            lockHint.setText("自动播放已锁定  ·  三指按住左上、右上、下方中央解锁");
            return;
        }

        if (touchesUnlockZones(view, event)) {
            lockHint.setText("保持三指按住...");
            if (pendingUnlockRunnable == null) {
                pendingUnlockRunnable = () -> {
                    if (locked) {
                        stopAutoMode();
                        Toast.makeText(this, "已解锁并停止自动播放", Toast.LENGTH_SHORT).show();
                    }
                };
                handler.postDelayed(pendingUnlockRunnable, UNLOCK_HOLD_MS);
            }
        } else {
            cancelUnlock();
            lockHint.setText("位置不正确  ·  请同时按住左上、右上、下方中央");
        }
    }

    private boolean touchesUnlockZones(View view, MotionEvent event) {
        boolean leftTop = false;
        boolean rightTop = false;
        boolean bottomCenter = false;
        int width = Math.max(view.getWidth(), 1);
        int height = Math.max(view.getHeight(), 1);
        for (int i = 0; i < event.getPointerCount(); i++) {
            float x = event.getX(i) / width;
            float y = event.getY(i) / height;
            if (x < 0.38f && y < 0.42f) {
                leftTop = true;
            } else if (x > 0.62f && y < 0.42f) {
                rightTop = true;
            } else if (x > 0.32f && x < 0.68f && y > 0.58f) {
                bottomCenter = true;
            }
        }
        return leftTop && rightTop && bottomCenter;
    }

    private void cancelUnlock() {
        if (pendingUnlockRunnable != null) {
            handler.removeCallbacks(pendingUnlockRunnable);
            pendingUnlockRunnable = null;
        }
    }

    private ClassicPage page() {
        return ContentRepository.PAGES[currentPageIndex];
    }

    private TextView label(String text, int sp, int color, int style) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextSize(sp);
        view.setTextColor(color);
        view.setTypeface(Typeface.DEFAULT, style);
        return view;
    }

    private Button actionButton(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(16);
        button.setTextColor(Color.WHITE);
        button.setAllCaps(false);
        button.setIncludeFontPadding(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setMinWidth(0);
        button.setMinimumWidth(0);
        button.setStateListAnimator(null);
        button.setBackground(rounded(ACTION_GREEN, ACTION_GREEN));
        button.setPadding(dp(8), 0, dp(8), 0);
        return button;
    }

    private Button topButton(String text) {
        Button button = actionButton(text);
        button.setTextSize(14);
        button.setPadding(dp(6), 0, dp(6), 0);
        return button;
    }

    private LinearLayout row() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER);
        return row;
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
    }

    private LinearLayout.LayoutParams weightedButtonLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(56), 1);
        params.setMargins(dp(5), dp(6), dp(5), dp(6));
        return params;
    }

    private LinearLayout.LayoutParams topButtonLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(dp(64), dp(42));
        params.setMargins(dp(6), 0, 0, 0);
        return params;
    }

    private LinearLayout.LayoutParams dialogButtonLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(52));
        params.setMargins(0, dp(8), 0, 0);
        return params;
    }

    private LinearLayout.LayoutParams autoButtonLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(56));
        params.setMargins(dp(5), dp(8), dp(5), dp(0));
        return params;
    }

    private LinearLayout.LayoutParams sceneLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(126));
        params.setMargins(0, dp(6), 0, dp(8));
        return params;
    }

    private LinearLayout.LayoutParams panelLayout() {
        LinearLayout.LayoutParams params = matchWrap();
        params.setMargins(0, dp(8), 0, dp(8));
        return params;
    }

    private GradientDrawable rounded(int color, int strokeColor) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(12));
        drawable.setStroke(dp(1), strokeColor);
        return drawable;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private static int blend(int from, int to, float amountTo) {
        int r = Math.round(Color.red(from) * (1 - amountTo) + Color.red(to) * amountTo);
        int g = Math.round(Color.green(from) * (1 - amountTo) + Color.green(to) * amountTo);
        int b = Math.round(Color.blue(from) * (1 - amountTo) + Color.blue(to) * amountTo);
        return Color.rgb(r, g, b);
    }
}
