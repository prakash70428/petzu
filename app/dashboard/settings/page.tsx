"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/features/auth/components";
import { passwordChangeSchema } from "@/features/auth/schemas";
import { logout } from "@/features/auth/store";
import { useAccountActions } from "@/features/account/hooks";
import { useConsent } from "@/features/consent/hooks";
import { PageHeader } from "@/features/dashboard/components";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const consent = useConsent();
  const account = useAccountActions();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const passwordForm = useForm({
    schema: passwordChangeSchema,
    initialValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast({ title: "Password updated", description: "Use your new password next time you sign in.", variant: "success" });
    },
  });

  async function handleDeleteAccount() {
    const succeeded = await account.deleteAccount();
    if (!succeeded) return;

    setDeleteOpen(false);
    logout();
    toast({ title: "Account deleted", description: "Your PetZu account and its data have been removed.", variant: "default" });
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
          <h2 className="font-semibold text-foreground">Communication preferences</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Choose what we can contact you about, and on which channel. Nothing is sent unless you turn it on here.
          </p>

          {consent.loading ? (
            <p className="mt-4 text-caption text-muted-foreground">Loading your preferences...</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr>
                    <th className="pb-2 text-left text-caption font-medium text-muted-foreground">Purpose</th>
                    {consent.channels.map((channel) => (
                      <th key={channel.id} className="w-20 pb-2 text-center text-caption font-medium text-muted-foreground">
                        {channel.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consent.purposes.map((purpose) => (
                    <tr key={purpose.id} className="border-t border-border">
                      <td className="py-3 pr-4">
                        <p className="text-foreground">{purpose.label}</p>
                        <p className="text-caption text-muted-foreground">{purpose.description}</p>
                      </td>
                      {consent.channels.map((channel) => {
                        const id = `consent-${channel.id}-${purpose.id}`;
                        return (
                          <td key={channel.id} className="text-center align-middle">
                            <Checkbox
                              id={id}
                              aria-label={`${channel.label} for ${purpose.label}`}
                              checked={consent.isGranted(channel.id, purpose.id)}
                              disabled={consent.isPending(channel.id, purpose.id)}
                              onCheckedChange={(checked) => consent.toggle(channel.id, purpose.id, checked === true)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-card-lg">
          <h2 className="font-semibold text-foreground">Your data</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Download a copy of your profile, consent settings, chat history, messages we&apos;ve sent you, and
            feedback you&apos;ve submitted.
          </p>
          <Button variant="outline" className="mt-4" onClick={account.exportData} disabled={account.exporting}>
            {account.exporting ? "Preparing export..." : "Export my data"}
          </Button>
        </Card>

        <Card className="border-destructive/30 p-card-lg">
          <h2 className="font-semibold text-foreground">Danger zone</h2>
          <Alert variant="destructive" title="Delete account" className="mt-4">
            This permanently deletes your PetZu account — profile, consent settings, chat history, message history,
            and feedback. This can&apos;t be undone.
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
            This permanently deletes your account and everything linked to it. This can&apos;t be undone — consider
            exporting your data first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={account.deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={account.deleting}>
            {account.deleting ? "Deleting..." : "Yes, delete it"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
