"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { m } from "framer-motion";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
} from "react";
import { tabIndicatorTransition } from "@/constants/motion";
import { cn } from "@/utils/cn";

interface TabsContextValue {
  activeValue?: string;
  groupId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps
  extends Omit<ComponentProps<typeof TabsPrimitive.Root>, "value" | "onValueChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Wraps Radix Tabs but always drives it as a controlled component
 * internally so the active value is readable in context — that's what lets
 * `TabsTrigger` render a `layoutId`-shared indicator that Framer Motion
 * slides between triggers instead of a hard cut.
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const activeValue = value ?? internalValue;
  const groupId = useId();

  const handleChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsPrimitive.Root
      value={activeValue}
      onValueChange={handleChange}
      className={cn(className)}
      {...props}
    >
      <TabsContext.Provider value={{ activeValue, groupId }}>
        {children}
      </TabsContext.Provider>
    </TabsPrimitive.Root>
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  children,
  value,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.activeValue === value;

  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "relative rounded-md px-3 py-1.5 text-body-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {isActive && (
        <m.span
          layoutId={`tabs-indicator-${ctx?.groupId}`}
          className="absolute inset-0 -z-10 rounded-md bg-background shadow-sm"
          transition={tabIndicatorTransition}
        />
      )}
      <span className="relative">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
