"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Next13ProgressBar } from "next13-progressbar";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Next13ProgressBar
        height="3px"
        color="#FF007F"
        options={{ showSpinner: false }}
        showOnShallow
      />
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
