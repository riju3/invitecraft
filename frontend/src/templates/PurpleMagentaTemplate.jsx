import { motion } from "framer-motion";
import { getTranslation, bengaliFonts } from "../utils/translations";

// "Sangeet Nights" - jewel-toned, modern-romantic theme. Same full wedding
// invitation structure as Rajwada and Shubh Vivah. Signature element: a
// flowing silk-ribbon SVG that drapes across the hero, plus an asymmetric
// tilted photo card stack instead of a grid.

const englishFonts = {
  display: "'Italiana', serif",
  body: "'Inter', sans-serif",
};

const palette = {
  plum: "#3D1238",
  nearBlack: "#1A0E1A",
  magenta: "#A91079",
  roseGold: "#D88FA3",
};

function RibbonFlow({ delay = 0 }) {
  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 90, display: "block" }}
    >
      <motion.path
        d="M0,60 C80,10 140,110 200,60 C260,10 320,110 400,60"
        fill="none"
        stroke={palette.roseGold}
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.85 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.8, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

function EmberGlow() {
  const particles = Array.from({ length: 10 });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "105vh", opacity: 0, scale: 0.5 }}
          animate={{ y: "-5vh", opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 9 + (i % 4), repeat: Infinity, delay: i * 1.1, ease: "linear" }}
          style={{
            position: "absolute",
            left: `${(i * 11) % 100}%`,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: palette.magenta,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

export default function PurpleMagentaTemplate({ invite, lang, RsvpForm }) {
  const t = getTranslation(lang);
  const isBengali = lang === "bn";
  const fonts = isBengali ? bengaliFonts : englishFonts;

  const weddingDate = new Date(invite.weddingDate);
  const locale = isBengali ? "bn-BD" : "en-US";

  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${palette.nearBlack}, ${palette.plum})`,
        color: palette.roseGold,
        fontFamily: fonts.body,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <EmberGlow />

      {/* Hero */}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <p
            style={{
              letterSpacing: "0.2em",
              fontSize: "0.8rem",
              color: palette.magenta,
              marginBottom: "1.2rem",
              textTransform: isBengali ? "none" : "uppercase",
            }}
          >
            {t.weJoyfullyInvite}
          </p>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
              fontWeight: isBengali ? 400 : 500,
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            {invite.brideName}
          </h1>
          <div style={{ color: palette.magenta, fontSize: "1.6rem", margin: "0.3rem 0" }}>&</div>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
              fontWeight: isBengali ? 400 : 500,
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            {invite.groomName}
          </h1>

          {(invite.brideFamily || invite.groomFamily) && (
            <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: `${palette.roseGold}cc` }}>
              {invite.brideFamily}
              {invite.brideFamily && invite.groomFamily ? " · " : ""}
              {invite.groomFamily}
            </p>
          )}
        </motion.div>

        {/* Signature ribbon flowing beneath the names */}
        <div style={{ width: "min(420px, 90vw)", marginTop: "1.5rem" }}>
          <RibbonFlow delay={0.4} />
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ marginTop: "1.5rem", color: palette.magenta, fontSize: "0.8rem", letterSpacing: "0.15em" }}
        >
          ↓ {t.scrollHint}
        </motion.div>
      </section>

      {/* Save the Date */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{ color: palette.magenta, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.8rem" }}>
          {t.saveTheDate}
        </p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            gap: "1.5rem",
            background: `${palette.magenta}1a`,
            border: `1px solid ${palette.roseGold}50`,
            borderRadius: "16px",
            padding: "1.8rem 2.5rem",
            fontFamily: fonts.display,
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: "#fff" }}>
              {weddingDate.toLocaleString(locale, { month: "long" })}
            </div>
            <div style={{ fontSize: "0.7rem", color: palette.magenta, marginTop: 4 }}>{t.month}</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: "#fff" }}>{weddingDate.getDate()}</div>
            <div style={{ fontSize: "0.7rem", color: palette.magenta, marginTop: 4 }}>{t.day}</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: "#fff" }}>{weddingDate.getFullYear()}</div>
            <div style={{ fontSize: "0.7rem", color: palette.magenta, marginTop: 4 }}>{t.year}</div>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      {invite.ourStory && (
        <section style={{ padding: "1rem 1.5rem 5rem", maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: "#fff", marginBottom: "1.2rem" }}>
            {t.ourStory}
          </h2>
          <p style={{ lineHeight: 1.8, color: `${palette.roseGold}dd`, fontSize: "1.05rem" }}>{invite.ourStory}</p>
        </section>
      )}

      {/* Photo Gallery - asymmetric tilted card stack, not a grid */}
      {invite.photos?.length > 0 && (
        <section style={{ padding: "1rem 1.5rem 5rem", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: "#fff", textAlign: "center", marginBottom: "2.5rem" }}>
            {t.gallery}
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.8rem",
              justifyContent: "center",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {invite.photos.map((photo, i) => {
              const offsets = [-6, 4, -3, 7, -8, 5];
              const rotate = offsets[i % offsets.length];
              const lift = i % 3 === 1 ? 18 : 0;
              return (
                <motion.div
                  key={photo.publicId || i}
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: -lift, rotate }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  whileHover={{ rotate: 0, scale: 1.04 }}
                  style={{
                    width: 200,
                    height: 250,
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
                    border: `1px solid ${palette.roseGold}40`,
                  }}
                >
                  <img src={photo.url} alt={photo.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Venue */}
      {invite.mainVenueName && (
        <section style={{ padding: "1rem 1.5rem 5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ color: palette.magenta, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{t.where}</p>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.2rem", color: "#fff", marginBottom: "1rem" }}>{t.theVenue}</h2>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{invite.mainVenueName}</p>
          <p style={{ color: `${palette.roseGold}aa`, marginBottom: "1.5rem" }}>{invite.mainVenueAddress}</p>
          {invite.mainVenueMapLink && (
            <a
              href={invite.mainVenueMapLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: palette.magenta,
                color: "#fff",
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
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.1rem", color: "#fff", textAlign: "center", marginBottom: "2.5rem" }}>
            {t.scheduleTitle}
          </h2>
          <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {invite.events.map((ev, i) => (
              <motion.div
                key={ev._id || i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  border: `1px solid ${palette.roseGold}40`,
                  borderRadius: "12px",
                  padding: "1.3rem 1.5rem",
                  background: `${palette.magenta}12`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ fontFamily: fonts.display, fontSize: "1.3rem", color: "#fff" }}>{ev.name}</h3>
                  <span style={{ color: palette.magenta, fontSize: "0.85rem" }}>
                    {new Date(ev.date).toLocaleDateString(locale, { month: "short", day: "numeric" })} · {ev.time}
                  </span>
                </div>
                {ev.description && <p style={{ color: `${palette.roseGold}bb`, marginTop: "0.4rem", fontSize: "0.95rem" }}>{ev.description}</p>}
                {(ev.venueName || ev.dressCode) && (
                  <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: `${palette.roseGold}99` }}>
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
          <RsvpForm lang={lang} accent={palette.magenta} textColor={palette.roseGold} bg={`${palette.magenta}10`} fonts={fonts} />
        </section>
      )}

      <footer style={{ textAlign: "center", padding: "2rem", color: `${palette.roseGold}66`, fontSize: "0.85rem", position: "relative", zIndex: 2 }}>
        {t.footerThanks}
      </footer>
    </div>
  );
}
