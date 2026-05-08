// @ts-check

function initResultPage() {
  const nextBtn = document.getElementById("resultNextBtn");

  nextBtn?.addEventListener("click", () => {
    window.BDay?.fadeTo("/love", "next");
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initResultPage, { once: true });
} else {
  initResultPage();
}

export {};
