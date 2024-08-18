interface Props {
  error: Error;
}

function Error({ error }: Props) {
  return (
    <div className="text-black m-4">
      <h2 className="font-black">{error.message || error.name}</h2>
      <pre className="whitespace-pre-wrap">
        {error.stack || "Stack trace is not available."}
      </pre>
    </div>
  );
}

export default Error;