import {
  BlogPreview,
  Categories,
  Community,
  FeaturedProducts,
  Hero,
  LifestyleGallery,
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
      <VetBooking />
      <Categories />
      <FeaturedProducts />
      <WhyPetzu />
      <LifestyleGallery />
      <Testimonials />
      <Community />
      <BlogPreview />
      <Newsletter />
    </>
  );
}
