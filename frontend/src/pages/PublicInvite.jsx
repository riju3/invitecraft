import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import LanguageToggle from "../components/LanguageToggle";
import RsvpForm from "../components/RsvpForm";
import RoyalBlueTemplate from "../templates/RoyalBlueTemplate";
import PurpleMagentaTemplate from "../templates/PurpleMagentaTemplate";
import CarmineRedTemplate from "../templates/CarmineRedTemplate";

// This page is intentionally NOT wrapped in ProtectedRoute (see App.jsx).
// Anyone with the link or QR code lands here directly - no login, ever.

const TEMPLATE_COMPONENTS = {
  "royal-blue": RoyalBlueTemplate,
  "purple-magenta": PurpleMagentaTemplate,
  "carmine-red": CarmineRedTemplate,
};

const TEMPLATE_ACCENTS = {
  "royal-blue": "#0B1F3D",
  "purple-magenta": "#A91079",
  "carmine-red": "#9B1B30",
};

export default function PublicInvite() {
  const { slug } = useParams();
  const [invite, setInvite] = useState(null);
  const [lang, setLang] = useState("en");
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

  useEffect(() => {
    let isMounted = true;

    const fetchInvite = async () => {
      try {
        const { data } = await api.get(`/invites/public/${slug}`);
        if (!isMounted) return;
        setInvite(data.invite);
        setLang(data.invite.language || "en"); // start with the couple's chosen default
        setStatus("ready");
      } catch (err) {
        if (!isMounted) return;
        setStatus(err.response?.status === 404 ? "notfound" : "error");
      }
    };

    fetchInvite();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A0E1A",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading invitation...
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A0E1A",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
          Invitation not found
        </h1>
        <p style={{ opacity: 0.7 }}>This link may have been removed, or the URL might be incorrect.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A0E1A",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Something went wrong loading this invitation. Please try again.
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[invite.templateId] || RoyalBlueTemplate;
  const accent = TEMPLATE_ACCENTS[invite.templateId] || "#1a1a1a";

  // Wrap RsvpForm so the template only has to render <RsvpForm .../> with
  // its own theme props - the invite id and event list are injected here.
  const ThemedRsvpForm = (props) => (
    <RsvpForm {...props} inviteId={invite._id} events={invite.events} />
  );

  return (
    <>
      <LanguageToggle lang={lang} onChange={setLang} accentColor={accent} />
      <TemplateComponent invite={invite} lang={lang} RsvpForm={ThemedRsvpForm} />
    </>
  );
}
