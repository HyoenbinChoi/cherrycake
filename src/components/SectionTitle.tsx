// components/SectionTitle.tsx
export default function SectionTitle({ k, e }: { k: string; e?: string }) {
  return (
    <header className="mb-6">
      <h2 className="h2">{e ?? "Decoding Emotions"}</h2>
      <p className="cap mt-1">{k}</p>
    </header>
  );
}
