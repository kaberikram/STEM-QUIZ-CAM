# STEM-QUIZ-CAM

Minimal monochrome STEM career quiz with camera capture and AI image transformation.

## Repo layout
- `web/` — Next.js app (App Router) with TailwindCSS
- Root `package.json` — convenience scripts proxying to `web/`

## Quick start
```bash
cp web/.env.local.example web/.env.local # fill tokens
npm install
npm run dev
```

## Environment
Set in `web/.env.local`:
- `REPLICATE_API_TOKEN`: your Replicate token
- One of:
  - `REPLICATE_MODEL`: e.g. `black-forest-labs/flux-1.1-pro`
  - `REPLICATE_MODEL_VERSION`: pinned version id

## App flow (high level)
1. `quiz/` — floating 2-col answers; small camera preview above the card
2. `capture/` — capture selfie; stores blob/data URLs in `sessionStorage`
3. `processing/` — builds positive/negative prompts and starts Replicate job
4. `result/` — shows generated image (original hidden by design)

## Prompting
- Positive prompt built from career profile via `buildPrompts`
- Negative prompt via `defaultNegativePrompt` to avoid artifacts

## Handoff notes
- UI is black/white only; no grayscale filters on result image
- Quiz card height is content-driven; answers are exactly two words
- Camera permissions are optional on quiz; required on capture

See `web/README.md` for app-specific details.
