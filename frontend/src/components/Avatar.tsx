const PALETTE = ["#007aff", "#34c759", "#ff9500", "#5856d6", "#ff2d55", "#30b0c7", "#af52de", "#a2845e"];

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase text-white"
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.4 }}
    >
      {name.slice(0, 2)}
    </span>
  );
}
