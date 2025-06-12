import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import * as S from "fp-ts/string";
import { bookOptions } from "@/components/search/select-search/types";

/**
 * Parsed reference structure for internal use
 */
export type ParsedReference = {
  book: string;
  startChapter: number;
  endChapter?: number;
  startVerse?: number;
  endVerse?: number;
  originalInput: string;
  normalizedDisplay: string;
};

/**
 * Book name aliases for flexible input
 */
const bookAliases: Record<string, string> = {
  // Common abbreviations
  gen: "genesis",
  exo: "exodus",
  ex: "exodus",
  lev: "leviticus",
  num: "numbers",
  deut: "deuteronomy",
  dt: "deuteronomy",
  josh: "joshua",
  judg: "judges",
  "1sam": "1 samuel",
  "1 sam": "1 samuel",
  "2sam": "2 samuel",
  "2 sam": "2 samuel",
  "1kgs": "1 kings",
  "1 kings": "1 kings",
  "2kgs": "2 kings",
  "2 kings": "2 kings",
  "1chr": "1 chronicles",
  "1 chron": "1 chronicles",
  "2chr": "2 chronicles",
  "2 chron": "2 chronicles",
  neh: "nehemiah",
  est: "esther",
  ps: "psalms",
  psalm: "psalms",
  prov: "proverbs",
  pr: "proverbs",
  eccl: "ecclesiastes",
  ecc: "ecclesiastes",
  song: "song of solomon",
  sos: "song of solomon",
  isa: "isaiah",
  is: "isaiah",
  jer: "jeremiah",
  lam: "lamentations",
  ezek: "ezekiel",
  ez: "ezekiel",
  dan: "daniel",
  hos: "hosea",
  ob: "obadiah",
  jon: "jonah",
  mic: "micah",
  nah: "nahum",
  hab: "habakkuk",
  zeph: "zephaniah",
  hag: "haggai",
  zech: "zechariah",
  mal: "malachi",
  matt: "matthew",
  mt: "matthew",
  mk: "mark",
  lk: "luke",
  jn: "john",
  rom: "romans",
  "1cor": "1 corinthians",
  "1 cor": "1 corinthians",
  "2cor": "2 corinthians",
  "2 cor": "2 corinthians",
  gal: "galatians",
  eph: "ephesians",
  phil: "philippians",
  col: "colossians",
  "1thess": "1 thessalonians",
  "1 thes": "1 thessalonians",
  "2thess": "2 thessalonians",
  "2 thes": "2 thessalonians",
  "1tim": "1 timothy",
  "1 tim": "1 timothy",
  "2tim": "2 timothy",
  "2 tim": "2 timothy",
  tit: "titus",
  phlm: "philemon",
  heb: "hebrews",
  jas: "james",
  "1pet": "1 peter",
  "1 pet": "1 peter",
  "2pet": "2 peter",
  "2 pet": "2 peter",
  "1jn": "1 john",
  "1john": "1 john",
  firstjohn: "1 john",
  "2jn": "2 john",
  "2john": "2 john",
  "3jn": "3 john",
  "3john": "3 john",
  jude: "jude",
  rev: "revelation",
  rv: "revelation",
};

/**
 * Get valid book names from the book options
 */
const getValidBooks = (): string[] =>
  pipe(
    bookOptions,
    A.map((option) => option.value.toLowerCase())
  );

/**
 * Resolve book name from various formats
 */
const resolveBookName = (input: string): O.Option<string> => {
  const normalized = input.toLowerCase().trim();
  const validBooks = getValidBooks();

  // Try exact match first
  if (validBooks.includes(normalized)) {
    return O.some(normalized);
  }

  // Try alias lookup
  const aliasMatch = bookAliases[normalized];
  if (aliasMatch && validBooks.includes(aliasMatch)) {
    return O.some(aliasMatch);
  }

  // Try partial match
  return pipe(
    validBooks,
    A.findFirst(
      (book) => book.startsWith(normalized) || book.includes(normalized)
    )
  );
};

/**
 * Sanitize input string
 */
const sanitizeInput = (input: string): E.Either<string, string> =>
  pipe(
    input.trim(),
    E.fromPredicate(
      (s) => s.length > 0,
      () => "Reference cannot be empty"
    )
  );

/**
 * Parse chapter and verse numbers from string
 */
const parseNumbers = (str: string): number[] =>
  pipe(
    str.split(/[,\s]+/),
    A.map((s) => parseInt(s.trim())),
    A.filter((n) => !isNaN(n) && n > 0)
  );

/**
 * Parse a single reference component (e.g., "John 3:16" or "Psalm 23")
 */
