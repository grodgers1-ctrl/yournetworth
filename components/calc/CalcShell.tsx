export function CalcShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-studio">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
