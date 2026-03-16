"use server";

import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';
import path from 'path';

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (aiInstance) return aiInstance;

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

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. API calls will fail.");
    // We still initialize it to avoid crashing the whole app on startup,
    // but it will throw when actually used if the key is invalid.
    apiKey = "MISSING_API_KEY";
  }

  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 5, baseDelay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error?.message || error);
      
      const errorMessage = error?.message?.toLowerCase() || '';
      const isRetryable = error?.status === 503 || 
                          errorMessage.includes('503') || 
                          errorMessage.includes('unavailable') ||
                          errorMessage.includes('high demand') ||
                          errorMessage.includes('429') ||
                          errorMessage.includes('too many requests') ||
                          errorMessage.includes('fetch failed') ||
                          errorMessage.includes('network') ||
                          errorMessage.includes('timeout') ||
                          error?.name === 'TypeError';

      if (!isRetryable || attempt >= maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

export async function generateRoadmap(goal: string, timeline: string, hours: string) {
  const prompt = `SYSTEM
You are Planix AI, an intelligent learning agent that designs roadmaps and teaches users step-by-step.

CONTEXT
Include roadmap data: None
Include chat history: None
Include uploaded document summaries: None
Include user progress: None

USER
Create a learning roadmap for: ${goal}. Timeline: ${timeline}. Time commitment: ${hours} hours per day.`;

  const response = await withRetry(() => getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          totalDuration: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "duration", "objectives", "explanation", "resources"]
            }
          }
        },
        required: ["title", "totalDuration", "phases"]
      }
    }
  }));

  if (!response.text) throw new Error("Failed to generate roadmap");
  try {
    return JSON.parse(response.text);
  } catch (e) {
    throw new Error("Invalid JSON response from AI");
  }
}

export async function refineRoadmap(currentRoadmap: any, userPrompt: string, uploadedContext?: string, chatHistory?: string, userProgress?: string) {
  const prompt = `SYSTEM
You are Planix AI, an intelligent learning agent that designs roadmaps and teaches users step-by-step.

CONTEXT
Include roadmap data: ${JSON.stringify(currentRoadmap)}
Include chat history: ${chatHistory || 'None'}
Include uploaded document summaries: ${uploadedContext || 'None'}
Include user progress: ${userProgress || 'None'}

USER
User request to refine: ${userPrompt}. Return the updated roadmap.`;

  const response = await withRetry(() => getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          totalDuration: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "duration", "objectives", "explanation", "resources"]
            }
          }
        },
        required: ["title", "totalDuration", "phases"]
      }
    }
  }));

  if (!response.text) throw new Error("Failed to refine roadmap");
  try {
    return JSON.parse(response.text);
  } catch (e) {
    throw new Error("Invalid JSON response from AI");
  }
}

export async function teachingExplain(concept: string, context: string, uploadedContext?: string, chatHistory?: string, userProgress?: string) {
  const prompt = `SYSTEM
You are Planix AI, an intelligent learning agent that designs roadmaps and teaches users step-by-step.

CONTEXT
Include roadmap data: ${context}
Include chat history: ${chatHistory || 'None'}
Include uploaded document summaries: ${uploadedContext || 'None'}
Include user progress: ${userProgress || 'None'}

USER
Explain the concept: "${concept}"`;

  const response = await withRetry(() => getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.4,
      systemInstruction: `You are an AI learning mentor.
Rules:
- Respond conversationally like ChatGPT.
- Use short paragraphs (2–4 lines max).
- Use bullet points only when helpful.
- Do NOT narrate roadmap structure.
- Do NOT include external resources.
- Do NOT include course suggestions.
- Do NOT include animations or UI references.
- Do NOT mention phases unless explicitly asked.
- Do NOT include code unless user asks.
- Keep responses clear, tight, and readable.
- Default length: 300–600 words max.
- Only go longer if user explicitly asks for deep detail.

Responses must follow format:
# Topic

## Concept
Explanation

## Example
Example explanation

## Practice Task
Small challenge.`
    }
  }));

  if (!response.text) throw new Error("Failed to generate explanation");
  return response.text;
}

export async function generateNotes(topic: string, context: string, uploadedContext?: string, chatHistory?: string, userProgress?: string) {
  const prompt = `SYSTEM
You are Planix AI, an intelligent learning agent that designs roadmaps and teaches users step-by-step.

CONTEXT
Include roadmap data: ${context}
Include chat history: ${chatHistory || 'None'}
Include uploaded document summaries: ${uploadedContext || 'None'}
Include user progress: ${userProgress || 'None'}

USER
Generate notes for the topic: "${topic}"`;

  const response = await withRetry(() => getAI().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.4,
      systemInstruction: `You are an AI learning mentor.
Rules:
- Return concise study notes.
- Use headings + bullets.
- No essays.
- No storytelling.
- No roadmap narration.
- No external links.
- No allocated resources.
- Keep each section short.
- Maximum response length: 500 words unless user asks for detailed notes.

Format:
# Topic

## Definition
## Key Concepts
## Examples
## Summary`
    }
  }));

  if (!response.text) throw new Error("Failed to generate notes");
  return response.text;
}
