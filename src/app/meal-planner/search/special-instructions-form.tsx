export default function SpecialInstructionsForm({
  submit,
  command,
  isLoading,
  input,
  setInput,
  inputRef,
}: {
  submit: (prompt: unknown) => void;
  command: string;
  isLoading: boolean;
  input: string;
  setInput: (input: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const input = form.elements.namedItem("prompt") as HTMLInputElement;

        if (input.value.trim()) {
          submit({ prompt: input.value, system: command });
        }
      }}
    >
      <input
        name="prompt"
        className="dark:bg-zinc-900 w-full p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
        value={input}
        placeholder="Any added special instructions for the meal planner..."
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        ref={inputRef}
      />
    </form>
  );
}
