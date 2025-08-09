STEM Career Quiz (Next.js + Replicate)

## Getting Started

Local setup

1) Copy `.env.local.example` to `.env.local` and set:
   - `REPLICATE_API_TOKEN`
   - `REPLICATE_MODEL` (e.g. `black-forest-labs/flux-1.1-pro` or your Kontext Pro model)
   - Or set `REPLICATE_MODEL_VERSION` if you prefer a pinned version

2) Install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure
- `src/app/quiz/page.tsx`: quiz UI — floating card, 2-col answers, small camera preview above
- `src/app/capture/page.tsx`: selfie capture and preview; stores `captured_blob_url` and `captured_data_url`
- `src/app/processing/page.tsx`: starts Replicate job using prompts; polls status
- `src/app/result/page.tsx`: displays only the AI-generated image
- `src/app/api/replicate/start/route.ts`: uploads file, calls Replicate model
- `src/data/questions.ts`: quiz questions and two-word answers
- `src/data/careers.ts`: career profiles and prompt builders (`buildPrompts`, `defaultNegativePrompt`)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Prompting
- Positive prompt: identity-preserving, adds happy/inspiring expression
- Negative prompt: removes artifacts (blurry, extra limbs, etc.)

## UI decisions
- Monochrome (black/white) theme only
- Result image shows in color; grayscale filters removed
- Quiz answers are exactly two words for consistency; no scroll in card

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Set the same env vars on Vercel. Ensure API routes run on Node runtime (default) and consider `maxDuration` if you need longer function time.
