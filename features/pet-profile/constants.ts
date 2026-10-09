import { Bird, Cat, Dog, Fish, type LucideIcon } from "lucide-react";
import type { PetType } from "@/features/shop/types";
import type { Species } from "./types";

export interface SpeciesConfig {
  label: string;
  /** "dog", used in copy like "Tell us about your dog". */
  singular: string;
  icon: LucideIcon;
  /** The existing shop filter this species maps onto. */
  shopPetType: PetType;
  image: string;
  imageAlt: string;
  heroCopy: string;
  breeds: string[];
}

/** Shown last in every breed list, for mixed breeds and "I don't know". */
export const OTHER_BREED = "Mixed / not sure";

/**
 * Everything the homepage needs to re-skin itself per animal lives here.
 * Dogs use the client's own photography; cats, birds and fish use
 * Unsplash photos (free licence, hotlinked as Unsplash asks) until the
 * client supplies their own. Swapping one in is a one-line change to `image`.
 */
export const speciesConfig: Record<Species, SpeciesConfig> = {
  dogs: {
    label: "Dogs",
    singular: "dog",
    icon: Dog,
    shopPetType: "dogs",
    image: "/images/petzucutedog.jpeg",
    imageAlt: "A happy golden retriever cared for through PetZu",
    heroCopy:
      "Food, vet care, grooming and training advice for dogs of every breed and age, plus a community of dog parents who get it.",
    breeds: [
      "Indie",
      "Labrador Retriever",
      "Golden Retriever",
      "German Shepherd",
      "Beagle",
      "Shih Tzu",
      "Pug",
      "Pomeranian",
      "Siberian Husky",
      "Rottweiler",
      "Dachshund",
    ],
  },
  cats: {
    label: "Cats",
    singular: "cat",
    icon: Cat,
    shopPetType: "cats",
    image: "https://images.unsplash.com/photo-1558201496-a35f22e7fb5c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "A tabby cat looking up",
    heroCopy:
      "Food, litter, vet care and grooming for cats of every breed and age, plus a community of cat parents who have seen it all.",
    breeds: ["Indie", "Persian", "Siamese", "Maine Coon", "British Shorthair", "Bengal", "Ragdoll"],
  },
  birds: {
    label: "Birds",
    singular: "bird",
    icon: Bird,
    shopPetType: "birds",
    image: "https://images.unsplash.com/photo-1511823991948-4d877be80581?auto=format&fit=crop&w=900&q=80",
    imageAlt: "A green and yellow parrot perched on a branch",
    heroCopy:
      "Seed, cages, avian vets and enrichment ideas for budgies, parrots and every feathered friend in between.",
    breeds: [
      "Budgerigar",
      "Cockatiel",
      "Lovebird",
      "Indian Ringneck",
      "African Grey",
      "Sun Conure",
      "Cockatoo",
      "Finch",
    ],
  },
  fish: {
    label: "Fish",
    singular: "fish",
    icon: Fish,
    shopPetType: "aquatics",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80",
    imageAlt: "A red betta fish with flowing fins",
    heroCopy:
      "Tanks, food, water care and expert advice for freshwater and tropical fish, from a first bowl to a planted tank.",
    breeds: ["Goldfish", "Betta", "Guppy", "Molly", "Angelfish", "Tetra", "Koi", "Oscar"],
  },
};

export const speciesList = Object.keys(speciesConfig) as Species[];
