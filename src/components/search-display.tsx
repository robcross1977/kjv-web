import { BookRecords } from "kingjames";

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

export default function SearchDisplay({ book }: { book?: BookRecords }) {
  return book === undefined ? (
    <></>
  ) : (
    <div>
      {Object.entries(book).map(([title, chapters]) => {
        const finalTitle = capitalizeFirstLetter(title);
        return (
          <div key={title} className="flex flex-col w-full h-full">
            <h1 className="text-4xl font-semibold mb-5 text-center">{`${finalTitle}`}</h1>
            {Object.entries(chapters).map(([chapter, verses]) => {
              return (
                <div key={`${book}${chapter}`}>
                  <h3 className="text-2xl font-semibold mt-5">
                    Chapter {chapter}
                  </h3>
                  {Object.entries(verses).map(([verse, text]) => {
                    return (
                      <div key={`${book}${chapter}${verse}`} className="my-4">
                        <sup className="text-red-950">{verse}</sup>
                        <span>{text}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
