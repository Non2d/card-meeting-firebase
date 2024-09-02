import { useCallback, useState } from "react";
import { FavoriteIconAnim } from "./fav_anim";
 
export default function Favorite() {
 const [on, setOn] = useState(false);
 const handleClick = useCallback(() => {
   setOn((prev) => !prev);
 }, []);
 
 return (
   <article>
     <h1>Favorite Animation</h1>
     <button onClick={handleClick}>
       <FavoriteIconAnim on={on} />
     </button>
   </article>
 );
}