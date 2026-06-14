// 三字经故事网页 - 主逻辑
let currentPage = 0;
let currentAudio = null;
let currentAudioButton = null;
let currentTtsRequest = null;
let currentUtterance = null;
let browserTtsQueue = [];
let browserTtsIndex = 0;
let browserTtsButton = null;
let browserTtsSession = 0;
const speechSynth = window.speechSynthesis || null;
const audioCache = new Map();
const ttsConfig = window.SANZIJING_TTS_CONFIG || {};

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
  stopAudio({ clearStatus: true });

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

// ========== TTS 接口播放 ==========
function stopAudio(options = {}) {
  const { clearStatus = false } = options;
  browserTtsSession++;
  if (currentTtsRequest) {
    currentTtsRequest.abort();
    currentTtsRequest = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (speechSynth && speechSynth.speaking) {
    speechSynth.cancel();
  }
  currentUtterance = null;
  browserTtsQueue = [];
  browserTtsIndex = 0;
  browserTtsButton = null;
  if (currentAudioButton) {
    currentAudioButton.classList.remove("playing");
  }
  [playVerseBtn, playStoryBtn].forEach((button) => {
    button.disabled = false;
    button.classList.remove("loading");
  });
  if (clearStatus) {
    audioStatus.textContent = "";
  }
  currentAudio = null;
  currentAudioButton = null;
}

function joinSpeechText(...parts) {
  return parts
    .map((part) => String(part).trim().replace(/[。！？；，、]+$/u, ""))
    .filter(Boolean)
    .join("。");
}

function getSpeechText(kind) {
  const data = threeCharClassic[currentPage];
  if (kind === "verse") {
    return joinSpeechText(data.verse, data.pinyin);
  }
  return joinSpeechText(data.story, data.moral);
}

function getBrowserSpeechText(kind) {
  const data = threeCharClassic[currentPage];
  if (kind === "verse") {
    return data.verse;
  }
  return joinSpeechText(data.story, data.moral);
}

function audioCacheKey(kind) {
  return `${kind}-${currentPage}`;
}

async function playAudio(kind, button) {
  stopAudio({ clearStatus: true });

  if (!ttsConfig.enabled || !ttsConfig.endpoint) {
    playBrowserTts(kind, button, "正在使用浏览器默认朗读。");
    return;
  }

  button.classList.add("loading");
  [playVerseBtn, playStoryBtn].forEach((item) => {
    item.disabled = true;
  });
  audioStatus.textContent = "正在生成老师朗读音频...";

  const cacheKey = audioCacheKey(kind);
  try {
    let audioUrl = ttsConfig.cacheAudio ? audioCache.get(cacheKey) : null;
    if (!audioUrl) {
      audioUrl = await requestTtsAudio(kind);
      if (ttsConfig.cacheAudio) {
        audioCache.set(cacheKey, audioUrl);
      }
    }
    playAudioUrl(audioUrl, button);
  } catch (error) {
    if (error.name !== "AbortError") {
      playBrowserTts(kind, button, "外部 TTS 暂时不可用，已切换为浏览器默认朗读。");
    }
    button.classList.remove("loading");
    [playVerseBtn, playStoryBtn].forEach((item) => {
      item.disabled = false;
    });
  }
}

async function requestTtsAudio(kind) {
  const controller = new AbortController();
  currentTtsRequest = controller;
  const timeout = setTimeout(() => controller.abort(), ttsConfig.timeoutMs || 60000);
  const data = threeCharClassic[currentPage];
  try {
    const response = await fetch(ttsConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({
        text: getSpeechText(kind),
        kind,
        page: currentPage + 1,
        verse: data.verse,
        voice: ttsConfig.voice || "zh-CN-XiaoxiaoNeural",
        rate: ttsConfig.rate || "-8%",
        pitch: ttsConfig.pitch || "+4Hz",
        voicePrompt: ttsConfig.voicePrompt,
        format: ttsConfig.outputFormat || "mp3"
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    return responseToAudioUrl(response);
  } finally {
    clearTimeout(timeout);
    currentTtsRequest = null;
  }
}

async function responseToAudioUrl(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.startsWith("audio/") || contentType.includes("octet-stream")) {
    return URL.createObjectURL(await response.blob());
  }

  const payload = await response.json();
  if (payload.audioUrl) {
    return payload.audioUrl;
  }
  if (payload.audioBase64) {
    const mimeType = payload.mimeType || "audio/mpeg";
    return URL.createObjectURL(base64ToBlob(payload.audioBase64, mimeType));
  }
  throw new Error("Unsupported TTS response");
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function playAudioUrl(audioUrl, button) {
  const audio = new Audio(audioUrl);
  currentAudio = audio;
  currentAudioButton = button;

  audio.addEventListener("play", () => {
    button.classList.add("playing");
    button.classList.remove("loading");
    [playVerseBtn, playStoryBtn].forEach((item) => {
      item.disabled = false;
    });
    audioStatus.textContent = "";
  });

  audio.addEventListener("ended", () => stopAudio({ clearStatus: true }));

  audio.addEventListener("error", () => {
    stopAudio();
    audioStatus.textContent = "音频播放失败，请稍后再试。";
  });

  audio.play().catch(() => {
    stopAudio();
    audioStatus.textContent = "浏览器阻止了播放，请再次点击按钮。";
  });
}

function playBrowserTts(kind, button, message) {
  if (ttsConfig.fallbackToBrowserTTS === false) {
    audioStatus.textContent = "请先配置开源 TTS 接口地址。";
    return;
  }
  if (!speechSynth || typeof SpeechSynthesisUtterance === "undefined") {
    audioStatus.textContent = "当前浏览器不支持系统 TTS，请配置外部 TTS 接口。";
    return;
  }

  browserTtsQueue = splitSpeechText(getBrowserSpeechText(kind));
  browserTtsIndex = 0;
  browserTtsButton = button;
  currentAudioButton = button;
  audioStatus.textContent = message;
  button.classList.add("playing");

  const session = ++browserTtsSession;
  speakNextBrowserChunk(session);
}

function speakNextBrowserChunk(session) {
  if (session !== browserTtsSession) {
    return;
  }
  if (!speechSynth || browserTtsIndex >= browserTtsQueue.length) {
    stopAudio({ clearStatus: true });
    return;
  }

  const utterance = new SpeechSynthesisUtterance(browserTtsQueue[browserTtsIndex]);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  utterance.pitch = 1.12;
  utterance.volume = 1;

  const voice = chooseBrowserVoice();
  if (voice) {
    utterance.voice = voice;
  }

  currentUtterance = utterance;
  utterance.onend = () => {
    if (session !== browserTtsSession) {
      return;
    }
    browserTtsIndex++;
    speakNextBrowserChunk(session);
  };
  utterance.onerror = () => {
    if (session !== browserTtsSession) {
      return;
    }
    stopAudio();
    audioStatus.textContent = "浏览器默认朗读失败，请配置外部 TTS 接口。";
  };

  speechSynth.speak(utterance);
  if (speechSynth.paused) {
    speechSynth.resume();
  }
  setTimeout(() => {
    if (speechSynth && speechSynth.paused) {
      speechSynth.resume();
    }
  }, 250);
}

function chooseBrowserVoice() {
  const voices = speechSynth.getVoices();
  const preferredNames = ["Xiaoxiao", "Xiaoyi", "Microsoft Huihui", "Tingting", "Google 普通话", "Google Mandarin"];
  return (
    voices.find((voice) => preferredNames.some((name) => voice.name.includes(name))) ||
    voices.find((voice) => voice.lang === "zh-CN") ||
    voices.find((voice) => voice.lang && voice.lang.startsWith("zh")) ||
    null
  );
}

function splitSpeechText(text) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const sentences = normalized.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [normalized];
  const chunks = [];
  let current = "";
  sentences.forEach((sentence) => {
    const next = current ? current + sentence : sentence;
    if (next.length > 90 && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = next;
    }
  });
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

if (speechSynth) {
  speechSynth.onvoiceschanged = () => {
    speechSynth.getVoices();
  };
  speechSynth.getVoices();
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
