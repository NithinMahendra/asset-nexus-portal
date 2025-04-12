
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetCategory, AssetStatus, User } from "@/types";
import { createAsset, getAllUsers } from "@/lib/supabase-utils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  category: z.enum([
    "laptop", "desktop", "mobile", "tablet", "monitor", 
    "printer", "networking", "peripheral", "software", "other"
  ]),
  status: z.enum(["available", "assigned", "repair", "retired"]),
  purchaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  warrantyExpiry: z.string().optional(),
  location: z.string().optional(),
  isAssigned: z.boolean().default(false),
  assignedTo: z.string().optional(),
  assignedDate: z.string().optional(),
  serialNumber: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
  value: z.string().optional()
    .refine(val => !val || !isNaN(parseFloat(val)), {
      message: "Value must be a number",
    })
});

type FormValues = z.infer<typeof formSchema>;

interface AddAssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddAssetForm({ isOpen, onClose, onSuccess }: AddAssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "laptop",
      status: "available",
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: "",
      location: "",
      isAssigned: false,
      assignedTo: "",
      assignedDate: "",
      serialNumber: "",
      model: "",
      description: "",
      value: ""
    }
  });

  const isAssigned = form.watch("isAssigned");
  const selectedStatus = form.watch("status");

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // If status changes to assigned, update isAssigned checkbox
  useEffect(() => {
    if (selectedStatus === "assigned" && !isAssigned) {
      form.setValue("isAssigned", true);
    } else if (selectedStatus !== "assigned" && isAssigned) {
      form.setValue("isAssigned", false);
    }
  }, [selectedStatus, isAssigned, form]);

  // If isAssigned changes, update status accordingly
  useEffect(() => {
    if (isAssigned && selectedStatus !== "assigned") {
      form.setValue("status", "assigned");
    } else if (!isAssigned && selectedStatus === "assigned") {
      form.setValue("status", "available");
    }
  }, [isAssigned, selectedStatus, form]);

  async function loadUsers() {
    const userList = await getAllUsers();
    setUsers(userList);
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Find the selected user object if assigned
      let assignedToUser: User | undefined;
      if (data.isAssigned && data.assignedTo) {
        assignedToUser = users.find(user => user.id === data.assignedTo);
      }

      const asset = await createAsset({
        name: data.name,
        category: data.category as AssetCategory,
        status: data.status as AssetStatus,
        purchaseDate: data.purchaseDate,
        warrantyExpiry: data.warrantyExpiry,
        location: data.location,
        assignedTo: assignedToUser,
        assignedDate: data.isAssigned ? data.assignedDate : undefined,
        serialNumber: data.serialNumber,
        model: data.model,
        description: data.description,
        value: data.value ? parseFloat(data.value) : undefined
      });
      
      if (asset) {
        form.reset();
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the asset.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Create a new asset in the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter asset name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="monitor">Monitor</SelectItem>
                        <SelectItem value="printer">Printer</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="peripheral">Peripheral</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="repair">Under Repair</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Expiry (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="Enter value" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description" 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAssigned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Assign to User
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this box if this asset is assigned to a user
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {isAssigned && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          defaultValue={new Date().toISOString().split('T')[0]}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Asset"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
