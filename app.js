// 三字经故事网页 - 主逻辑
let currentPage = 0;
let currentAudio = null;
let currentAudioButton = null;

const verseText = document.getElementById("verseText");
const pinyinText = document.getElementById("pinyinText");
const storyText = document.getElementById("storyText");
const moralText = document.getElementById("moralText");
const pageIndicator = document.getElementById("pageIndicator");
const sceneWrap = document.getElementById("sceneWrap");
const book = document.getElementById("book");
const pageSelect = document.getElementById("pageSelect");
const verseCard = document.getElementById("verseCard");
const storyCard = document.getElementById("storyCard");
const moralCard = document.getElementById("moralCard");
const audioStatus = document.getElementById("audioStatus");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playVerseBtn = document.getElementById("playVerseBtn");
const playStoryBtn = document.getElementById("playStoryBtn");

// 初始化页面选择下拉框
function renderPageSelect() {
  pageSelect.innerHTML = "";
  threeCharClassic.forEach((_, idx) => {
    const data = threeCharClassic[idx];
    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = `第 ${idx + 1} 页 · ${data.verse}`;
    pageSelect.appendChild(option);
  });
}

// 渲染当前页
function renderPage() {
  const data = threeCharClassic[currentPage];
  stopAudio();

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
    pageSelect.value = String(currentPage);
    audioStatus.textContent = "";

    // 更新按钮状态
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === threeCharClassic.length - 1;

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

pageSelect.addEventListener("change", () => {
  currentPage = Number(pageSelect.value);
  renderPage();
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

// ========== 静态音频播放 ==========
function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentAudioButton) {
    currentAudioButton.classList.remove("playing");
  }
  currentAudio = null;
  currentAudioButton = null;
}

function pageAudioName() {
  return String(currentPage + 1).padStart(3, "0");
}

function playAudio(kind, button) {
  stopAudio();
  audioStatus.textContent = "";

  const audio = new Audio(`audio/${kind}/${pageAudioName()}.mp3`);
  currentAudio = audio;
  currentAudioButton = button;

  audio.addEventListener("play", () => {
    button.classList.add("playing");
  });

  audio.addEventListener("ended", stopAudio);

  audio.addEventListener("error", () => {
    stopAudio();
    audioStatus.textContent = "音频还在准备中，请稍后再试。";
  });

  audio.play().catch(() => {
    stopAudio();
    audioStatus.textContent = "音频还在准备中，请稍后再试。";
  });
}

playVerseBtn.addEventListener("click", () => {
  playAudio("verse", playVerseBtn);
});

playStoryBtn.addEventListener("click", () => {
  playAudio("story", playStoryBtn);
});

// 初始化第一页
window.addEventListener("load", () => {
  renderPageSelect();
  renderPage();
});
