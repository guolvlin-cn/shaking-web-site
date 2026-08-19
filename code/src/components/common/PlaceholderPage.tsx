interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="section-title-accent">
        <h1 className="section-title" data-testid="page-title">
          {title}
        </h1>
      </div>
      {description && (
        <p className="mt-4 text-text-secondary" data-testid="page-description">
          {description}
        </p>
      )}
      <div className="mt-8 rounded-card border border-border bg-bg-card p-8 text-center text-caption text-text-secondary">
        该模块开发中，敬请期待
      </div>
    </main>
  );
}
