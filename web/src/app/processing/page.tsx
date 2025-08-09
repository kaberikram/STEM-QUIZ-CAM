"use client";

import { useEffect, useState } from "react";
import { CAREERS, buildPrompts } from "@/data/careers";

export default function ProcessingPage() {
  const [status, setStatus] = useState<string>("starting");
  const [error, setError] = useState<string | null>(null);

  // Build prompts and start the generation job when arriving on this page
  useEffect(() => {
    const careerKey = sessionStorage.getItem("career_key");
    const blobUrl = sessionStorage.getItem("captured_blob_url");
    const dataUrl = sessionStorage.getItem("captured_data_url");
    // Prefer data URL across route transitions; blob: URLs can become invalid
    const sourceUrl = dataUrl || blobUrl;
    if (!careerKey || !sourceUrl) {
      setError("Missing selection or photo");
      return;
    }
    const career = CAREERS[careerKey as keyof typeof CAREERS];
    // Build positive + negative prompts from the selected career profile
    const { prompt, negative } = buildPrompts(career, "");

    const start = async () => {
      try {
        // Handle data URLs directly to avoid fetch issues in some browsers
        let blob: Blob;
        if (sourceUrl.startsWith("data:")) {
          const res = await fetch(sourceUrl);
          blob = await res.blob();
        } else {
          const res = await fetch(sourceUrl);
          blob = await res.blob();
        }
        const form = new FormData();
        form.append("image", blob, "selfie.jpg");
        form.append("prompt", prompt);
        form.append("negative_prompt", negative);
        const res = await fetch("/api/replicate/start", { method: "POST", body: form });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Start failed: ${res.status}`);
        }
        const data = (await res.json()) as { id: string; status: string };
        const id = data.id;
        // Poll for completion; for production consider SSE/webhooks
        const poll = async () => {
          const r = await fetch(`/api/replicate/status?id=${id}`);
          const j = await r.json();
          setStatus(j.status);
          if (j.status === "succeeded") {
            sessionStorage.setItem("result_urls", JSON.stringify(j.output || []));
            location.href = "/result";
            return;
          }
          if (j.status === "failed" || j.status === "canceled") {
            setError(j.error || "Generation failed");
            return;
          }
          setTimeout(poll, 2000);
        };
        setTimeout(poll, 2000);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    start();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-black">
      <h1 className="text-2xl font-semibold mb-2">Crafting your future look...</h1>
      <p className="text-black/60 mb-6">Hang tight while we generate your image.</p>
      <div className="animate-pulse w-24 h-24 rounded-full bg-black/10" />
      <p className="text-sm text-black/60 mt-6">Status: {status}</p>
      {error && <p className="text-black mt-4">{error}</p>}
    </div>
  );
}


