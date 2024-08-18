import Image from "next/image";

function Loader() {
  return (
    <Image
      className="absolute top-0 left-0 right-0 bottom-0 m-auto w-40"
      src="/icon/sunadokei.svg"
      alt="Loading"
      width={40}
      height={40}
    />
  );
}

export default Loader;