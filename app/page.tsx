import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)",
          padding: "6rem 1rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)`,
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div
            className="badge badge-primary animate-fade-in"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              marginBottom: "1.5rem",
              display: "inline-flex",
              fontSize: "0.875rem",
              padding: "0.375rem 1rem",
            }}
          >
            🛍️ Bangladesh&apos;s Trusted Marketplace
          </div>

          <h1
            className="animate-fade-in"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "white",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
            }}
          >
            Buy & Sell
            <br />
            <span style={{ color: "#fbbf24" }}>Second-Hand Items</span>
            <br />
            <span style={{ fontSize: "0.7em", opacity: 0.9 }}>Safely & Easily</span>
          </h1>

          <p
            className="animate-fade-in"
            style={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "2.5rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Join thousands of Bangladeshis buying and selling pre-loved items.
            Get great deals on electronics, clothing, furniture, and more.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/listings"
              className="btn"
              style={{
                background: "white",
                color: "#4f46e5",
                padding: "0.875rem 2rem",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "0.75rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
            >
              Browse Listings →
            </Link>
            <Link
              href="/register"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.4)",
                padding: "0.875rem 2rem",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "0.75rem",
              }}
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: "white", padding: "3rem 1rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {[
              { value: "50K+", label: "Active Listings" },
              { value: "25K+", label: "Happy Users" },
              { value: "12", label: "Categories" },
              { value: "99%", label: "Safe Transactions" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem" }}
            >
              Browse by Category
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "1rem",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/listings?category=${cat.id}`}
                className="card"
                style={{
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "block",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                  {cat.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e1b4b, #312e81)",
          padding: "5rem 1rem",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Ready to Start Selling?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
              fontSize: "1.125rem",
            }}
          >
            List your items for free and reach thousands of buyers.
          </p>
          <Link
            href="/register"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              padding: "1rem 2.5rem",
              fontSize: "1.125rem",
              fontWeight: 700,
              borderRadius: "0.875rem",
              boxShadow: "0 8px 30px rgba(245, 158, 11, 0.4)",
            }}
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}
