// @ts-check

const configEl = document.getElementById("birthday-config");

try {
  window.BDAY_CONFIG = JSON.parse(configEl?.textContent || "{}");
} catch {
  window.BDAY_CONFIG = {};
}

const overlay = document.createElement("div");
overlay.className = "page-turn-overlay";
overlay.innerHTML = `
  <span class="turn-sheet turn-sheet-a"></span>
  <span class="turn-sheet turn-sheet-b"></span>
  <span class="turn-shadow"></span>
`;
document.documentElement.appendChild(overlay);

const toast = document.createElement("div");
toast.className = "toast";
document.documentElement.appendChild(toast);

let prepareMusicForNavigation = async () => {};

function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let isNavigating = false;
let softNavigationId = 0;

async function swapPageContent(url = "") {
  const response = await fetch(url, { headers: { "X-Soft-Navigation": "1" } });
  if (!response.ok) throw new Error(`Navigation failed: ${response.status}`);

  const html = await response.text();
  const nextDoc = new DOMParser().parseFromString(html, "text/html");
  const nextMain = nextDoc.querySelector("main");
  const currentMain = document.querySelector("main");
  const nextConfig = nextDoc.getElementById("birthday-config");
  const currentConfig = document.getElementById("birthday-config");

  if (!nextMain || !currentMain) throw new Error("Missing page content");

  document.title = nextDoc.title || document.title;
  document.body.className = nextDoc.body.className;
  document.body.dataset.page = nextDoc.body.dataset.page || "";
  currentMain.replaceWith(nextMain);

  if (nextConfig && currentConfig) {
    currentConfig.textContent = nextConfig.textContent;
    try {
      window.BDAY_CONFIG = JSON.parse(nextConfig.textContent || "{}");
    } catch {
      window.BDAY_CONFIG = {};
    }
  }

  const pageScript = Array.from(nextDoc.querySelectorAll("script[type='module']"))
    .map((script) => script.getAttribute("src") || "")
    .find((src) => src.includes("/ts/") && !src.includes("/ts/app.ts"));

  if (pageScript) {
    softNavigationId += 1;
    const script = document.createElement("script");
    script.type = "module";
    script.src = `${pageScript}${pageScript.includes("?") ? "&" : "?"}nav=${softNavigationId}`;
    document.body.appendChild(script);
    script.addEventListener("load", () => script.remove(), { once: true });
  }

  window.history.pushState({}, "", url);
  initPageEntry();
}

async function fadeTo(url = "", direction = "next") {
  if (isNavigating || !url) return;
  isNavigating = true;
  const normalizedDirection = direction === "prev" ? "prev" : direction === "zoom" ? "zoom" : "next";
  sessionStorage.setItem("paper_direction", normalizedDirection === "zoom" ? "next" : normalizedDirection);
  await prepareMusicForNavigation();
  overlay.classList.remove("turn-next", "turn-prev", "turn-zoom", "show");
  overlay.classList.add("show", `turn-${normalizedDirection}`);
  await wait(normalizedDirection === "zoom" ? 440 : 680);
  try {
    await swapPageContent(url);
    overlay.classList.remove("show");
    window.setTimeout(() => overlay.classList.remove("turn-next", "turn-prev", "turn-zoom"), 180);
    isNavigating = false;
  } catch {
    window.location.href = url;
  }
}

let toastTimer = 0;

function showToast(text = "", ms = 1400) {
  toast.textContent = text;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), ms);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function initPageEntry() {
  const direction = sessionStorage.getItem("paper_direction");
  sessionStorage.removeItem("paper_direction");

  if (direction !== "next" && direction !== "prev") return;
  document.body.classList.add(`page-enter-${direction}`);
  window.setTimeout(() => {
    document.body.classList.remove(`page-enter-${direction}`);
  }, 720);
}

function currentRoute() {
  const route = window.location.pathname.replace(/\/$/, "") || "/";
  if (route === "/index.html") return "/";
  if (route === "/main.html") return "/story";
  if (route === "/gift.html") return "/gift";
  if (route === "/result.html") return "/result";
  if (route === "/love.html") return "/love";
  return route;
}

function isTypingTarget(target = document.body) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return target.isContentEditable || tag === "input" || tag === "textarea" || tag === "select";
}

