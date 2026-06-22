import { NextResponse } from 'next/server';

// Nudge Library — these would normally live in Supabase.
// Seeded here for immediate functionality.
const NUDGE_LIBRARY = [
  // === Content Creation Nudges ===
  {
    id: "n-01",
    content: "Students understand better when you start with a real problem, then introduce the theory as the solution. Try the Problem-First approach!",
    category: "content_creation",
    trigger_context: "pre_generation",
  },
  {
    id: "n-02",
    content: "Research shows students retain 55% more when the same concept is presented in text + visual + interactive format. You've generated text — try adding an infographic too.",
    category: "content_creation",
    trigger_context: "post_generation",
  },
  {
    id: "n-03",
    content: "Students remember concepts 60% better when linked to a product they use daily. Try mentioning how this topic is used in apps like Instagram, Google Maps, or Spotify.",
    category: "content_creation",
    trigger_context: "pre_generation",
  },
  {
    id: "n-04",
    content: "Tip: Students in technical subjects retain 40% more when you include 'why this was invented' before 'how it works'. Enable the 'Origin Story' option!",
    category: "content_creation",
    trigger_context: "pre_generation",
  },

  // === Behavior / Classroom Nudges ===
  {
    id: "n-05",
    content: "Start today's class with a smile and a question: 'What's the most interesting thing you learned this week?'",
    category: "behavior",
    trigger_context: "dashboard",
  },
  {
    id: "n-06",
    content: "Students who hear 'What do you think?' at least 3 times per lecture report 40% higher satisfaction. Try asking before showing the answer.",
    category: "behavior",
    trigger_context: "dashboard",
  },
  {
    id: "n-07",
    content: "Making one mistake intentionally and asking students to catch it builds 3x more engagement than a perfect lecture. Try it today!",
    category: "behavior",
    trigger_context: "live_session",
  },
  {
    id: "n-08",
    content: "You've been explaining for a while. Consider pausing for questions or a quick activity to re-engage students.",
    category: "behavior",
    trigger_context: "live_session",
  },

  // === General Teaching Nudges ===
  {
    id: "n-09",
    content: "The best professors know 10x more than they present. The 'Deep Dive' panel has advanced subtopics — reviewing them takes 5 minutes and prepares you for any question.",
    category: "general",
    trigger_context: "dashboard",
  },
  {
    id: "n-10",
    content: "Great mentors share one personal experience per week. Consider telling your students about a time you struggled with this topic and how you overcame it.",
    category: "general",
    trigger_context: "dashboard",
  },
  {
    id: "n-11",
    content: "If a student doesn't understand your explanation, the problem isn't the student — it's the explanation. Try the 'Explain Differently' button to get alternative approaches.",
    category: "general",
    trigger_context: "post_generation",
  },
  {
    id: "n-12",
    content: "Quick win: Send your students a 1-line summary of today's key takeaway. It takes 10 seconds and reinforces learning.",
    category: "general",
    trigger_context: "live_session",
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // behavior, content_creation, general
    const context = searchParams.get("context"); // dashboard, pre_generation, post_generation, live_session

    let filtered = [...NUDGE_LIBRARY];

    if (category) {
      filtered = filtered.filter((n) => n.category === category);
    }
    if (context) {
      filtered = filtered.filter((n) => n.trigger_context === context);
    }

    if (filtered.length === 0) {
      return NextResponse.json({ nudge: null, message: "No nudges available for this context." });
    }

    // Pick a random nudge from the filtered list
    // In production, we'd check nudge_history in Supabase to avoid repeats
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const selectedNudge = filtered[randomIndex];

    return NextResponse.json({
      nudge: {
        id: selectedNudge.id,
        content: selectedNudge.content,
        category: selectedNudge.category,
      },
    });
  } catch (error) {
    console.error("Nudge API Error:", error);
    return NextResponse.json({ error: "Failed to fetch nudge" }, { status: 500 });
  }
}
