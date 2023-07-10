import { range } from "@util/array-util";

type ManualConfig = {
  type: "manual";
  blankIndicies: number[];
};

type RandomConfig = {
  type: "random";
  numberOfBlanks: number;
};

type Config = {
  question: string;
} & (ManualConfig | RandomConfig);

function stripPunctuation(word: string) {
  return word.at(word.length - 1)?.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/)
    ? ([
        word.slice(0, word.length - 1),
        word.at(word.length - 1) ?? "",
      ] as const)
    : ([word, ""] as const);
}

function ManualQuestion(question: string, blankIndicies: number[]) {
  function checkAnswer() {
    const words = question
      .split(" ")
      .map((word) => stripPunctuation(word)[0].toLowerCase());

    const answers = blankIndicies.reduce<
      (readonly [number, string, string, boolean])[]
    >((previousValue, currentValue) => {
      const input: HTMLInputElement | null = document.querySelector(
        `input:nth-child(${currentValue + 1})`
      );

      if (!input) {
        throw new Error("Question config is invalid.");
      }

      return [
        ...previousValue,
        [
          currentValue,
          input.value,
          words.at(currentValue) ?? "",
          input.value.toLowerCase() === words.at(currentValue),
        ] as const,
      ];
    }, [] as (readonly [number, string, string, boolean])[]);

    console.log(`answers: ${answers}`);
  }

  return (
    <div>
      {question.split(" ").map((part, index) => {
        const [word, punctuation] = stripPunctuation(part);

        return blankIndicies.includes(index) ? (
          <>
            {" "}
            <input key={index} size={word.length} />
            {punctuation}
          </>
        ) : (
          <> {part}</>
        );
      })}
      <button
        onClick={() => checkAnswer()}
        className="text-white bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2"
      >
        Check Answer
      </button>
    </div>
  );
}

function getRandomBlankInRange(length: number, numberOfBlanks: number) {
  const blankIndicies: number[] = [];
  const potentialIndices = range(0, length - 1, 1);

  if (numberOfBlanks > length) {
    return blankIndicies;
  }

  while (numberOfBlanks > blankIndicies.length) {
    const randomIndex = Math.floor(Math.random() * potentialIndices.length);
    blankIndicies.push(potentialIndices[randomIndex]);
    potentialIndices.splice(randomIndex, 1);
  }

  return blankIndicies;
}

function RandomQuestion(question: string, numberOfBlanks: number) {
  const blankIndicies = getRandomBlankInRange(
    question.split(" ").length,
    numberOfBlanks
  );

  return ManualQuestion(question, blankIndicies);
}

function generateQuestion(config: Config) {
  return config.type === "manual"
    ? ManualQuestion(config.question, config.blankIndicies)
    : RandomQuestion(config.question, config.numberOfBlanks);
}

export default function FillInTheBlank(config: Config) {
  return <div>{generateQuestion(config)}</div>;
}
