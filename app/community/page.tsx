import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { CommunityBoard } from "@/features/community/components/community-board";
import { isCommunitySpecies } from "@/features/community/schema";

export const metadata: Metadata = buildMetadata({
  title: "Community",
  path: "/community",
  description: "Ask other pet parents which vet, food or groomer actually worked for them.",
});

const houseRules = [
  "Share what actually happened with your pet, not what you read somewhere.",
  "No sales pitches or affiliate links.",
  "For anything urgent, call a vet first. The board is for experience, not emergencies.",
];

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ pet?: string }> }) {
  const { pet } = await searchParams;

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Community</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-display-lg text-foreground">
            Is this vet actually good? Is this food even any good?
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            That&apos;s what our community started out asking. Ask other pet parents about vets, food, groomers and
            everything in between, and share what has actually worked for your pet.
          </p>
        </div>
        <ul className="flex max-w-sm flex-col gap-2 text-body-sm text-muted-foreground">
          {houseRules.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <CommunityBoard initialSpecies={isCommunitySpecies(pet) ? pet : undefined} />
      </div>

      <p className="mt-12 text-center text-body-sm text-muted-foreground">
        Looking for a quick answer?{" "}
        <Link href="/guides" className="font-medium text-primary hover:underline">
          Browse the care guides
        </Link>
      </p>
    </Section>
  );
}
