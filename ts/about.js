// @ts-nocheck

function initAboutPage() {
  const nextBtn = document.getElementById("aboutNextBtn");
  const portrait = document.querySelector(".about-portrait");

  nextBtn?.addEventListener("click", () => {
    window.BDay?.fadeTo("/story", "next");
  });

  if (portrait instanceof HTMLElement && !portrait.dataset.sparkled) {
    portrait.dataset.sparkled = "1";
    for (let i = 0; i < 16; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "about-sparkle";
      sparkle.setAttribute("aria-hidden", "true");
      sparkle.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      sparkle.style.setProperty("--y", `${8 + Math.random() * 82}%`);
      sparkle.style.setProperty("--d", `${(Math.random() * 1.8).toFixed(2)}s`);
      sparkle.style.setProperty("--s", `${(0.72 + Math.random() * 0.7).toFixed(2)}`);
      portrait.appendChild(sparkle);
    }
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initAboutPage, { once: true });
} else {
  initAboutPage();
}

export {};
