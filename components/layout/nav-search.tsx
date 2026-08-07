"use client";

import { AnimatePresence, m } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Expands inline on click rather than routing straight to a dedicated search page — one less navigation for the common case of a quick search. */
export function NavSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
    setValue("");
  }

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false}>
        {open && (
          <m.form
            onSubmit={handleSubmit}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Input
              autoFocus
              type="search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="h-9 w-[200px]"
            />
          </m.form>
        )}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-label={open ? "Close search" : "Open search"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X /> : <Search />}
      </Button>
    </div>
  );
}
