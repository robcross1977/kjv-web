import { capitalizeFirstAlphabeticCharacter } from "../string-util";

describe("The string-util module", () => {
  describe("The capitalizeFirstAlphabeticCharacter function", () => {
    it("should capitalize the first letter of every book that starts with a letter", () => {
      expect(capitalizeFirstAlphabeticCharacter("genesis")).toBe("Genesis");
    });

    it("should capitalize the first letter of every book that starts with a number", () => {
      expect(capitalizeFirstAlphabeticCharacter("1 samuel")).toBe("1 Samuel");
    });

    it('should capitalize "Song" and "Solomon" in "Song of Solomon" but not "of"', () => {
      expect(capitalizeFirstAlphabeticCharacter("song of solomon")).toBe(
        "Song of Solomon"
      );
    });
  });
});
