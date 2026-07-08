import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "var(--paper)",
      }}
    >
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", marginBottom: "0.5rem" }}>
        404
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.6rem" }}>
        We couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "0.7rem 1.6rem",
          borderRadius: 999,
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        Go home
      </Link>
    </div>
  );
}
