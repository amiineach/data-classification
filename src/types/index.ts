export type Organization = {
  id: string;
  title: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
  created_at: string; // ISO string
  updated_at: string; // ISO string
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
