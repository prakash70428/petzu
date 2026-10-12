import {
  BlogPreview,
  Categories,
  Community,
  FeaturedProducts,
  Hero,
  LifestyleGallery,
  Newsletter,
  Services,
  VetBooking,
  WhyPetzu,
} from "@/features/home/components";
import { ForSpecies } from "@/features/pet-profile/components";

/**
 * Order follows the client's priorities: services and the community come
 * straight after the hero, the shop after them (it links out to Amazon).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Community />
      <VetBooking />
      <WhyPetzu />
      <Categories />
      <FeaturedProducts />
      {/* The gallery is the client's own dog photography. */}
      <ForSpecies species="dogs">
        <LifestyleGallery />
      </ForSpecies>
      <BlogPreview />
      <Newsletter />
    </>
  );
}
