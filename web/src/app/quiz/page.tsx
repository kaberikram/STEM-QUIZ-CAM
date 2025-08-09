"use client";

import { useEffect, useRef, useState } from "react";
import { QUIZ_QUESTIONS, type QuizOption } from "@/data/questions";
import { CAREERS, type CareerProfile } from "@/data/careers";

type Scores = Record<keyof typeof CAREERS, number>;

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>(() => {
    const base: Partial<Scores> = {};
    (Object.keys(CAREERS) as Array<keyof typeof CAREERS>).forEach((k) => {
      base[k] = 0;
    });
    return base as Scores;
  });
  const [error, setError] = useState<string | null>(null);

  // Camera preview in quiz: optional; we don't block quiz if camera fails
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
      } catch {
        // Allow quiz to proceed without camera
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const q = QUIZ_QUESTIONS[step];

  function applyOption(option: QuizOption) {
    const updated = { ...scores };
    for (const [k, w] of Object.entries(option.weights)) {
      updated[k as keyof typeof CAREERS] += w ?? 0;
    }
    setScores(updated);
    if (step < QUIZ_QUESTIONS.length - 1) setStep(step + 1);
    else {
      // compute result
      const [bestKey] = Object.entries(updated).sort((a, b) => b[1] - a[1])[0];
      const career = CAREERS[bestKey as keyof typeof CAREERS];
      if (!career) {
        setError("Could not determine career");
        return;
      }
      // Stash selection in sessionStorage for the capture step
      sessionStorage.setItem("career_key", bestKey);
      location.href = "/capture";
    }
  }

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Floating camera + quiz card stacked near the bottom */}
      <div className="fixed inset-x-0 bottom-50 z-10 flex flex-col items-center gap-3">
        <video
          ref={videoRef}
          className="w-full max-w-sm rounded bg-black scale-x-[-1]"
          muted
          playsInline
        />
        <div className="w-full max-w-sm rounded-xl bg-white border border-black shadow-sm p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="text-xs text-black/70">Question {step + 1} / {QUIZ_QUESTIONS.length}</div>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-black" : "bg-black/20"}`}
                />
              ))}
            </div>
          </div>
          <h1 className="text-lg font-semibold mb-3 text-black clamp-1 min-h-[1.75rem] shrink-0">{q.text}</h1>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((o) => (
              <button
                key={o.id}
                onClick={() => applyOption(o)}
                className="px-3 py-2 rounded-md border border-black text-left bg-white text-black hover:bg-black hover:text-white transition-colors text-sm min-h-10 whitespace-nowrap"
              >
                <span className="text-left block overflow-hidden text-ellipsis">{o.label}</span>
              </button>
            ))}
          </div>
          {error && <p className="text-black mt-2 text-sm shrink-0">{error}</p>}
        </div>
      </div>
    </div>
  );
}


