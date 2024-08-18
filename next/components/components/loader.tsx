import Image from "next/image";

function Loader() {
  const src = `${process.env.NODE_ENV !== 'development' ? '/card-meet' : ''}/icon/sunadokei.svg`;

  return (
    <Image
      className="absolute top-0 left-0 right-0 bottom-0 m-auto w-40"
      src={src}
      alt="Loading"
      width={40}
      height={40}
    />
  );
}

export default Loader;