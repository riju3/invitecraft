import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const THEMES = [
  { name: "Rajwada", tagline: "Regal navy & gold", swatch: "linear-gradient(135deg, #0B1F3D, #0F4C4C)" },
  { name: "Sangeet Nights", tagline: "Jewel-toned plum & magenta", swatch: "linear-gradient(135deg, #1A0E1A, #A91079)" },
  { name: "Shubh Vivah", tagline: "Classic red & gold", swatch: "linear-gradient(135deg, #9B1B30, #5C0F1F)" },
];

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.3rem 1.5rem",
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600 }}>
          InviteCraft
        </span>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <Link to="/login" className="btn-text">
            Log in
          </Link>
          <Link
            to="/register"
            style={{
              background: "var(--ink)",
              color: "#fff",
              padding: "0.5rem 1.1rem",
              borderRadius: 8,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      <section style={{ textAlign: "center", padding: "4rem 1.5rem 3rem" }}>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 7vw, 3.4rem)",
            lineHeight: 1.2,
            maxWidth: 680,
            margin: "0 auto 1rem",
          }}
        >
          Beautiful wedding invitations, ready to share in minutes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto 2rem" }}
        >
          Pick a theme, add your details and photos, and get one link your guests
          can open instantly — no login required on their end.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link
            to="/register"
            style={{
              display: "inline-block",
              background: "var(--ink)",
              color: "#fff",
              padding: "0.9rem 2rem",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            Create your invitation
          </Link>
        </motion.div>
      </section>

      <section style={{ padding: "2rem 1.5rem 5rem", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "2rem" }}>
          Three themes to choose from
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {THEMES.map((theme, i) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "#fff",
              }}
            >
              <div style={{ height: 100, background: theme.swatch }} />
              <div style={{ padding: "1.1rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "0.2rem" }}>
                  {theme.name}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{theme.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "2rem", color: "var(--muted)", fontSize: "0.85rem" }}>
        Available in English and বাংলা.
      </footer>
    </div>
  );
}
