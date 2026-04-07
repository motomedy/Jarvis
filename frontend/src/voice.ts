/**
 * Voice input (Web Speech API) and audio output (AudioContext) for JARVIS.
 */

// ---------------------------------------------------------------------------
// Speech Recognition
// ---------------------------------------------------------------------------

export interface VoiceInput {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
}

export type SttSource = "chrome" | "backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const webkitSpeechRecognition: any;

export function createVoiceInput(
  onTranscript: (text: string) => void,
  onError: (msg: string) => void,
  onSourceChange?: (source: SttSource) => void
): VoiceInput {
  // Try native speech recognition first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (typeof webkitSpeechRecognition !== "undefined" ? webkitSpeechRecognition : null);
  if (SR) {
    onSourceChange?.("chrome");
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let shouldListen = false;
    let paused = false;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) onTranscript(text);
        }
      }
    };

    recognition.onend = () => {
      if (shouldListen && !paused) {
        try {
          recognition.start();
        } catch {
          // Already started
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        onError("Microphone access denied. Please allow microphone access.");
        shouldListen = false;
      } else if (event.error === "no-speech") {
        // Normal, just restart
      } else if (event.error === "aborted") {
        // Expected during pause
      } else {
        console.warn("[voice] recognition error:", event.error);
      }
    };

    return {
      start() {
        shouldListen = true;
        paused = false;
        try {
          recognition.start();
        } catch {
          // Already started
        }
      },
      stop() {
        shouldListen = false;
        paused = false;
        recognition.stop();
      },
      pause() {
        paused = true;
        recognition.stop();
      },
      resume() {
        paused = false;
        if (shouldListen) {
          try {
            recognition.start();
          } catch {
            // Already started
          }
        }
      },
    };
  }

  // Fallback: backend-powered speech recognition using MediaRecorder
  onSourceChange?.("backend");
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let shouldListen = false;
  let paused = false;
  let stream: MediaStream | null = null;

  async function startRecording() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        if (!shouldListen || paused) return;
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Send to backend for transcription
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'speech.webm');
          const resp = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });
          if (!resp.ok) throw new Error('Transcription failed');
          const data = await resp.json();
          if (data.text) {
            onTranscript(data.text);
          } else {
            onError('No transcript received');
          }
        } catch (err) {
          onError('Speech-to-text error');
        }
        // Restart if still listening
        if (shouldListen && !paused) {
          startRecording();
        }
      };
      mediaRecorder.start();
      // Stop after 5 seconds (or configurable)
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (err) {
      onError('Microphone access denied or unavailable');
    }
  }

  return {
    start() {
      shouldListen = true;
      paused = false;
      startRecording();
    },
    stop() {
      shouldListen = false;
      paused = false;
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
    },
    pause() {
      paused = true;
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    },
    resume() {
      paused = false;
      if (shouldListen && (!mediaRecorder || mediaRecorder.state !== 'recording')) {
        startRecording();
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Audio Player
// ---------------------------------------------------------------------------

export interface AudioPlayer {
  enqueue(base64: string): Promise<void>;
  stop(): void;
  getAnalyser(): AnalyserNode;
  onFinished(cb: () => void): void;
}

export function createAudioPlayer(): AudioPlayer {
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  analyser.connect(audioCtx.destination);

  const queue: AudioBuffer[] = [];
  let isPlaying = false;
  let currentSource: AudioBufferSourceNode | null = null;
  let finishedCallback: (() => void) | null = null;

  function playNext() {
    if (queue.length === 0) {
      isPlaying = false;
      currentSource = null;
      finishedCallback?.();
      return;
    }

    isPlaying = true;
    const buffer = queue.shift()!;
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    currentSource = source;

    source.onended = () => {
      if (currentSource === source) {
        playNext();
      }
    };

    source.start();
  }

  return {
    async enqueue(base64: string) {
      // Resume audio context (browser autoplay policy)
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      try {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
        queue.push(audioBuffer);
        if (!isPlaying) playNext();
      } catch (err) {
        console.error("[audio] decode error:", err);
        // Skip bad audio, continue
        if (!isPlaying && queue.length > 0) playNext();
      }
    },

    stop() {
      queue.length = 0;
      if (currentSource) {
        try {
          currentSource.stop();
        } catch {
          // Already stopped
        }
        currentSource = null;
      }
      isPlaying = false;
    },

    getAnalyser() {
      return analyser;
    },

    onFinished(cb: () => void) {
      finishedCallback = cb;
    },
  };
}
