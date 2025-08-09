import type { CareerKey } from "./questions";

export type CareerProfile = {
  key: CareerKey;
  title: string;
  attire: string;
  setting: string;
};

export const CAREERS: Record<CareerKey, CareerProfile> = {
  software_engineer: {
    key: "software_engineer",
    title: "Software Engineer",
    attire: "a comfy hoodie and headphones",
    setting: "a modern office full of screens",
  },
  space_engineer: {
    key: "space_engineer",
    title: "Space Engineer",
    attire: "a sleek astronaut suit",
    setting: "a futuristic space station",
  },
  chemist: {
    key: "chemist",
    title: "Chemist",
    attire: "a white lab coat and safety goggles",
    setting: "a bright science lab",
  },
  game_developer: {
    key: "game_developer",
    title: "Game Developer",
    attire: "a graphic tee and creative workstation",
    setting: "a studio with game art and consoles",
  },
  marine_biologist: {
    key: "marine_biologist",
    title: "Marine Biologist",
    attire: "a wetsuit and research gear",
    setting: "a coral reef research site",
  },
  roboticist: {
    key: "roboticist",
    title: "Roboticist",
    attire: "a utility jacket and tool belt",
    setting: "a robotics lab with moving machines",
  },
  data_scientist: {
    key: "data_scientist",
    title: "Data Scientist",
    attire: "a smart blazer with a laptop",
    setting: "a data lab with charts and dashboards",
  },
  environmental_scientist: {
    key: "environmental_scientist",
    title: "Environmental Scientist",
    attire: "outdoor field gear and a notebook",
    setting: "a green nature reserve",
  },
};

export function buildPrompts(
  career: CareerProfile,
  base: string
): { prompt: string; negative: string } {
  if (base && base.trim().length > 0) {
    return { prompt: base.trim(), negative: defaultNegativePrompt() };
  }
  const prompt = [
    `Change the outfit to ${career.attire} and replace the background with ${career.setting}.`,
    `Keep the person's identity, facial structure, skin tone, hair, age, position, and framing the same.`,
    `Gently adjust the expression to look happy and inspiring — a natural, warm smile with bright, confident eyes.`,
    `Only edit the outfit, environment, and expression to reflect a professional ${career.title} setting.`,
  ].join(" ");
  return { prompt, negative: defaultNegativePrompt() };
}

// Backwards-compatible single-string builder (used in some places)
export function buildPrompt(career: CareerProfile, base: string): string {
  return buildPrompts(career, base).prompt;
}

export function defaultNegativePrompt(): string {
  return [
    // General artifacts and undesired edits
    "distorted face, deformed, asymmetry, extra fingers, extra limbs, missing facial features, bad anatomy, low quality, blurry, pixelated, artifacts",
    // Identity and realism guardrails
    "over-smoothing skin, heavy makeup, cartoonish, unrealistic proportions, de-aging or aging, changing ethnicity or gender",
    // Cropping and overlays
    "cropped face, cut-off head, text, watermark, logo, caption, border",
  ].join(", ");
}


