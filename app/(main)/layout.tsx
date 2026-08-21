export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar will be added here in Phase 2 */}
      <main style={{ flex: 1 }}>{children}</main>
      {/* Footer will be added here in Phase 2 */}
    </div>
  );
}
