// ===========================
// ACTIVITY: BOLD LETTERS
// Practice tracing and bolding letters A-Z
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import { drawArrow } from "../helpers.js";

let currentLetter = "a";
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

export function init() {
  ui.updateActivityTitle("Menebalkan Huruf (huruf kecil)");
  ui.updateModeIndicator(`Huruf ${currentLetter}`);
  ui.updateInstructions("Tebalkan huruf kecil dengan mengikuti arah garis.");
  ui.clearActivityControls();

  // Add navigation buttons
  ui.addControlButton("◀ Sebelumnya", previousLetter);
  ui.addControlButton("Berikutnya ▶", nextLetter);
  ui.addControlButton("Cek Hasil", checkResult);

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Draw current letter (this will clear and draw)
  drawing.clear();
  drawLetter();
}

function previousLetter() {
  const currentIndex = alphabet.indexOf(currentLetter);
  if (currentIndex > 0) {
    currentLetter = alphabet[currentIndex - 1];
    ui.updateModeIndicator(`Huruf ${currentLetter}`);
    drawing.clear();
    drawLetter();
    sound.playClick();
  }
}

function nextLetter() {
  const currentIndex = alphabet.indexOf(currentLetter);
  if (currentIndex < alphabet.length - 1) {
    currentLetter = alphabet[currentIndex + 1];
    ui.updateModeIndicator(`Huruf ${currentLetter}`);
    drawing.clear();
    drawLetter();
    sound.playClick();
  }
}

function drawLetter() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  // Draw letter outline
  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw outline
  ctx.strokeText(currentLetter, size / 2, size / 2);

  // Draw inner guide
  ctx.strokeStyle = "rgba(108, 92, 231, 0.15)";
  ctx.lineWidth = 15;
  ctx.strokeText(currentLetter, size / 2, size / 2);

  // Directional hint: show a small arrow indicating typical start -> stroke direction
  // This is a general hint pointing from upper-left towards center
  const startX = size / 2 - size * 0.25;
  const startY = size / 2 - size * 0.35;
  const endX = size / 2 - size * 0.05;
  const endY = size / 2 - size * 0.1;
  drawArrow(ctx, startX, startY, endX, endY, Math.max(10, size * 0.04), "#6C5CE7");
  // Draw dotted direction hints along the same vector (small dots)
  const dotCount = 5;
  ctx.fillStyle = "#6C5CE7";
  const dotRadius = Math.max(2, Math.round(size * 0.01));
  for (let i = 1; i <= dotCount; i++) {
    const t = i / (dotCount + 1);
    const dx = startX + (endX - startX) * t;
    const dy = startY + (endY - startY) * t;
    ctx.beginPath();
    ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function checkResult() {
  sound.playComplete();
  ui.showSuccess(`Bagus! Huruf ${currentLetter} sudah tebal!`, 2000);

  // Auto move to next letter after success
  setTimeout(() => {
    const currentIndex = alphabet.indexOf(currentLetter);
    if (currentIndex < alphabet.length - 1) {
      nextLetter();
    }
  }, 2500);
}

export function cleanup() {
  // No special cleanup needed
}
