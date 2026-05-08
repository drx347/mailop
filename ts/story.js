// @ts-nocheck

function initStoryPage() {
  const config = window.BDAY_CONFIG || {};
  const messages = Array.isArray(config.mainMessages) ? config.mainMessages : [];
  const messageEl = document.getElementById("message");
  const nextBtn = document.getElementById("nextBtn");
  const skipBtn = document.getElementById("skipBtn");
  const progress = document.getElementById("storyProgress");

  if (!messageEl || !(nextBtn instanceof HTMLButtonElement)) {
    return;
  }
  const messageBox = messageEl;
  const nextButton = nextBtn;
  const skipButton = skipBtn instanceof HTMLButtonElement ? skipBtn : null;

  let index = 0;
  let typing = false;
  let cancelToken = 0;

  function renderProgress() {
    if (!progress) return;
    progress.innerHTML = "";

    for (let i = 0; i < Math.max(messages.length, 1); i += 1) {
      const dot = document.createElement("span");
      if (i === index) dot.className = "active";
      progress.appendChild(dot);
    }
  }

  function setButtons() {
    nextButton.textContent = index >= messages.length - 1 ? "Buka hadiah" : "Lanjut";
    renderProgress();
  }

  async function typeMessage(text = "") {
    typing = true;
    cancelToken += 1;
    const token = cancelToken;
    messageBox.classList.add("swap");
    await new Promise((resolve) => setTimeout(resolve, 160));
    messageBox.innerHTML = "";

    const span = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    messageBox.append(span, cursor);
    messageBox.classList.remove("swap");

    for (let i = 0; i < text.length; i += 1) {
      if (token !== cancelToken) return;
      span.textContent = text.slice(0, i + 1);
      await new Promise((resolve) => setTimeout(resolve, 22));
    }

    cursor.remove();
    typing = false;
  }

  async function showCurrent() {
    const text = messages[index] || "...";
    setButtons();
    await typeMessage(text);
  }

  nextButton.addEventListener("click", async () => {
    if (typing) {
      cancelToken += 1;
      messageBox.textContent = messages[index] || "";
      typing = false;
      return;
    }

    if (index >= messages.length - 1) {
      window.BDay?.fadeTo("/gift", "next");
      return;
    }

    index += 1;
    await showCurrent();
  });

  skipButton?.addEventListener("click", () => window.BDay?.fadeTo("/gift", "next"));
  showCurrent();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initStoryPage, { once: true });
} else {
  initStoryPage();
}

export {};
