/* ============================================================
   script.js — Shared site-wide scripts
   Perception Multimedia Inc.
   ============================================================ */

/* ── Video card keyboard accessibility ──
   Allows keyboard users to open video cards with Enter or Space.
   Applies to any .video-card with an onclick handler.
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.video-card').forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
});
