type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export function BibleActions({ show, setShow }: Props) {
  return (
    <div className="flex flex-col">
      <button
        className="bg-sky-500 hover:bg-sky-700 text-zinc-50 font-bold p-1 border border-sky-700 rounded text-sm"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide Actions" : "Show Actions"}
      </button>
      <div className="flex flex-row">
        <div>
          <select className={`${show ? "visible" : "invisible"}`}>
            <option>Mark Checked as Read</option>
            <option>Bookmark Checked</option>
            <option>Add Checked to Memory Verses</option>
            <option>Hide Actions</option>
          </select>
        </div>
        <div>
          <button className={`${show ? "visible" : "invisible"}`}>
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
}
