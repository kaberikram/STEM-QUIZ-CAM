"use client";

import { useEffect, useState } from "react";
import { CAREERS } from "@/data/careers";

export default function ResultPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [careerTitle, setCareerTitle] = useState<string>("");

  useEffect(() => {
    const u = sessionStorage.getItem("result_urls");
    const key = sessionStorage.getItem("career_key");
    const career = key ? CAREERS[key as keyof typeof CAREERS] : undefined;
    setCareerTitle(career ? career.title : "STEM Pro");
    if (u) setUrls(JSON.parse(u));
  }, []);

  const download = async () => {
    if (urls.length === 0) return;
    const url = urls[0];
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stem-future.jpg";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const share = async () => {
    try {
      if (navigator.share && urls.length > 0) {
        await navigator.share({ title: "My STEM Future", text: "Check this out!", url: urls[0] });
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4 bg-white text-black">
      <h1 className="text-2xl font-semibold mt-2">You’d be an amazing {careerTitle}!</h1>
      <div className="w-full max-w-3xl">
        <p className="text-sm text-black/60 mb-2">AI-Generated</p>
        {urls.length > 0 && urls[0] ? (
          <img src={urls[0]} alt="AI Result" className="w-full rounded" />
        ) : (
          <div className="w-full h-64 bg-black/5 rounded" />
        )}
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={download} className="px-4 py-2 rounded bg-black text-white">Download</button>
        <button onClick={share} className="px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition-colors">Share</button>
        <a href="/quiz" className="px-4 py-2 rounded border border-black hover:bg-black hover:text-white transition-colors">Try Again</a>
      </div>
    </div>
  );
}


