import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

export function capitalizeFirstAlphabeticCharacter(str: string) {
  return pipe(
    str.replace(/[a-zA-Z]/, (c) => c.toUpperCase()),
    O.fromPredicate((s) => s.length > 0)
  );
}
