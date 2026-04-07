/**
 * JARVIS — Main entry point.
 *
 * Wires together the orb visualization, WebSocket communication,
 * speech recognition, and audio playback into a single experience.
 */

import { createOrb, type OrbState } from "./orb";
import { createVoiceInput, createAudioPlayer, type SttSource } from "./voice";
import { createSocket } from "./ws";
import { openSettings, checkFirstTimeSetup } from "./settings";
import "./style.css";

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

type State = "idle" | "listening" | "thinking" | "speaking";
let currentState: State = "idle";
let isMuted = false;

const statusEl = document.getElementById("status-text")!;
const errorEl = document.getElementById("error-text")!;
const sttSourceEl = document.getElementById("stt-source")!;
const chatLogEl = document.getElementById("chat-log")!;

let lastAssistantMsg = "";
let lastAssistantMsgAt = 0;

function addChatMessage(role: "user" | "assistant", text: string) {
  const content = text.trim();
  if (!content) return;

  if (role === "assistant") {
    const now = Date.now();
    // Avoid duplicate assistant lines when both audio and text events carry the same text.
    if (content === lastAssistantMsg && now - lastAssistantMsgAt < 1500) return;
    lastAssistantMsg = content;
    lastAssistantMsgAt = now;
  }

  const row = document.createElement("div");
  row.className = `chat-msg ${role === "user" ? "chat-msg-user" : "chat-msg-assistant"}`;
  row.textContent = content;
  chatLogEl.appendChild(row);
  while (chatLogEl.childElementCount > 60) {
    chatLogEl.removeChild(chatLogEl.firstElementChild!);
  }
  chatLogEl.scrollTop = chatLogEl.scrollHeight;
}

let speechUnlocked = false;
let pendingSpeechText: string | null = null;
let speechWarningShown = false;

function pickSpeechVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /^en(-|_)/i.test(v.lang) && /google|samantha|alex|english/i.test(v.name)) ||
    voices.find((v) => /^en(-|_)/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

function flushPendingSpeech() {
  if (!pendingSpeechText) return;
  const text = pendingSpeechText;
  pendingSpeechText = null;
  speakTextFallback(text);
}

function speakTextFallback(text: string) {
  if (isMuted || !text || !("speechSynthesis" in window)) return;
  if (!speechUnlocked) {
    pendingSpeechText = text;
    if (!speechWarningShown) {
      showError("Tap anywhere once to enable voice output.");
      speechWarningShown = true;
    }
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = pickSpeechVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis failures and keep text fallback.
  }
}

function unlockSpeechOutput() {
  if (!("speechSynthesis" in window)) return;
  speechUnlocked = true;
  speechWarningShown = false;
  // Prime voice list in browsers that load voices lazily.
  window.speechSynthesis.getVoices();
  flushPendingSpeech();
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    flushPendingSpeech();
  };
}

function updateSttSource(source: SttSource) {
  sttSourceEl.textContent = "stt: chrome";
  sttSourceEl.classList.remove("stt-backend");
}

function showError(msg: string) {
  errorEl.textContent = msg;
  errorEl.style.opacity = "1";
  setTimeout(() => {
    errorEl.style.opacity = "0";
  }, 5000);
}

function updateStatus(state: State) {
  const labels: Record<State, string> = {
    idle: "",
    listening: "listening...",
    thinking: "thinking...",
    speaking: "",
  };
  statusEl.textContent = labels[state];
}

// ---------------------------------------------------------------------------
// Init components
// ---------------------------------------------------------------------------

const canvas = document.getElementById("orb-canvas") as HTMLCanvasElement;
const orb = createOrb(canvas);

const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
const WS_URL = `${wsProto}//${window.location.host}/ws/voice`;
const socket = createSocket(WS_URL);

const audioPlayer = createAudioPlayer();
orb.setAnalyser(audioPlayer.getAnalyser());

function transition(newState: State) {
  if (newState === currentState) return;
  currentState = newState;
  orb.setState(newState as OrbState);
  updateStatus(newState);

  switch (newState) {
    case "idle":
      if (!isMuted) voiceInput.resume();
      break;
    case "listening":
      if (!isMuted) voiceInput.resume();
      break;
    case "thinking":
      voiceInput.pause();
      break;
    case "speaking":
      voiceInput.pause();
      break;
  }
}

// ---------------------------------------------------------------------------
// Voice input
// ---------------------------------------------------------------------------

const voiceInput = createVoiceInput(
  (text: string) => {
    // Cancel any current JARVIS response before sending new input
    audioPlayer.stop();
    addChatMessage("user", text);
    // User spoke — send transcript
    socket.send({ type: "transcript", text, isFinal: true });
    transition("thinking");
  },
  (msg: string) => {
    showError(msg);
  },
  (source: SttSource) => {
    updateSttSource(source);
  }
);

