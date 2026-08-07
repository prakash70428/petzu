import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buildMetadata } from "@/constants/seo";
import { ProviderDetail } from "@/features/services/components";
import { providers } from "@/features/services/constants";
import { getProviderBySlug } from "@/features/services/utils";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) return buildMetadata({ title: "Provider not found", path: "/services" });

  return buildMetadata({
    title: provider.name,
    path: `/services/providers/${provider.slug}`,
    description: provider.bio,
  });
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) notFound();

  const listingHref = provider.type === "vet" ? "/services/vet-booking" : "/services/grooming";
  const listingLabel = provider.type === "vet" ? "Vet booking" : "Grooming";

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={listingHref}>{listingLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{provider.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8">
        <ProviderDetail provider={provider} />
      </div>
    </Section>
  );
}
