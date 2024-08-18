import { ReactNode } from "react";
// import { zIndex } from "../utils/style";

//カスタムアニメーションを削除
interface Props {
  children: ReactNode;
}

function Modal({ children }: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-80">
      {children}
    </div>
  );
}

export default Modal;
