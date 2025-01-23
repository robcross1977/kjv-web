import { z } from "zod";

export const referenceSchema = z.object({
  book: z.string(),
  chapters: z.array(
    z.object({
      chapter: z.number(),
      verses: z.array(
        z.object({
          verse: z.number(),
          text: z.string(),
        })
      ),
    })
  ),
});
export type Reference = z.infer<typeof referenceSchema>;

export type FlattenedReference = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};
export function flattenReference(ref: Reference): FlattenedReference[] {
  return ref.chapters.flatMap((chapter) => {
    return chapter.verses.flatMap((verse) => {
      return {
        book: ref.book,
        chapter: chapter.chapter,
        verse: verse.verse,
        text: verse.text,
      };
    });
  });
}

export const referenceResponseSchema = z.object({
  references: z.array(referenceSchema),
});

export type ReferenceResponse = z.infer<typeof referenceResponseSchema>;
