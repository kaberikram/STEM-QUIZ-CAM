"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CAREERS, buildPrompt } from "@/data/careers";

export default function CapturePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mirror, setMirror] = useState(true);

  // Start camera; required on this page to capture a selfie
  useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError("Camera unavailable. You can upload a file instead.");
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = Math.min(video.videoWidth || 720, 720);
    const height = Math.round((video.videoHeight / (video.videoWidth || 1)) * width);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    if (mirror) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    canvas.toBlob((b) => {
      if (!b) return;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      const objectUrl = URL.createObjectURL(b);
      setBlobUrl(objectUrl);
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        sessionStorage.setItem("captured_data_url", dataUrl);
      } catch {
        // ignore
      }
    }, "image/jpeg", 0.9);
  }, [blobUrl, mirror]);

  const goNext = useCallback(() => {
    if (!blobUrl) {
      setError("Please capture a photo first.");
      return;
    }
    sessionStorage.setItem("captured_blob_url", blobUrl);
    if (!sessionStorage.getItem("captured_data_url") && canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
        sessionStorage.setItem("captured_data_url", dataUrl);
      } catch {}
    }
    location.href = "/processing";
  }, [blobUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-white text-black">
      <h1 className="text-2xl font-semibold">Take Photo</h1>
      {error && <p className="text-black">{error}</p>}
      <video ref={videoRef} playsInline muted className={`w-full max-w-sm rounded bg-black ${mirror ? "scale-x-[-1]" : ""}`} />
      <div className="flex items-center gap-2">
        <label className="text-sm text-black select-none">
          <input type="checkbox" className="mr-2" checked={mirror} onChange={(e) => setMirror(e.target.checked)} />
          Mirror preview
        </label>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-3">
        <button onClick={capture} className="px-4 py-2 rounded bg-black text-white">Capture</button>
        <button onClick={goNext} className="px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition-colors">Continue</button>
      </div>
      {blobUrl && (
        <div className="mt-4">
          <p className="text-sm text-black/60 mb-2">Preview:</p>
          <img src={blobUrl} alt="Preview" className="rounded max-w-sm" />
        </div>
      )}
    </div>
  );
}


