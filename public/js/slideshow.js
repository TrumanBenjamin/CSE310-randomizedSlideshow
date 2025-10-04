(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots   = Array.from(document.querySelectorAll(".dot"));
  if (!slides.length) return;

  let idx = 0;
  let timer = null;
  const DURATION_MS = 3000;

  function show(n) {
    slides[idx].classList.remove("is-active");
    dots[idx]?.classList.remove("is-active");
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add("is-active");
    dots[idx]?.classList.add("is-active");
  }

  function next() { show(idx + 1); }

  function start() {
    stop();
    timer = setInterval(next, DURATION_MS);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); start(); }));

  // start after first image finishes loading (helps perceived timing)
  const first = slides[0];
  if (first.complete) start();
  else first.addEventListener("load", start, { once: true });

  // pause on hover (optional nicety)
  const box = document.getElementById("slideshow");
  box.addEventListener("mouseenter", stop);
  box.addEventListener("mouseleave", start);
})();