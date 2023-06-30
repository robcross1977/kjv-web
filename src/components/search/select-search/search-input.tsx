import { useState } from "react";
import { bookNames } from "kingjames";

export default function Search() {
  const [activeBook, setActiveBook] = useState("");
  const [activeChapter, setActiveChapter] = useState("");
  const [activeVerse, setActiveVerse] = useState("");

  return (
    <div>
      <div>
        <select>
          {bookNames.map((b) => (
            <option value={b} key={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select></select>
      </div>
      <div>
        <select></select>
      </div>
    </div>
  );
}
