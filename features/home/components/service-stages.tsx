import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { serviceStages, services, type ServiceItem } from "../constants";

export interface ServiceStagesProps {
  /** Show each service's one-line description (the /services hub does; the homepage stays compact). */
  detailed?: boolean;
  /** Extra line under a service, e.g. a provider count on the hub. */
  renderMeta?: (service: ServiceItem) => ReactNode;
  className?: string;
}

/**
 * Services grouped by where they fall in a pet's life, as four columns of
 * plain links instead of a grid of identical cards. Shared by the homepage
 * and the /services hub so the order can never drift between them.
 */
export function ServiceStages({ detailed = false, renderMeta, className }: ServiceStagesProps) {
  return (
    <ol className={cn("grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8", className)}>
      {serviceStages.map((stage, index) => (
        <li key={stage.key} className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <span className="font-display text-heading-3 text-primary">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{stage.title}</h3>
          </div>
          <ul className="mt-2 flex flex-col">
            {services
              .filter((service) => service.stage === stage.key)
              .map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-3 transition-colors duration-200 ease-premium hover:bg-accent"
                    >
                      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5 font-semibold text-foreground">
                          {service.title}
                          <ArrowRight
                            className="size-3.5 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                            aria-hidden
                          />
                        </span>
                        {detailed && (
                          <span className="mt-0.5 block text-body-sm text-muted-foreground">{service.description}</span>
                        )}
                        {renderMeta?.(service)}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ol>
  );
}
