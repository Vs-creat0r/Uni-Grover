import { NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, content } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const systemPrompt = `You are an expert quiz creator for university-level courses.
Given a topic and its lesson content, generate exactly 5 multiple-choice questions.
Each question should test understanding at different levels (recall, application, analysis).

You MUST return a JSON object with this schema:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`;

    const userPrompt = `Generate a 5-question quiz for the topic: "${topic}"

Here is the lesson content to base the quiz on:
${JSON.stringify(content, null, 2)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Quiz Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

    const quiz = JSON.parse(cleaned);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
