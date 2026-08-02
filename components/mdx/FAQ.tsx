type QAPair = { question: string; answer: string };

export function FAQ({ items }: { items: QAPair[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="my-8 border-t border-hairline pt-8">
        <h2 className="text-2xl font-semibold text-text">Frequently asked questions</h2>
        <dl className="mt-6 space-y-6">
          {items.map((item, i) => (
            <div key={i} className="rounded-[16px] border border-hairline bg-surface p-5">
              <dt className="font-semibold text-text">{item.question}</dt>
              <dd className="mt-2 text-sm text-text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
