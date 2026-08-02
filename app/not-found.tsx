import { LinkButton } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-[1160px] px-6 py-20 md:py-32">
      <div className="max-w-xl">
        <p className="text-caption font-medium uppercase tracking-widest text-text-dim">404</p>
        <h1 className="mt-4 text-title">Page not found</h1>
        <p className="mt-4 text-body">
          The page you are looking for does not exist or has been moved. If you were expecting a calculator, glossary term, or guide, try one of the links below.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LinkButton href="/" variant="primary">
            Go home
          </LinkButton>
          <LinkButton href="/glossary" variant="secondary">
            Browse the glossary
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
