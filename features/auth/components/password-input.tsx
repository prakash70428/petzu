"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { getPasswordStrength } from "../utils";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showStrength?: boolean;
}

export function PasswordInput({ showStrength = false, value, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength && typeof value === "string" && value.length > 0 ? getPasswordStrength(value) : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Input type={visible ? "text" : "password"} value={value} className={cn("pr-10", className)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {strength && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-200",
                  step <= strength.score - 1 ? strengthColor(strength.score) : "bg-muted",
                )}
              />
            ))}
          </div>
          <span className="text-caption text-muted-foreground">{strength.label}</span>
        </div>
      )}
    </div>
  );
}

function strengthColor(score: number) {
  if (score <= 1) return "bg-destructive";
  if (score === 2) return "bg-warning";
  if (score === 3) return "bg-info";
  return "bg-success";
}
