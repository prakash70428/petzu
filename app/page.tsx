import {
  BlogPreview,
  Categories,
  Community,
  FeaturedProducts,
  Hero,
  LifestyleGallery,
  Newsletter,
  Services,
  Testimonials,
  VetBooking,
  WhyPetzu,
} from "@/features/home/components";

export default function Home() {
  return (
    <>
      <Hero />
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
