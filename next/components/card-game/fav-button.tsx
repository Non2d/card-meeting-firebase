import { useState } from "react";

function FavButton() {
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 m-10 rounded ${liked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
    >
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}

export default FavButton;