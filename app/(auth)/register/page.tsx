import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - ReSell Hub",
  description: "Create your ReSell Hub account",
};

export default function RegisterPage() {
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
      <div className="card animate-scale-in" style={{ padding: "2.5rem", width: "100%", maxWidth: "480px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Join ReSell Hub 🛍️
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Create your account to start buying and selling
        </p>
        {/* Register form will be implemented in Phase 2 */}
        <p style={{ color: "var(--text-muted)", textAlign: "center", fontSize: "0.875rem" }}>
          Register form — Phase 2
        </p>
      </div>
    </div>
  );
}
