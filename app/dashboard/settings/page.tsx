"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/features/auth/components";
import { passwordChangeSchema } from "@/features/auth/schemas";
import { logout } from "@/features/auth/store";
import { PageHeader } from "@/features/dashboard/components";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

const notificationPrefs = [
  { id: "order-updates", label: "Order updates", description: "Shipping and delivery notifications." },
  { id: "appointment-reminders", label: "Appointment reminders", description: "Reminders 24 hours before a visit." },
  { id: "product-recommendations", label: "Product recommendations", description: "Occasional picks for your pets." },
  { id: "community-replies", label: "Community replies", description: "When someone replies to your posts." },
];

export default function SettingsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    "order-updates": true,
    "appointment-reminders": true,
    "product-recommendations": false,
    "community-replies": true,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);

  const passwordForm = useForm({
    schema: passwordChangeSchema,
    initialValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast({ title: "Password updated", description: "Use your new password next time you sign in.", variant: "success" });
    },
  });

  function handleDeleteAccount() {
    logout();
    toast({ title: "Account deleted", description: "Your demo account has been cleared.", variant: "default" });
    router.push("/");
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your password, notifications, and account." />

      <div className="flex flex-col gap-6">
        <Card className="p-card-lg">
          <h2 className="font-semibold text-foreground">Change password</h2>
          <form onSubmit={passwordForm.handleSubmit} className="mt-4 flex max-w-lg flex-col gap-4">
            <FormField label="Current password" htmlFor="currentPassword" error={passwordForm.errors.currentPassword}>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={passwordForm.values.currentPassword}
                onChange={(event) => passwordForm.setField("currentPassword", event.target.value)}
                variant={passwordForm.errors.currentPassword ? "error" : "default"}
              />
            </FormField>
            <FormField label="New password" htmlFor="newPassword" error={passwordForm.errors.newPassword}>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                showStrength
                value={passwordForm.values.newPassword}
                onChange={(event) => passwordForm.setField("newPassword", event.target.value)}
                variant={passwordForm.errors.newPassword ? "error" : "default"}
              />
            </FormField>
            <FormField
              label="Confirm new password"
              htmlFor="confirmNewPassword"
              error={passwordForm.errors.confirmNewPassword}
            >
              <PasswordInput
                id="confirmNewPassword"
                autoComplete="new-password"
                value={passwordForm.values.confirmNewPassword}
                onChange={(event) => passwordForm.setField("confirmNewPassword", event.target.value)}
                variant={passwordForm.errors.confirmNewPassword ? "error" : "default"}
              />
            </FormField>
            <div>
              <Button type="submit" disabled={passwordForm.isSubmitting}>
                {passwordForm.isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-card-lg">
          <h2 className="font-semibold text-foreground">Email notifications</h2>
          <div className="mt-4 flex flex-col gap-4">
            {notificationPrefs.map((pref) => (
              <div key={pref.id} className="flex items-start gap-2.5">
                <Checkbox
                  id={pref.id}
                  className="mt-0.5"
                  checked={prefs[pref.id]}
                  onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, [pref.id]: checked === true }))}
                />
                <div>
                  <Label htmlFor={pref.id} className="cursor-pointer">
                    {pref.label}
                  </Label>
                  <p className="text-caption text-muted-foreground">{pref.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-destructive/30 p-card-lg">
          <h2 className="font-semibold text-foreground">Danger zone</h2>
          <Alert variant="destructive" title="Delete account" className="mt-4">
            This permanently removes your account, saved pets, and order history. This can&apos;t be undone.
          </Alert>
          <Button variant="destructive" className="mt-4" onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </Card>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This clears your demo session and all locally stored data. You can sign back in at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Yes, delete it
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
