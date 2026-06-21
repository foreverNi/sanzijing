package com.foreverni.sanzijing;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
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
    private static final int PAGE_PAUSE_MS = 60_000;
    private static final int UNLOCK_HOLD_MS = 900;
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
    private String activeSpeechText = "";
    private String activeSpeechBaseId = "";
    private File pendingSpeechFile;
    private MediaPlayer currentSpeechPlayer;
    private Runnable pendingAutoRunnable;
    private Runnable pendingUnlockRunnable;
    private Runnable pendingSpeechTimeoutRunnable;

    private FrameLayout root;
    private LinearLayout content;
    private TextView pageIndicator;
    private TextView verseText;
    private TextView pinyinText;
    private NativeAnimationView sceneView;
    private TextView storyText;
    private TextView moralText;
    private TextView statusText;
    private TextView lockHint;
    private Button previousButton;
    private Button nextButton;
    private Button verseButton;
    private Button storyButton;
    private Button autoButton;
    private Button ttsSettingsButton;
    private View lockOverlay;
    private TextToSpeech textToSpeech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        buildLayout();
        renderPage();
    }

    @Override
    protected void onDestroy() {
        stopAutoMode();
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

        TextView title = label("三字经故事乐园", 25, TEXT_PRIMARY, Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        content.addView(title, matchWrap());

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

        LinearLayout audioRow = row();
        verseButton = actionButton("读三字经");
        storyButton = actionButton("讲故事");
        audioRow.addView(verseButton, weightedButtonLayout());
        audioRow.addView(storyButton, weightedButtonLayout());
        content.addView(audioRow, matchWrap());

        LinearLayout navRow = row();
        previousButton = actionButton("上一页");
        nextButton = actionButton("下一页");
        navRow.addView(previousButton, weightedButtonLayout());
        navRow.addView(nextButton, weightedButtonLayout());
        content.addView(navRow, matchWrap());

        autoButton = actionButton("自动播放");
        content.addView(autoButton, autoButtonLayout());

        ttsSettingsButton = actionButton("语音设置");
        ttsSettingsButton.setVisibility(View.GONE);
        content.addView(ttsSettingsButton, autoButtonLayout());

        statusText = label("", 15, TEXT_SECONDARY, Typeface.NORMAL);
        statusText.setGravity(Gravity.CENTER);
        statusText.setPadding(0, dp(10), 0, 0);
        content.addView(statusText, matchWrap());

        previousButton.setOnClickListener(v -> {
            if (currentPageIndex > 0) {
                stopAutoMode();
                currentPageIndex--;
                renderPage();
            }
        });
        nextButton.setOnClickListener(v -> {
            if (currentPageIndex < ContentRepository.PAGES.length - 1) {
                stopAutoMode();
                currentPageIndex++;
                renderPage();
            }
        });
        verseButton.setOnClickListener(v -> speakManual("verse"));
        storyButton.setOnClickListener(v -> speakManual("story"));
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
        previousButton.setEnabled(currentPageIndex > 0 && !locked);
        nextButton.setEnabled(currentPageIndex < ContentRepository.PAGES.length - 1 && !locked);
        if (!autoMode) {
            statusText.setText("");
        }
    }

    private void speakManual(String kind) {
        stopAutoMode();
        speak(kind, "manual-" + kind);
    }

    private void startAutoMode() {
        autoMode = true;
        autoRound = 0;
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        autoButton.setText("停止自动播放");
        setLocked(true);
        statusText.setText("自动播放：每页读三字经、讲故事各 3 次。");
        runAutoRound();
    }

    private void stopAutoMode() {
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
        if (!autoMode || utteranceId == null) {
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
        ClassicPage page = page();
        String text = "verse".equals(kind)
            ? page.verse
            : page.story + "。" + page.moral;
        activeSpeechText = text;
        activeSpeechBaseId = utteranceId;
        ttsFallbackAttempted = false;
        if (playBundledSpeech(kind, utteranceId)) {
            return;
        }
        if (!ensureTtsReady()) {
            return;
        }
        synthesizeSpeech(text, utteranceId);
    }

    private boolean playBundledSpeech(String kind, String utteranceId) {
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
                if (autoMode) {
                    handleSpeechDone(utteranceId);
                } else {
                    statusText.setText("");
                }
            });
            currentSpeechPlayer.setOnErrorListener((player, what, extra) -> {
                releaseSpeechPlayer();
                statusText.setText("内置语音播放失败：" + what + "/" + extra);
                stopAutoMode();
                return true;
            });
            currentSpeechPlayer.prepare();
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
                if (autoMode) {
                    handleSpeechDone(utteranceId);
                } else {
                    statusText.setText("");
                }
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

    private void setLocked(boolean shouldLock) {
        locked = shouldLock;
        if (lockOverlay != null) {
            lockOverlay.setVisibility(locked ? View.VISIBLE : View.GONE);
        }
        if (previousButton != null) {
            previousButton.setEnabled(!locked && currentPageIndex > 0);
            nextButton.setEnabled(!locked && currentPageIndex < ContentRepository.PAGES.length - 1);
            verseButton.setEnabled(!locked);
            storyButton.setEnabled(!locked);
        }
    }

    private void handleUnlockTouch(View view, MotionEvent event) {
        if (!locked) {
            return;
        }
        if (event.getActionMasked() == MotionEvent.ACTION_UP
            || event.getActionMasked() == MotionEvent.ACTION_CANCEL
            || event.getPointerCount() < 3) {
            cancelUnlock();
            lockHint.setText("自动播放已锁定\n三指同时按住左上、右上、下方中央解锁");
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
            lockHint.setText("位置不正确\n请同时按住左上、右上、下方中央");
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