// ---------------------------------------------------------------------------
// Audio playback finished
// ---------------------------------------------------------------------------

audioPlayer.onFinished(() => {
  transition("idle");
});

// ---------------------------------------------------------------------------
// WebSocket messages
// ---------------------------------------------------------------------------

socket.onMessage((msg) => {
  const type = msg.type as string;

  if (type === "audio") {
    const audioData = msg.data as string;
    console.log("[audio] received", audioData ? `${audioData.length} chars` : "EMPTY", "state:", currentState);
    if (audioData) {
      if (currentState !== "speaking") {
        transition("speaking");
      }
      audioPlayer.enqueue(audioData);
    } else {
      // TTS failed — no audio but still need to return to idle
      console.warn("[audio] no data received, returning to idle");
      transition("idle");
    }
    // Log text for debugging
    if (msg.text) {
      console.log("[JARVIS]", msg.text);
      if (typeof msg.text === "string") addChatMessage("assistant", msg.text);
    }
  } else if (type === "status") {
    const state = msg.state as string;
    if (state === "thinking" && currentState !== "thinking") {
      transition("thinking");
    } else if (state === "working") {
      // Task spawned — show thinking with a different label
      transition("thinking");
      statusEl.textContent = "working...";
    } else if (state === "idle") {
      transition("idle");
    }
  } else if (type === "text") {
    // Text fallback when TTS fails
    console.log("[JARVIS]", msg.text);
    if (typeof msg.text === "string") {
      addChatMessage("assistant", msg.text);
      speakTextFallback(msg.text);
    }
  } else if (type === "task_spawned") {
    console.log("[task]", "spawned:", msg.task_id, msg.prompt);
  } else if (type === "task_complete") {
    console.log("[task]", "complete:", msg.task_id, msg.status, msg.summary);
  }
});

// ---------------------------------------------------------------------------
// Kick off
// ---------------------------------------------------------------------------

// Start listening after a brief delay for the orb to render
setTimeout(() => {
  voiceInput.start();
  transition("listening");
}, 1000);

// Resume AudioContext on ANY user interaction (browser autoplay policy)
function ensureAudioContext() {
  const ctx = audioPlayer.getAnalyser().context as AudioContext;
  if (ctx.state === "suspended") {
    ctx.resume().then(() => console.log("[audio] context resumed"));
  }
}
document.addEventListener("click", ensureAudioContext);
document.addEventListener("touchstart", ensureAudioContext);
document.addEventListener("keydown", ensureAudioContext, { once: true });
document.addEventListener("click", unlockSpeechOutput, { once: true });
document.addEventListener("touchstart", unlockSpeechOutput, { once: true });
document.addEventListener("keydown", unlockSpeechOutput, { once: true });

// Try to resume audio context on load
ensureAudioContext();

// ---------------------------------------------------------------------------
// UI Controls
// ---------------------------------------------------------------------------

const btnMute = document.getElementById("btn-mute")!;
const btnMenu = document.getElementById("btn-menu")!;
const menuDropdown = document.getElementById("menu-dropdown")!;
const btnTestVoice = document.getElementById("btn-test-voice")!;
const btnRestart = document.getElementById("btn-restart")!;
const btnFixSelf = document.getElementById("btn-fix-self")!;

btnMute.addEventListener("click", (e) => {
  e.stopPropagation();
  isMuted = !isMuted;
  btnMute.classList.toggle("muted", isMuted);
  if (isMuted) {
    voiceInput.pause();
    transition("idle");
  } else {
    voiceInput.resume();
    transition("listening");
  }
});

btnMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  menuDropdown.style.display = menuDropdown.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", () => {
  menuDropdown.style.display = "none";
});

btnTestVoice.addEventListener("click", (e) => {
  e.stopPropagation();
  menuDropdown.style.display = "none";
  unlockSpeechOutput();
  speakTextFallback("Voice test is working, sir.");
});

btnRestart.addEventListener("click", async (e) => {
  e.stopPropagation();
  menuDropdown.style.display = "none";
  statusEl.textContent = "restarting...";
  try {
    await fetch("/api/restart", { method: "POST" });
    // Wait a few seconds then reload
    setTimeout(() => window.location.reload(), 4000);
  } catch {
    statusEl.textContent = "restart failed";
  }
});

btnFixSelf.addEventListener("click", (e) => {
  e.stopPropagation();
  menuDropdown.style.display = "none";
  // Activate work mode on the WebSocket session (JARVIS becomes Claude Code's voice)
  socket.send({ type: "fix_self" });
  statusEl.textContent = "entering work mode...";
});

// Settings button
const btnSettings = document.getElementById("btn-settings")!;
btnSettings.addEventListener("click", (e) => {
  e.stopPropagation();
  menuDropdown.style.display = "none";
  openSettings();
});

// First-time setup detection — check after a short delay for server readiness
setTimeout(() => {
  checkFirstTimeSetup();
}, 2000);
