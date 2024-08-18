// アニメーションを廃止
import { Icon } from "./icon";

interface Props {
  type: string;
  text: string;
}

function Toast({ type, text }: Props) {
  return (
    <div className="flex items-center p-1 mb-1 text-sm rounded-sm bg-gray-700">
      <Icon name={type} />
      <span className="ml-1 w-48 overflow-hidden whitespace-nowrap text-ellipsis">
        {text}
      </span>
    </div>
  );
}

export default Toast;