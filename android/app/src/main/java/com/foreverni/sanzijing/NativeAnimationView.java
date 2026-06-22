package com.foreverni.sanzijing;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.SystemClock;
import android.view.View;

final class NativeAnimationView extends View {
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rect = new RectF();
    private ClassicPage page;
    private long startedAtMs = SystemClock.uptimeMillis();
    private boolean darkMode = false;
    private int textPrimary = Color.rgb(34, 51, 39);
    private int textSecondary = Color.rgb(92, 109, 97);
    private int surface = Color.rgb(254, 252, 247);
    private int border = Color.rgb(214, 224, 210);

    NativeAnimationView(Context context) {
        super(context);
    }

    void setPalette(boolean dark, int primaryText, int secondaryText, int surfaceColor, int borderColor) {
        darkMode = dark;
        textPrimary = primaryText;
        textSecondary = secondaryText;
        surface = surfaceColor;
        border = borderColor;
        invalidate();
    }

    void setPage(ClassicPage nextPage) {
        page = nextPage;
        startedAtMs = SystemClock.uptimeMillis();
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (page == null) {
            return;
        }

        float w = getWidth();
        float h = getHeight();
        float t = (SystemClock.uptimeMillis() - startedAtMs) / 1000f;
        int bg = darkMode ? surface : blend(page.backgroundColor, surface, 0.72f);
        int accent = darkMode ? border : blend(page.accentColor, surface, 0.34f);

        drawStage(canvas, w, h, bg, accent, t);
        drawScene(canvas, w, h, t);
        postInvalidateOnAnimation();
    }

    private void drawStage(Canvas canvas, float w, float h, int bg, int accent, float t) {
        rect.set(0, 0, w, h);
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(bg);
        canvas.drawRoundRect(rect, dp(18), dp(18), paint);

        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(dp(1.5f));
        paint.setColor(accent);
        canvas.drawRoundRect(rect, dp(18), dp(18), paint);

        paint.setStyle(Paint.Style.FILL);
        paint.setColor(darkMode ? Color.argb(46, 255, 255, 255) : Color.argb(72, 255, 255, 255));
        canvas.drawCircle(w * 0.2f, h * 0.18f, dp(42), paint);
        canvas.drawCircle(w * 0.82f, h * 0.22f, dp(34), paint);

        for (int i = 0; i < 6; i++) {
            float phase = t * 0.9f + i * 0.8f;
            float x = w * (0.1f + i * 0.16f);
            float y = h * (0.18f + 0.18f * (float) Math.sin(phase));
            paint.setColor(darkMode
                ? Color.argb(46, Color.red(border), Color.green(border), Color.blue(border))
                : Color.argb(56, Color.red(page.accentColor), Color.green(page.accentColor), Color.blue(page.accentColor)));
            canvas.drawCircle(x, y, dp(8 + (i % 3) * 4), paint);
        }
    }

    private void drawScene(Canvas canvas, float w, float h, float t) {
        Scene scene = sceneFor(page.animation);
        if (scene.type == 0) {
            drawGrowthScene(canvas, w, h, t, scene);
        } else if (scene.type == 1) {
            drawDualScene(canvas, w, h, t, scene);
        } else if (scene.type == 2) {
            drawProcessScene(canvas, w, h, t, scene);
        } else {
            drawCardScene(canvas, w, h, t, scene);
        }
    }

    private void drawGrowthScene(Canvas canvas, float w, float h, float t, Scene scene) {
        drawFloatingText(canvas, scene.badge, w * 0.5f, dp(24), 15, textSecondary, Typeface.BOLD);
        drawEmoji(canvas, scene.icons[0], w * 0.26f, h * 0.48f + wave(t, 7), 42);
        drawEmoji(canvas, scene.icons[1], w * 0.5f, h * 0.58f - wave(t, 10), 52);
        drawEmoji(canvas, scene.icons[2], w * 0.74f, h * 0.46f + wave(t + 1.3f, 8), 50);
        drawCaption(canvas, scene.labels[0], w * 0.5f, h - dp(20));
    }

    private void drawDualScene(Canvas canvas, float w, float h, float t, Scene scene) {
        drawMiniCard(canvas, scene.icons[0], scene.labels[0], w * 0.28f, h * 0.52f + wave(t, 7));
        drawArrow(canvas, w * 0.5f, h * 0.52f, t);
        drawMiniCard(canvas, scene.icons[1], scene.labels[1], w * 0.72f, h * 0.52f + wave(t + 1.1f, 7));
        drawCaption(canvas, scene.badge, w * 0.5f, h - dp(20));
    }

    private void drawProcessScene(Canvas canvas, float w, float h, float t, Scene scene) {
        drawFloatingText(canvas, scene.badge, w * 0.5f, dp(24), 15, textSecondary, Typeface.BOLD);
        for (int i = 0; i < 3; i++) {
            float x = w * (0.22f + i * 0.28f);
            drawMiniCard(canvas, scene.icons[i], scene.labels[i], x, h * 0.56f + wave(t + i, 6));
            if (i < 2) {
                drawArrow(canvas, w * (0.36f + i * 0.28f), h * 0.56f, t + i);
            }
        }
    }

