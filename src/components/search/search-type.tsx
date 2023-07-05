type Props = {
  searchType: "Basic" | "Advanced";
  onOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchType({
  onOptionChange,
  searchType = "Basic",
}: Props) {
  return (
    <div className="w-full flex flex-row justify-start items-center">
      <div>
        <span className="font-semibold mx-1 text-slate-950">Search Type:</span>
      </div>
      <div className="mx-1">
        <input
          type="radio"
          checked={searchType === "Basic"}
          value="Basic"
          onChange={onOptionChange}
        />
        <span className="mx-1 text-slate-950">basic</span>
      </div>
      <div className="mx1">
        <input
          type="radio"
          checked={searchType === "Advanced"}
          value="Advanced"
          onChange={onOptionChange}
        />
        <span className="mx-1 text-slate-950">advanced</span>
      </div>
    </div>
  );
}
