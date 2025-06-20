// File: src/app/api/user/route.ts

import { NextResponse } from 'next/server';

// ===================================================================
//  Handles GET requests (for your dashboard)
// ===================================================================
export async function GET(req: Request) {
  try {
    // This is a placeholder for the data your dashboard expects.
    // We are returning some dummy data to make the dashboard load correctly.
    const dashboardData = {
      user: {
        name: "Amine Ach",
        email: "amine@example.com",
      },
      stats: {
        documentsGenerated: 5,
        lastLogin: new Date().toISOString(),
      }
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Error in GET /api/user:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data.' }, { status: 500 });
  }
}


// ===================================================================
//  Handles POST requests (for our new Policy Generator)
// ===================================================================
export async function POST(req: Request) {
  try {
    // 1. SECURELY GET THE API KEY
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key is not configured.' }, { status: 500 });
    }

    // 2. GET THE USER'S PROMPT FROM THE FRONTEND
    const body = await req.json();
    const userInput = body.prompt;

    if (!userInput) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    // 3. CALL THE OPENROUTER API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3-8b-instruct", 
        "messages": [
          { "role": "system", "content": "You are an expert at writing professional policy documents." },
          { "role": "user", "content": userInput }
        ]
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenRouter API Error:", errorData);
        return NextResponse.json({ error: 'Failed to fetch response from OpenRouter.', details: errorData }, { status: response.status });
    }

    // 4. SEND THE AI'S RESPONSE BACK TO THE FRONTEND
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in POST /api/user:", error);
    return NextResponse.json({ error: 'An unexpected error occurred during policy generation.' }, { status: 500 });
  }
}