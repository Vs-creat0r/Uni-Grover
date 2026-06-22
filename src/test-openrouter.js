async function test() {
  const topic = "Basic Terminologies: Vulnerability, Threat, Exploit, Attack";
  const audience = "Beginner";
  const includeEthics = false;
  
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer YOUR_API_KEY_HERE`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate the lesson JSON for: ${topic}` }
      ]
    })
  });
  
  console.log(response.status);
  const text = await response.text();
  console.log(text);
}

test();
