export function CalloutDark({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-6 rounded-[16px] border border-hairline bg-surface p-6">
      {title && <p className="text-sm font-semibold text-text">{title}</p>}
      <div className="text-sm text-text-muted">{children}</div>
    </div>
  );
}
