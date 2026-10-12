export type ProviderType = "vet" | "groomer" | "trainer" | "sitter";

export interface ProviderService {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Provider {
  id: string;
  slug: string;
  type: ProviderType;
  name: string;
  title: string;
  clinicName: string;
  bio: string;
  initials: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  location: {
    city: string;
    /** Neighbourhood within the city, e.g. "Bandra West". */
    area: string;
    distanceKm: number;
  };
  languages: string[];
  acceptsNewPatients: boolean;
  verified: boolean;
  services: ProviderService[];
}

export interface Pet {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Bird" | "Fish";
  breed: string;
  initials: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface FilterState {
  specialties: string[];
  minRating: number | null;
  availableOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  specialties: [],
  minRating: null,
  availableOnly: false,
};

export type SortOption = "recommended" | "rating" | "distance" | "price-asc";

export interface Booking {
  provider: Provider;
  service: ProviderService;
  pet: Pet;
  date: Date;
  time: string;
  notes: string;
}
