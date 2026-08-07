import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqCategory } from "../types";

export function FaqAccordion({ category }: { category: FaqCategory }) {
  return (
    <div>
      <h2 className="text-heading-4 font-semibold text-foreground">{category.title}</h2>
      <Accordion type="multiple" className="mt-4">
        {category.items.map((item, index) => (
          <AccordionItem key={index} value={`${category.title}-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
