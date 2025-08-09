export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-3xl font-bold">See Your STEM Future</h1>
      <p className="text-center text-black/60">
        Take a short quiz and see yourself in a STEM career!
      </p>
      <div className="flex gap-3">
        <a
          href="/quiz"
          className="rounded px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors"
        >
          Start Quiz
        </a>
      </div>
    </div>
  );
}
