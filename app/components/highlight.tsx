type Tone = 'cool' | 'warm' | 'blue';

const toneClass: Record<Tone, string> = {
  cool: 'text-accent-cool',
  warm: 'text-accent-warm',
  blue: 'text-brand-blue',
};

// Wraps the first occurrence of `phrase` in `text` in an accent color, so the
// one most intriguing detail per paragraph reads at a glance against the
// muted body copy around it.
export function emphasize(text: string, phrase: string, tone: Tone) {
  const start = text.indexOf(phrase);
  if (start === -1) return text;
  return (
    <>
      {text.slice(0, start)}
      <span className={`${toneClass[tone]} font-semibold`}>{phrase}</span>
      {text.slice(start + phrase.length)}
    </>
  );
}
