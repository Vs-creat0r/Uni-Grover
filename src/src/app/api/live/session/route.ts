import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateSessionId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST — Create a new live session
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, title, totalSlides, slideData, pdfText } = body;

    if (!title) {
      return NextResponse.json({ error: 'Session title is required' }, { status: 400 });
    }

    const sessionId = generateSessionId();

    const { data, error } = await supabase.from('live_sessions').insert([{
      id: sessionId,
      course_id: courseId || null,
      title,
      status: 'active',
      current_slide: 1,
      total_slides: totalSlides || 0,
      slide_data: slideData || null,
      pdf_text: pdfText || null,
    }]).select().single();

    if (error) {
      console.error('Session Create Error:', error);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Session POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — Get session info (used by student polling)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Session GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update session (current slide, end session)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, currentSlide, status } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (currentSlide !== undefined) updates.current_slide = currentSlide;
    if (status === 'ended') {
      updates.status = 'ended';
      updates.ended_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Session PATCH Error:', error);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Session PATCH Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
