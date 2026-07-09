import { motion } from "framer-motion";
import { getTranslation, bengaliFonts } from "../utils/translations";

// "Rajwada" - a moonlit-court theme. Deep violet night sky, frost-white
// ink, gold accents. Signature elements: the couple's names set in a
// flowing calligraphic script, arched haveli-window photo frames with a
// gold border that draws itself in on scroll, and flowers + leaves
// drifting down through the page like petals shaken loose from a garland.

const englishFonts = {
  display: "'Cormorant Garamond', serif",
  script: "'Alex Brush', cursive",
  body: "'Inter', sans-serif",
};

const palette = {
  navy: "#1C0B5C",
  navyMid: "#11003D",
  navyDeep: "#0A0028",
  gold: "#C9A646",
  ivory: "#F5F0FF",
};

// Small pink flower cluster, reused as a falling-petal sprite.
const FLOWER_DATA_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><g><path style='fill:%23FF80AC;' d='M311.382,320.494H200.328c-16.978,30.049-27.952,72.457-27.952,108.028c0,55.392,28.087,83.478,83.478,83.478s83.478-28.087,83.478-83.478C339.333,392.951,328.361,350.543,311.382,320.494z'/><path style='fill:%23FF80AC;' d='M172.388,240.162c-0.055,0-0.109,0-0.158,0c-34.511,0.321-76.712,12.016-107.522,29.804C16.735,297.663,6.459,336.027,34.154,384c8.048,13.945,21.266,33.446,43.027,41.809c6.945,2.668,14.271,4,21.961,4c15.038,0,31.446-5.092,49.044-15.255c30.816-17.788,62.049-48.494,79.581-78.228L172.388,240.162z'/></g><g><path style='fill:%23F26D99;' d='M477.556,128c-8.048-13.945-21.266-33.446-43.027-41.809c-20.532-7.891-44.413-4.108-71.005,11.255c-30.816,17.788-62.049,48.494-79.581,78.228l55.381,96.162c0.055,0,0.109,0,0.158,0c34.511-0.321,76.712-12.016,107.522-29.804c26.593-15.348,41.82-34.147,45.255-55.859C495.888,163.147,485.605,141.945,477.556,128z'/><path style='fill:%23F26D99;' d='M492.257,325.826c-3.435-21.712-18.664-40.51-45.255-55.859c-30.81-17.788-73.011-29.483-107.522-29.804c-0.049,0-0.104,0-0.158,0l-55.381,96.162c17.533,29.734,48.766,60.44,79.581,78.228c17.598,10.163,34.006,15.255,49.044,15.255c7.684,0,15.016-1.331,21.961-4c21.761-8.365,34.979-27.864,43.027-41.809S495.888,348.853,492.257,325.826z'/></g><g><path style='fill:%23FF80AC;' d='M148.187,97.446C121.6,82.093,97.73,78.309,77.181,86.191C55.42,94.554,42.203,114.055,34.154,128c-27.696,47.973-17.418,86.337,30.554,114.032c30.81,17.788,73.011,29.483,107.522,29.804c0.049,0,0.104,0,0.158,0l55.381-96.162C210.236,145.94,179.001,115.233,148.187,97.446z'/><path style='fill:%23FF80AC;' d='M255.855,0c-55.392,0-83.478,28.087-83.478,83.478c0,35.571,10.972,77.979,27.951,108.028h111.054c16.979-30.049,27.952-72.457,27.952-108.028C339.333,28.087,311.247,0,255.855,0z'/></g><path style='fill:%23F26D99;' d='M311.382,191.506c16.978-30.049,27.951-72.457,27.951-108.028C339.333,28.087,311.247,0,255.855,0v191.506H311.382z'/><path style='fill:%23FFE0B2;' d='M255.855,356.174c-55.234,0-100.174-44.94-100.174-100.174s44.94-100.174,100.174-100.174S356.029,200.766,356.029,256S311.088,356.174,255.855,356.174z'/><path style='fill:%23FFC033;' d='M255.855,189.217c-36.826,0-66.783,29.956-66.783,66.783s29.956,66.783,66.783,66.783s66.783-29.956,66.783-66.783S292.681,189.217,255.855,189.217z'/><path style='fill:%23F26D99;' d='M255.855,320.494V512c55.392,0,83.478-28.087,83.478-83.478c0-35.571-10.972-77.979-27.951-108.028H255.855z'/><path style='fill:%23FDCD99;' d='M356.029,256c0-55.234-44.94-100.174-100.174-100.174v200.348C311.088,356.174,356.029,311.234,356.029,256z'/><path style='fill:%23F9A926;' d='M322.637,256c0-36.826-29.956-66.783-66.783-66.783v133.565C292.681,322.783,322.637,292.826,322.637,256z'/></svg>";

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

