"use server";

import {
  AIResponse,
  Message,
  OpenRouterRequest,
  OpenRouterResponse,
} from "@/types";

// Environment variables validation
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "My AI App";

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable is required");
}

/**
 * Send a prompt to the AI model and get a response
 * @param prompt - The user's prompt/question
 * @param options - Optional parameters for the AI request
 * @returns Promise<AIResponse> - The AI's response or error
 */
export async function sendPromptToAI(
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    systemMessage?: string;
  } = {}
): Promise<AIResponse> {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return {
        success: false,
        error: "Prompt cannot be empty",
      };
    }

    // Prepare messages array
    const messages: Message[] = [];

    // Add system message if provided
    if (options.systemMessage) {
      messages.push({
        role: "system",
        content: options.systemMessage,
      });
    }

    // Add user message
    messages.push({
      role: "user",
      content: prompt.trim(),
    });

    // Prepare request body
    const requestBody: OpenRouterRequest = {
      model: options.model || "deepseek/deepseek-r1-0528:free",
      messages,
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
      ...(options.temperature !== undefined && {
        temperature: options.temperature,
      }),
      ...(options.topP !== undefined && { top_p: options.topP }),
    };

    // Make API request
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", response.status, errorText);

      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    // Parse response
    const data: OpenRouterResponse = await response.json();

    // Extract the AI's response
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return {
        success: false,
        error: "No response content received from AI",
      };
    }

    return {
      success: true,
      data: aiMessage,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error in sendPromptToAI:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send a conversation (multiple messages) to the AI model
 * @param messages - Array of conversation messages
 * @param options - Optional parameters for the AI request
 * @returns Promise<AIResponse> - The AI's response or error
 */
export async function sendConversationToAI(
  messages: Message[],
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  } = {}
): Promise<AIResponse> {
  try {
    // Validate input
    if (!messages || messages.length === 0) {
      return {
        success: false,
        error: "Messages array cannot be empty",
      };
    }

    // Prepare request body
    const requestBody: OpenRouterRequest = {
      model: options.model || "deepseek/deepseek-r1-0528:free",
      messages,
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
      ...(options.temperature !== undefined && {
        temperature: options.temperature,
      }),
      ...(options.topP !== undefined && { top_p: options.topP }),
    };

    // Make API request
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", response.status, errorText);

      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    // Parse response
    const data: OpenRouterResponse = await response.json();

    // Extract the AI's response
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return {
        success: false,
        error: "No response content received from AI",
      };
    }

    return {
      success: true,
      data: aiMessage,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error in sendConversationToAI:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
