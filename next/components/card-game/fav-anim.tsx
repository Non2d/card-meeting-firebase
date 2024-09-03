import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Animation from "./colorful_like.json";

function FavAnim() {
  return (
    <div>
      <Player
        autoplay
        src={Animation}
        style={{
          position: "fixed",
          top: "11%",
          left: "4%",
          transform: "translate(-50%, -50%)",
          height: "200px",
          width: "200px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default FavAnim;