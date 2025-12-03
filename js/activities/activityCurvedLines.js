// ===========================
// ACTIVITY: CURVED LINES
// Practice drawing curved lines
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import { drawArrow } from "../helpers.js";

let currentMode = "wave";

const modes = {
  wave: { name: "Gelombang" },
  spiral: { name: "Spiral" },
  curve: { name: "Lengkung" },
  smooth: { name: "Halus" },
};

export function init() {
  ui.updateActivityTitle("Garis Melengkung");
  ui.updateModeIndicator(modes[currentMode].name);
  ui.updateInstructions("Ikuti garis. Tarik jari mengikuti titik titik sesuai arah panah.");
  ui.clearActivityControls();

  // Add mode selection buttons
  Object.keys(modes).forEach((modeKey) => {
    ui.addControlButton(
      modes[modeKey].name,
      () => selectMode(modeKey),
      modeKey === currentMode
    );
  });

  // Add check button
  ui.addControlButton("Cek Hasil", checkResult);

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Initialize with current mode (this will clear and draw guide curves)
  selectMode(currentMode);
}

function selectMode(modeKey) {
  currentMode = modeKey;
  ui.updateModeIndicator(modes[currentMode].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    if (index < Object.keys(modes).length) {
      btn.classList.toggle("active", Object.keys(modes)[index] === modeKey);
    }
  });

  // Reset and draw guide lines
  drawing.clear();
  drawGuideCurves();

  sound.playClick();
}

function drawGuideCurves() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  if (currentMode === "wave") {
    // Draw wave patterns
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);

      for (let x = 50; x < size - 50; x += 20) {
        const waveY = y + Math.sin((x - 50) / 30) * 30;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();
      // Show direction hint (left -> right)
      drawArrow(ctx, 60, y, 120, y, 12, "#6C5CE7");
    }
  } else if (currentMode === "spiral") {
    // Draw spiral
    const centerX = size / 2;
    const centerY = size / 2;
    ctx.beginPath();

    for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
      const radius = angle * 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    // Add directional arrows along the spiral to indicate outward drawing direction
    const spiralArrows = 3;
    for (let i = 0; i < spiralArrows; i++) {
      const a = (Math.PI * 6) * ((i + 1) / (spiralArrows + 1));
      const aNext = a + 0.25; // small step forward for arrow direction
      const r = a * 10;
      const rNext = aNext * 10;
      const x1 = centerX + Math.cos(a) * r;
      const y1 = centerY + Math.sin(a) * r;
      const x2 = centerX + Math.cos(aNext) * rNext;
      const y2 = centerY + Math.sin(aNext) * rNext;
      drawArrow(ctx, x1, y1, x2, y2, 10, "#6C5CE7");
    }
  } else if (currentMode === "curve") {
    // Draw S-curves
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.bezierCurveTo(size / 3, y - 50, (size * 2) / 3, y + 50, size - 50, y);
      ctx.stroke();
      // Add an arrow following the bezier direction
      const p0 = { x: 50, y };
      const p1 = { x: size / 3, y: y - 50 };
      const p2 = { x: (size * 2) / 3, y: y + 50 };
      const p3 = { x: size - 50, y };
      // compute point at t and t+dt for direction
      const t = 0.45;
      const dt = 0.06;
      function cubicAt(p0, p1, p2, p3, t) {
        const u = 1 - t;
        const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
        const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
        return { x, y };
      }
      const pt1 = cubicAt(p0, p1, p2, p3, t);
      const pt2 = cubicAt(p0, p1, p2, p3, t + dt);
      drawArrow(ctx, pt1.x, pt1.y, pt2.x, pt2.y, 10, "#6C5CE7");
    }
  } else if (currentMode === "smooth") {
    // Draw smooth curves
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.quadraticCurveTo(size / 2, y - 40, size - 50, y);
      ctx.stroke();
      // Add arrow following quadratic curve direction
      const q0 = { x: 50, y };
      const q1 = { x: size / 2, y: y - 40 };
      const q2 = { x: size - 50, y };
      function quadAt(p0, p1, p2, t) {
        const u = 1 - t;
        const x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
        const y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
        return { x, y };
      }
      const tq = 0.45;
      const dtq = 0.06;
      const qp1 = quadAt(q0, q1, q2, tq);
      const qp2 = quadAt(q0, q1, q2, tq + dtq);
      drawArrow(ctx, qp1.x, qp1.y, qp2.x, qp2.y, 10, "#6C5CE7");
    }
  }

  ctx.setLineDash([]);
}

function checkResult() {
  sound.playComplete();
  ui.showSuccess("Hebat! Garis lengkungmu sangat bagus!", 3000);
}

export function cleanup() {
  // No special cleanup needed
}
