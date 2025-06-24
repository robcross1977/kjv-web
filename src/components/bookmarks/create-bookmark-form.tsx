"use client";

import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus } from "lucide-react";
import {
  CreateBookmarkSchema,
  type CreateBookmarkRequest,
  BOOKMARK_CATEGORIES,
  BOOKMARK_COLORS,
} from "@/types/bookmark";
import { parseReference, validateReference } from "@/lib/reference-parser";

type Props = {
  onSubmit: (data: CreateBookmarkRequest) => Promise<boolean>;
  onCancel: () => void;
  initialReference?: string;
};

type FormData = {
  name: string;
  description?: string;
  reference: string;
  category?: string;
  color?: string;
};

/**
 * Form for creating new bookmarks
 */
export function CreateBookmarkForm({
  onSubmit,
  onCancel,
  initialReference,
}: Props) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateBookmarkSchema.omit({ tags: true })),
    defaultValues: {
      name: "",
      description: "",
      reference: initialReference || "",
      category: undefined,
      color: undefined,
    },
  });

  const watchedReference = watch("reference");

  // Validate reference in real-time
  const validateReferenceInput = (reference: string) => {
    if (!reference.trim()) {
      setReferenceError(null);
      return;
    }

    const result = pipe(parseReference(reference), E.chain(validateReference));

    if (E.isLeft(result)) {
      setReferenceError(result.left);
    } else {
      setReferenceError(null);
    }
  };

  // Handle reference input changes
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("reference", value);
    validateReferenceInput(value);
  };

  // Add tag
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key down
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Form submission
  const onFormSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const bookmarkData: CreateBookmarkRequest = {
        ...data,
        tags,
      };

      const success = await onSubmit(bookmarkData);

      if (!success) {
        // Error handling is done by the parent component
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Bookmark Name *</Label>
        <Input
          id="name"
          placeholder="Enter a descriptive name for this bookmark"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <Label htmlFor="reference">Bible Reference *</Label>
        <Input
          id="reference"
          placeholder="e.g., John 3:16, Genesis 1:1-5, Psalm 23"
          value={watchedReference}
          onChange={handleReferenceChange}
        />
        {errors.reference && (
          <p className="text-sm text-destructive">{errors.reference.message}</p>
        )}
        {referenceError && (
          <Alert variant="destructive">
            <AlertDescription>{referenceError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add notes about why this passage is important to you"
          rows={3}
          {...register("description")}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category (Optional)</Label>
        <Select
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
              className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
              style={{ backgroundColor: color }}
              onClick={() => setValue("color", color)}
            />
          ))}
          <button
            type="button"
            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors bg-white flex items-center justify-center"
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
        <Button
          type="submit"
          disabled={isSubmitting || !!referenceError}
          className="flex-1"
        >
          {isSubmitting ? "Creating..." : "Create Bookmark"}
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
