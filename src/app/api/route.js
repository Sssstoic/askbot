import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { question } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question },
      ],
    });

    return new Response(JSON.stringify(completion), { status: 200 });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
