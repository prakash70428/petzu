import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";

export interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

/**
 * A Server Component, deliberately — shiki highlights at render time on
 * the server and ships plain HTML with inline colors, so zero highlighter
 * JS (grammars, themes, the WASM engine) ever reaches the client bundle.
 * Only the copy button is a client island.
 */
export async function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="group relative my-8 overflow-hidden rounded-xl border border-border">
      {filename && (
        <div className="border-b border-border bg-muted px-4 py-2 text-caption text-muted-foreground">
          <span className="font-mono">{filename}</span>
        </div>
      )}
      <div className="relative">
        <div className="absolute right-3 top-3 z-10">
          <CopyButton code={code} />
        </div>
        <div
          className="overflow-x-auto text-body-sm [&>pre]:p-4 [&>pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
