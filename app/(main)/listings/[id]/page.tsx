import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product Details - ReSell Hub`,
    description: `View product details on ReSell Hub`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>
          Product Detail
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Product ID: {id} — Phase 3
        </p>
      </div>
    </div>
  );
}
