package com.foreverni.sanzijing;

final class ClassicPage {
    final String verse;
    final String pinyin;
    final String story;
    final String moral;
    final int backgroundColor;
    final int accentColor;

    ClassicPage(String verse, String pinyin, String story, String moral, int backgroundColor, int accentColor) {
        this.verse = verse;
        this.pinyin = pinyin;
        this.story = story;
        this.moral = moral;
        this.backgroundColor = backgroundColor;
        this.accentColor = accentColor;
    }
}
