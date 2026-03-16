import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

try {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envLocal = fs.readFileSync(envLocalPath, 'utf-8');
    const match = envLocal.match(/(?:^|\n)NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
      apiKey = match[1].trim();
    } else {
      const match2 = envLocal.match(/(?:^|\n)GEMINI_API_KEY=(.*)/);
      if (match2 && match2[1]) {
        apiKey = match2[1].trim();
      }
    }
  }
} catch (e) {
  console.error("Failed to read .env.local", e);
}

const ai = new GoogleGenAI({ apiKey });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;

    const filePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const prompt = "Analyze this file and extract key concepts that would help someone studying this topic.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [filePart, { text: prompt }] },
    });

    if (!response.text) {
      throw new Error("Failed to generate analysis from file");
    }

    return NextResponse.json({ extractedText: response.text });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process file upload' }, { status: 500 });
  }
}
