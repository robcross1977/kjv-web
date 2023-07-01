import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

export function capitalizeFirstAlphabeticCharacter(str: string) {
  return pipe(
    str.replace(/\b[a-zA-Z]/g, (c) => c.toUpperCase()),
    (s) => s.replace(/\bOf\b/, "of"),
    O.fromPredicate((s) => s.length > 0)
  );
}
