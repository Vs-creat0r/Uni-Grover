import { NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slideTexts } = body; // Array of { page: number, text: string }

    if (!slideTexts || !Array.isArray(slideTexts) || slideTexts.length === 0) {
      return NextResponse.json({ error: 'slideTexts array is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    // Build a single prompt for ALL slides to save API credits
    const slideSummary = slideTexts
      .map((s: { page: number; text: string }) => `--- SLIDE ${s.page} ---\n${s.text || '(No text content)'}`)
      .join('\n\n');

    const systemPrompt = `You are an AI teaching assistant analyzing presentation slides for a live university lecture.
For each slide, generate:
1. Two to three SHORT bullet points summarizing the key concepts (max 15 words each)
2. One engagement question/option that a student can respond to (like "Did you understand this concept?" or "Which part was most interesting?")
3. Two response options the student can quickly tap (e.g., "Understood ✓", "Need more explanation")

You MUST return a JSON object with this schema:
{
  "slides": [
    {
      "page": 1,
      "bullets": ["Bullet 1", "Bullet 2"],
      "question": "The engagement question for this slide",
      "options": ["Option A", "Option B"]
    }
  ]
}

Generate entries for ALL slides provided. If a slide has no meaningful text, still generate a generic entry like "Visual/Diagram slide" with a question about whether the visual was clear.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: `Analyze these ${slideTexts.length} slides:\n\n${slideSummary}` }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Analyze Error:', errorText);
      return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
    }

    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

    const result = JSON.parse(cleaned);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Slide Analyze Error:', error);
    return NextResponse.json({ error: 'Failed to analyze slides' }, { status: 500 });
  }
}
