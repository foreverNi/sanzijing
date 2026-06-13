// 三字经动画场景 - 完整版
// 每个场景都精心设计，表达经文的核心含义

// 通用动画生成函数
function createFloaties(symbols = ["✨", "🌟", "💫", "🫧", "💛"]) {
  return symbols.map((symbol, idx) => {
    const positions = [
      "top:12%;left:10%;",
      "top:18%;right:12%;",
      "bottom:18%;left:14%;",
      "bottom:14%;right:10%;",
      "top:48%;left:6%;",
      "top:44%;right:7%;"
    ];
    return `<span class="baby-floaty baby-floaty-${idx}" style="${positions[idx % positions.length]}animation-delay:${idx * 0.45}s;">${symbol}</span>`;
  }).join("");
}

function createStoryLabel(text, accent = "#e91e63") {
  return `<div class="baby-story-label" style="--baby-accent:${accent};">${text}</div>`;
}

function createSimpleScene(emoji, label, desc) {
  return () => `
    <div class="baby-template baby-simple">
      ${createFloaties()}
      <div class="baby-soft-hill"></div>
      <div class="baby-character baby-character-main">
        <div class="baby-face-glow"></div>
        <div class="baby-emoji">${emoji}</div>
        <div class="baby-sparkle-ring">✨</div>
      </div>
      <div class="baby-label-card">
        <div class="baby-label-main">${label}</div>
        ${desc ? `<div class="baby-label-desc">${desc}</div>` : ''}
      </div>
    </div>
  `;
}

function createDualScene(emoji1, emoji2, label1, label2, arrow = "→") {
  return () => `
    <div class="baby-template baby-dual">
      ${createFloaties(["🌈", "✨", "🫧", "🌟"])}
      <div class="baby-soft-hill"></div>
      <div class="baby-dual-card baby-dual-left">
        <div class="baby-emoji baby-emoji-side">${emoji1}</div>
        <div class="baby-mini-label">${label1}</div>
      </div>
      <div class="baby-arrow-bubble">${arrow}</div>
      <div class="baby-dual-card baby-dual-right">
        <div class="baby-emoji baby-emoji-side">${emoji2}</div>
        <div class="baby-mini-label warm">${label2}</div>
      </div>
    </div>
  `;
}

function createMultiScene(emojis, labels, title) {
  const items = emojis.map((e, i) => `
    <div class="baby-multi-item" style="animation-delay:${i * 0.14}s;">
      <div class="baby-emoji baby-emoji-grid">${e}</div>
      ${labels[i] ? `<div class="baby-grid-label">${labels[i]}</div>` : ''}
    </div>
  `).join('');
  
  return () => `
    <div class="baby-template baby-multi">
      ${createFloaties(["✨", "🌟", "🎈", "🫧"])}
      <div class="baby-soft-hill"></div>
      ${title ? createStoryLabel(title, "#1976d2") : ''}
      <div class="baby-grid">${items}</div>
    </div>
  `;
}

function createProcessScene(steps, title, caption = "") {
  const stepHtml = steps.map((step, idx) => `
    <div class="baby-process-step" style="animation-delay:${idx * 0.22}s;">
      <div class="baby-process-emoji">${step.emoji}</div>
      <div class="baby-process-text">${step.label}</div>
    </div>
  `).join(`<div class="baby-process-path">➜</div>`);

  return () => `
    <div class="baby-template baby-process">
      ${createFloaties(["🎈", "✨", "🌟", "🫧"])}
      <div class="baby-soft-hill"></div>
      ${createStoryLabel(title, "#e91e63")}
      <div class="baby-process-row">${stepHtml}</div>
      ${caption ? `<div class="baby-process-caption">${caption}</div>` : ''}
    </div>
    <style>
      .baby-process {
        flex-direction: column;
        gap: 16px;
      }
      .baby-process-row {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        max-width: 94%;
      }
      .baby-process-step {
        width: 112px;
        min-height: 118px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 24px;
        border: 2px solid rgba(255,255,255,0.78);
        background: rgba(255,255,255,0.72);
        box-shadow: 0 12px 24px rgba(96,64,32,0.1);
        animation: baby-card-hop 3.2s ease-in-out infinite;
      }
      .baby-process-emoji {
        font-size: clamp(2.7rem, 8vw, 4.5rem);
        line-height: 1;
        filter: drop-shadow(0 10px 18px rgba(96,64,32,0.14));
        animation: baby-emoji-wiggle 3.3s ease-in-out infinite;
      }
      .baby-process-text {
        color: #555;
        font-size: .92rem;
        font-weight: 900;
        text-align: center;
        line-height: 1.25;
      }
      .baby-process-path {
        position: relative;
        z-index: 3;
        color: #ff9800;
        font-size: 1.9rem;
        font-weight: 900;
        animation: baby-pulse 2s ease-in-out infinite;
      }
      .baby-process-caption {
        position: relative;
        z-index: 3;
        padding: 8px 18px;
        border-radius: 999px;
        background: rgba(255,255,255,0.82);
        color: #6a1b9a;
        font-size: .95rem;
        font-weight: 900;
        box-shadow: 0 8px 18px rgba(96,64,32,0.08);
      }
      @media (max-width: 700px) {
        .baby-process-row {
          gap: 6px;
        }
        .baby-process-step {
          width: 86px;
          min-height: 98px;
        }
        .baby-process-path {
          font-size: 1.2rem;
        }
        .baby-process-text {
          font-size: .78rem;
        }
      }
    </style>
  `;
}

