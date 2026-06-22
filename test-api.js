const topic = 'BasicTerminologies: Vulnerability, Threat, Exploit, Attack';
const systemPrompt = `You are an expert professor with 20 years of experience.
Your goal is to explain complex topics in a way that builds curiosity, deep understanding, and practical application.
The user wants to learn about: ${topic}
Target Audience: Intermediate

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

fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY_HERE',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openrouter/free',
    response_format: { type: { type: 'json_object' } }, // Some models need correct format or ignore it
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate the lesson JSON for: ${topic}` }
    ]
  })
}).then(r => r.json()).then(data => {
  const contentString = data.choices[0].message.content;
  console.log('CONTENT STRING:', contentString);
  try {
    const json = JSON.parse(contentString);
    console.log('JSON PARSED SUCCESSFULLY');
  } catch (e) {
    console.error('JSON PARSE ERROR:', e.message);
  }
}).catch(console.error);