// Ambient garland: flowers + leaves drift down through the whole page.
// Left position, delay, and duration for each sprite are taken directly
// from the reference animation so the fall speed matches exactly; only
// the flower count (fewer) and leaf size (bigger) were adjusted per brief.
const FALL_TIMES = [0, 0.08, 0.92, 1]; // matches the 0% / 8% / 92% / 100% CSS keyframe stops
const FALL_Y = ["-5vh", "3.8vh", "96.2vh", "105vh"]; // same travel curve for every sprite

const FLOWERS = [
  { left: "10%", delay: 0, duration: 12, size: 15 },
  { left: "38%", delay: 5, duration: 14, size: 14 },
  { left: "66%", delay: 2.5, duration: 11, size: 14 },
  { left: "88%", delay: 7, duration: 13, size: 12 },
];

const LEAVES = [
  { left: "6%", delay: 0.5, duration: 10, size: 27 },
  { left: "18%", delay: 2.5, duration: 11.5, size: 23 },
  { left: "30%", delay: 4, duration: 9.5, size: 29 },
  { left: "42%", delay: 1, duration: 12, size: 21 },
  { left: "54%", delay: 5.5, duration: 10.5, size: 27 },
  { left: "62%", delay: 3, duration: 11, size: 23 },
  { left: "74%", delay: 6.5, duration: 9, size: 25 },
  { left: "84%", delay: 2, duration: 12.5, size: 21 },
  { left: "94%", delay: 4.5, duration: 10, size: 27 },
];

function FallingGarland() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {FLOWERS.map((f, i) => (
        <motion.div
          key={`fl-${i}`}
          initial={{ y: FALL_Y[0], opacity: 0, rotate: 0 }}
          animate={{ y: FALL_Y, opacity: [0, 0.85, 0.85, 0], rotate: [0, 27.2, 312.8, 340] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: "linear", times: FALL_TIMES }}
          style={{
            position: "absolute",
            left: f.left,
            width: f.size,
            height: f.size,
            backgroundImage: `url("${FLOWER_DATA_URI}")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
      {LEAVES.map((l, i) => (
        <motion.div
          key={`lf-${i}`}
          initial={{ y: FALL_Y[0], x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: FALL_Y, x: [0, 2.88, -5.52, -10], opacity: [0, 0.75, 0.75, 0], rotate: [0, 25.6, 294.4, 320] }}
          transition={{ duration: l.duration, repeat: Infinity, delay: l.delay, ease: "linear", times: FALL_TIMES }}
          style={{
            position: "absolute",
            left: l.left,
            width: l.size,
            height: l.size / 1.6,
            background: palette.ivory,
            borderRadius: "0 70% 0 70%",
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
  const scriptFont = isBengali ? bengaliFonts.display : englishFonts.script;

  const weddingDate = new Date(invite.weddingDate);
  const dateParts = {
    month: weddingDate.toLocaleString(isBengali ? "bn-BD" : "en-US", { month: "long" }),
    day: weddingDate.getDate(),
    year: weddingDate.getFullYear(),
  };

  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${palette.navy} 0%, ${palette.navyMid} 55%, ${palette.navyDeep} 100%)`,
        color: palette.ivory,
        fontFamily: fonts.body,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FallingGarland />

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
              fontFamily: scriptFont,
              fontWeight: isBengali ? 600 : 400,
              fontSize: isBengali ? "clamp(2.4rem, 8vw, 4.5rem)" : "clamp(3rem, 11vw, 6rem)",
              lineHeight: 1.15,
              marginBottom: "0.3rem",
              color: palette.ivory,
            }}
          >
            {invite.brideName}
          </h1>
          <div style={{ color: palette.gold, fontSize: "1.6rem", margin: "0.3rem 0", fontFamily: fonts.display }}>&</div>
          <h1
            style={{
              fontFamily: scriptFont,
              fontWeight: isBengali ? 600 : 400,
              fontSize: isBengali ? "clamp(2.4rem, 8vw, 4.5rem)" : "clamp(3rem, 11vw, 6rem)",
              lineHeight: 1.15,
              color: palette.ivory,
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
