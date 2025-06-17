import { Message } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to create a system message
export function createSystemMessage(content: string): Message {
  return {
    role: "system",
    content,
  };
}

// Utility function to create a user message
export function createUserMessage(content: string): Message {
  return {
    role: "user",
    content,
  };
}

// Utility function to create an assistant message
export function createAssistantMessage(content: string): Message {
  return {
    role: "assistant",
    content,
  };
}
