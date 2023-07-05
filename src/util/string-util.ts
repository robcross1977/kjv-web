import { pipe } from "fp-ts/function";

export function capitalizeFirstAlphabeticCharacter(str: string) {
  return pipe(
    str.replace(/\b[a-zA-Z]/g, (c) => c.toUpperCase()),
    (s) => s.replace(/\bOf\b/, "of")
  );
}
