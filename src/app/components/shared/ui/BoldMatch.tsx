interface BoldMatchProps {
  text: string;
  query: string;
}

// Bolds every occurrence of `query` in `text`. Matches the plain substring
// search the lists filter with, so what is bold is what matched.
export default function BoldMatch({ text, query }: BoldMatchProps) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const parts = text.split(q);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <strong className="font-bold">{q}</strong>}
        </span>
      ))}
    </>
  );
}
