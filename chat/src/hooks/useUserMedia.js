import { useState, useEffect } from "react";

export function useUserMedia(requestedMedia) {
  const [mediaStream, setMediaStream] = useState(null);

  async function enableStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
      setMediaStream(stream);
    } catch (err) {
      // Removed for brevity
      console.log({ err });
    }
  }
  useEffect(async () => {
    if (!mediaStream) {
      await enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}
