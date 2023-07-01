type Props = {
  searchType: "Basic" | "Advanced";
  onOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchType({
  searchType = "Basic",
  onOptionChange,
}: Props) {
  return (
    <div className="w-full flex flex-row justify-end items-center">
      <div>
        <span className="font-semibold mx-1">Search Type:</span>
      </div>
      <div className="mx-1">
        <input
          type="radio"
          value="Basic"
          name="SearchType"
          checked={searchType === "Basic"}
          onChange={onOptionChange}
        />
        <span className="mx-1">Basic</span>
      </div>
      <div className="mx1">
        <input
          type="radio"
          value="Advanced"
          name="SearchType"
          checked={searchType === "Advanced"}
          onChange={onOptionChange}
        />
        <span className="mx-1">Advanced</span>
      </div>
    </div>
  );
}
