import { useState } from "react";
import { motion } from "framer-motion";
import { getTranslation, bengaliFonts } from "../utils/translations";

// "Shubh Vivah" - classic traditional red-and-gold wedding card theme,
// directly inspired by the bold white-on-red Bengali calligraphy headline
// style (Galada) seen on real Bengali wedding cards, with cream/gold
// butterfly and floral motifs drifting across a solid carmine background.

const englishFonts = {
  display: "'Cormorant', serif",
  body: "'Inter', sans-serif",
};

const palette = {
  carmine: "#9B1B30",
  maroon: "#5C0F1F",
  gold: "#D4AF37",
  cream: "#FBF1E0",
};

// Ambient motifs: the gold flower (❀) and cream star (✦) — the same two
// symbols already used elsewhere on this card (hero flourish, old
// butterfly) — now drift top-to-bottom across the whole page. The travel
// curve (times/positions) is copied exactly from the Rajwada theme's
// falling garland so both themes fall at the same speed.
const FALL_TIMES = [0, 0.08, 0.92, 1];
const FALL_Y = ["-5vh", "3.8vh", "96.2vh", "105vh"];

const FLOWERS = [
  { left: "10%", delay: 0, duration: 12, size: "1.6rem" },
  { left: "38%", delay: 5, duration: 14, size: "1.5rem" },
  { left: "66%", delay: 2.5, duration: 11, size: "1.5rem" },
  { left: "88%", delay: 7, duration: 13, size: "1.3rem" },
];

const STARS = [
  { left: "6%", delay: 0.5, duration: 10, size: "1.2rem" },
  { left: "18%", delay: 2.5, duration: 11.5, size: "1rem" },
  { left: "30%", delay: 4, duration: 9.5, size: "1.3rem" },
  { left: "42%", delay: 1, duration: 12, size: "0.95rem" },
  { left: "54%", delay: 5.5, duration: 10.5, size: "1.2rem" },
  { left: "62%", delay: 3, duration: 11, size: "1rem" },
  { left: "74%", delay: 6.5, duration: 9, size: "1.1rem" },
  { left: "84%", delay: 2, duration: 12.5, size: "0.95rem" },
  { left: "94%", delay: 4.5, duration: 10, size: "1.2rem" },
];