const parseReferenceComponent = (
  input: string
): E.Either<string, ParsedReference> => {
  // Match patterns like "John 3:16", "John 3:16-18", "John 3", "1 John 3:4-9"
  const patterns = [
    // Book Chapter:Verse-Verse (e.g., "John 3:16-18")
    /^(.+?)\s+(\d+):(\d+)-(\d+)$/,
    // Book Chapter:Verse (e.g., "John 3:16")
    /^(.+?)\s+(\d+):(\d+)$/,
    // Book Chapter-Chapter (e.g., "Matthew 5-7")
    /^(.+?)\s+(\d+)-(\d+)$/,
    // Book Chapter (e.g., "John 3")
    /^(.+?)\s+(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const [, bookPart, ...numberParts] = match;

      return pipe(
        resolveBookName(bookPart),
        E.fromOption(() => `Invalid book name: ${bookPart}`),
        E.chain((book) => {
          const numbers = numberParts.map((n) => parseInt(n));

          if (pattern === patterns[0]) {
            // Chapter:Verse-Verse
            const [chapter, startVerse, endVerse] = numbers;
            return E.right({
              book,
              startChapter: chapter,
              startVerse,
              endVerse,
              originalInput: input,
              normalizedDisplay: `${book} ${chapter}:${startVerse}-${endVerse}`,
            });
          } else if (pattern === patterns[1]) {
            // Chapter:Verse
            const [chapter, verse] = numbers;
            return E.right({
              book,
              startChapter: chapter,
              startVerse: verse,
              originalInput: input,
              normalizedDisplay: `${book} ${chapter}:${verse}`,
            });
          } else if (pattern === patterns[2]) {
            // Chapter-Chapter
            const [startChapter, endChapter] = numbers;
            return E.right({
              book,
              startChapter,
              endChapter,
              originalInput: input,
              normalizedDisplay: `${book} ${startChapter}-${endChapter}`,
            });
          } else if (pattern === patterns[3]) {
            // Chapter only
            const [chapter] = numbers;
            return E.right({
              book,
              startChapter: chapter,
              originalInput: input,
              normalizedDisplay: `${book} ${chapter}`,
            });
          }

          return E.left("Failed to parse reference");
        })
      );
    }
  }

  return E.left(`Invalid reference format: ${input}`);
};

/**
 * Main reference parser function
 */
export const parseReference = (
  input: string
): E.Either<string, ParsedReference> =>
  pipe(input, sanitizeInput, E.chain(parseReferenceComponent));

/**
 * Create a normalized reference string for display
 */
export const normalizeReference = (parsed: ParsedReference): string => {
  const { book, startChapter, endChapter, startVerse, endVerse } = parsed;

  if (endChapter) {
    return `${book} ${startChapter}-${endChapter}`;
  } else if (endVerse) {
    return `${book} ${startChapter}:${startVerse}-${endVerse}`;
  } else if (startVerse) {
    return `${book} ${startChapter}:${startVerse}`;
  } else {
    return `${book} ${startChapter}`;
  }
};

/**
 * Validate that a reference exists in the Bible
 * This is a simplified validation - in a real app you'd check against actual Bible structure
 */
export const validateReference = (
  parsed: ParsedReference
): E.Either<string, ParsedReference> => {
  const { book, startChapter, endChapter, startVerse, endVerse } = parsed;

  // Basic validation rules
  if (startChapter < 1) {
    return E.left("Chapter must be greater than 0");
  }

  if (endChapter && endChapter < startChapter) {
    return E.left("End chapter must be greater than start chapter");
  }

  if (startVerse && startVerse < 1) {
    return E.left("Verse must be greater than 0");
  }

  if (endVerse && startVerse && endVerse < startVerse) {
    return E.left("End verse must be greater than start verse");
  }

  // TODO: Add more sophisticated validation against actual Bible structure
  // For now, we'll assume basic validation is sufficient

  return E.right(parsed);
};

/**
 * Parse multiple references separated by semicolons or commas
 */
export const parseMultipleReferences = (
  input: string
): E.Either<string, ParsedReference[]> => {
  const references = input
    .split(/[;,]/)
    .map((ref) => ref.trim())
    .filter((ref) => ref.length > 0);

  if (references.length === 0) {
    return E.left("No references found");
  }

  if (references.length === 1) {
    return pipe(
      parseReference(references[0]),
      E.map((ref) => [ref])
    );
  }

  // For multiple references, parse each one
  const results = references.map(parseReference);
  const errors = results.filter(E.isLeft);

  if (errors.length > 0) {
    return E.left(`Failed to parse: ${errors.map((e) => e.left).join(", ")}`);
  }

  return E.right(results.map((r) => (r as E.Right<ParsedReference>).right));
};

/**
 * Get book suggestions for autocomplete
 */
export const getBookSuggestions = (input: string): string[] => {
  if (input.length < 2) return [];

  const normalized = input.toLowerCase();
  const validBooks = getValidBooks();

  const suggestions = pipe(
    validBooks,
    A.filter(
      (book) =>
        book.startsWith(normalized) ||
        book.includes(normalized) ||
        Object.keys(bookAliases).some(
          (alias) => alias.startsWith(normalized) && bookAliases[alias] === book
        )
    )
  );

  // Limit to 10 suggestions
  return suggestions.slice(0, 10);
};
