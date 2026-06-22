import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const GEMINI_MODEL = 'gemini-2.5-flash';

async function callGemini(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in .env.local');
  }

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
    console.error('Gemini API Error:', errorText, 'Status:', response.status);
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Unexpected Gemini response:', data);
    throw new Error('Unexpected response format from Gemini');
  }

  return data.candidates[0].content.parts[0].text;
}

function cleanJsonString(raw: string): string {
  let s = raw.trim();
  if (s.startsWith('```json')) s = s.replace(/^```json/, '').replace(/```$/, '').trim();
  else if (s.startsWith('```')) s = s.replace(/^```/, '').replace(/```$/, '').trim();
  return s;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, audience, includeEthics, courseId, regenerate } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    if (!courseId) {
      return NextResponse.json({ error: 'Course selection is required' }, { status: 400 });
    }

    let systemPrompt = `You are an expert professor with 20 years of experience.
Your goal is to explain complex topics in a way that builds curiosity, deep understanding, and practical application.
The user wants to learn about: ${topic}
Target Audience: ${audience || 'Intermediate'}

You MUST structure your response as a JSON object matching this schema:
{
  "hook": "A fascinating fact or mystery related to the topic.",
  "why_this_matters": "A 2-sentence explanation of why this concept exists.",
  "real_world_examples": ["Example 1", "Example 2"],
  "core_explanation": "The main technical explanation.",
  "analogy": "An 'Explain Like I'm 5' metaphor.",
  "common_misconception": "One thing students always get wrong.",
  "curiosity_question": "An open-ended debate question."
}`;

    if (includeEthics) {
      systemPrompt += `\nAdditionally, include an "ethics_impact" field detailing misuse, real-world societal impact, and guidelines.`;
    }

    if (regenerate) {
      systemPrompt += `\nIMPORTANT: The user has already seen a previous explanation. You MUST use completely different examples, a completely different analogy, different real-world applications, and a fresh perspective. Be creative and original.`;
    }

    console.log('Sending prompt to Gemini 2.5 Flash...');
    const contentString = await callGemini(systemPrompt, `Generate the lesson JSON for: ${topic}`);

    let generatedContent;
    try {
      generatedContent = JSON.parse(cleanJsonString(contentString));
    } catch {
      console.error('Failed to parse JSON from AI:', contentString);
      return NextResponse.json({ error: 'AI returned invalid JSON format' }, { status: 500 });
    }

    // Save to Supabase (skip for regenerations — same content just explained differently)
    if (!regenerate) {
      try {
        const { error: dbError } = await supabase.from('generated_content').insert([{
          course_id: courseId,
          topic: topic,
          audience: audience || 'intermediate',
          hook: generatedContent.hook,
          why_this_matters: generatedContent.why_this_matters,
          real_world_examples: generatedContent.real_world_examples,
          core_explanation: generatedContent.core_explanation,
          analogy: generatedContent.analogy,
          common_misconception: generatedContent.common_misconception,
          curiosity_question: generatedContent.curiosity_question,
          ethics_impact: generatedContent.ethics_impact,
        }]);
        if (dbError) console.error('DB Insert Error:', dbError);
      } catch (err) {
        console.error('Supabase Error:', err);
      }
    }

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Generation API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
