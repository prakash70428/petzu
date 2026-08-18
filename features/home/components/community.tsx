import { Heart, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { communityPosts } from "../constants";

export function Community() {
  return (
    <Section className="bg-secondary/40">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Community</Badge>
          <h2 className="mt-4 font-display text-display-lg text-foreground">
            Fresh from the community
          </h2>
          <p className="mt-3 max-w-lg text-body-lg text-muted-foreground">
            The reviews above come from real bookings. This is where those same
            pet parents keep talking: 340,000+ people swapping tips, wins, and
            the occasional 2am panic post.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link href="/community">
            <Users className="size-4" aria-hidden />
            Join the community
          </Link>
        </Button>
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {communityPosts.map((post) => (
          <RevealItem key={post.author}>
            <Card interactive className="flex h-full flex-col gap-4 p-card-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{post.initials}</AvatarFallback>
                  </Avatar>
                  <p className="text-body-sm font-semibold text-foreground">{post.author}</p>
                </div>
                <Badge variant="secondary">{post.tag}</Badge>
              </div>
              <p className="flex-1 text-body-sm text-muted-foreground">{post.content}</p>
              <div className="flex items-center gap-4 border-t border-border pt-4 text-caption text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="size-3.5" aria-hidden /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-3.5" aria-hidden /> Reply
                </span>
              </div>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
