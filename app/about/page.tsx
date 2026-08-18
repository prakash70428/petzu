import type { Metadata } from "next";
import { Heart, ShieldCheck, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/constants/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  path: "/about",
  description: "Why The PetZu World exists, and what we're building for pet parents.",
});

const values = [
  {
    icon: ShieldCheck,
    title: "Vetted, not just listed",
    description: "Every product and provider on PetZu is reviewed before it reaches you. No pay-to-rank shelf space.",
  },
  {
    icon: Truck,
    title: "Care that shows up",
    description: "Same-day delivery, same-day vet visits. Pet emergencies don't wait, so neither do we.",
  },
  {
    icon: Users,
    title: "Built with pet parents",
    description: "Every feature started as a complaint from someone who couldn't find a decent vet at 9pm on a Sunday.",
  },
];

export default function AboutPage() {
  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-display-lg text-foreground">
            Pet care shouldn&apos;t feel like a second job.
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            The PetZu World started with a simple frustration: finding a trustworthy vet, a decent
            groomer, and food that wasn&apos;t secretly bad for your pet meant juggling a dozen apps and
            forum threads. We built one place instead.
          </p>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Today that&apos;s vetted products, licensed vets and groomers you can book directly, and a
            community of pet parents comparing notes. Same mission, more places to find it.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/shop">Explore the shop</Link>
          </Button>
        </div>

        <div className="relative mx-auto aspect-[705/1280] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-lg">
          <Image
            src="/images/petzucutedog.jpeg"
            alt="A happy golden retriever, the kind of good boy PetZu was built for"
            fill
            sizes="(min-width: 1024px) 24rem, 90vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border p-card-lg">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-heading-4 font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-card-lg text-center">
        <Heart className="size-6 text-destructive" aria-hidden />
        <p className="max-w-md text-body-sm text-muted-foreground">
          Have a pet story, a complaint, or a feature idea? We read everything that comes through{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            the contact page
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
