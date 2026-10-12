"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCommunityPosts } from "@/features/community/api";
import type { CommunityPostView } from "@/features/community/schema";
import { speciesConfig } from "@/features/pet-profile/constants";
import { usePetProfileState } from "@/features/pet-profile/store";

/**
 * Sits right under the hero (client feedback: the community shouldn't feel
 * less important than the shop). Shows real questions from the board for
 * the animal the visitor picked; until there are any, it shows the kind of
 * question people ask, clearly as prompts, never as invented posts.
 */
export function Community() {
  const profile = usePetProfileState();
  const activePet = profile.pets.find((pet) => pet.id === profile.activeId);
  const species = activePet?.species ?? profile.browsingSpecies;
  const config = speciesConfig[species];
  const [posts, setPosts] = useState<CommunityPostView[]>([]);

  useEffect(() => {
    if (!profile.hydrated) return;
    let cancelled = false;
    fetchCommunityPosts(species)
      .then((data) => !cancelled && setPosts(data.slice(0, 3)))
      .catch(() => !cancelled && setPosts([]));
    return () => {
      cancelled = true;
    };
  }, [species, profile.hydrated]);

  const prompts = [
    `Which vet near me is actually good with ${config.label.toLowerCase()}?`,
    `Is this ${config.singular} food even any good?`,
    `Who's a groomer or sitter you'd trust with your ${config.singular}?`,
  ];

  return (
    <Section className="bg-secondary/40">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <Badge variant="outline">Community</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Ask {config.singular} parents who&apos;ve been there
          </h2>
          <p className="mt-3 max-w-lg text-body-lg text-muted-foreground">
            The PetZu community started with two questions: is this vet actually good, and is this food even any
            good? Ask yours with just your name and email.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="gradient" size="lg">
              <Link href={`/community?pet=${species}#ask`}>Ask a question</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/community?pet=${species}`}>Read the board</Link>
            </Button>
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-background">
          {posts.length > 0
            ? posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/community?pet=${post.species}`}
                    className="group flex items-start gap-4 p-5 transition-colors hover:bg-primary/5"
                  >
                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span className="flex-1">
                      <span className="block font-medium text-foreground">{post.title}</span>
                      <span className="mt-1 block text-caption text-muted-foreground">
                        {post.topic} · {post.replies.length} {post.replies.length === 1 ? "answer" : "answers"}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))
            : prompts.map((prompt) => (
                <li key={prompt}>
                  <Link
                    href={`/community?pet=${species}#ask`}
                    className="group flex items-start gap-4 p-5 transition-colors hover:bg-primary/5"
                  >
                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span className="flex-1 font-medium text-foreground">{prompt}</span>
                    <span className="shrink-0 text-caption font-medium text-primary">Ask</span>
                  </Link>
                </li>
              ))}
        </ul>
      </div>
    </Section>
  );
}
