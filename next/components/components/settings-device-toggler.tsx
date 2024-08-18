interface Props {
  state: "ON" | "OFF";
  onClick: () => void;
}

function SettingsDeviceToggler({ state, onClick }: Props) {
  return (
    <span className="text-center">
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={onClick}
      >
        {state === "ON" ? "OFF" : "ON"}
      </button>
    </span>
  );
}

export default SettingsDeviceToggler;