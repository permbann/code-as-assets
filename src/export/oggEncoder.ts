import { audioBufferToWav } from "./wavEncoder";

/**
 * Encodes an AudioBuffer into an Ogg / Opus compressed audio file using browser MediaRecorder
 */
export async function audioBufferToOgg(
  buffer: AudioBuffer,
): Promise<{ blob: Blob; extension: string }> {
  // Test for preferred MIME types
  const preferredMimes = [
    "audio/ogg; codecs=opus",
    "audio/ogg; codecs=vorbis",
    "audio/ogg",
    "audio/webm; codecs=opus",
    "audio/webm",
  ];

  let selectedMime = "";
  if (typeof MediaRecorder !== "undefined") {
    for (const mime of preferredMimes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }
  }

  // If no compressed audio mime is supported in current environment, return WAV
  if (!selectedMime) {
    return {
      blob: audioBufferToWav(buffer),
      extension: "wav",
    };
  }

  return new Promise((resolve) => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    const destination = ctx.createMediaStreamDestination();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(destination);

    const recorder = new MediaRecorder(destination.stream, {
      mimeType: selectedMime,
      audioBitsPerSecond: 128000,
    });

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const ext = selectedMime.includes("ogg") ? "ogg" : "webm";
      const blob = new Blob(chunks, { type: selectedMime });
      void ctx.close();
      resolve({ blob, extension: ext });
    };

    recorder.start();
    source.start(0);

    // Stop recording slightly after buffer duration finishes
    setTimeout(
      () => {
        try {
          recorder.stop();
          source.stop();
        } catch {
          // Source already ended
        }
      },
      Math.ceil((buffer.duration + 0.1) * 1000),
    );
  });
}
