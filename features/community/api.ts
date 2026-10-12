import { apiClient } from "@/services/api-client";
import type { CommunityPostView, CommunitySpecies, NewPost, NewReply } from "./schema";

export function fetchCommunityPosts(species?: CommunitySpecies) {
  const query = species ? `?species=${species}` : "";
  return apiClient<{ data: CommunityPostView[] }>(`/api/community${query}`).then((res) => res.data);
}

export function createCommunityPost(post: NewPost) {
  return apiClient<{ data: { id: string } }>("/api/community", { method: "POST", body: JSON.stringify(post) });
}

export function createCommunityReply(postId: string, reply: NewReply) {
  return apiClient<{ data: { id: string } }>(`/api/community/${postId}/replies`, {
    method: "POST",
    body: JSON.stringify(reply),
  });
}
