// @ts-nocheck

function initBookPage() {
  const book = document.getElementById("openBook");
  const board = document.querySelector(".cover-board");
  const burstColors = ["#e8647b", "#2d8c87", "#f4bd4f", "#5775b9", "#f18d72", "#fffdf7"];

  let opened = false;

  function burstLove() {
    if (!board) return;

    for (let i = 0; i < 34; i += 1) {
      const heart = document.createElement("span");
      heart.className = "love-pop";
      heart.setAttribute("aria-hidden", "true");

      const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.35;
      const distance = 110 + Math.random() * 180;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 80 - Math.random() * 80;

      heart.style.setProperty("--x", `${x.toFixed(1)}px`);
      heart.style.setProperty("--y", `${y.toFixed(1)}px`);
      heart.style.setProperty("--r", `${(-38 + Math.random() * 76).toFixed(1)}deg`);
      heart.style.setProperty("--s", `${(0.7 + Math.random() * 0.76).toFixed(2)}`);
      heart.style.setProperty("--d", `${(Math.random() * 0.22).toFixed(2)}s`);

      board.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }

    for (let i = 0; i < 42; i += 1) {
      const paper = document.createElement("span");
      paper.className = i % 5 === 0 ? "spark-pop" : "paper-pop";
      paper.setAttribute("aria-hidden", "true");

      const angle = (Math.PI * 2 * i) / 42 + Math.random() * 0.45;
      const distance = 90 + Math.random() * 260;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 70 - Math.random() * 80;
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];

      paper.style.setProperty("--x", `${x.toFixed(1)}px`);
      paper.style.setProperty("--y", `${y.toFixed(1)}px`);
      paper.style.setProperty("--r", `${(-180 + Math.random() * 360).toFixed(1)}deg`);
      paper.style.setProperty("--d", `${(Math.random() * 0.22).toFixed(2)}s`);
      paper.style.setProperty("--c", color);
      paper.style.setProperty("--w", `${(8 + Math.random() * 16).toFixed(1)}px`);
      paper.style.setProperty("--h", `${(7 + Math.random() * 13).toFixed(1)}px`);

      board.appendChild(paper);
      paper.addEventListener("animationend", () => paper.remove(), { once: true });
    }
  }

  function bindBookTilt() {
    if (!(book instanceof HTMLElement)) return;

    book.addEventListener("pointermove", (event) => {
      if (opened) return;
      const rect = book.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      book.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      book.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    });

    book.addEventListener("pointerleave", () => {
      book.style.setProperty("--ry", "0deg");
      book.style.setProperty("--rx", "0deg");
    });

    book.addEventListener("pointerdown", () => {
      if (!opened) book.style.setProperty("--lift", "-2px");
    });

    book.addEventListener("pointerup", () => {
      if (!opened) book.style.setProperty("--lift", "-8px");
    });
  }

  async function openBook() {
    if (opened) return;
    opened = true;
    book?.classList.add("is-open");
    burstLove();
    window.BDay?.showToast?.("Masuk ke halaman scrapbook.", 1100);
    await new Promise((resolve) => setTimeout(resolve, 620));
    document.body.classList.add("book-zooming");
    book?.classList.add("is-zooming");
    await new Promise((resolve) => setTimeout(resolve, 920));
    window.BDay?.fadeTo("/about", "zoom");
  }

  book?.addEventListener("click", openBook);
  bindBookTilt();

  setTimeout(() => {
    if (!opened) window.BDay?.showToast?.("Buku scrapbook-nya sudah nunggu kamu.", 1400);
  }, 3600);
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initBookPage, { once: true });
} else {
  initBookPage();
}

export {};
