import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../styles/app-pages.css";

const TEMPLATE_LABELS = {
  "royal-blue": { name: "Rajwada", swatch: "linear-gradient(135deg, #0B1F3D, #0F4C4C)" },
  "purple-magenta": { name: "Sangeet Nights", swatch: "linear-gradient(135deg, #1A0E1A, #A91079)" },
  "carmine-red": { name: "Shubh Vivah", swatch: "linear-gradient(135deg, #9B1B30, #5C0F1F)" },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrOpenFor, setQrOpenFor] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data } = await api.get("/invites/my");
        setInvites(data.invites);
      } catch (err) {
        setError("Could not load your invitations.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invitation? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/invites/${id}`);
      setInvites((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      setError("Could not delete that invitation.");
    } finally {
      setDeletingId(null);
    }
  };

  const fullUrlFor = (slug) => `${window.location.origin}/invite/${slug}`;

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <span className="brand">InviteCraft</span>
        <button className="btn-text" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="form-page" style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.6rem", flexWrap: "wrap", gap: "0.8rem" }}>
          <div>
            <h1 className="step-title" style={{ marginBottom: "0.2rem" }}>
              {user ? `Hi, ${user.name}` : "Your invitations"}
            </h1>
            <p className="step-sub" style={{ marginBottom: 0 }}>
              Manage your wedding invitations and share links.
            </p>
          </div>
          <Link to="/create" className="btn-primary-inline" style={{ display: "inline-block" }}>
            + New invitation
          </Link>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading && <p style={{ color: "var(--muted)" }}>Loading...</p>}

        {!loading && invites.length === 0 && (
          <div className="auth-card" style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              No invitations yet
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Create your first wedding invitation in a few steps.
            </p>
            <Link to="/create" className="btn-primary-inline" style={{ display: "inline-block" }}>
              Get started
            </Link>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {invites.map((invite) => {
            const tpl = TEMPLATE_LABELS[invite.templateId] || {};
            const url = fullUrlFor(invite.slug);
            return (
              <motion.div
                key={invite._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{ padding: "1.3rem", textAlign: "left" }}
              >
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      background: tpl.swatch || "#ccc",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                      {invite.brideName} &amp; {invite.groomName}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                      {tpl.name} ·{" "}
                      {new Date(invite.weddingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="link-box" style={{ marginTop: "1rem", marginBottom: "0.8rem" }}>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {url}
                  </span>
                  <button className="btn-text" onClick={() => navigator.clipboard.writeText(url)}>
                    Copy
                  </button>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <a href={`/invite/${invite.slug}`} target="_blank" rel="noreferrer" className="btn-secondary">
                    Preview
                  </a>
                  <Link to={`/edit/${invite._id}`} className="btn-secondary">
                    Edit
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => setQrOpenFor(qrOpenFor === invite._id ? null : invite._id)}
                  >
                    {qrOpenFor === invite._id ? "Hide QR" : "Show QR"}
                  </button>
                  <button
                    className="icon-btn-danger"
                    onClick={() => handleDelete(invite._id)}
                    disabled={deletingId === invite._id}
                    style={{ marginLeft: "auto" }}
                  >
                    {deletingId === invite._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                {qrOpenFor === invite._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={{ textAlign: "center", marginTop: "1rem" }}
                  >
                    <div className="qr-wrapper">
                      <QRCodeCanvas value={url} size={150} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
