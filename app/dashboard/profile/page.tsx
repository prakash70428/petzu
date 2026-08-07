"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "@/features/auth/schemas";
import { updateUser, useSession } from "@/features/auth/store";
import { getInitials } from "@/features/auth/utils";
import { PageHeader } from "@/features/dashboard/components";
import { PageSkeleton } from "@/features/dashboard/components";
import { formatDate } from "@/features/dashboard/utils";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const session = useSession();
  const user = session.user;

  // The shell already gates on auth, but this page reads `user` directly —
  // render the skeleton rather than crashing during the hydration frame.
  if (!user) return <PageSkeleton />;

  return <ProfileForm key={user.email} initialUser={user} />;
}

function ProfileForm({ initialUser }: { initialUser: NonNullable<ReturnType<typeof useSession>["user"]> }) {
  const { values, errors, setField, handleSubmit, isSubmitting } = useForm({
    schema: profileSchema,
    initialValues: {
      name: initialUser.name,
      email: initialUser.email,
      bio: initialUser.bio ?? "",
    },
    onSubmit: async (submitted) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateUser({
        name: submitted.name,
        email: submitted.email,
        bio: submitted.bio,
        initials: getInitials(submitted.name),
      });
      toast({ title: "Profile updated", description: "Your changes have been saved.", variant: "success" });
    },
  });

  return (
    <>
      <PageHeader title="Profile" description="How you appear across PetZu." />

      <Card className="p-card-lg">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Avatar size="xl">
            <AvatarFallback>{getInitials(values.name || initialUser.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{initialUser.name}</p>
            <p className="text-caption text-muted-foreground">
              Member since {formatDate(initialUser.memberSince)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
          <FormField label="Full name" htmlFor="name" error={errors.name}>
            <Input
              id="name"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              variant={errors.name ? "error" : "default"}
            />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              variant={errors.email ? "error" : "default"}
            />
          </FormField>
          <FormField
            label="Bio"
            htmlFor="bio"
            error={errors.bio}
            helperText={`${values.bio?.length ?? 0}/160 characters`}
          >
            <Textarea
              id="bio"
              rows={3}
              value={values.bio}
              onChange={(event) => setField("bio", event.target.value)}
              variant={errors.bio ? "error" : "default"}
            />
          </FormField>
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
