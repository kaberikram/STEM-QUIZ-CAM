import { NextResponse } from "next/server";
import Replicate from "replicate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // allow long-running predictions in dev/pro

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(request: Request): Promise<Response> {
  try {
    // Expect multipart/form-data with fields: image (File), prompt (string), negative_prompt (optional string)
    const formData = await request.formData();
    const image = formData.get("image");
    const prompt = String(formData.get("prompt") || "");
    const negative_prompt = String(formData.get("negative_prompt") || "");

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Missing image file in form-data under 'image'" },
        { status: 400 }
      );
    }

    // Optional: basic guardrails on size and type
    if (image.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large. Please keep under 4 MB." },
        { status: 413 }
      );
    }

    const mimeTypeOk = /^(image\/png|image\/jpeg|image\/webp)$/.test(
      image.type || ""
    );
    if (!mimeTypeOk) {
      return NextResponse.json(
        { error: "Unsupported image type. Use PNG, JPEG, or WEBP." },
        { status: 415 }
      );
    }

    // Upload the selfie to Replicate's files API and use the returned URL
    const uploaded = await (replicate as any).files.create(image);
    const imageUrl: string | undefined = uploaded?.urls?.get;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to upload image to Replicate." },
        { status: 500 }
      );
    }

    // Select model by name or pinned version via env
    // Examples: black-forest-labs/flux-1.1-pro, black-forest-labs/flux.1-kontxt-pro
    const model = process.env.REPLICATE_MODEL;
    const version = process.env.REPLICATE_MODEL_VERSION; // optional

    if (!model && !version) {
      return NextResponse.json(
        {
          error:
            "Missing REPLICATE_MODEL (or REPLICATE_MODEL_VERSION). Set one in your env.",
        },
        { status: 500 }
      );
    }

    // Build input payload. Most models accept `negative_prompt`; if not, it's ignored.
    const input: Record<string, unknown> = {
      prompt,
      negative_prompt: negative_prompt || undefined,
      input_image: imageUrl,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      preserve_input_image: true,
      // Identity-preservation hints (if supported by model)
      // Many models honor these as soft constraints even if not in schema
      keep_face: true,
      keep_pose: true,
      keep_lighting: true,
    };

    let prediction;
    if (model) {
      prediction = await replicate.predictions.create({
        model,
        input,
        webhook: undefined,
        // Note: do not wait synchronously; client will poll status endpoint
      });
    } else {
      prediction = await replicate.predictions.create({
        version: version as string,
        input,
        webhook: undefined,
      });
    }

    return NextResponse.json({ id: prediction.id, status: prediction.status });
  } catch (error: unknown) {
    console.error("/api/replicate/start error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}