const animationScenes = {
  // ========== 第一部分：教育意义（精心设计） ==========
  "baby-seed": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <div style="position:absolute;top:50%;left:50%;width:400px;height:400px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,215,0,0.25) 0%,transparent 70%);animation:halo-pulse 3s ease-in-out infinite;pointer-events:none;"></div>
      <div style="position:absolute;top:40px;left:60px;font-size:2rem;animation:heart-rise 4s ease-in-out infinite;">❤️</div>
      <div style="position:absolute;top:60px;right:80px;font-size:1.8rem;animation:heart-rise 4s ease-in-out infinite 1s;">❤️</div>
      <div style="position:absolute;bottom:60px;left:80px;font-size:1.6rem;animation:heart-rise 4s ease-in-out infinite 2s;">❤️</div>
      <div style="position:absolute;bottom:80px;right:60px;font-size:2rem;animation:heart-rise 4s ease-in-out infinite 0.5s;">❤️</div>
      <div style="position:relative;animation:gentle-bounce 2.5s ease-in-out infinite;">
        <div style="font-size:3rem;text-align:center;margin-bottom:10px;animation:star-twinkle 2s ease-in-out infinite;">✨</div>
        <div style="font-size:9rem;text-align:center;filter:drop-shadow(0 15px 30px rgba(0,0,0,0.15));position:relative;z-index:2;">👶</div>
        <div style="font-size:3rem;text-align:center;margin-top:-10px;animation:star-twinkle 2s ease-in-out infinite 0.5s;">✨</div>
      </div>
      <div style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);text-align:center;">
        <div style="font-size:3rem;animation:grow 3s ease-in-out infinite;display:inline-block;">🌱</div>
      </div>
      <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.9);padding:8px 24px;border-radius:30px;font-weight:800;color:#e91e63;font-size:1rem;letter-spacing:2px;box-shadow:0 4px 12px rgba(233,30,99,0.2);">本性善良 🌿</div>
    </div>
    <style>
      @keyframes halo-pulse { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; } 50% { transform: translate(-50%,-50%) scale(1.15); opacity: 1; } }
      @keyframes heart-rise { 0% { transform: translateY(30px); opacity: 0.3; } 50% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-30px); opacity: 0.3; } }
      @keyframes gentle-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      @keyframes star-twinkle { 0%,100% { opacity: 0.4; transform: scale(0.8) rotate(-10deg); } 50% { opacity: 1; transform: scale(1.2) rotate(10deg); } }
      @keyframes grow { 0% { transform: scale(0.7) translateY(10px); opacity: 0.6; } 50% { transform: scale(1.1) translateY(-5px); opacity: 1; } 100% { transform: scale(0.7) translateY(10px); opacity: 0.6; } }
    </style>
  `,

  "two-trees": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:space-around;padding:20px;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;width:50%;height:100%;background:linear-gradient(180deg,rgba(135,206,235,0.15),rgba(144,238,144,0.2));z-index:0;"></div>
      <div style="position:absolute;top:0;right:0;width:50%;height:100%;background:linear-gradient(180deg,rgba(169,169,169,0.15),rgba(139,69,19,0.15));z-index:0;"></div>
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="font-size:2.5rem;animation:sun-shine 3s ease-in-out infinite;">☀️</div>
        <div style="font-size:8rem;animation:tree-sway 3s ease-in-out infinite;filter:drop-shadow(0 15px 25px rgba(0,100,0,0.25));">🌳</div>
        <div style="font-size:1.8rem;animation:drop 2s ease-in-out infinite;">💧</div>
        <div style="background:rgba(76,175,80,0.15);border:2px solid #4caf50;padding:8px 20px;border-radius:20px;font-weight:800;color:#2e7d32;font-size:1rem;">好环境 · 茁壮成长</div>
      </div>
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:8px;">
        <div style="font-size:1.5rem;font-weight:900;color:#666;">同样的起点</div>
        <div style="font-size:2.5rem;animation:arrow-move 2s ease-in-out infinite;">↔️</div>
        <div style="font-size:1.3rem;font-weight:800;color:#e91e63;">不同的结果</div>
      </div>
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <div style="font-size:2.5rem;animation:storm 2s ease-in-out infinite;">⛈️</div>
        <div style="font-size:8rem;animation:tree-shake 2.5s ease-in-out infinite;filter:grayscale(0.6) brightness(0.7) drop-shadow(0 15px 25px rgba(101,67,33,0.25));">🥀</div>
        <div style="font-size:1.8rem;animation:shake 1s ease-in-out infinite;">🪨</div>
        <div style="background:rgba(244,67,54,0.15);border:2px solid #f44336;padding:8px 20px;border-radius:20px;font-weight:800;color:#c62828;font-size:1rem;">坏环境 · 日渐枯萎</div>
      </div>
    </div>
    <style>
      @keyframes sun-shine { 0%,100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(15deg); } }
      @keyframes tree-sway { 0%,100% { transform: rotate(-3deg) scale(1); } 50% { transform: rotate(3deg) scale(1.05); } }
      @keyframes tree-shake { 0%,100% { transform: rotate(-8deg) translateY(5px); } 50% { transform: rotate(8deg) translateY(-5px); } }
      @keyframes drop { 0% { transform: translateY(-15px); opacity: 0; } 50% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(15px); opacity: 0; } }
      @keyframes storm { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15) rotate(-10deg); } }
      @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      @keyframes arrow-move { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(1.3); } }
    </style>
  `,

  "cloth-clean": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;gap:40px;padding:20px;overflow:hidden;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:15px;">
        <div style="position:relative;">
          <div style="width:150px;height:180px;background:linear-gradient(135deg,#ffffff,#f5f5f5);border:3px solid #ddd;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.1);animation:paper-float 3s ease-in-out infinite;display:flex;align-items:center;justify-content:center;font-size:4rem;">😇</div>
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:2rem;animation:sparkle 1.5s ease-in-out infinite;">✨</div>
        </div>
        <div style="background:rgba(76,175,80,0.15);border:2px solid #4caf50;padding:10px 18px;border-radius:20px;font-weight:800;color:#2e7d32;font-size:1.05rem;text-align:center;">纯洁的心灵<br/>本性善良</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
        <div style="font-size:2.5rem;animation:arrow-down 2s ease-in-out infinite;">⬇️</div>
        <div style="font-size:1rem;font-weight:800;color:#f44336;background:#fff3e0;padding:6px 14px;border-radius:15px;">缺少教育</div>
        <div style="font-size:2.5rem;animation:arrow-down 2s ease-in-out infinite;">⬇️</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:15px;">
        <div style="position:relative;">
          <div style="width:150px;height:180px;background:linear-gradient(135deg,#d7ccc8,#a1887f);border:3px solid #8d6e63;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.2);animation:paper-float 3s ease-in-out infinite 1s;display:flex;align-items:center;justify-content:center;font-size:4rem;position:relative;overflow:hidden;">😢
            <div style="position:absolute;top:15px;left:15px;width:25px;height:25px;background:#5d4037;border-radius:50%;opacity:0.7;animation:stain 2s ease-in-out infinite;"></div>
            <div style="position:absolute;bottom:25px;right:20px;width:30px;height:20px;background:#3e2723;border-radius:50%;opacity:0.6;animation:stain 2s ease-in-out infinite 0.5s;"></div>
          </div>
        </div>
        <div style="background:rgba(244,67,54,0.15);border:2px solid #f44336;padding:10px 18px;border-radius:20px;font-weight:800;color:#c62828;font-size:1.05rem;text-align:center;">本性改变了<br/>染上了污点</div>
      </div>
      <div style="position:absolute;top:15px;left:50%;transform:translateX(-50%);background:rgba(255,152,0,0.15);border:2px solid #ff9800;padding:8px 20px;border-radius:20px;font-weight:800;color:#e65100;font-size:1rem;letter-spacing:2px;">⚠️ 不教育的后果</div>
    </div>
    <style>
      @keyframes paper-float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      @keyframes sparkle { 0%,100% { opacity: 0.3; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.2) rotate(20deg); } }
      @keyframes arrow-down { 0%,100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(10px); opacity: 1; } }
      @keyframes stain { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.3); opacity: 0.8; } }
    </style>
  `,

  "magnifier": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;padding:30px;overflow:hidden;">
      <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:300px;height:300px;background:radial-gradient(circle,rgba(255,235,59,0.3),transparent 70%);animation:focus-glow 3s ease-in-out infinite;"></div>
      <div style="position:absolute;top:30px;left:50%;transform:translateX(-50%);display:flex;gap:15px;">
        <div style="font-size:2rem;animation:item-float 2s ease-in-out infinite;">📚</div>
        <div style="font-size:2rem;animation:item-float 2s ease-in-out infinite 0.3s;">📖</div>
        <div style="font-size:2rem;animation:item-float 2s ease-in-out infinite 0.6s;">✏️</div>
        <div style="font-size:2rem;animation:item-float 2s ease-in-out infinite 0.9s;">🎨</div>
      </div>
      <div style="position:relative;margin-top:30px;">
        <div style="font-size:8rem;animation:book-open 3s ease-in-out infinite;filter:drop-shadow(0 15px 25px rgba(52,73,94,0.25));text-align:center;">📖</div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;background:radial-gradient(circle,#ffeb3b,rgba(255,235,59,0));border-radius:50%;box-shadow:0 0 40px 15px rgba(255,235,59,0.7);animation:focus-point 2s ease-in-out infinite;"></div>
        <div style="position:absolute;top:-30px;right:-40px;font-size:7rem;animation:magnifier-move 4s ease-in-out infinite;filter:drop-shadow(0 10px 20px rgba(0,0,0,0.25));">🔍</div>
      </div>
      <div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(156,39,176,0.15);border:2px solid #9c27b0;padding:12px 24px;border-radius:25px;font-weight:800;color:#6a1b9a;font-size:1.1rem;letter-spacing:2px;">🎯 专心致志 · 才能学好</div>
    </div>
    <style>
      @keyframes focus-glow { 0%,100% { opacity: 0.5; transform: translateX(-50%) scale(1); } 50% { opacity: 0.9; transform: translateX(-50%) scale(1.2); } }
      @keyframes item-float { 0%,100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-15px); opacity: 1; } }
      @keyframes book-open { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      @keyframes magnifier-move { 0%,100% { transform: translate(0,0) rotate(-5deg); } 25% { transform: translate(-40px,20px) rotate(5deg); } 50% { transform: translate(-20px,40px) rotate(-5deg); } 75% { transform: translate(20px,20px) rotate(5deg); } }
      @keyframes focus-point { 0%,100% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.7; } 50% { transform: translate(-50%,-50%) scale(1.4); opacity: 1; } }
    </style>
  `,

  "mother-move": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:20px;">
      <div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:space-around;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div style="font-size:1.8rem;animation:stage1 5s ease-in-out infinite;">🕯️</div>
          <div style="font-size:4.5rem;animation:stage1 5s ease-in-out infinite;">🏚️</div>
          <div style="background:rgba(117,117,117,0.15);border:2px solid #757575;padding:6px 12px;border-radius:15px;font-weight:800;color:#424242;font-size:0.9rem;">第一处</div>
          <div style="font-size:0.9rem;color:#616161;font-weight:700;">墓地旁</div>
        </div>
        <div style="font-size:2.2rem;color:#1976d2;animation:arrow-right 2s ease-in-out infinite;">➡️</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div style="font-size:1.8rem;animation:stage2 5s ease-in-out infinite;">🛒</div>
          <div style="font-size:4.5rem;animation:stage2 5s ease-in-out infinite;">🏪</div>
          <div style="background:rgba(255,152,0,0.15);border:2px solid #ff9800;padding:6px 12px;border-radius:15px;font-weight:800;color:#e65100;font-size:0.9rem;">第二处</div>
          <div style="font-size:0.9rem;color:#ef6c00;font-weight:700;">集市边</div>
        </div>
        <div style="font-size:2.2rem;color:#1976d2;animation:arrow-right 2s ease-in-out infinite 0.3s;">➡️</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div style="font-size:1.8rem;animation:stage3 5s ease-in-out infinite;">📚</div>
          <div style="font-size:4.5rem;animation:stage3 5s ease-in-out infinite;">🏫</div>
          <div style="background:rgba(76,175,80,0.2);border:3px solid #4caf50;padding:6px 12px;border-radius:15px;font-weight:900;color:#2e7d32;font-size:0.9rem;box-shadow:0 4px 12px rgba(76,175,80,0.3);">✓ 最终</div>
          <div style="font-size:0.9rem;color:#2e7d32;font-weight:700;">学校旁 🌟</div>
        </div>
      </div>
      <div style="position:absolute;top:55%;left:5%;z-index:5;animation:mother-move 5s ease-in-out infinite;">
        <div style="display:flex;align-items:center;gap:3px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.25));">
          <div style="font-size:3.5rem;animation:bounce-step 0.5s ease-in-out infinite;">👩</div>
          <div style="font-size:2.5rem;animation:bounce-step 0.5s ease-in-out infinite 0.25s;">🧒</div>
          <div style="font-size:2rem;animation:bounce-step 0.5s ease-in-out infinite 0.1s;">📦</div>
        </div>
      </div>
      <div style="position:absolute;top:15px;left:50%;transform:translateX(-50%);background:rgba(25,118,210,0.15);border:2px solid #1976d2;padding:10px 22px;border-radius:25px;font-weight:800;color:#0d47a1;font-size:1.05rem;letter-spacing:2px;">🏠 孟母三迁 · 择邻而居</div>
      <div style="position:absolute;bottom:25px;left:50%;transform:translateX(-50%);background:rgba(255,193,7,0.2);border:2px solid #ffc107;padding:10px 22px;border-radius:25px;font-weight:800;color:#e65100;font-size:1rem;animation:learning 3s ease-in-out infinite;">📖 孟子开始学习礼仪和知识 ✨</div>
    </div>
    <style>
      @keyframes arrow-right { 0%,100% { transform: translateX(0); } 50% { transform: translateX(15px); } }
      @keyframes stage1 { 0%,25% { transform: scale(1.15); filter: drop-shadow(0 8px 25px rgba(117,117,117,0.6)) brightness(1); } 26%,100% { transform: scale(1); opacity: 0.5; } }
      @keyframes stage2 { 0%,25% { transform: scale(1); opacity: 0.5; } 26%,55% { transform: scale(1.15); filter: drop-shadow(0 8px 25px rgba(255,152,0,0.6)) brightness(1); } 56%,100% { transform: scale(1); opacity: 0.5; } }
      @keyframes stage3 { 0%,55% { transform: scale(1); opacity: 0.5; } 56%,100% { transform: scale(1.2); filter: drop-shadow(0 8px 25px rgba(76,175,80,0.7)) brightness(1); opacity: 1; } }
      @keyframes mother-move { 0% { left: 5%; } 25% { left: 30%; } 50% { left: 55%; } 100% { left: 75%; } }
      @keyframes bounce-step { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes learning { 0%,100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.05); } }
    </style>
  `,

  "loom-cut": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px;overflow:hidden;">
      <div style="position:relative;display:flex;align-items:center;justify-content:center;margin-top:20px;">
        <div style="font-size:3.5rem;animation:spool-spin 2s ease-in-out infinite;">🧵</div>
        <div style="position:relative;width:200px;height:80px;">
          <div style="position:absolute;top:50%;transform:translateY(-50%);width:100%;height:50px;background:repeating-linear-gradient(45deg,#8d6e63,#8d6e63 5px,#a1887f 5px,#a1887f 10px);border:3px solid #5d4037;border-radius:4px;box-shadow:0 8px 20px rgba(93,64,55,0.35);animation:weave 3s ease-in-out infinite;"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:0;height:60px;background:#fff;border-left:3px dashed #c62828;animation:cut-snap 3s ease-in-out infinite;"></div>
        </div>
        <div style="font-size:3.5rem;animation:spool-spin 2s ease-in-out infinite 0.5s;">🧵</div>
        <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:5rem;animation:scissor-cut 3s ease-in-out infinite;filter:drop-shadow(0 8px 15px rgba(244,67,54,0.4));z-index:10;">✂️</div>
        <div style="position:absolute;bottom:-60px;left:20px;font-size:4rem;animation:mother-shake 3s ease-in-out infinite;">👩</div>
        <div style="position:absolute;bottom:-60px;right:20px;font-size:3.5rem;animation:child-ashamed 3s ease-in-out infinite;">🧒</div>
      </div>
      <div style="display:flex;gap:20px;margin-top:80px;">
        <div style="background:rgba(76,175,80,0.15);border:2px solid #4caf50;padding:10px 18px;border-radius:15px;font-weight:800;color:#2e7d32;font-size:1rem;text-align:center;">织布剪断<br/><span style="font-size:0.9rem;color:#558b2f;">无法再接回去</span></div>
        <div style="background:rgba(244,67,54,0.15);border:2px solid #f44336;padding:10px 18px;border-radius:15px;font-weight:800;color:#c62828;font-size:1rem;text-align:center;">学习中断<br/><span style="font-size:0.9rem;color:#e53935;">前功尽弃 ⚠️</span></div>
      </div>
      <div style="position:absolute;top:15px;left:50%;transform:translateX(-50%);background:rgba(244,67,54,0.15);border:2px solid #f44336;padding:10px 24px;border-radius:25px;font-weight:800;color:#c62828;font-size:1.1rem;">✂️ 半途而废 · 前功尽弃</div>
    </div>
    <style>
      @keyframes spool-spin { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
      @keyframes weave { 0%,30% { opacity: 1; transform: translateY(-50%) scaleX(1); } 40% { opacity: 0.8; transform: translateY(-50%) scaleX(0.95); } 50%,100% { opacity: 1; transform: translateY(-50%) scaleX(1); } }
      @keyframes cut-snap { 0%,30% { width: 0; opacity: 0; } 40% { width: 3px; opacity: 1; } 50% { width: 30px; opacity: 1; } 60%,100% { width: 3px; opacity: 0.7; } }
      @keyframes scissor-cut { 0%,30% { transform: translateX(-50%) translateY(-50px) rotate(-45deg); opacity: 0.5; } 40% { transform: translateX(-50%) translateY(0) rotate(0deg); opacity: 1; } 50% { transform: translateX(-50%) translateY(10px) rotate(15deg); opacity: 1; } 60%,100% { transform: translateX(-50%) translateY(0) rotate(0deg); opacity: 0.7; } }
      @keyframes mother-shake { 0%,30%,100% { transform: rotate(0deg); } 40%,60% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
      @keyframes child-ashamed { 0%,30% { transform: translateY(0); opacity: 1; } 40%,70% { transform: translateY(10px) scale(0.95); opacity: 0.8; } 100% { transform: translateY(0); opacity: 1; } }
    </style>
  `,

  "teacher-parent": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;padding:25px;overflow:hidden;">
      <div style="position:relative;display:flex;align-items:flex-end;gap:30px;z-index:3;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div style="font-size:7rem;animation:father-teach 2.5s ease-in-out infinite;filter:drop-shadow(0 15px 25px rgba(78,52,46,0.3));">👴</div>
          <div style="background:rgba(78,52,46,0.15);border:2px solid #4e342e;padding:6px 16px;border-radius:20px;font-weight:800;color:#3e2723;font-size:1rem;">窦燕山</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:15px;">
          <div style="font-size:2rem;animation:bubble-rise 2s ease-in-out infinite;">💭</div>
          <div style="font-size:4.5rem;animation:book-rise 2.5s ease-in-out infinite;">📚</div>
          <div style="background:rgba(255,193,7,0.2);border:2px dashed #ffc107;padding:8px 20px;border-radius:15px;font-weight:800;color:#e65100;font-size:1rem;">教育有方 🌟</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div style="font-size:5.5rem;animation:child-learn 2s ease-in-out infinite;filter:drop-shadow(0 15px 25px rgba(56,142,60,0.3));">👦</div>
          <div style="background:rgba(56,142,60,0.15);border:2px solid #388e3c;padding:6px 16px;border-radius:20px;font-weight:800;color:#1b5e20;font-size:1rem;">孩子</div>
        </div>
      </div>
      <div style="position:absolute;top:30px;left:40px;font-size:2.5rem;animation:float-item 3s ease-in-out infinite;">📖</div>
      <div style="position:absolute;top:50px;right:60px;font-size:2.2rem;animation:float-item 3s ease-in-out infinite 0.5s;">✏️</div>
      <div style="position:absolute;bottom:80px;left:50px;font-size:2rem;animation:float-item 3s ease-in-out infinite 1s;">🎓</div>
      <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(255,152,0,0.15);border:2px solid #ff9800;padding:10px 22px;border-radius:25px;font-weight:800;color:#e65100;font-size:1.05rem;">👨‍👦 言传身教 · 好方法教出好孩子</div>
    </div>
    <style>
      @keyframes father-teach { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.03); } }
      @keyframes child-learn { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes book-rise { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
      @keyframes bubble-rise { 0%,100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(-20px); opacity: 1; } }
      @keyframes float-item { 0%,100% { transform: translateY(0) rotate(-5deg); opacity: 0.6; } 50% { transform: translateY(-20px) rotate(10deg); opacity: 1; } }
    </style>
  `,

  "five-children": () => `
    <div style="width:100%;height:100%;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:25px;overflow:hidden;">
      <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;height:100%;background:radial-gradient(circle,rgba(255,215,0,0.15) 0%,transparent 60%);animation:gold-pulse 3s ease-in-out infinite;z-index:0;"></div>
      <div style="position:relative;z-index:3;margin-bottom:15px;">
        <div style="font-size:5.5rem;animation:trophy-glow 2.5s ease-in-out infinite;filter:drop-shadow(0 15px 30px rgba(255,193,7,0.5));">🏆</div>
        <div style="position:absolute;top:-10px;left:-30px;font-size:2rem;animation:confetti 2s ease-in-out infinite;">🎉</div>
        <div style="position:absolute;top:-10px;right:-30px;font-size:2rem;animation:confetti 2s ease-in-out infinite 0.5s;">🎊</div>
      </div>
      <div style="position:relative;z-index:3;display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-top:20px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div style="font-size:4rem;animation:child-success 2s ease-in-out infinite 0s;">🧑‍🎓</div><div style="background:rgba(233,30,99,0.15);border:2px solid #e91e63;padding:4px 12px;border-radius:15px;font-weight:800;color:#ad1457;font-size:0.9rem;">状元</div></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div style="font-size:4rem;animation:child-success 2s ease-in-out infinite 0.2s;">🧑‍🎓</div><div style="background:rgba(156,39,176,0.15);border:2px solid #9c27b0;padding:4px 12px;border-radius:15px;font-weight:800;color:#6a1b9a;font-size:0.9rem;">进士</div></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div style="font-size:4rem;animation:child-success 2s ease-in-out infinite 0.4s;">🧑‍🎓</div><div style="background:rgba(63,81,181,0.15);border:2px solid #3f51b5;padding:4px 12px;border-radius:15px;font-weight:800;color:#1a237e;font-size:0.9rem;">探花</div></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div style="font-size:4rem;animation:child-success 2s ease-in-out infinite 0.6s;">🧑‍🎓</div><div style="background:rgba(3,169,244,0.15);border:2px solid #03a9f4;padding:4px 12px;border-radius:15px;font-weight:800;color:#01579b;font-size:0.9rem;">榜眼</div></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><div style="font-size:4rem;animation:child-success 2s ease-in-out infinite 0.8s;">🧑‍🎓</div><div style="background:rgba(76,175,80,0.15);border:2px solid #4caf50;padding:4px 12px;border-radius:15px;font-weight:800;color:#1b5e20;font-size:0.9rem;">及第</div></div>
      </div>
      <div style="position:relative;z-index:3;margin-top:25px;display:flex;align-items:center;gap:15px;">
        <div style="font-size:4.5rem;animation:father-proud 2.5s ease-in-out infinite;">👴</div>
        <div style="font-size:2rem;animation:smile 2s ease-in-out infinite;">😊</div>
      </div>
      <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(255,193,7,0.25),rgba(255,152,0,0.25));border:3px solid #ffc107;padding:12px 28px;border-radius:30px;font-weight:900;color:#e65100;font-size:1.15rem;letter-spacing:3px;box-shadow:0 6px 20px rgba(255,193,7,0.4);z-index:10;">🏅 五子登科 · 名扬四海 🏅</div>
    </div>
    <style>
      @keyframes gold-pulse { 0%,100% { opacity: 0.5; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.1); } }
      @keyframes trophy-glow { 0%,100% { transform: scale(1) rotate(-3deg); filter: drop-shadow(0 15px 30px rgba(255,193,7,0.5)); } 50% { transform: scale(1.15) rotate(3deg); filter: drop-shadow(0 15px 45px rgba(255,193,7,0.8)); } }
      @keyframes confetti { 0%,100% { transform: translateY(0) rotate(-15deg); opacity: 0.7; } 50% { transform: translateY(-15px) rotate(15deg); opacity: 1; } }
      @keyframes child-success { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.1); } }
      @keyframes father-proud { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.05); } }
      @keyframes smile { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.2); opacity: 1; } }
    </style>
  `,

  // ========== 第二部分：学习的重要性 ==========
  "father-teach": createDualScene("👨‍👦", "📚", "养育", "教育", "→"),
  "teacher-strict": createDualScene("👩‍🏫", "📖", "老师", "严格教导", "→"),
  "child-study": createSimpleScene("👦", "学习是孩子的本分", "📚✏️"),
  "young-old": createDualScene("👦", "👴", "少壮努力", "老大伤悲", "→"),
  "jade-carve": createDualScene("💎", "🏺", "玉石", "精美器物", "→"),
  "book-wisdom": createSimpleScene("📖", "学习让人懂得道理", "知书达理"),

  // ========== 第三部分：为人处事、孝敬长辈 ==========
  "child-grow": createSimpleScene("🌱", "年少时就要学做人", "从小养成好习惯"),
  "teacher-friend": createMultiScene(["👨‍🏫", "👫", "🙇"], ["良师", "益友", "礼仪"], "亲近良师益友"),
  "huangxiang-warm": createProcessScene([
    { emoji: "🌙", label: "夜晚到了" },
    { emoji: "👦", label: "黄香暖席" },
    { emoji: "🛏️", label: "父母安睡" }
  ], "黄香温席", "孝顺从小事做起"),
  "filial-piety": createSimpleScene("🙇", "孝顺父母", "天经地义"),
  "kongrong-pear": createProcessScene([
    { emoji: "🍐", label: "一盘梨" },
    { emoji: "👦", label: "孔融选择" },
    { emoji: "🤝", label: "大的让给哥哥" }
  ], "孔融让梨", "学会分享和谦让"),
  "siblings-love": createMultiScene(["👦", "👧", "❤️"], ["哥哥", "弟弟", "友爱"], "兄弟姐妹和睦"),

  // ========== 第四部分：基础知识 ==========
  "priority-first": createDualScene("🙇", "📚", "先学做人", "再学知识", "→"),
  "count-read": createMultiScene(["🔢", "📖", "✏️"], ["数数", "认字", "写字"], "算数识字"),
  "numbers-count": createSimpleScene("🔢", "一而十，十而百", "循序渐进"),
  "numbers-infinity": createSimpleScene("♾️", "数字无穷", "学无止境"),
  "heaven-earth-man": createMultiScene(["☀️", "🌍", "👤"], ["天", "地", "人"], "三才：天地人"),
  "sun-moon-star": createProcessScene([
    { emoji: "☀️", label: "太阳升起" },
    { emoji: "🌙", label: "月亮出来" },
    { emoji: "⭐", label: "星星闪闪" }
  ], "日月星三光", "天空每天都有光"),
  "ruler-subject": createDualScene("👑", "🙇", "君主", "臣子", "↔️"),
  "family-harmony": createMultiScene(["👨", "👩", "👦", "👧"], ["父", "母", "子", "女"], "家和万事兴"),
  "four-seasons": createProcessScene([
    { emoji: "🌸", label: "春天开花" },
    { emoji: "☀️", label: "夏天明亮" },
    { emoji: "🍂", label: "秋天收获" },
    { emoji: "❄️", label: "冬天飘雪" }
  ], "四季轮转", "春夏秋冬慢慢转"),
  "season-cycle": createSimpleScene("🔄", "四季运转", "永不停息"),
  "four-directions": createMultiScene(["⬆️", "⬇️", "⬅️", "➡️"], ["北", "南", "西", "东"], "四方"),
  "center-direction": createSimpleScene("🎯", "中央为基准", "不偏不倚"),
  "five-elements": createMultiScene(["💧", "🔥", "🌲", "⚙️", "🪨"], ["水", "火", "木", "金", "土"], "五行"),
  "elements-order": createSimpleScene("🔄", "五行相生相克", "有规律"),

  // ========== 第五部分：人伦五常 ==========
  "five-virtues": createMultiScene(["❤️", "⚖️", "🙇", "🧠", "🤝"], ["仁", "义", "礼", "智", "信"], "五常"),
  "virtues-stable": createSimpleScene("📿", "五常不可混乱", "永远遵守"),
  "six-grains": createMultiScene(["🌾", "🌽", "🫘", "🌾", "🌾", "🌾"], ["稻", "粱", "菽", "麦", "黍", "稷"], "六谷"),
  "food-variety": createSimpleScene("🍚", "不挑食才健康", "样样都要吃"),
  "six-animals": createMultiScene(["🐴", "🐄", "🐑", "🐔", "🐕", "🐷"], ["马", "牛", "羊", "鸡", "狗", "猪"], "六畜"),
  "animal-care": createSimpleScene("🐕", "善待动物", "它们是人类的朋友"),

  // ========== 第六部分：典籍经典 ==========
  "lunyu-book": createSimpleScene("📜", "《论语》二十篇", "儒家经典"),
  "disciples-record": createSimpleScene("👥", "弟子记录老师教诲", "传承智慧"),
  "mencius-book": createSimpleScene("📜", "《孟子》七篇", "讲仁政"),
  "moral-teach": createSimpleScene("⚖️", "讲道德，说仁义", "人性本善"),
  "zhongyong-book": createSimpleScene("📜", "《中庸》", "子思笔"),
  "balance-neutral": createSimpleScene("⚖️", "不偏不倚", "中庸之道"),
  "daxue-book": createSimpleScene("📜", "《大学》", "曾子著"),
  "self-govern": createSimpleScene("🏛️", "修身齐家治国平天下", "从自己做起"),

  // ========== 第七部分：历史朝代 ==========
  "ancient-kings": createMultiScene(["👑", "👑"], ["夏禹", "商汤"], "开国贤君"),
  "three-kings": createMultiScene(["👑", "👑", "👑"], ["夏禹", "商汤", "周武"], "三王"),
  "shang-dynasty": createSimpleScene("🏛️", "商汤灭夏建商", "六百年"),
  "zhou-fall": createSimpleScene("🔥", "商纣亡国", "六百载终"),
  "zhou-king": createSimpleScene("⚔️", "周武王灭商", "建立周朝"),
  "zhou-long": createSimpleScene("🏛️", "周朝八百年", "最长久"),
  "warring-states": createSimpleScene("⚔️", "春秋战国", "百家争鸣"),
  "warring-seven": createMultiScene(["🏛️", "🏛️", "🏛️", "🏛️", "🏛️", "🏛️", "🏛️"], ["齐", "楚", "燕", "韩", "赵", "魏", "秦"], "战国七雄"),
  "qin-unify": createProcessScene([
    { emoji: "🏰", label: "诸国并立" },
    { emoji: "🐉", label: "秦国统一" },
    { emoji: "🧱", label: "修筑长城" }
  ], "秦统一六国", "历史也可以像故事一样看"),
  "chu-han": createDualScene("⚔️", "🏆", "楚项羽", "汉刘邦", "VS"),
  "han-found": createSimpleScene("🏛️", "刘邦建立汉朝", "四百年基业"),
  "wangmang-usurp": createSimpleScene("👑", "王莽篡汉", "建立新朝"),
  "eastern-han": createSimpleScene("🏛️", "刘秀中兴", "东汉复兴"),
  "han-end": createSimpleScene("⚔️", "汉朝四百年", "亡于献帝"),
  "three-kingdoms": createMultiScene(["🏛️", "🏛️", "🏛️"], ["魏", "蜀", "吴"], "三国鼎立"),
  "three-to-jin": createSimpleScene("➡️", "三国归晋", "天下一统"),
  "tang-found": createSimpleScene("🏛️", "李渊建唐", "贞观之治"),
  "tang-golden": createProcessScene([
    { emoji: "🏛️", label: "唐朝建立" },
    { emoji: "🎶", label: "诗乐兴盛" },
    { emoji: "🌟", label: "盛世闪光" }
  ], "唐朝盛世", "文化像星星一样亮"),
  "tang-long": createSimpleScene("🏛️", "唐朝三百年", "二十传"),
  "tang-fall": createSimpleScene("🔥", "唐朝灭亡", "五代十国"),
  "song-found": createSimpleScene("🏛️", "赵匡胤建宋", "黄袍加身"),
  "song-north-south": createDualScene("🏛️", "🏛️", "北宋", "南宋", "→"),

  // ========== 第八部分：勤学故事 ==========
  "confucius-study": createSimpleScene("👴", "孔子好学", "拜七岁小孩为师"),
  "ancient-diligent": createSimpleScene("📚", "圣贤勤学", "何况我们"),
  "head-hair": createProcessScene([
    { emoji: "🌙", label: "夜里读书" },
    { emoji: "📚", label: "提醒自己" },
    { emoji: "💪", label: "坚持学习" }
  ], "刻苦勤学", "用温和方式理解努力"),
  "self-study": createSimpleScene("📖", "主动学习", "不要人督促"),
  "firefly-snow": createProcessScene([
    { emoji: "✨", label: "萤火微光" },
    { emoji: "📖", label: "照着读书" },
    { emoji: "❄️", label: "雪光映字" }
  ], "囊萤映雪", "条件艰苦也爱学习"),
  "poor-study": createSimpleScene("📖", "贫穷不停止学习", "志向坚定"),
  "su-old-study": createSimpleScene("👴", "苏洵二十七岁", "发愤读书"),
  "never-too-late": createSimpleScene("⏰", "学习永远不晚", "何时开始都不迟"),
  "lianghao-old": createSimpleScene("🏆", "梁灏八十二岁", "中状元"),
  "old-success": createSimpleScene("👴", "年老照样成才", "有志不在年高"),
  "zuying-poem": createSimpleScene("👦", "祖莹八岁", "能吟诗"),
  "limi-chess": createSimpleScene("👦", "李泌七岁", "能赋棋"),
  "caiwenji-qin": createSimpleScene("👩", "蔡文姬", "能辨琴声"),
  "xiedaoyun-poem": createSimpleScene("👩", "谢道韫", "咏絮之才"),
  "girl-smart": createSimpleScene("👩", "女孩子也聪明", "男女平等"),
  "boy-alert": createSimpleScene("👦", "男生更要努力", "不能落后"),
  "liuyan-child": createSimpleScene("👦", "刘晏七岁", "当小官"),
  "child-official": createSimpleScene("📚", "神童也要努力", "持续进步"),

  // ========== 第九部分：劝学总结 ==========
  "dog-rooster": createDualScene("🐕", "🐓", "狗守夜", "鸡司晨", "&"),
  "human-learn": createSimpleScene("👤", "不学无术", "不如动物"),
  "silkworm-bee": createProcessScene([
    { emoji: "🐛", label: "蚕宝宝吐丝" },
    { emoji: "🐝", label: "小蜜蜂采蜜" },
    { emoji: "🍯", label: "勤劳有成果" }
  ], "蚕丝蜂蜜", "万物都在认真做事"),
  "better-than-animal": createSimpleScene("📚", "人要学习", "超过动物"),
  "young-learn": createDualScene("👦", "👨", "幼而学", "壮而行", "→"),
  "serve-country": createSimpleScene("🏛️", "报效国家", "造福百姓"),
  "famous-family": createSimpleScene("👨‍👩‍👦", "成功让父母光荣", "光宗耀祖"),
  "honor-ancestors": createSimpleScene("🏆", "光于前，裕于后", "造福后代"),
  "gold-legacy": createSimpleScene("💰", "留金不如留经", "知识是最好的遗产"),
  "classic-legacy": createSimpleScene("📜", "我只教孩子一本经", "三字经"),
  "diligence-play": createProcessScene([
    { emoji: "🎮", label: "先想玩" },
    { emoji: "📚", label: "再学习" },
    { emoji: "🏅", label: "勤有功" }
  ], "勤学有收获", "玩耍和学习要有次序"),
  "final-warning": createProcessScene([
    { emoji: "📜", label: "读完三字经" },
    { emoji: "💡", label: "记住道理" },
    { emoji: "🌈", label: "继续努力" }
  ], "宜勉力", "温柔提醒，天天进步")
};

function renderAnimation(animationKey, container, bgColor) {
  if (!animationScenes[animationKey]) {
    container.innerHTML = wrapBabyStage(`<div class="baby-empty-book">📖</div>`, bgColor, animationKey);
    return;
  }
  container.style.background = `linear-gradient(135deg, ${bgColor}33 0%, ${adjustColor(bgColor, -10)}22 100%)`;
  container.innerHTML = wrapBabyStage(animationScenes[animationKey](), bgColor, animationKey);
}

function wrapBabyStage(sceneHtml, bgColor, animationKey) {
  const accent = adjustColor(bgColor, -22);
  return `
    <div class="baby-stage" style="--baby-bg:${bgColor};--baby-accent:${accent};">
      <div class="baby-stage-sky"></div>
      <div class="baby-stage-rainbow"></div>
      <div class="baby-stage-bubble baby-stage-bubble-1"></div>
      <div class="baby-stage-bubble baby-stage-bubble-2"></div>
      <div class="baby-stage-bubble baby-stage-bubble-3"></div>
      <div class="baby-stage-confetti">${createStageConfetti(animationKey)}</div>
      <div class="baby-stage-content">${sceneHtml}</div>
    </div>
    ${babyAnimationStyles()}
  `;
}

function createStageConfetti(seed) {
  const motifs = ["✨", "🌟", "💫", "🫧", "💛", "🌸"];
  const offset = seed.length % motifs.length;
  return motifs.map((_, idx) => {
    const symbol = motifs[(idx + offset) % motifs.length];
    return `<span class="baby-confetti baby-confetti-${idx}">${symbol}</span>`;
  }).join("");
}

function babyAnimationStyles() {
  return `
    <style>
      .baby-stage,
      .baby-stage * {
        box-sizing: border-box;
      }
      .baby-stage {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 100%;
        overflow: hidden;
        border-radius: 20px;
        background:
          radial-gradient(circle at 20% 18%, rgba(255,255,255,0.85), transparent 22%),
          radial-gradient(circle at 84% 22%, rgba(255,255,255,0.65), transparent 20%),
          linear-gradient(160deg, color-mix(in srgb, var(--baby-bg) 42%, #fff 58%), #fffdf7 58%, color-mix(in srgb, var(--baby-bg) 24%, #fff 76%));
      }
      .baby-stage-sky {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 8%, rgba(255,255,255,0.8), transparent 18%),
          radial-gradient(circle at 35% 100%, rgba(255,238,188,0.45), transparent 30%);
        animation: baby-sky-breathe 6s ease-in-out infinite;
        pointer-events: none;
      }
      .baby-stage-rainbow {
        position: absolute;
        left: 50%;
        bottom: -26%;
        width: 92%;
        aspect-ratio: 2 / 1;
        border-radius: 999px 999px 0 0;
        transform: translateX(-50%);
        background: linear-gradient(90deg, rgba(255,128,171,0.22), rgba(255,213,79,0.2), rgba(129,212,250,0.2), rgba(179,157,219,0.2));
        filter: blur(1px);
        opacity: 0.85;
        pointer-events: none;
      }
      .baby-stage-bubble {
        position: absolute;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.75);
        background: rgba(255,255,255,0.22);
        box-shadow: inset 0 0 18px rgba(255,255,255,0.55);
        animation: baby-bubble-float 7s ease-in-out infinite;
        pointer-events: none;
      }
      .baby-stage-bubble-1 { width: 54px; height: 54px; left: 7%; bottom: 14%; }
      .baby-stage-bubble-2 { width: 36px; height: 36px; right: 12%; top: 16%; animation-delay: 1.3s; }
      .baby-stage-bubble-3 { width: 24px; height: 24px; left: 18%; top: 22%; animation-delay: 2.4s; }
      .baby-stage-content {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
      }
      .baby-stage-confetti {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }
      .baby-confetti,
      .baby-floaty {
        position: absolute;
        display: inline-block;
        font-size: 1.6rem;
        filter: drop-shadow(0 4px 8px rgba(255,183,77,0.22));
        animation: baby-float 5.5s ease-in-out infinite;
      }
      .baby-confetti-0 { top: 10%; left: 12%; animation-delay: 0s; }
      .baby-confetti-1 { top: 14%; right: 14%; animation-delay: .7s; }
      .baby-confetti-2 { bottom: 20%; left: 8%; animation-delay: 1.4s; }
      .baby-confetti-3 { bottom: 15%; right: 10%; animation-delay: 2.1s; }
      .baby-confetti-4 { top: 48%; left: 4%; animation-delay: 2.8s; }
      .baby-confetti-5 { top: 52%; right: 5%; animation-delay: 3.5s; }
      .baby-template {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 28px;
      }
      .baby-simple {
        flex-direction: column;
        gap: 16px;
      }
      .baby-soft-hill {
        position: absolute;
        left: -8%;
        right: -8%;
        bottom: -18%;
        height: 36%;
        border-radius: 50% 50% 0 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.58), color-mix(in srgb, var(--baby-bg) 35%, #fff 65%));
        pointer-events: none;
      }
      .baby-character {
        position: relative;
        z-index: 2;
        display: grid;
        place-items: center;
        animation: baby-character-bob 3.2s ease-in-out infinite;
      }
      .baby-emoji {
        position: relative;
        z-index: 2;
        font-size: clamp(4.8rem, 13vw, 8.2rem);
        line-height: 1;
        filter: drop-shadow(0 15px 28px rgba(96,64,32,0.16));
        animation: baby-emoji-wiggle 3.6s ease-in-out infinite;
        transform-origin: 50% 86%;
      }
      .baby-face-glow {
        position: absolute;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,247,181,0.78), rgba(255,247,181,0));
        animation: baby-glow 3s ease-in-out infinite;
      }
      .baby-sparkle-ring {
        position: absolute;
        top: -8px;
        right: -18px;
        z-index: 3;
        font-size: 2rem;
        animation: baby-sparkle-pop 1.8s ease-in-out infinite;
      }
      .baby-label-card,
      .baby-story-label {
        position: relative;
        z-index: 3;
        max-width: min(84%, 440px);
        border: 2px solid rgba(255,255,255,0.85);
        border-radius: 22px;
        background: rgba(255,255,255,0.9);
        box-shadow: 0 12px 28px rgba(96,64,32,0.12);
        text-align: center;
      }
      .baby-label-card {
        padding: 11px 22px 12px;
      }
      .baby-label-main {
        color: #e91e63;
        font-size: 1.08rem;
        font-weight: 900;
        letter-spacing: 1px;
      }
      .baby-label-desc {
        margin-top: 4px;
        color: #666;
        font-size: .92rem;
        font-weight: 700;
      }
      .baby-dual {
        gap: clamp(10px, 4vw, 30px);
      }
      .baby-dual-card {
        position: relative;
        z-index: 3;
        min-width: 132px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 16px 14px;
        border: 2px solid rgba(255,255,255,0.78);
        border-radius: 24px;
        background: rgba(255,255,255,0.68);
        box-shadow: 0 14px 28px rgba(96,64,32,0.1);
        animation: baby-card-sway 3.7s ease-in-out infinite;
      }
      .baby-dual-right {
        animation-delay: .6s;
      }
      .baby-emoji-side {
        font-size: clamp(3.5rem, 10vw, 6.4rem);
      }
      .baby-mini-label,
      .baby-grid-label {
        max-width: 10em;
        color: #2e7d32;
        font-weight: 900;
        font-size: .98rem;
        text-align: center;
        line-height: 1.25;
      }
      .baby-mini-label.warm {
        color: #c62828;
      }
      .baby-arrow-bubble {
        position: relative;
        z-index: 3;
        min-width: 58px;
        min-height: 58px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(255,255,255,0.86);
        color: #ff8f00;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 900;
        box-shadow: 0 10px 22px rgba(255,143,0,0.18);
        animation: baby-pulse 2.2s ease-in-out infinite;
      }
      .baby-multi {
        flex-direction: column;
        gap: 18px;
      }
      .baby-story-label {
        padding: 9px 22px;
        color: var(--baby-accent);
        font-size: 1.08rem;
        font-weight: 900;
        letter-spacing: 1px;
      }
      .baby-grid {
        position: relative;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        max-width: 94%;
      }
      .baby-multi-item {
        width: 92px;
        min-height: 106px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 8px;
        border-radius: 22px;
        background: rgba(255,255,255,0.72);
        box-shadow: 0 10px 22px rgba(96,64,32,0.09);
        animation: baby-card-hop 3.4s ease-in-out infinite;
      }
      .baby-emoji-grid {
        font-size: clamp(2.4rem, 7vw, 4rem);
      }
      .baby-empty-book {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        font-size: 8rem;
        animation: baby-character-bob 3s ease-in-out infinite;
      }
      @keyframes baby-sky-breathe {
        0%,100% { opacity: .75; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.04); }
      }
      @keyframes baby-bubble-float {
        0%,100% { transform: translateY(0) scale(1); opacity: .62; }
        50% { transform: translateY(-18px) scale(1.08); opacity: .92; }
      }
      @keyframes baby-float {
        0%,100% { transform: translateY(0) rotate(-6deg) scale(.95); opacity: .58; }
        50% { transform: translateY(-18px) rotate(7deg) scale(1.12); opacity: .98; }
      }
      @keyframes baby-character-bob {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-13px); }
      }
      @keyframes baby-emoji-wiggle {
        0%,100% { transform: rotate(-2deg) scale(1); }
        50% { transform: rotate(2deg) scale(1.04); }
      }
      @keyframes baby-glow {
        0%,100% { transform: scale(.92); opacity: .55; }
        50% { transform: scale(1.14); opacity: .95; }
      }
      @keyframes baby-sparkle-pop {
        0%,100% { transform: scale(.75) rotate(-8deg); opacity: .5; }
        50% { transform: scale(1.25) rotate(12deg); opacity: 1; }
      }
      @keyframes baby-card-sway {
        0%,100% { transform: translateY(0) rotate(-1deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      @keyframes baby-card-hop {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-9px); }
      }
      @keyframes baby-pulse {
        0%,100% { transform: scale(1); }
        50% { transform: scale(1.12); }
      }
      @media (max-width: 700px) {
        .baby-template { padding: 18px; }
        .baby-dual { flex-wrap: wrap; }
        .baby-dual-card { min-width: 118px; padding: 12px 10px; }
        .baby-arrow-bubble { min-width: 48px; min-height: 48px; }
        .baby-multi-item { width: 78px; min-height: 90px; }
        .baby-label-main, .baby-story-label { font-size: .98rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .baby-stage *,
        .baby-stage *::before,
        .baby-stage *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  `;
}

function adjustColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
