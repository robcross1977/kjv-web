import { range } from "../array-util";

describe("The array-util module", () => {
  describe("The range function", () => {
    it("should create an array of numbers ranging from start to stop in increments of step where step = 1", () => {
      expect(range(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
    });

    it("should create an array of numbers ranging from start to stop in increments of step where step = 2", () => {
      expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    });
  });
});
