"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Settings,
  Zap,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { sendPromptToAI } from "@/ai/actions";
// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ChatSettings {
  temperature: number;
  maxTokens: number;
  systemMessage: string;
}

// AI Chat Hook
function useAIChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      prompt,
      settings,
    }: {
      prompt: string;
      settings: ChatSettings;
    }) => {
      const result = await sendPromptToAI(prompt, {
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemMessage: settings.systemMessage || undefined,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to get AI response");
      }

      return {
        content: result.data!,
        usage: result.usage,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-chat"] });
    },
  });
}

// Message Component
function ChatMessage({
  message,
  onCopy,
}: {
  message: Message;
  onCopy: (content: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`group flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
        message.role === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className="w-8 h-8 ring-2 ring-background shadow-sm">
        <AvatarFallback
          className={
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }
        >
          {message.role === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex-1 space-y-2 max-w-[85%] ${
          message.role === "user" ? "text-right" : ""
        }`}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">
            {message.role === "user" ? "You" : "AI Assistant"}
          </span>
          <span>•</span>
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.usage && (
            <>
              <span>•</span>
              <Badge variant="outline" className="text-xs py-0 px-1.5">
                <Zap className="w-3 h-3 mr-1" />
                {message.usage.total_tokens}
              </Badge>
            </>
          )}
        </div>

        <div className="relative group">
          <Card
            className={`transition-all duration-200 hover:shadow-md ${
              message.role === "user"
                ? "bg-primary text-primary-foreground border-primary/20 shadow-primary/10"
                : "bg-card border-border/50 hover:border-border"
            }`}
          >
            <CardContent className="p-4 relative">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>

              {/* Copy button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.role === "user"
                          ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy message"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main Chat Component
export function AIChatSheet() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 0.7,
    maxTokens: 1000,
    systemMessage: "You are a helpful AI assistant.",
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const aiChatMutation = useAIChat();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || aiChatMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await aiChatMutation.mutateAsync({
        prompt: inputValue.trim(),
        settings,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        usage: response.usage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const totalTokens = messages.reduce(
    (sum, msg) => sum + (msg.usage?.total_tokens || 0),
    0
  );

  return (
    <TooltipProvider>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Test AI Chat
            <Sparkles className="w-3 h-3 opacity-60" />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col max-h-screen">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                  AI Assistant
                </SheetTitle>
                <SheetDescription className="text-sm">
                  Test your AI model integration
                </SheetDescription>
              </div>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                      className="h-8 w-8 p-0"
                    >
                      <Settings
                        className={`w-4 h-4 transition-transform ${
                          showSettings ? "rotate-90" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      disabled={messages.length === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear chat</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Stats */}
            {messages.length > 0 && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <span>{messages.length} messages</span>
                {totalTokens > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {totalTokens} tokens
                    </span>
                  </>
                )}
              </div>
            )}
          </SheetHeader>

          {/* Settings Panel */}
          <Collapsible open={showSettings} onOpenChange={setShowSettings}>
            <CollapsibleContent className="px-6 pb-4">
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center justify-between">
                      Temperature
                      <span className="font-mono text-xs">
                        {settings.temperature}
                      </span>
                    </Label>
                    <Slider
                      value={[settings.temperature]}
                      onValueChange={([value]) =>
                        setSettings((prev) => ({ ...prev, temperature: value }))
                      }
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Max Tokens</Label>
                    <Input
                      type="number"
                      value={settings.maxTokens}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          maxTokens: parseInt(e.target.value) || 1000,
                        }))
                      }
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      System Message
                    </Label>
                    <Textarea
                      value={settings.systemMessage}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          systemMessage: e.target.value,
                        }))
                      }
                      placeholder="You are a helpful assistant..."
                      className="min-h-[60px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
            <div className="space-y-6 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[280px]">
                    Ask me anything! I&apos;m here to help with questions,
                    creative tasks, analysis, and more.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onCopy={copyToClipboard}
                  />
                ))
              )}

              {aiChatMutation.isPending && (
                <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <Avatar className="w-8 h-8 ring-2 ring-background shadow-sm">
                    <AvatarFallback className="bg-muted">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="max-w-[85%]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI is thinking...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {aiChatMutation.error && (
            <div className="px-6 pb-4">
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  {aiChatMutation.error instanceof Error
                    ? aiChatMutation.error.message
                    : "An error occurred"}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Input Form */}
          <div className="p-6 pt-4 bg-background/80 backdrop-blur-sm border-t">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  disabled={aiChatMutation.isPending}
                  className="resize-none min-h-[44px] max-h-[120px] pr-12 text-sm"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || aiChatMutation.isPending}
                  size="sm"
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                >
                  {aiChatMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">deepseek-r1-0528:free</span>
                <span>Press Shift+Enter for new line</span>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
