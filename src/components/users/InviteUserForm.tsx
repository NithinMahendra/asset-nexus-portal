
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string; // expect this to be provided from parent
  onSuccess?: () => void;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ isOpen, onClose, organizationId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setInviteLink("");
    try {
      // Create invitation in Supabase
      const { data, error } = await supabase
        .from("invitations")
        .insert({
          email,
          role,
          organization_id: organizationId,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Compose invite link (copy to clipboard)
      const url = new URL(window.location.origin + "/auth/signup");
      url.searchParams.set("invite", data.id);
      setInviteLink(url.toString());

      toast({
        title: "Invite created!",
        description: `Invitation link copied to clipboard.`,
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

  // Always close dialog state resets
  React.useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setRole('employee');
      setInviteLink('');
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
              placeholder="Enter user email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Select value={role} onValueChange={(val) => setRole(val as "employee" | "admin")}>
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
              {isLoading ? 'Sending...' : 'Send Invite'}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserForm;
