import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - ReSell Hub",
  description: "Login to your ReSell Hub account",
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="card animate-scale-in" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Welcome back 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Login to ReSell Hub
        </p>
        {/* Auth form will be implemented in Phase 2 */}
        <p style={{ color: "var(--text-muted)", textAlign: "center", fontSize: "0.875rem" }}>
          Login form — Phase 2
        </p>
      </div>
    </div>
  );
}
