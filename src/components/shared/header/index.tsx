import Auth from "@components/auth";

function Title() {
  return (
    <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 font-serif">
      Bible Buddy
    </h1>
  );
}

export default function Header() {
  return (
    <header
      className={`
      flex flex-col justify-center
      w-full h-[105px]
      py-1
      `}
    >
      <div className="flex lg:flex-col justify-between items-center lg:items-start w-11/12 lg:w-2/3 mx-auto">
        <div className="flex justify-between items-center w-full">
          <Title />
          <div className="hidden lg:block">
            <Auth />
          </div>
        </div>
      </div>
    </header>
  );
}
