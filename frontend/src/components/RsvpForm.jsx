import { useState } from "react";
import { motion } from "framer-motion";
import { getTranslation } from "../utils/translations";
import api from "../utils/api";

// Rendered inside each template via the RsvpForm prop slot. Receives the
// host template's accent color, text color, background tint, and font
// pair so it blends in rather than looking like a bolted-on generic form.
// Guests submit this with no login - it posts to a public endpoint.
export default function RsvpForm({ lang, accent, textColor, bg, fonts, inviteId, events = [] }) {
  const t = getTranslation(lang);
  const isBengali = lang === "bn";

  const [name, setName] = useState("");
  const [attending, setAttending] = useState({});
  const [song, setSong] = useState("");
  const [diet, setDiet] = useState("none");
  const [advice, setAdvice] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const toggleEvent = (eventId) => {
    setAttending((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus("sending");
    try {
      await api.post(`/invites/${inviteId}/rsvp`, {
        guestName: name,
        attendingEvents: Object.keys(attending).filter((id) => attending[id]),
        songRequest: song,
        dietaryPreference: diet,
        advice,
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem 0.9rem",
    borderRadius: 8,
    border: `1px solid ${accent}50`,
    background: "rgba(255,255,255,0.06)",
    color: textColor,
    fontFamily: fonts.body,
    fontSize: "0.95rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    marginBottom: "0.4rem",
    color: textColor,
    opacity: 0.85,
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: 480,
          margin: "0 auto",
          textAlign: "center",
          padding: "2.5rem 1.5rem",
          border: `1px solid ${accent}50`,
          borderRadius: 14,
          background: bg,
        }}
      >
        <p style={{ fontFamily: fonts.display, fontSize: "1.3rem", color: textColor }}>{t.rsvpSent}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        border: `1px solid ${accent}40`,
        borderRadius: 14,
        background: bg,
      }}
    >
      <h2 style={{ fontFamily: fonts.display, fontSize: "1.8rem", color: textColor, textAlign: "center", marginBottom: "0.4rem" }}>
        {t.rsvpTitle}
      </h2>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: textColor, opacity: 0.75, marginBottom: "1.6rem" }}>
        {t.rsvpSubtitle}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <div>
          <label style={labelStyle}>{t.yourName}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {events.length > 0 && (
          <div>
            <label style={labelStyle}>{t.scheduleTitle}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {events.map((ev) => (
                <label
                  key={ev._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.6rem 0.8rem",
                    borderRadius: 8,
                    border: `1px solid ${accent}30`,
                    cursor: "pointer",
                    color: textColor,
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!attending[ev._id]}
                    onChange={() => toggleEvent(ev._id)}
                    style={{ width: "auto", accentColor: accent }}
                  />
                  {ev.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label style={labelStyle}>{t.songRequest}</label>
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder={t.songPlaceholder}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>{t.dietaryPreferences}</label>
          <select value={diet} onChange={(e) => setDiet(e.target.value)} style={inputStyle}>
            <option value="none">{t.noPreference}</option>
            <option value="vegetarian">{t.vegetarian}</option>
            <option value="vegan">{t.vegan}</option>
            <option value="gluten-free">{t.glutenFree}</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>{t.adviceTitle}</label>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder={t.advicePlaceholder}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            marginTop: "0.4rem",
            padding: "0.8rem",
            borderRadius: 999,
            background: accent,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            opacity: status === "sending" ? 0.7 : 1,
          }}
        >
          {status === "sending" ? "..." : t.submitRsvp}
        </button>

        {status === "error" && (
          <p style={{ color: "#ff8080", fontSize: "0.85rem", textAlign: "center" }}>
            {isBengali ? "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।" : "Something went wrong. Please try again."}
          </p>
        )}
      </form>
    </motion.div>
  );
}
