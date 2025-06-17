import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { createOrganizationAction } from "@/actions/project";
import { toast } from "react-hot-toast";

interface CreateOrganizationProps {
  userId: string;
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function CreateOrganization({
  userId,
  triggerText = "Create Organization",
  triggerVariant = "default",
}: CreateOrganizationProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      owner_id: string;
    }) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("owner_id", data.owner_id);

      const result = await createOrganizationAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create organization");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", userId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });

      setFormData({ title: "", description: "" });
      setOpen(false);
      toast.success(`Organization created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Name is required");
      return;
    }

    createOrganizationMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      owner_id: userId,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className="gap-2">
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to manage your teams and projects. You can
            always update details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Organization Name *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter organization name"
              value={formData.title}
              onChange={handleInputChange}
              disabled={createOrganizationMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your organization..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={createOrganizationMutation.isPending}
              className="w-full min-h-[100px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createOrganizationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createOrganizationMutation.isPending || !formData.title.trim()
              }
              className="gap-2"
            >
              {createOrganizationMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Organization
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
