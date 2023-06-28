import { BookRecords } from "kingjames";
import { ChapterDisplay } from "./chapter-display";

function capitalizeFirstLetter(str: string) {
  if (str.length > 3) {
    if (new RegExp(/^[a-zA-Z]/).test(str.charAt(0))) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else if (new RegExp(/^[a-zA-Z]/).test(str.charAt(2))) {
      return str.slice(0, 2) + str.charAt(2).toUpperCase() + str.slice(3);
    }
  }

  return "No Result Found";
}

export default function SearchDisplay({
  book,
  isDirty,
}: {
  book?: BookRecords;
  isDirty?: boolean;
}) {
  if (!isDirty) {
    return <></>;
  }

  if (book === undefined || Object.keys(book).length === 0) {
    return <p className="text-3xl font-semibold">No Result Found</p>;
  }

  return (
    <div className="w-full">
      {Object.entries(book).map(([title, chapters]) => {
        const finalTitle = capitalizeFirstLetter(title);

        return (
          <div key={title} className="flex flex-col w-full h-full">
            <h1 className="text-4xl font-semibold mb-5 text-center w-full">
              {`${finalTitle}`}
            </h1>
            {ChapterDisplay({ book: title, chapters })}
          </div>
        );
      })}
    </div>
  );
}
