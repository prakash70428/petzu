"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
      className="flex size-8 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-100 backdrop-blur-sm transition-all duration-200 ease-premium hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  );
}
