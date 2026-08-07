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
import { BookingFlow } from "@/features/services/components/booking";
import { providers } from "@/features/services/constants";
import { getProviderBySlug } from "@/features/services/utils";

interface BookPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
}

export function generateStaticParams() {
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider || !provider.acceptsNewPatients) {
    return buildMetadata({ title: "Booking unavailable", path: "/services" });
  }

  return buildMetadata({
    title: `Book with ${provider.name}`,
    path: `/services/providers/${provider.slug}/book`,
  });
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { slug } = await params;
  const { service: serviceId } = await searchParams;
  const provider = getProviderBySlug(slug);
  if (!provider || !provider.acceptsNewPatients) notFound();

  const service = provider.services.find((item) => item.id === serviceId) ?? provider.services[0];

  return (
    <Section spacing="sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/services/providers/${provider.slug}`}>{provider.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Book</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6">
        <h1 className="font-display text-display-lg text-foreground">Book with {provider.name}</h1>
      </div>

      <div className="mt-10">
        <BookingFlow provider={provider} service={service} />
      </div>
    </Section>
  );
}
