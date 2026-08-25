import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ChatWidget } from "@/features/chatbot/components/chat-widget";
import { MotionProvider } from "./motion-provider";
import { ThemeProvider } from "./theme-provider";

/**
 * Single composition root for all app-wide providers. Root layout only
 * ever imports this, so adding a new provider never touches layout.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        {children}
        <Toaster />
        <ChatWidget />
      </MotionProvider>
    </ThemeProvider>
  );
}
