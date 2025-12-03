// ===========================
// ACTIVITY: FREE DRAW
// Free drawing activity
// ===========================
// ACTIVITY: FREE DRAW
// Free drawing activity
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";

export function init() {
  ui.updateActivityTitle("Coret-coret Bebas");
  ui.updateModeIndicator("");
  ui.updateInstructions(
    "Gambar sesukamu. Sentuh dan geser jari untuk menggambar."
  );
  ui.clearActivityControls();

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Clear and prepare canvas
  drawing.clear();
}

export function cleanup() {
  // No special cleanup needed
}
