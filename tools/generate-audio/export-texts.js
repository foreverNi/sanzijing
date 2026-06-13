const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "../..");
const dataPath = path.join(rootDir, "data.js");
const outputPath = path.join(__dirname, "texts.json");
const voicePrompt = "温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。";

const context = {};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(dataPath, "utf8") + "\n;globalThis.__data = threeCharClassic;",
  context
);

const items = [];
function joinForSpeech(...parts) {
  return parts
    .map((part) => String(part).trim().replace(/[。！？；，、]+$/u, ""))
    .filter(Boolean)
    .join("。");
}

context.__data.forEach((page, index) => {
  const fileName = String(index + 1).padStart(3, "0") + ".mp3";
  items.push({
    id: `verse-${String(index + 1).padStart(3, "0")}`,
    page: index + 1,
    kind: "verse",
    output: `audio/verse/${fileName}`,
    text: joinForSpeech(page.verse, page.pinyin),
    voicePrompt
  });
  items.push({
    id: `story-${String(index + 1).padStart(3, "0")}`,
    page: index + 1,
    kind: "story",
    output: `audio/story/${fileName}`,
    text: joinForSpeech(page.story, page.moral),
    voicePrompt
  });
});

const manifest = {
  generator: "CosyVoice",
  source: "https://github.com/FunAudioLLM/CosyVoice",
  format: {
    container: "mp3",
    channels: 1,
    bitrateKbps: "64-96"
  },
  voicePrompt,
  count: items.length,
  items
};

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Wrote ${items.length} audio text items to ${path.relative(rootDir, outputPath)}`);
