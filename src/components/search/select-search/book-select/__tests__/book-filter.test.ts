import { ValidBookName } from "kingjames";
import { filterBookOptions, getBookOptionFromBook } from "../book-filter";

describe("The book-filter module", () => {
  describe("The book-filter function", () => {
    it("should return the full list of books if the query is empty", () => {
      const result = filterBookOptions("");
      expect(result.length).toBe(66);
    });

    it("should return a filtered list of books that begin with the query (case-insensitive)", () => {
      const result = filterBookOptions("A");
      expect(result).toEqual([
        { key: 30, value: "amos" },
        { key: 44, value: "acts" },
      ]);
    });
  });

  describe("The getBookOptionFromBook function", () => {
    it("should return a book option from a book", () => {
      const result = getBookOptionFromBook("amos");
      expect(result).toEqual({ key: 30, value: "amos" });
    });

    it("should return Genesis if the book is unrecognized", () => {
      const result = getBookOptionFromBook("macabees" as ValidBookName);
      expect(result).toEqual({ key: 1, value: "genesis" });
    });
  });
});
