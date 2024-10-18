import { OpenAI } from 'openai'; // Modify the import

// Initialize OpenAI client directly
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided.' });
  }

  try {
    const prompt = `Summarize the following PubMed article: ${input}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    const summary = response.choices[0].message.content.trim();
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Error generating summary.' });
  }
}
