import { z } from "zod";

/** The animals PetZu personalises for (features/pet-profile). */
export const communitySpecies = ["dogs", "cats", "birds", "fish"] as const;
export type CommunitySpecies = (typeof communitySpecies)[number];

/**
 * Topics follow the two questions the community started with ("is this vet
 * actually good?", "is this food even any good?") plus the other things pet
 * parents ask each other most.
 */
export const communityTopics = ["Vets", "Food", "Health", "Grooming", "Training", "Adoption", "Other"] as const;
export type CommunityTopic = (typeof communityTopics)[number];

const author = {
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(200),
};

export const newPostSchema = z.object({
  ...author,
  species: z.enum(communitySpecies, { message: "Choose an animal" }),
  topic: z.enum(communityTopics, { message: "Choose a topic" }),
  title: z.string().trim().min(10, "Ask your question in at least 10 characters").max(160),
  body: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type NewPost = z.infer<typeof newPostSchema>;

export const newReplySchema = z.object({
  ...author,
  body: z.string().trim().min(2, "Write a reply").max(2000),
});
export type NewReply = z.infer<typeof newReplySchema>;

export function isCommunitySpecies(value: string | null | undefined): value is CommunitySpecies {
  return communitySpecies.includes(value as CommunitySpecies);
}

/** Public shape of a post: never includes the author's email. */
export interface CommunityReplyView {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CommunityPostView {
  id: string;
  authorName: string;
  species: CommunitySpecies;
  topic: CommunityTopic;
  title: string;
  body: string;
  createdAt: string;
  replies: CommunityReplyView[];
}
