// Quiz domain types and data
// NOTE: Answer labels are intentionally constrained to two words each
// to keep the quiz card compact and consistent across steps.
export type CareerKey =
  | "software_engineer"
  | "space_engineer"
  | "chemist"
  | "game_developer"
  | "marine_biologist"
  | "roboticist"
  | "data_scientist"
  | "environmental_scientist";

export type QuizOption = {
  id: string;
  label: string;
  weights: Partial<Record<CareerKey, number>>;
};

export type QuizQuestion = {
  id: string;
  text: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "What sounds most fun to you?",
    options: [
      {
        id: "q1_a1",
        label: "Build apps",
        weights: {
          software_engineer: 2,
          data_scientist: 1,
          game_developer: 1,
        },
      },
      {
        id: "q1_a2",
        label: "Run experiments",
        weights: { chemist: 2 },
      },
      {
        id: "q1_a3",
        label: "Explore oceans",
        weights: { marine_biologist: 2 },
      },
      {
        id: "q1_a4",
        label: "Design rockets",
        weights: { space_engineer: 2 },
      },
    ],
  },
  {
    id: "q2",
    text: "Which tool would you pick first?",
    options: [
      {
        id: "q2_a1",
        label: "Use laptop",
        weights: {
          software_engineer: 2,
          data_scientist: 1,
          game_developer: 1,
        },
      },
      {
        id: "q2_a2",
        label: "Use microscope",
        weights: { chemist: 2 },
      },
      {
        id: "q2_a3",
        label: "Diving gear",
        weights: { marine_biologist: 2 },
      },
      {
        id: "q2_a4",
        label: "Robot kit",
        weights: { roboticist: 2, space_engineer: 1 },
      },
    ],
  },
  {
    id: "q3",
    text: "Where would you like to work?",
    options: [
      {
        id: "q3_a1",
        label: "Tech office",
        weights: {
          software_engineer: 2,
          data_scientist: 1,
          game_developer: 1,
        },
      },
      {
        id: "q3_a2",
        label: "Science lab",
        weights: { chemist: 2 },
      },
      {
        id: "q3_a3",
        label: "Ocean boat",
        weights: { marine_biologist: 2 },
      },
      {
        id: "q3_a4",
        label: "Space station",
        weights: { space_engineer: 2 },
      },
    ],
  },
  {
    id: "q4",
    text: "What kind of challenge do you enjoy most?",
    options: [
      {
        id: "q4_a1",
        label: "Debug puzzles",
        weights: { software_engineer: 2, data_scientist: 1 },
      },
      {
        id: "q4_a2",
        label: "Run experiments",
        weights: { chemist: 2 },
      },
      {
        id: "q4_a3",
        label: "Explore nature",
        weights: { marine_biologist: 1, environmental_scientist: 2 },
      },
      {
        id: "q4_a4",
        label: "Build machines",
        weights: { roboticist: 2, space_engineer: 1 },
      },
    ],
  },
];



