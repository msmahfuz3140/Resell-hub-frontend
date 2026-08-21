export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Dashboard sidebar will be added in Phase 4 */}
      {children}
    </div>
  );
}
