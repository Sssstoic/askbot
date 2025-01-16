// Importing the OpenAI SDK to interact with OpenAI models
import { OpenAI } from 'openai';

// Initialize OpenAI instance with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key for accessing OpenAI
});

/**
 * Handle the POST request to interact with OpenAI's API and return the response.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Response} - The HTTP response, either with a generated answer or an error message.
 */
export async function POST(req) {
  // Extract the question from the JSON body of the incoming request
  const { question } = await req.json();

  try {
    // Make a call to the OpenAI API to get a completion for the question
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // The OpenAI model to use for generating the response
      messages: [
        // The system message to set the assistant's behavior
        { role: "system", content: "You are a helpful assistant." },
        // The user's question
        { role: "user", content: question },
      ],
    });

    // Return the OpenAI response as a JSON object with a 200 status code (OK)
    return new Response(JSON.stringify(completion), { status: 200 });
  } catch (error) {
    // If there's an error during the API call, log the error and return a 500 status (Internal Server Error)
    console.error("Error from OpenAI:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
