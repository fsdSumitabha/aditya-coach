// Re-mounts on every navigation → a soft 0.5s rise-in between routes
// (CSS-only; disabled under prefers-reduced-motion).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
