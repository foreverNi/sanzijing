package com.foreverni.sanzijing;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

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
    private Runnable pendingAutoRunnable;
    private Runnable pendingUnlockRunnable;

    private FrameLayout root;
    private LinearLayout content;
    private TextView pageIndicator;
    private TextView verseText;
    private TextView pinyinText;
    private TextView storyText;
    private TextView moralText;
    private TextView statusText;
    private TextView lockHint;
    private Button previousButton;
    private Button nextButton;
    private Button verseButton;
    private Button storyButton;
    private Button autoButton;
    private View lockOverlay;
    private TextToSpeech textToSpeech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        buildLayout();
        configureTts();
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
                int localeResult = textToSpeech.setLanguage(Locale.CHINA);
                textToSpeech.setSpeechRate(0.82f);
                textToSpeech.setPitch(1.08f);
                ttsReady = localeResult != TextToSpeech.LANG_MISSING_DATA
                    && localeResult != TextToSpeech.LANG_NOT_SUPPORTED;
            }
            runOnUiThread(() -> statusText.setText(ttsReady ? "" : "当前系统 TTS 不支持普通话，请在系统设置中安装中文语音。"));
        });
        textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
            }

            @Override
            public void onDone(String utteranceId) {
                runOnUiThread(() -> handleSpeechDone(utteranceId));
            }

            @Override
            public void onError(String utteranceId) {
                runOnUiThread(() -> {
                    statusText.setText("系统 TTS 播放失败，请检查系统语音设置。");
                    stopAutoMode();
                });
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
        content.setPadding(dp(18), dp(18), dp(18), dp(18));
        scrollView.addView(content, new ScrollView.LayoutParams(
            ScrollView.LayoutParams.MATCH_PARENT,
            ScrollView.LayoutParams.WRAP_CONTENT
        ));

        TextView title = label("三字经故事乐园", 28, TEXT_PRIMARY, Typeface.BOLD);
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
        pinyinText.setPadding(dp(10), dp(0), dp(10), dp(18));
        content.addView(pinyinText, matchWrap());

        TextView storyTitle = label("故事解说", 20, TEXT_PRIMARY, Typeface.BOLD);
        storyTitle.setPadding(0, dp(20), 0, dp(8));
        content.addView(storyTitle, matchWrap());

        storyText = label("", 18, TEXT_PRIMARY, Typeface.NORMAL);
        storyText.setLineSpacing(dp(4), 1.0f);
        storyText.setPadding(dp(16), dp(16), dp(16), dp(16));
        content.addView(storyText, panelLayout());

        moralText = label("", 17, TEXT_SECONDARY, Typeface.BOLD);
        moralText.setPadding(dp(16), dp(14), dp(16), dp(14));
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
        content.addView(autoButton, matchWrap());

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

        root.addView(scrollView);
        buildLockOverlay();
        setContentView(root);
    }

    private void buildLockOverlay() {
        LinearLayout overlay = new LinearLayout(this);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setGravity(Gravity.CENTER);
        overlay.setPadding(dp(24), dp(24), dp(24), dp(24));
        overlay.setBackgroundColor(Color.argb(236, 37, 54, 45));
        overlay.setVisibility(View.GONE);

        lockHint = label("自动播放已锁定\n三指同时按住左上、右上、下方中央解锁", 22, Color.WHITE, Typeface.BOLD);
        lockHint.setGravity(Gravity.CENTER);
        lockHint.setLineSpacing(dp(6), 1.0f);
        overlay.addView(lockHint, matchWrap());

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
        previousButton.setEnabled(currentPageIndex > 0 && !locked);
        nextButton.setEnabled(currentPageIndex < ContentRepository.PAGES.length - 1 && !locked);
        if (!autoMode) {
            statusText.setText("");
        }
    }

    private void speakManual(String kind) {
        if (!ensureTtsReady()) {
            return;
        }
        stopAutoMode();
        speak(kind, "manual-" + kind);
    }

    private void startAutoMode() {
        if (!ensureTtsReady()) {
            return;
        }
        autoMode = true;
        autoRound = 0;
        autoButton.setText("停止自动播放");
        setLocked(true);
        statusText.setText("自动播放：每页读三字经、讲故事各 3 次。");
        runAutoRound();
    }

    private void stopAutoMode() {
        autoMode = false;
        autoRound = 0;
        if (pendingAutoRunnable != null) {
            handler.removeCallbacks(pendingAutoRunnable);
        }
        if (pendingUnlockRunnable != null) {
            handler.removeCallbacks(pendingUnlockRunnable);
        }
        pendingAutoRunnable = null;
        pendingUnlockRunnable = null;
        setLocked(false);
        if (textToSpeech != null) {
            textToSpeech.stop();
        }
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
        Toast.makeText(this, "系统 TTS 正在初始化或不支持中文语音", Toast.LENGTH_SHORT).show();
        return false;
    }

    private void speak(String kind, String utteranceId) {
        ClassicPage page = page();
        String text = "verse".equals(kind)
            ? page.verse + "。" + page.pinyin
            : page.story + "。" + page.moral;
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId);
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
        button.setTextSize(17);
        button.setTextColor(Color.WHITE);
        button.setAllCaps(false);
        button.setBackground(rounded(ACTION_GREEN, ACTION_GREEN));
        button.setPadding(dp(8), dp(10), dp(8), dp(10));
        return button;
    }

    private LinearLayout row() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER);
        row.setPadding(0, dp(10), 0, 0);
        return row;
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
    }

    private LinearLayout.LayoutParams weightedButtonLayout() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);
        params.setMargins(dp(4), 0, dp(4), 0);
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
