import { motion } from "framer-motion";

// A small floating pill the guest can tap to flip between English and
// Bengali labels/fonts. This never changes what's stored in the database -
// it only changes how this one guest's browser renders the page right now.
export default function LanguageToggle({ lang, onChange, accentColor = "#1a1a1a" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 50,
        display: "flex",
        background: "rgba(255,255,255,0.9)",
        borderRadius: "999px",
        padding: "4px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        backdropFilter: "blur(6px)",
      }}
    >
      <button
        onClick={() => onChange("en")}
        aria-pressed={lang === "en"}
        style={{
          padding: "0.4rem 0.85rem",
          borderRadius: "999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          background: lang === "en" ? accentColor : "transparent",
          color: lang === "en" ? "#fff" : "#444",
          transition: "background 0.2s ease",
        }}
      >
        EN
      </button>
      <button
        onClick={() => onChange("bn")}
        aria-pressed={lang === "bn"}
        style={{
          padding: "0.4rem 0.85rem",
          borderRadius: "999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          fontFamily: "'Noto Serif Bengali', serif",
          background: lang === "bn" ? accentColor : "transparent",
          color: lang === "bn" ? "#fff" : "#444",
          transition: "background 0.2s ease",
        }}
      >
        বাং
      </button>
    </motion.div>
  );
}
