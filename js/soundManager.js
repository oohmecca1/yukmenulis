// ===========================
// SOUND MANAGER
// Manages sound effects and audio
// ===========================

import state from "./stateManager.js";

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.bgmAudio = null;
    this.init();
  }

  // Initialize audio context
  init() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  // Play success sound
  playSuccess() {
    if (!state.get("soundEnabled")) return;
    this.playTone(523.25, 0.1, "sine"); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "sine"), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2, "sine"), 200); // G5
  }

  // Play click sound
  playClick() {
    if (!state.get("soundEnabled")) return;
    this.playTone(800, 0.05, "square");
  }

  // Play error sound
  playError() {
    if (!state.get("soundEnabled")) return;
    this.playTone(200, 0.1, "sawtooth");
    setTimeout(() => this.playTone(150, 0.15, "sawtooth"), 100);
  }

  // Play draw sound (subtle)
  playDraw() {
    if (!state.get("soundEnabled")) return;
    this.playTone(400, 0.02, "sine");
  }

  // Play complete sound
  playComplete() {
    if (!state.get("soundEnabled")) return;
    this.playTone(523.25, 0.1, "sine"); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "sine"), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.1, "sine"), 200); // G5
    setTimeout(() => this.playTone(1046.5, 0.3, "sine"), 300); // C6
  }

  // Generic tone player using Web Audio API
  playTone(frequency, duration, type = "sine") {
    if (!this.audioContext) return;

    const volume = state.get("volume") / 100;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Toggle sound on/off
  toggleSound(enabled) {
    state.set("soundEnabled", enabled);
  }

  // Set volume (0-100)
  setVolume(volume) {
    state.set("volume", Math.max(0, Math.min(100, volume)));
    // Update BGM volume if playing
    if (this.bgmAudio) {
      this.bgmAudio.volume = state.get("volume") / 100;
    }
  }

  // Play background music (looped)
  playBGM() {
    if (!state.get("soundEnabled") || !state.get("bgmEnabled")) return;

    try {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio("bgm.mp3");
        this.bgmAudio.loop = true;
        this.bgmAudio.crossOrigin = "anonymous";
        this.bgmAudio.preload = "auto";
        this.bgmAudio.volume = state.get("volume") / 100;
      }

      const playPromise = this.bgmAudio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch((err) => {
          // Autoplay may be blocked; resume audioContext on user gesture handled elsewhere
          console.warn("BGM play blocked:", err);
        });
      }
    } catch (e) {
      console.warn("Failed to play BGM:", e);
    }
  }

  // Return whether BGM is currently playing
  isBgmPlaying() {
    return !!(this.bgmAudio && !this.bgmAudio.paused && this.bgmAudio.currentTime > 0);
  }

  // Stop background music
  stopBGM() {
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
  }

  // Resume audio context (needed for some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
}

// Export singleton instance
export default new SoundManager();
