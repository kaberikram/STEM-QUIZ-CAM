import { NextResponse } from "next/server";
import Replicate from "replicate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function GET(request: Request): Promise<Response> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Missing REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing 'id' query parameter" },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.get(id);

    // Normalize output to a simple list of URLs
    // Replicate outputs can be strings, arrays, or file-like objects with a url
    const outputs: string[] = [];
    const pushIfUrl = (val: unknown) => {
      if (typeof val === "string") {
        outputs.push(val);
        return;
      }
      if (val && typeof val === "object" && "url" in (val as any)) {
        const u = (val as any).url;
        if (typeof u === "string") outputs.push(u);
      }
    };

    const out = (prediction as any).output;
    if (Array.isArray(out)) {
      for (const item of out) pushIfUrl(item);
    } else if (out != null) {
      pushIfUrl(out);
    }

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      error: (prediction as any).error || null,
      output: outputs,
    });
  } catch (error: unknown) {
    console.error("/api/replicate/status error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}


