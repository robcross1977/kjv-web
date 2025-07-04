"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus } from "lucide-react";
import {
  CreateBookmarkFolderSchema,
  type CreateBookmarkFolderRequest,
  type BookmarkFolder,
} from "@/types/bookmark-folder";

// Predefined folder colors
const FOLDER_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
  "#059669", // green
];

type Props = {
  onSubmit: (data: CreateBookmarkFolderRequest) => Promise<boolean>;
  onCancel: () => void;
  folders: BookmarkFolder[];
  parentId?: string;
};

/**
 * Form component for creating new bookmark folders
 */
export function CreateFolderForm({
  onSubmit,
  onCancel,
  folders,
  parentId,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBookmarkFolderRequest>({
    resolver: zodResolver(CreateBookmarkFolderSchema),
    defaultValues: {
      name: "",
      description: "",
      color: FOLDER_COLORS[0],
      parentId: parentId || undefined,
    },
  });

  const handleFormSubmit = async (data: CreateBookmarkFolderRequest) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        onCancel(); // Close the form on success
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available parent folders (excluding the current folder to prevent circular references)
  const availableParentFolders = folders.filter(
    (folder) => folder.id !== parentId // Don't allow selecting self as parent
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Folder Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter folder name"
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Add a description for this folder"
          className="w-full min-h-[60px]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Parent Folder */}
      <div className="space-y-2">
        <Label>Parent Folder (Optional)</Label>
        <Select
          value={watch("parentId") || "none"}
          onValueChange={(value) =>
            setValue("parentId", value === "none" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent folder" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg border border-gray-200">
            <SelectItem value="none">No parent (root level)</SelectItem>
            {availableParentFolders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Folder Color</Label>
        <div className="flex gap-2 flex-wrap">
          {FOLDER_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-colors ${
                watch("color") === color
                  ? "border-gray-800 ring-2 ring-gray-300"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setValue("color", color)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center gap-2"
        >
          <FolderPlus className="h-4 w-4" />
          {isSubmitting ? "Creating..." : "Create Folder"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
