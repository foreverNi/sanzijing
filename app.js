// 三字经故事网页 - 主逻辑
let currentPage = 0;
let speechSynth = window.speechSynthesis || null;
let currentUtterance = null;
let isSpeaking = false;

const verseText = document.getElementById("verseText");
const pinyinText = document.getElementById("pinyinText");
const storyText = document.getElementById("storyText");
const moralText = document.getElementById("moralText");
const pageIndicator = document.getElementById("pageIndicator");
const sceneWrap = document.getElementById("sceneWrap");
const book = document.getElementById("book");
const pageDots = document.getElementById("pageDots");
const verseCard = document.getElementById("verseCard");
const storyCard = document.getElementById("storyCard");
const moralCard = document.getElementById("moralCard");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playVerseBtn = document.getElementById("playVerseBtn");
const playStoryBtn = document.getElementById("playStoryBtn");
const stopBtn = document.getElementById("stopBtn");

// 初始化页码导航小圆点
function renderDots() {
  pageDots.innerHTML = "";
  threeCharClassic.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "page-dot" + (idx === currentPage ? " active" : "");
    dot.textContent = idx + 1;
    dot.onclick = () => {
      currentPage = idx;
      renderPage();
    };
    pageDots.appendChild(dot);
  });
}

// 渲染当前页
function renderPage() {
  const data = threeCharClassic[currentPage];
  stopSpeaking();

  // 更新背景
  book.style.background = `linear-gradient(135deg, ${data.bgColor}22 0%, #fffef5 40%, ${data.bgColor}22 100%)`;
  verseCard.style.borderColor = data.accentColor;
  verseCard.style.boxShadow = `0 6px 18px ${data.accentColor}33`;

  // 翻页动画 - 渐入
  [verseCard, storyCard, moralCard].forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
  });

  setTimeout(() => {
    verseText.textContent = data.verse;
    pinyinText.textContent = data.pinyin;
    storyText.textContent = data.story;
    moralText.textContent = data.moral;

    // 渲染动画场景
    renderAnimation(data.animation, sceneWrap, data.bgColor);

    // 更新页码
    pageIndicator.textContent = `第 ${currentPage + 1} 页 / 共 ${threeCharClassic.length} 页`;

    // 更新按钮状态
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === threeCharClassic.length - 1;

    // 更新小圆点
    renderDots();

    // 渐入动画
    [verseCard, storyCard, moralCard].forEach((el, idx) => {
      setTimeout(() => {
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, idx * 100);
    });
  }, 100);
}

// ========== 翻页 ==========
prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < threeCharClassic.length - 1) {
    currentPage++;
    renderPage();
  }
});

// 键盘方向键
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && currentPage > 0) {
    currentPage--;
    renderPage();
  } else if (e.key === "ArrowRight" && currentPage < threeCharClassic.length - 1) {
    currentPage++;
    renderPage();
  }
});

// ========== 语音播报 ==========
function stopSpeaking() {
  if (speechSynth && speechSynth.speaking) {
    speechSynth.cancel();
  }
  isSpeaking = false;
  [playVerseBtn, playStoryBtn].forEach((b) => b.classList.remove("playing"));
}

function speakChinese(text, button) {
  if (!speechSynth) {
    alert("您的浏览器暂不支持语音朗读功能，请使用 Chrome、Edge 或 Safari 浏览器体验。");
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9; // 稍慢，适合儿童学习
  utterance.pitch = 1.1; // 稍高，更亲切
  utterance.volume = 1;

  // 尝试选择中文声音
  const voices = speechSynth.getVoices();
  const chineseVoice = voices.find((v) => v.lang.startsWith("zh"));
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  utterance.onstart = () => {
    isSpeaking = true;
    if (button) button.classList.add("playing");
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (button) button.classList.remove("playing");
  };

  utterance.onerror = () => {
    isSpeaking = false;
    if (button) button.classList.remove("playing");
  };

  currentUtterance = utterance;
  speechSynth.speak(utterance);
}

playVerseBtn.addEventListener("click", () => {
  const data = threeCharClassic[currentPage];
  const verse = data.verse.replace(/，/g, "，").replace(/。/g, "。");
  speakChinese(verse + "。" + data.pinyin, playVerseBtn);
});

playStoryBtn.addEventListener("click", () => {
  const data = threeCharClassic[currentPage];
  speakChinese(data.story + "。" + data.moral, playStoryBtn);
});

stopBtn.addEventListener("click", stopSpeaking);

// 预加载语音列表（部分浏览器是异步加载）
if (speechSynth) {
  speechSynth.onvoiceschanged = () => {
    speechSynth.getVoices();
  };
  // 触发一次
  speechSynth.getVoices();
}

// 初始化第一页
window.addEventListener("load", () => {
  renderPage();
  // 页面加载后自动播放故事（需用户交互才能播放声音）
  setTimeout(() => {
    // 提示用户
    pageIndicator.innerHTML += " <span style='color:#e91e63;'>👆 点击按钮开始听故事吧</span>";
  }, 1500);
});
