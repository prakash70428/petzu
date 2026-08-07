import {
  BlogPreview,
  Categories,
  Community,
  FeaturedProducts,
  Hero,
  Newsletter,
  Services,
  Stats,
  Testimonials,
  TrustedBrands,
  VetBooking,
  WhyPetzu,
} from "@/features/home/components";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <TrustedBrands />
      <Services />
      <Categories />
      <FeaturedProducts />
      <VetBooking />
      <WhyPetzu />
      <Testimonials />
      <Community />
      <BlogPreview />
      <Newsletter />
    </>
  );
}
