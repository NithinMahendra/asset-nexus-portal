import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onSuccess?: () => void;
}

// Correct RFC4122 v4 UUID generator for TypeScript (no array math, safe)
function generateUUID() {
  // Generates a random RFC4122 version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({
  isOpen,
  onClose,
  organizationId,
  onSuccess,
}) => {
  // Make email optional for non-email invites
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteId, setInviteId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setInviteLink("");
    setInviteId("");

    // Check if organizationId is missing or blank
    if (!organizationId || organizationId.trim() === "") {
      toast({
        title: "Cannot invite user",
        description: "A valid organization is required to generate an invite.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Insert invitation (with or without email)
      const { data, error } = await supabase
        .from("invitations")
        .insert({
          email: email.trim() === "" ? null : email.trim(), // allow null email
          role,
          organization_id: organizationId,
        })
        .select("id")
        .single();

      if (error) throw error;

      const invite_id = data.id;
      setInviteId(invite_id);

      // Compose invite link (for admin to share)
      const url = new URL(window.location.origin + "/auth/signup");
      url.searchParams.set("invite", invite_id);
      setInviteLink(url.toString());

      toast({
        title: "Invite created!",
        description: `Invite link generated.`,
      });
      navigator.clipboard.writeText(url.toString());

      setEmail("");
      setRole("employee");
      onSuccess && onSuccess();
    } catch (err: any) {
      toast({
        title: "Invite failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Always reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setRole("employee");
      setInviteLink("");
      setInviteId("");
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="User email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
            />
            <span className="text-xs text-muted-foreground block mt-1">
              Email is optional. Generate invite link without entering email if desired.
            </span>
          </div>
          <div>
            <Select value={role} onValueChange={val => setRole(val as "employee" | "admin")}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Invite"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>

        {inviteLink && (
          <div className="mt-4">
            <p className="text-sm mb-1">Invite link (copied to clipboard):</p>
            <Input readOnly value={inviteLink} className="text-xs" />
            <p className="text-xs text-muted-foreground mt-1">
              Share this link with your new team member for them to sign up.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserForm;
