type SearchButtonProps = {
  doSearch: () => void;
};

export default function SearchButton({ doSearch }: SearchButtonProps) {
  return (
    <button
      type="submit"
      className="text-white bg-stone-500 hover:bg-stone-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2"
      onClick={doSearch}
    >
      Search
    </button>
  );
}