    private void drawCardScene(Canvas canvas, float w, float h, float t, Scene scene) {
        drawFloatingText(canvas, scene.badge, w * 0.5f, dp(24), 15, textSecondary, Typeface.BOLD);
        drawEmoji(canvas, scene.icons[0], w * 0.5f, h * 0.45f + wave(t, 10), 58);
        drawCaption(canvas, scene.labels[0], w * 0.5f, h * 0.76f);
    }

    private void drawMiniCard(Canvas canvas, String icon, String label, float cx, float cy) {
        float width = dp(88);
        float height = dp(84);
        rect.set(cx - width / 2f, cy - height / 2f, cx + width / 2f, cy + height / 2f);
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(darkMode ? Color.rgb(35, 46, 38) : Color.argb(236, 255, 255, 255));
        canvas.drawRoundRect(rect, dp(18), dp(18), paint);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(dp(1));
        paint.setColor(darkMode ? border : Color.argb(120, Color.red(page.accentColor), Color.green(page.accentColor), Color.blue(page.accentColor)));
        canvas.drawRoundRect(rect, dp(18), dp(18), paint);
        drawEmoji(canvas, icon, cx, cy - dp(4), 32);
        drawFloatingText(canvas, label, cx, cy + dp(30), 11, textSecondary, Typeface.BOLD);
    }

    private void drawArrow(Canvas canvas, float cx, float cy, float t) {
        drawFloatingText(canvas, "➜", cx + wave(t, 3), cy + dp(8), 23, page.accentColor, Typeface.BOLD);
    }

    private void drawEmoji(Canvas canvas, String text, float cx, float baseline, int sp) {
        paint.setStyle(Paint.Style.FILL);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setTextSize(dp(sp));
        paint.setTypeface(Typeface.DEFAULT_BOLD);
        paint.setColor(textPrimary);
        canvas.drawText(text, cx, baseline, paint);
    }

    private void drawCaption(Canvas canvas, String text, float cx, float baseline) {
        drawFloatingText(canvas, text, cx, baseline, 14, textSecondary, Typeface.BOLD);
    }

    private void drawFloatingText(Canvas canvas, String text, float cx, float baseline, int sp, int color, int style) {
        paint.setStyle(Paint.Style.FILL);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setTextSize(dp(sp));
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, style));
        paint.setColor(color);
        canvas.drawText(text, cx, baseline, paint);
    }

    private Scene sceneFor(String animation) {
        String key = animation == null ? "" : animation;
        if (key.contains("seed") || key.contains("tree") || key.contains("grow") || key.contains("spring")) {
            return new Scene(0, new String[] {"☀", "苗", "树"}, new String[] {"善良像种子慢慢长大"}, "成长");
        }
        if (key.contains("mother") || key.contains("home") || key.contains("family") || key.contains("filial")) {
            return new Scene(1, new String[] {"家", "学"}, new String[] {"温暖家", "好环境"}, "亲情与学习");
        }
        if (key.contains("loom") || key.contains("cut") || key.contains("diligence") || key.contains("study")) {
            return new Scene(2, new String[] {"玩", "读", "成"}, new String[] {"分心", "努力", "进步"}, "勤学");
        }
        if (key.contains("book") || key.contains("classic") || key.contains("learn")) {
            return new Scene(2, new String[] {"书", "思", "明"}, new String[] {"读书", "思考", "明理"}, "学习");
        }
        if (key.contains("sun") || key.contains("moon") || key.contains("star")) {
            return new Scene(2, new String[] {"日", "月", "星"}, new String[] {"太阳", "月亮", "星星"}, "天地万物");
        }
        if (key.contains("number") || key.contains("math")) {
            return new Scene(2, new String[] {"一", "十", "百"}, new String[] {"开始", "积累", "更多"}, "数字");
        }
        if (key.contains("water") || key.contains("fire") || key.contains("metal") || key.contains("earth")) {
            return new Scene(2, new String[] {"水", "火", "土"}, new String[] {"五行", "变化", "规律"}, "自然规律");
        }
        if (key.contains("history") || key.contains("king") || key.contains("country")) {
            return new Scene(1, new String[] {"国", "史"}, new String[] {"朝代", "故事"}, "历史");
        }
        return new Scene(3, new String[] {"书"}, new String[] {page.verse}, "三字经故事");
    }

    private float wave(float t, float amount) {
        return dp(amount) * (float) Math.sin(t * 1.8f);
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private static int blend(int from, int to, float amountTo) {
        int r = Math.round(Color.red(from) * (1 - amountTo) + Color.red(to) * amountTo);
        int g = Math.round(Color.green(from) * (1 - amountTo) + Color.green(to) * amountTo);
        int b = Math.round(Color.blue(from) * (1 - amountTo) + Color.blue(to) * amountTo);
        return Color.rgb(r, g, b);
    }

    private static final class Scene {
        final int type;
        final String[] icons;
        final String[] labels;
        final String badge;

        Scene(int type, String[] icons, String[] labels, String badge) {
            this.type = type;
            this.icons = icons;
            this.labels = labels;
            this.badge = badge;
        }
    }
}
