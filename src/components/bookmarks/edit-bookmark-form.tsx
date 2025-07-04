"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Folder } from "lucide-react";
import {
  UpdateBookmarkSchema,
  type UpdateBookmarkRequest,
  type Bookmark,
} from "@/types/bookmark";
import { type BookmarkFolder } from "@/types/bookmark-folder";

// Predefined categories and colors
const BOOKMARK_CATEGORIES = [
  "Study",
  "Devotional",
  "Sermon",
  "Memory",
  "Prayer",
  "Prophecy",
  "Wisdom",
  "Comfort",
  "Praise",
  "Teaching",
];

const BOOKMARK_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

type Props = {
  bookmark: Bookmark;
  onSubmit: (data: UpdateBookmarkRequest) => Promise<boolean>;
  onCancel: () => void;
  folders?: BookmarkFolder[];
};

/**
 * Form component for editing existing bookmarks
 */
export function EditBookmarkForm({
  bookmark,
  onSubmit,
  onCancel,
  folders = [],
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(bookmark.tags || []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateBookmarkRequest>({
    resolver: zodResolver(UpdateBookmarkSchema),
    defaultValues: {
      name: bookmark.name,
      description: bookmark.description || "",
      reference: bookmark.originalRef,
      category: bookmark.category || undefined,
      color: bookmark.color || undefined,
      folderId: bookmark.folderId || undefined,
      tags: bookmark.tags || [],
    },
  });

  // Watch for changes to update tags
  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFormSubmit = async (data: UpdateBookmarkRequest) => {
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter bookmark name"
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <Label htmlFor="reference">Bible Reference *</Label>
        <Input
          id="reference"
          {...register("reference")}
          placeholder="e.g., John 3:16, Romans 8:28-30"
          className="w-full"
        />
        {errors.reference && (
          <p className="text-sm text-red-500">{errors.reference.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Add a description or note about this bookmark"
          className="w-full min-h-[80px]"
        />
      </div>

      {/* Folder */}
      <div className="space-y-2">
        <Label>Folder (Optional)</Label>
        <Select
          value={watch("folderId") || "none"}
          onValueChange={(value) =>
            setValue("folderId", value === "none" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg border border-gray-200">
            <SelectItem value="none">No folder</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                <div className="flex items-center gap-2">
                  <Folder
                    className="h-4 w-4"
                    style={{ color: folder.color || "#6b7280" }}
                  />
                  {folder.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category (Optional)</Label>
        <Select
          value={watch("category") || "none"}
          onValueChange={(value) =>
            setValue("category", value === "none" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg border border-gray-200">
            <SelectItem value="none">No category</SelectItem>
            {BOOKMARK_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color (Optional)</Label>
        <div className="flex gap-2 flex-wrap">
          {BOOKMARK_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-colors ${
                watch("color") === color
                  ? "border-gray-800"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setValue("color", color)}
            />
          ))}
          <button
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-colors bg-white flex items-center justify-center ${
              !watch("color")
                ? "border-gray-800"
                : "border-gray-300 hover:border-gray-500"
            }`}
            onClick={() => setValue("color", undefined)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (Optional)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Updating..." : "Update Bookmark"}
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