function FallingMotifs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {FLOWERS.map((f, i) => (
        <motion.div
          key={`fl-${i}`}
          initial={{ y: FALL_Y[0], opacity: 0, rotate: 0 }}
          animate={{ y: FALL_Y, opacity: [0, 0.85, 0.85, 0], rotate: [0, 27.2, 312.8, 340] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "linear", times: FALL_TIMES }}
          style={{ position: "absolute", left: f.left, fontSize: f.size, color: palette.gold }}
        >
          ❀
        </motion.div>
      ))}
      {STARS.map((s, i) => (
        <motion.div
          key={`st-${i}`}
          initial={{ y: FALL_Y[0], x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: FALL_Y, x: [0, 2.88, -5.52, -10], opacity: [0, 0.75, 0.75, 0], rotate: [0, 25.6, 294.4, 320] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "linear", times: FALL_TIMES }}
          style={{ position: "absolute", left: s.left, fontSize: s.size, color: palette.cream }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}

function ScratchDateCard({ value, label, isBengali }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      onClick={() => setRevealed(true)}
      style={{
        position: "relative",
        width: 140,
        height: 110,
        borderRadius: 12,
        cursor: "pointer",
        overflow: "hidden",
        border: `2px solid ${palette.gold}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: palette.cream,
          color: palette.maroon,
          fontFamily: "'Cormorant', serif",
        }}
      >
        <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>{revealed ? value : "?"}</span>
        <span style={{ fontSize: "0.7rem", marginTop: 4, color: palette.carmine }}>{label}</span>
      </div>
      {!revealed && (
        <motion.div
          whileTap={{ scale: 0.96 }}
          style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(135deg, ${palette.gold}, ${palette.gold} 10px, #c9a02f 10px, #c9a02f 20px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.maroon,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {isBengali ? "স্ক্র্যাচ করুন" : "SCRATCH"}
        </motion.div>
      )}
    </div>
  );
}

export default function CarmineRedTemplate({ invite, lang, RsvpForm }) {
  const t = getTranslation(lang);
  const isBengali = lang === "bn";
  const fonts = isBengali ? bengaliFonts : englishFonts;

  const weddingDate = new Date(invite.weddingDate);
  const locale = isBengali ? "bn-BD" : "en-US";

  return (
    <div
      style={{
        background: `radial-gradient(ellipse at top, ${palette.carmine}, ${palette.maroon})`,
        color: palette.cream,
        fontFamily: fonts.body,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FallingMotifs />

      {/* Hero - bold calligraphic headline like the reference card */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Decorative top mandala-ish flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.5, scale: 1, rotate: 360 }}
          transition={{ opacity: { duration: 1 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
          style={{ fontSize: "2rem", color: palette.gold, marginBottom: "1rem" }}
        >
          ❀
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ letterSpacing: "0.15em", fontSize: "0.8rem", color: palette.gold, marginBottom: "1rem" }}
        >
          {t.weJoyfullyInvite}
        </motion.p>

        {/* Bold white calligraphic-style names, exactly like the card's white headline on red */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.6rem, 9vw, 5rem)",
            fontWeight: isBengali ? 400 : 600,
            color: palette.cream,
            lineHeight: 1.2,
            textShadow: `0 2px 14px ${palette.maroon}`,
          }}
        >
          {invite.brideName}
        </motion.h1>
        <div style={{ color: palette.gold, fontSize: "1.8rem", margin: "0.4rem 0" }}>&</div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(2.6rem, 9vw, 5rem)",
            fontWeight: isBengali ? 400 : 600,
            color: palette.cream,
            lineHeight: 1.2,
            textShadow: `0 2px 14px ${palette.maroon}`,
          }}
        >
          {invite.groomName}
        </motion.h1>

        {(invite.brideFamily || invite.groomFamily) && (
          <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: `${palette.cream}cc` }}>
            {invite.brideFamily}
            {invite.brideFamily && invite.groomFamily ? " · " : ""}
            {invite.groomFamily}
          </p>
        )}

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ marginTop: "3rem", color: palette.gold, fontSize: "0.8rem", letterSpacing: "0.15em" }}
        >
          ↓ {t.scrollHint}
        </motion.div>
      </section>

      {/* Save the Date - scratch reveal */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ color: palette.gold, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
          {t.saveTheDate}
        </p>
        <p style={{ color: `${palette.cream}cc`, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          {t.scratchToReveal}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <ScratchDateCard
            value={weddingDate.toLocaleString(locale, { month: "long" })}
            label={t.month}
            isBengali={isBengali}
          />
          <ScratchDateCard value={weddingDate.getDate()} label={t.day} isBengali={isBengali} />
          <ScratchDateCard value={weddingDate.getFullYear()} label={t.year} isBengali={isBengali} />
        </div>
      </section>

      {/* Our Story */}
      {invite.ourStory && (
        <section style={{ padding: "1rem 1.5rem 5rem", maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: palette.gold, marginBottom: "1.2rem" }}>
            {t.ourStory}
          </h2>
          <p style={{ lineHeight: 1.8, color: `${palette.cream}dd`, fontSize: "1.05rem" }}>{invite.ourStory}</p>
        </section>
      )}

      {/* Photo Gallery - simple rounded frames with gold border, cream mat */}
      {invite.photos?.length > 0 && (
        <section style={{ padding: "1rem 1.5rem 5rem", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: palette.gold, textAlign: "center", marginBottom: "2.2rem" }}>
            {t.gallery}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
            {invite.photos.map((photo, i) => (
              <motion.div
                key={photo.publicId || i}
                initial={{ opacity: 0, rotate: i % 2 === 0 ? -4 : 4, y: 20 }}
                whileInView={{ opacity: 1, rotate: i % 2 === 0 ? -2 : 2, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  background: palette.cream,
                  padding: "10px 10px 28px",
                  borderRadius: 4,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  width: 220,
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || ""}
                  style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Venue */}
      {invite.mainVenueName && (
        <section style={{ padding: "1rem 1.5rem 5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ color: palette.gold, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{t.where}</p>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.2rem", marginBottom: "1rem" }}>{t.theVenue}</h2>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{invite.mainVenueName}</p>
          <p style={{ color: `${palette.cream}aa`, marginBottom: "1.5rem" }}>{invite.mainVenueAddress}</p>
          {invite.mainVenueMapLink && (
            <a
              href={invite.mainVenueMapLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: palette.gold,
                color: palette.maroon,
                padding: "0.7rem 1.8rem",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              {t.getDirections}
            </a>
          )}
        </section>
      )}

      {/* Event Schedule */}
      {invite.events?.length > 0 && (
        <section style={{ padding: "1rem 1.5rem 5rem", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: palette.gold, textAlign: "center", marginBottom: "2.2rem" }}>
            {t.scheduleTitle}
          </h2>
          <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {invite.events.map((ev, i) => (
              <motion.div
                key={ev._id || i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  border: `1.5px solid ${palette.gold}60`,
                  borderRadius: "10px",
                  padding: "1.2rem 1.4rem",
                  background: `${palette.cream}12`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ fontFamily: fonts.display, fontSize: "1.3rem" }}>{ev.name}</h3>
                  <span style={{ color: palette.gold, fontSize: "0.85rem" }}>
                    {new Date(ev.date).toLocaleDateString(locale, { month: "short", day: "numeric" })} · {ev.time}
                  </span>
                </div>
                {ev.description && <p style={{ color: `${palette.cream}bb`, marginTop: "0.4rem", fontSize: "0.95rem" }}>{ev.description}</p>}
                {(ev.venueName || ev.dressCode) && (
                  <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: `${palette.cream}99` }}>
                    {ev.venueName && <div>{ev.venueName}</div>}
                    {ev.dressCode && <div>{t.dressCode}: {ev.dressCode}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {RsvpForm && (
        <section style={{ padding: "1rem 1.5rem 6rem", position: "relative", zIndex: 2 }}>
          <RsvpForm lang={lang} accent={palette.gold} textColor={palette.cream} bg={`${palette.cream}10`} fonts={fonts} />
        </section>
      )}

      <footer style={{ textAlign: "center", padding: "2rem", color: `${palette.cream}66`, fontSize: "0.85rem", position: "relative", zIndex: 2 }}>
        {t.footerThanks}
      </footer>
    </div>
  );
}
