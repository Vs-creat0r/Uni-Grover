import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST — Student submits feedback for a slide
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, slideNumber, studentId, responseType, responseText } = body;

    if (!sessionId || !slideNumber || !studentId || !responseType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['like', 'dislike', 'question'].includes(responseType)) {
      return NextResponse.json({ error: 'Invalid response type' }, { status: 400 });
    }

    const { data, error } = await supabase.from('slide_feedback').insert([{
      session_id: sessionId,
      slide_number: slideNumber,
      student_id: studentId,
      response_type: responseType,
      response_text: responseText || null,
    }]).select().single();

    if (error) {
      console.error('Feedback Insert Error:', error);
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Feedback POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — Professor fetches feedback for a session
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const slideNumber = searchParams.get('slideNumber');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    let query = supabase
      .from('slide_feedback')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (slideNumber) {
      query = query.eq('slide_number', parseInt(slideNumber));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Feedback GET Error:', error);
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }

    return NextResponse.json({ feedback: data || [] });
  } catch (error) {
    console.error('Feedback GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
