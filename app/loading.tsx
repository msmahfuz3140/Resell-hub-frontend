// Loading skeleton component for pages
export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="container" style={{ paddingTop: "2rem" }}>
        {/* Hero skeleton */}
        <div
          className="skeleton"
          style={{ height: "500px", marginBottom: "3rem" }}
        />

        {/* Cards skeleton grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: "1rem" }}>
              <div
                className="skeleton"
                style={{ height: "200px", marginBottom: "1rem" }}
              />
              <div
                className="skeleton"
                style={{ height: "1.25rem", marginBottom: "0.5rem", width: "80%" }}
              />
              <div
                className="skeleton"
                style={{ height: "1rem", width: "60%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
