import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

const STEPS = ["Pet", "Date & time", "Confirm"];

export interface BookingStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function BookingStepper({ currentStep, onStepClick }: BookingStepperProps) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={index > currentStep}
              onClick={() => onStepClick(index)}
              className={cn("flex items-center gap-2", index <= currentStep ? "cursor-pointer" : "cursor-not-allowed")}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-caption font-semibold transition-colors duration-150",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-border text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-body-sm font-medium sm:inline",
                  isCurrent || isComplete ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div className={cn("mx-3 h-px flex-1 transition-colors duration-150", isComplete ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