function navigateWithArrow(delta = 1) {
  if (isNavigating) return;

  const routeOrder = ["/", "/about", "/story", "/gift", "/result", "/love"];
  const route = currentRoute();
  const index = routeOrder.indexOf(route);
  if (index === -1) return;

  if (delta > 0) {
    const primaryAction = {
      "/": "openBook",
      "/about": "aboutNextBtn",
      "/story": "nextBtn",
      "/gift": "continueBtn",
      "/result": "resultNextBtn",
    }[route];

    if (primaryAction) {
      const button = document.getElementById(primaryAction);
      if (button instanceof HTMLButtonElement) {
        button.click();
        return;
      }
    }
  }

  const targetIndex = index + delta;
  if (targetIndex < 0 || targetIndex >= routeOrder.length) {
    showToast(delta > 0 ? "Ini sudah halaman terakhir." : "Ini sudah halaman pembuka.", 1100);
    return;
  }

  fadeTo(routeOrder[targetIndex], delta > 0 ? "next" : "prev");
}

function bindKeyboardPaging() {
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (isTypingTarget(event.target instanceof HTMLElement ? event.target : document.body)) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateWithArrow(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateWithArrow(-1);
    }
  });
}

function initAmbientPaper() {
  if (prefersReducedMotion()) return;

  const canvas = document.createElement("canvas");
  canvas.className = "fx-canvas";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const context = ctx;

  document.body.appendChild(canvas);

  let width = 0;
  let height = 0;
  const ratio = Math.min(2, window.devicePixelRatio || 1);

  function resize() {
    width = canvas.width = Math.floor(window.innerWidth * ratio);
    height = canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  resize();
  window.addEventListener("resize", resize);

  const colors = ["#e8647b", "#2d8c87", "#f4bd4f", "#5775b9", "#f18d72"];
  const scraps = Array.from({ length: 28 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 8 + Math.random() * 16,
    speed: 0.22 + Math.random() * 0.46,
    drift: -0.26 + Math.random() * 0.52,
    turn: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  let last = performance.now();

  function tick(now = 0) {
    const dt = Math.min(32, now - last);
    last = now;
    context.clearRect(0, 0, width, height);

    for (const scrap of scraps) {
      scrap.y += scrap.speed * dt * ratio * 0.1;
      scrap.x += scrap.drift * dt * ratio * 0.08;
      scrap.turn += dt * 0.001;

      if (scrap.y > height + 40) {
        scrap.y = -40;
        scrap.x = Math.random() * width;
      }

      context.save();
      context.translate(scrap.x, scrap.y);
      context.rotate(scrap.turn);
      context.globalAlpha = 0.18;
      context.fillStyle = scrap.color;
      context.fillRect(-scrap.size / 2, -scrap.size / 3, scrap.size, scrap.size * 0.62);
      context.restore();
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function ensureMusicUI() {
  const audio = document.getElementById("bgm");
  if (!(audio instanceof HTMLAudioElement) || !audio.getAttribute("src")) return;
  const bgm = audio;
  const enabledKey = "bd_bgm_on";
  const timeKey = "bd_bgm_time";
  const navKey = "bd_bgm_was_playing";
  const tuckedKey = "bd_music_tucked";
  const targetVolume = 0.2;
  const firstStartAt = 8.5;
  let fadeFrame = 0;
  let startedByGesture = false;

  const wrap = document.createElement("div");
  wrap.className = "muter";
  if (localStorage.getItem(tuckedKey) === "1") wrap.classList.add("is-tucked");
  wrap.hidden = true;
  wrap.innerHTML = `
    <button class="music-tab" id="musicPanelToggle" type="button" aria-label="Sembunyikan kontrol musik" title="Sembunyikan kontrol musik">
      <span aria-hidden="true">M</span>
    </button>
    <button class="chip music-chip" id="musicToggle" type="button" aria-pressed="false" title="Toggle music">
      <span class="music-dot" aria-hidden="true"></span>
      <span class="music-text">Musik siap</span>
    </button>
  `;
  document.body.appendChild(wrap);

  const btn = document.getElementById("musicToggle");
  if (!(btn instanceof HTMLButtonElement)) return;
  const button = btn;
  const panelToggle = document.getElementById("musicPanelToggle");

  let mediaReady = false;

  function revealMusicUI() {
    if (mediaReady) return;
    mediaReady = true;
    wrap.hidden = false;
  }

  bgm.addEventListener("loadedmetadata", revealMusicUI, { once: true });
  bgm.addEventListener("canplay", revealMusicUI, { once: true });
  bgm.addEventListener("error", () => wrap.remove(), { once: true });
  setTimeout(() => {
    if (bgm.readyState >= 1) revealMusicUI();
  }, 500);

  function saveTime() {
    if (!Number.isFinite(bgm.currentTime) || bgm.currentTime <= 0) return;
    sessionStorage.setItem(timeKey, String(bgm.currentTime));
  }

  function savedTime() {
    const value = Number(sessionStorage.getItem(timeKey));
    return Number.isFinite(value) && value > 0 ? value : firstStartAt;
  }

  function restoreSavedTime() {
    const nextTime = savedTime();
    if (!Number.isFinite(nextTime) || nextTime <= 0) return;
    try {
      bgm.currentTime = nextTime;
    } catch {
      bgm.addEventListener(
        "loadedmetadata",
        () => {
          try {
            bgm.currentTime = nextTime;
          } catch {
            // Some browsers reject early seeks until metadata is ready.
          }
        },
        { once: true },
      );
    }
  }

  function setUI(on = false, label = "") {
    button.setAttribute("aria-pressed", String(on));
    const text = button.querySelector(".music-text");
    if (text) text.textContent = label || (on ? "Musik menyala" : "Musik mati");
  }

  function fadeVolume(to = targetVolume, duration = 700) {
    window.cancelAnimationFrame(fadeFrame);
    const from = bgm.volume;
    const startedAt = performance.now();

    return new Promise((resolve) => {
      function step(now = 0) {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        bgm.volume = from + (to - from) * eased;

        if (progress >= 1) {
          bgm.volume = to;
          resolve(undefined);
          return;
        }

        fadeFrame = window.requestAnimationFrame(step);
      }

      fadeFrame = window.requestAnimationFrame(step);
    });
  }

  async function tryPlay({ fade = true } = {}) {
    try {
      restoreSavedTime();

      bgm.volume = fade ? 0 : targetVolume;
      await bgm.play();
      if (fade) await fadeVolume(targetVolume, 900);
      return true;
    } catch {
      return false;
    }
  }

  async function startMusicFromGesture() {
    if (startedByGesture || localStorage.getItem(enabledKey) === "0") return;
    startedByGesture = true;
    const ok = await tryPlay({ fade: true });
    localStorage.setItem(enabledKey, ok ? "1" : "0");
    setUI(ok, ok ? "Musik menyala" : "Tap musik");
  }

  async function restoreMusic() {
    bgm.loop = true;
    bgm.volume = 0;
    const pref = localStorage.getItem(enabledKey);
    const wasPlayingBeforeNavigation = sessionStorage.getItem(navKey) === "1";
    sessionStorage.removeItem(navKey);
    const shouldPlay = pref === "1" || wasPlayingBeforeNavigation;

    if (!shouldPlay) {
      setUI(false, pref === "0" ? "Musik mati" : "Tap untuk musik");
      return;
    }

    const ok = await tryPlay({ fade: !wasPlayingBeforeNavigation });
    if (ok) localStorage.setItem(enabledKey, "1");
    setUI(ok, ok ? "Musik menyala" : "Tap untuk musik");
    if (!ok) {
      window.addEventListener("pointerdown", startMusicFromGesture, { once: true });
      window.addEventListener("keydown", startMusicFromGesture, { once: true });
    }
  }

  restoreMusic();

  button.addEventListener("click", async () => {
    const on = localStorage.getItem(enabledKey) === "1" && !bgm.paused;
    if (on) {
      await fadeVolume(0, 420);
      saveTime();
      bgm.pause();
      localStorage.setItem(enabledKey, "0");
      setUI(false, "Musik mati");
      return;
    }

    const ok = await tryPlay({ fade: true });
    localStorage.setItem(enabledKey, ok ? "1" : "0");
    setUI(ok, ok ? "Musik menyala" : "Tap lagi");
  });

  panelToggle?.addEventListener("click", () => {
    const tucked = !wrap.classList.contains("is-tucked");
    wrap.classList.toggle("is-tucked", tucked);
    localStorage.setItem(tuckedKey, tucked ? "1" : "0");
    panelToggle.setAttribute("aria-label", tucked ? "Tampilkan kontrol musik" : "Sembunyikan kontrol musik");
    panelToggle.setAttribute("title", tucked ? "Tampilkan kontrol musik" : "Sembunyikan kontrol musik");
  });

  window.addEventListener("pointerdown", startMusicFromGesture, { once: true });
  window.addEventListener("keydown", startMusicFromGesture, { once: true });
  window.addEventListener("pagehide", saveTime);
  bgm.addEventListener("timeupdate", () => {
    if (Math.floor(bgm.currentTime) % 4 === 0) saveTime();
  });

  prepareMusicForNavigation = async () => {
    const isPlaying = !bgm.paused && !bgm.ended;
    saveTime();
    sessionStorage.setItem(navKey, isPlaying ? "1" : "0");
    if (isPlaying) {
      localStorage.setItem(enabledKey, "1");
      bgm.volume = Math.min(bgm.volume, targetVolume);
    }
  };
}

window.BDay = {
  fadeTo,
  showToast,
};

window.addEventListener("DOMContentLoaded", () => {
  initPageEntry();
  initAmbientPaper();
  ensureMusicUI();
  bindKeyboardPaging();
});

export {};
