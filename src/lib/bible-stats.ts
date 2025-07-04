import { ValidBookName, chapterCountFrom, verseCountFrom } from "kingjames";
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";

/**
 * All Bible books in order
 */
export const BIBLE_BOOKS: ValidBookName[] = [
  "genesis",
  "exodus",
  "leviticus",
  "numbers",
  "deuteronomy",
  "joshua",
  "judges",
  "ruth",
  "1 samuel",
  "2 samuel",
  "1 kings",
  "2 kings",
  "1 chronicles",
  "2 chronicles",
  "ezra",
  "nehemiah",
  "esther",
  "job",
  "psalms",
  "proverbs",
  "ecclesiastes",
  "song of solomon",
  "isaiah",
  "jeremiah",
  "lamentations",
  "ezekiel",
  "daniel",
  "hosea",
  "joel",
  "amos",
  "obadiah",
  "jonah",
  "micah",
  "nahum",
  "habakkuk",
  "zephaniah",
  "haggai",
  "zechariah",
  "malachi",
  "matthew",
  "mark",
  "luke",
  "john",
  "acts",
  "romans",
  "1 corinthians",
  "2 corinthians",
  "galatians",
  "ephesians",
  "philippians",
  "colossians",
  "1 thessalonians",
  "2 thessalonians",
  "1 timothy",
  "2 timothy",
  "titus",
  "philemon",
  "hebrews",
  "james",
  "1 peter",
  "2 peter",
  "1 john",
  "2 john",
  "3 john",
  "jude",
  "revelation",
];

/**
 * Calculate the total number of verses in a book
 */
export const getBookVerseCount = (book: ValidBookName): number => {
  const chapterCount = chapterCountFrom(book);

  return pipe(
    Array.from({ length: chapterCount }, (_, i) => i + 1),
    A.map((chapter) =>
      pipe(
        verseCountFrom(book, chapter),
        O.getOrElse(() => 0)
      )
    ),
    A.reduce(0, (acc, count) => acc + count)
  );
};

/**
 * Get the total number of verses in the entire Bible
 * This is cached since it's a constant value
 */
let _totalBibleVerses: number | null = null;

export const getTotalBibleVerses = (): number => {
  if (_totalBibleVerses === null) {
    _totalBibleVerses = pipe(
      BIBLE_BOOKS,
      A.map(getBookVerseCount),
      A.reduce(0, (acc, count) => acc + count)
    );
  }
  return _totalBibleVerses;
};

/**
 * Calculate reading progress percentage based on read verses
 */
export const calculateReadingProgress = (readVersesCount: number): number => {
  const totalVerses = getTotalBibleVerses();
  if (totalVerses === 0) return 0;

  const percentage = (readVersesCount / totalVerses) * 100;
  return Math.round(percentage * 100) / 100; // Round to 2 decimal places
};

/**
 * Get verse counts for specific books (useful for book-level progress)
 */
export const getBookStats = (book: ValidBookName) => {
  const chapterCount = chapterCountFrom(book);
  const verseCount = getBookVerseCount(book);

  return {
    book,
    chapterCount,
    verseCount,
  };
};
