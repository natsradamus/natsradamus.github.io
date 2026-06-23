/* natsradamus — shared behavior
   Custom cursor enhancement. The accent color is fixed in style.css
   (--accent) — one consistent brand color, not randomized per visit.
   Loaded by every page (root: "script.js", projects: "../script.js"). */
(function () {
  "use strict";

  /* ── Custom cursor: enhancement only ──
     Native cursor is the floor. We only take it over on a true fine pointer
     (mouse/trackpad) when the user hasn't asked to reduce motion. Touch,
     coarse pointers, reduced-motion, and no-JS all keep the system cursor. */
  var finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  var dot  = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("custom-cursor"); // CSS hides native cursor + reveals dots

  var mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* Animate the ring only while the tab is visible. A hidden tab throttles
     RAF but never fully stops it — gating on visibility keeps it off battery
     entirely, and we resume on return. */
  var rafId = null;
  function tick() {
    rx = lerp(rx, mx, 0.30);
    ry = lerp(ry, my, 0.30);
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    rafId = requestAnimationFrame(tick);
  }
  function startLoop() { if (rafId === null) rafId = requestAnimationFrame(tick); }
  function stopLoop()  { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopLoop(); else startLoop();
  });
  startLoop();

  document.querySelectorAll("a, button").forEach(function (el) {
    el.addEventListener("mouseenter", function () { ring.classList.add("hovering"); });
    el.addEventListener("mouseleave", function () { ring.classList.remove("hovering"); });
  });

  document.addEventListener("mousedown", function () {
    dot.classList.add("clicking"); ring.classList.add("clicking");
  });
  document.addEventListener("mouseup", function () {
    dot.classList.remove("clicking"); ring.classList.remove("clicking");
  });
  document.addEventListener("mouseleave", function () {
    dot.style.opacity = "0"; ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", function () {
    dot.style.opacity = "1"; ring.style.opacity = "";
  });
})();
