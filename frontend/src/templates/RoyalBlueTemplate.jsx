import { motion } from "framer-motion";
import { getTranslation, bengaliFonts } from "../utils/translations";

// "Rajwada" - a royal-court theme. Signature element: photos framed inside
// an arched haveli-window shape, with a gold border that draws itself in
// on scroll. Ambient gold dust drifts upward through the page.

const englishFonts = {
  display: "'Cormorant Garamond', serif",
  body: "'Inter', sans-serif",
};

const palette = {
  navy: "#0B1F3D",
  navyDeep: "#071630",
  gold: "#C9A646",
  ivory: "#F3EDE0",
  teal: "#0F4C4C",
};

function ArchFrame({ src, alt, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay }}
      style={{
        position: "relative",
        width: "min(280px, 80vw)",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 200 260"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2, pointerEvents: "none" }}
      >
        <motion.path
          d="M10,260 V100 C10,40 50,10 100,10 C150,10 190,40 190,100 V260"
          fill="none"
          stroke={palette.gold}
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, delay: delay + 0.2, ease: "easeInOut" }}
        />
      </svg>
      <div
        style={{
          clipPath: "path('M10,260 V100 C10,40 50,10 100,10 C150,10 190,40 190,100 V260 Z')",
          width: "200px",
          height: "260px",
          margin: "0 auto",
          background: `${palette.ivory}`,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </motion.div>
  );
}

function GoldDust() {
  const particles = Array.from({ length: 14 });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.7, 0] }}
          transition={{
            duration: 8 + (i % 5),
            repeat: Infinity,
            delay: i * 0.9,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${(i * 7.3) % 100}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: palette.gold,
          }}
        />
      ))}
    </div>
  );
}

export default function RoyalBlueTemplate({ invite, lang, RsvpForm }) {
  const t = getTranslation(lang);
  const isBengali = lang === "bn";
  const fonts = isBengali ? bengaliFonts : englishFonts;

  const weddingDate = new Date(invite.weddingDate);
  const dateParts = {
    month: weddingDate.toLocaleString(isBengali ? "bn-BD" : "en-US", { month: "long" }),
    day: weddingDate.getDate(),
    year: weddingDate.getFullYear(),
  };

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${palette.navyDeep}, ${palette.navy})`,
        color: palette.ivory,
        fontFamily: fonts.body,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GoldDust />

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
          borderBottom: `1px solid ${palette.gold}40`,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p style={{ letterSpacing: "0.2em", fontSize: "0.8rem", color: palette.gold, marginBottom: "1.2rem", textTransform: isBengali ? "none" : "uppercase" }}>
            {t.weJoyfullyInvite}
          </p>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              marginBottom: "0.3rem",
            }}
          >
            {invite.brideName}
          </h1>
          <div style={{ color: palette.gold, fontSize: "1.6rem", margin: "0.3rem 0" }}>&</div>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            {invite.groomName}
          </h1>

          {(invite.brideFamily || invite.groomFamily) && (
            <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: `${palette.ivory}cc` }}>
              {invite.brideFamily}
              {invite.brideFamily && invite.groomFamily ? " · " : ""}
              {invite.groomFamily}
            </p>
          )}
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ marginTop: "3rem", color: palette.gold, fontSize: "0.8rem", letterSpacing: "0.15em" }}
        >
          ↓ {t.scrollHint}
        </motion.div>
      </section>

      {/* Save the Date */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ color: palette.gold, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.8rem" }}
        >
          {t.saveTheDate}
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "inline-flex",
            gap: "1.5rem",
            background: `${palette.ivory}10`,
            border: `1px solid ${palette.gold}50`,
            borderRadius: "16px",
            padding: "1.8rem 2.5rem",
            fontFamily: fonts.display,
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600 }}>{dateParts.month}</div>
            <div style={{ fontSize: "0.7rem", color: palette.gold, marginTop: 4 }}>{t.month}</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600 }}>{dateParts.day}</div>
            <div style={{ fontSize: "0.7rem", color: palette.gold, marginTop: 4 }}>{t.day}</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 600 }}>{dateParts.year}</div>
            <div style={{ fontSize: "0.7rem", color: palette.gold, marginTop: 4 }}>{t.year}</div>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      {invite.ourStory && (
        <section style={{ padding: "3rem 1.5rem 5rem", maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2rem", color: palette.gold, marginBottom: "1.2rem" }}>
            {t.ourStory}
          </h2>
          <p style={{ lineHeight: 1.8, color: `${palette.ivory}dd`, fontSize: "1.05rem" }}>
            {invite.ourStory}
          </p>
        </section>
      )}

      {/* Photo Gallery - arch frames */}
      {invite.photos?.length > 0 && (
        <section style={{ padding: "2rem 1.5rem 5rem", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2rem", color: palette.gold, textAlign: "center", marginBottom: "2.5rem" }}>
            {t.gallery}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", justifyContent: "center" }}>
            {invite.photos.map((photo, i) => (
              <ArchFrame key={photo.publicId || i} src={photo.url} alt={photo.caption || ""} delay={i * 0.1} />
            ))}
          </div>
        </section>
      )}

      {/* Venue */}
      {invite.mainVenueName && (
        <section style={{ padding: "2rem 1.5rem 5rem", textAlign: "center", position: "relative", zIndex: 2 }}>
          <p style={{ color: palette.gold, letterSpacing: "0.15em", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
            {t.where}
          </p>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2.2rem", marginBottom: "1rem" }}>{t.theVenue}</h2>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{invite.mainVenueName}</p>
          <p style={{ color: `${palette.ivory}aa`, marginBottom: "1.5rem" }}>{invite.mainVenueAddress}</p>
          {invite.mainVenueMapLink && (
            <a
              href={invite.mainVenueMapLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: palette.gold,
                color: palette.navyDeep,
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
        <section style={{ padding: "2rem 1.5rem 5rem", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontFamily: fonts.display, fontSize: "2rem", color: palette.gold, textAlign: "center", marginBottom: "2.5rem" }}>
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
                  border: `1px solid ${palette.gold}40`,
                  borderRadius: "12px",
                  padding: "1.3rem 1.5rem",
                  background: `${palette.ivory}08`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ fontFamily: fonts.display, fontSize: "1.3rem" }}>{ev.name}</h3>
                  <span style={{ color: palette.gold, fontSize: "0.85rem" }}>
                    {new Date(ev.date).toLocaleDateString(isBengali ? "bn-BD" : "en-US", { month: "short", day: "numeric" })} · {ev.time}
                  </span>
                </div>
                {ev.description && <p style={{ color: `${palette.ivory}bb`, marginTop: "0.4rem", fontSize: "0.95rem" }}>{ev.description}</p>}
                {(ev.venueName || ev.dressCode) && (
                  <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: `${palette.ivory}99` }}>
                    {ev.venueName && <div>{ev.venueName}</div>}
                    {ev.dressCode && <div>{t.dressCode}: {ev.dressCode}</div>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP - rendered by parent, themed wrapper here */}
      {RsvpForm && (
        <section style={{ padding: "2rem 1.5rem 6rem", position: "relative", zIndex: 2 }}>
          <RsvpForm lang={lang} accent={palette.gold} textColor={palette.ivory} bg={`${palette.ivory}08`} fonts={fonts} />
        </section>
      )}

      <footer style={{ textAlign: "center", padding: "2rem", color: `${palette.ivory}66`, fontSize: "0.85rem", position: "relative", zIndex: 2 }}>
        {t.footerThanks}
      </footer>
    </div>
  );
}
