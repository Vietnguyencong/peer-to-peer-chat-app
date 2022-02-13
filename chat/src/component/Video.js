import React, { useRef, useState, useEffect } from "react";

export default function Video({ muted, stream }) {
  const videoRef = useRef();
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  function handleCanPlay() {
    videoRef.current.play();
  }
  return (
    <video
      ref={videoRef}
      onCanPlay={handleCanPlay}
      autoPlay={true}
      playsInline
      muted={muted}
      height={290}
      style={{ margin: "10px" }}
    ></video>
  );
}
