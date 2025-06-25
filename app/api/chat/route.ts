import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const ollama = createOllama(
//     {
//   baseURL: 'http://localhost:11434/api',
// }
);


const model = ollama("phi3:mini")

export async function POST(request: Request) {
 
  try {
    const { messages } = await request.json();

    const response =  streamText({
        model: model,
        messages,
    })

    // Handle the response from the AI model
    // This will stream the response back to the client
    return response.toDataStreamResponse()
   
  } catch (error) {
    console.error('Error in chat route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}