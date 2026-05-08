// @ts-nocheck

function initGiftPage() {
  const giftBox = document.getElementById("giftBox");
  const continueBtn = document.getElementById("continueBtn");
  const note = document.getElementById("giftBoxNote");

  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;

    giftBox?.classList.add("is-open");
    giftBox?.setAttribute("aria-expanded", "true");

    if (note) {
      note.textContent = "Tadaaa. Isinya sweater kecil buat kamu.";
    }

    if (continueBtn instanceof HTMLButtonElement) {
      continueBtn.hidden = false;
      continueBtn.disabled = false;
      continueBtn.textContent = "Lanjut";
    }

    window.BDay?.showToast?.("Kotaknya kebuka. Semoga kamu suka.", 1300);
  }

  giftBox?.addEventListener("click", openGift);
  giftBox?.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGift();
    }
  });

  continueBtn?.addEventListener("click", () => {
    if (!(continueBtn instanceof HTMLButtonElement)) return;

    if (continueBtn.disabled) {
      window.BDay?.showToast?.("Buka kotaknya dulu ya.", 1100);
      return;
    }

    window.BDay?.fadeTo("/result", "next");
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initGiftPage, { once: true });
} else {
  initGiftPage();
}

export {};
