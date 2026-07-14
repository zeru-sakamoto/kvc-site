// Renders a JSON-LD structured-data block for search engines and AI answer
// engines. Server component; serialized once at render. Reused by the root
// layout, the homepage, the docs, and the discovery pages.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is trusted, build-time content from lib/content.ts. Escaping `<`
      // still closes the one hole that matters: a stray `</script>` breaking out.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
