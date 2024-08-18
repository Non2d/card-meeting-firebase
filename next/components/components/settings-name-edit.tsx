import { useState } from "react";

interface Props {
  defaultDisplayName: string;
  isInvalid: boolean;
  onChangeDisplayName: (name: string) => void;
}

function SettingsNameEdit({
  defaultDisplayName,
  isInvalid,
  onChangeDisplayName,
}: Props) {
  const [displayName, setDisplayName] = useState(defaultDisplayName);

  return (
    <div>
      <input
        type="text"
        value={displayName}
        maxLength={10}
        placeholder="Enter your name"
        onChange={(ev) => {
          // ignore while IME compositing
          if (ev.target.value.length > 10) {
            return;
          }
          const name = ev.target.value;
          setDisplayName(name);
          onChangeDisplayName(name);
        }}
        className={`box-border w-full p-1 appearance-none border-0 border-b text-lg ${
          isInvalid
            ? "border-red-500"
            : "border-gray-500 focus:border-blue-500"
        }`}
      />
    </div>
  );
}

export default SettingsNameEdit;
