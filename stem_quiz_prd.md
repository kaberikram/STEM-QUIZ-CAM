**Product Requirements Document (PRD): STEM Career Quiz Web App**

---

### Overview
A mobile web app where kids answer 4 fun questions to discover a STEM career path. Their answers generate a custom prompt, and a selfie taken via the front camera is processed by the FLUX.1 Kontext model (via Replicate) to create an AI-generated image of their future self in that career.

---

### Goals
- Spark interest in STEM fields among children
- Deliver a personalized, visual experience using AI
- Enable front camera-based engagement and photo-to-AI transformation

---

### Success Metrics
- Quiz completion rate: > 80%
- Photo submission rate: > 70%
- AI result screen share/download: > 30%
- Time-on-app: > 3 minutes per session

---

### Features

#### 1. Always-On Front Camera
- Activated when quiz starts (using `getUserMedia`)
- Camera feed remains live during quiz
- Blurred background option for privacy

#### 2. Quiz System (4 Multiple-Choice Questions)
- 4 predefined questions with 4 answer options each
- Tap-to-select interface
- Progress tracker (e.g., dots or stepper)
- Answers are mapped to career profiles (e.g., biologist, game developer)

#### 3. Selfie Capture
- Prompt user to take a photo after Q4
- Preview and retake option
- Image temporarily stored for AI processing

#### 4. AI Image Generation (FLUX.1 Kontext via Replicate)
- Prompt crafted based on quiz responses:
  "Transform this image of a young child into a confident [STEM Role] wearing [attire] in a [setting], while keeping facial features and composition the same."
- Example roles: Space Engineer, Chemist, Game Developer, Marine Biologist, etc.
- Calls Replicate API with selfie + prompt

#### 5. Result Display
- Left: Original photo
- Right: AI-generated image
- STEM career label + message: “You’d be an amazing Software Engineer!”
- CTA: [Download Image] [Share] [Try Again]

#### 6. Error Handling
- Fallback message if Replicate call fails
- Button to restart quiz

---

### Wireframe (UI Structure)

**1. Landing Page**
- Title: “See Your STEM Future”
- Subtitle: “Take a short quiz and see yourself in a STEM career!”
- CTA: “Start Quiz”

**2. QuizView**
- Background: Live front camera feed
- Overlay: Question text + 4 answer buttons
- Progress indicator at top

**3. TakePhoto**
- Live camera preview
- Buttons: [Retake], [Capture Photo]

**4. Processing**
- Animation + text: “Crafting your future look...”
- Optional: STEM fun fact

**5. Result**
- Side-by-side: Original vs. AI-generated image
- Label: Career title + praise
- Actions: [Download], [Share], [Try Again]

**6. Error**
- Message: “Something went wrong.”
- Action: [Restart Quiz]

---

### Tech Stack
- **Frontend**: React.js / Vanilla JS
- **Camera API**: getUserMedia()
- **AI Processing**: Replicate API using FLUX.1 Kontext [pro or max]
- **Hosting**: Vercel / Netlify

---

### Privacy
- Images are not stored permanently
- No login/account required
- All processing is session-based

---

### Timeline
| Phase                 | Timeline        |
|----------------------|-----------------|
| Wireframe + Design   | Week 1          |
| Frontend Dev         | Week 2          |
| AI Integration       | Week 3          |
| QA & Polish          | Week 4          |
| Launch MVP           | End of Week 4   |

---

### Next Steps
- Finalize Figma prototype (in progress)
- Connect FLUX.1 API and test prompts
- Review with educators for age-appropriateness