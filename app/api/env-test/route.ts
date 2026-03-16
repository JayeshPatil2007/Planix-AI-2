import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    gemini: process.env.GEMINI_API_KEY,
    next_public_gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY
  });
}
