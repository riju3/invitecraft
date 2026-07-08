import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import "../styles/app-pages.css";

const TEMPLATES = [
  { id: "royal-blue", name: "Rajwada", swatch: "linear-gradient(135deg, #0B1F3D, #0F4C4C)" },
  { id: "purple-magenta", name: "Sangeet Nights", swatch: "linear-gradient(135deg, #1A0E1A, #A91079)" },
  { id: "carmine-red", name: "Shubh Vivah", swatch: "linear-gradient(135deg, #9B1B30, #5C0F1F)" },
];

const emptyEvent = () => ({
  tempId: Math.random().toString(36).slice(2),
  name: "",
  date: "",
  time: "",
  venueName: "",
  venueAddress: "",
  dressCode: "",
  description: "",
});

// Mongo gives back ISO datetimes; <input type="date"> needs YYYY-MM-DD
const toDateInputValue = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().slice(0, 10);
};

export default function EditInvite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null); // null until loaded
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const { data } = await api.get(`/invites/${id}`);
        const inv = data.invite;
        setForm({
          templateId: inv.templateId,
          language: inv.language || "en",
          brideName: inv.brideName || "",
          groomName: inv.groomName || "",
          brideFamily: inv.brideFamily || "",
          groomFamily: inv.groomFamily || "",
          weddingDate: toDateInputValue(inv.weddingDate),
          mainVenueName: inv.mainVenueName || "",
          mainVenueAddress: inv.mainVenueAddress || "",
          mainVenueMapLink: inv.mainVenueMapLink || "",
          ourStory: inv.ourStory || "",
          photos: inv.photos || [],
          events: (inv.events || []).map((ev) => ({
            tempId: ev._id || Math.random().toString(36).slice(2),
            name: ev.name || "",
            date: toDateInputValue(ev.date),
            time: ev.time || "",
            venueName: ev.venueName || "",
            venueAddress: ev.venueAddress || "",
            dressCode: ev.dressCode || "",
            description: ev.description || "",
          })),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this invitation.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [id]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateEvent = (tempId, field, value) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.tempId === tempId ? { ...ev, [field]: value } : ev)),
    }));
  };

  const addEvent = () => setForm((prev) => ({ ...prev, events: [...prev.events, emptyEvent()] }));

  const removeEvent = (tempId) =>
    setForm((prev) => ({ ...prev, events: prev.events.filter((ev) => ev.tempId !== tempId) }));

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos", file));
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, photos: [...prev.photos, ...data.photos] }));
    } catch (err) {
      setError(err.response?.data?.message || "Photo upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (publicId) => {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.publicId !== publicId) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSavedMessage("");
    try {
      const cleanEvents = form.events
        .filter((ev) => ev.name.trim() && ev.date)
        .map(({ tempId, ...rest }) => rest);

      await api.put(`/invites/${id}`, { ...form, events: cleanEvents });
      setSavedMessage("Changes saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="form-page">
          <p style={{ color: "var(--muted)" }}>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="app-shell">
        <div className="form-page">
          <div className="error-banner">{error || "Invitation not found."}</div>
          <Link to="/dashboard" className="btn-secondary" style={{ display: "inline-block", marginTop: "1rem" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <span className="brand">InviteCraft</span>
        <Link to="/dashboard" className="btn-text">
          Back to dashboard
        </Link>
      </div>

      <div className="form-page">
        <h1 className="step-title">Edit invitation</h1>
        <p className="step-sub">Update any details below, then save your changes.</p>

        {error && <div className="error-banner">{error}</div>}
        {savedMessage && (
          <div style={{ background: "#eaf6ec", color: "#2a7a3b", padding: "0.7rem 0.9rem", borderRadius: 10, fontSize: "0.85rem", marginBottom: "1.2rem" }}>
            {savedMessage}
          </div>
        )}

        {/* Theme + language */}
        <h2 className="step-title" style={{ fontSize: "1.2rem" }}>Theme</h2>
        <div className="template-grid">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className={`template-card ${form.templateId === tpl.id ? "selected" : ""}`}
              onClick={() => update("templateId", tpl.id)}
            >
              <div className="template-swatch" style={{ background: tpl.swatch }} />
              <h3>{tpl.name}</h3>
            </div>
          ))}
        </div>

        <div className="lang-toggle-row">
          <div
            className={`lang-option ${form.language === "en" ? "selected" : ""}`}
            onClick={() => update("language", "en")}
          >
            <div className="label-en">English</div>
          </div>
          <div
            className={`lang-option ${form.language === "bn" ? "selected" : ""}`}
            onClick={() => update("language", "bn")}
          >
            <div className="label-bn">বাংলা</div>
          </div>
        </div>

        {/* Couple details */}
        <h2 className="step-title" style={{ fontSize: "1.2rem" }}>Couple details</h2>
        <div className="form-row">
          <div className="field-group">
            <label>Bride's name</label>
            <input value={form.brideName} onChange={(e) => update("brideName", e.target.value)} />
          </div>
          <div className="field-group">
            <label>Groom's name</label>
            <input value={form.groomName} onChange={(e) => update("groomName", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field-group">
            <label>Bride's family</label>
            <input value={form.brideFamily} onChange={(e) => update("brideFamily", e.target.value)} />
          </div>
          <div className="field-group">
            <label>Groom's family</label>
            <input value={form.groomFamily} onChange={(e) => update("groomFamily", e.target.value)} />
          </div>
        </div>
        <div className="field-group">
          <label>Wedding date</label>
          <input type="date" value={form.weddingDate} onChange={(e) => update("weddingDate", e.target.value)} />
        </div>

        {/* Venue + story */}
        <h2 className="step-title" style={{ fontSize: "1.2rem" }}>Venue & story</h2>
        <div className="field-group">
          <label>Main venue name</label>
          <input value={form.mainVenueName} onChange={(e) => update("mainVenueName", e.target.value)} />
        </div>
        <div className="field-group">
          <label>Venue address</label>
          <input value={form.mainVenueAddress} onChange={(e) => update("mainVenueAddress", e.target.value)} />
        </div>
        <div className="field-group">
          <label>Google Maps link</label>
          <input value={form.mainVenueMapLink} onChange={(e) => update("mainVenueMapLink", e.target.value)} />
        </div>
        <div className="field-group">
          <label>Our story</label>
          <textarea rows={4} value={form.ourStory} onChange={(e) => update("ourStory", e.target.value)} />
        </div>

        {/* Photos */}
        <h2 className="step-title" style={{ fontSize: "1.2rem" }}>Photos</h2>
        {form.photos.length > 0 && (
          <div className="photo-grid">
            {form.photos.map((photo) => (
              <div className="photo-thumb" key={photo.publicId}>
                <img src={photo.url} alt="" />
                <button type="button" className="remove-btn" onClick={() => removePhoto(photo.publicId)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="upload-dropzone" style={{ display: "block" }}>
          {uploading ? "Uploading..." : "Tap to add more photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>

        {/* Events */}
        <h2 className="step-title" style={{ fontSize: "1.2rem", marginTop: "1.8rem" }}>Event schedule</h2>
        {form.events.map((ev, i) => (
          <div className="event-card" key={ev.tempId}>
            <div className="event-card-header">
              <h4>Event {i + 1}</h4>
              <button type="button" className="icon-btn-danger" onClick={() => removeEvent(ev.tempId)}>
                Remove
              </button>
            </div>
            <div className="field-group">
              <label>Event name</label>
              <input value={ev.name} onChange={(e) => updateEvent(ev.tempId, "name", e.target.value)} />
            </div>
            <div className="form-row">
              <div className="field-group">
                <label>Date</label>
                <input type="date" value={ev.date} onChange={(e) => updateEvent(ev.tempId, "date", e.target.value)} />
              </div>
              <div className="field-group">
                <label>Time</label>
                <input value={ev.time} onChange={(e) => updateEvent(ev.tempId, "time", e.target.value)} placeholder="7:00 PM" />
              </div>
            </div>
            <div className="field-group">
              <label>Venue</label>
              <input value={ev.venueName} onChange={(e) => updateEvent(ev.tempId, "venueName", e.target.value)} />
            </div>
            <div className="field-group">
              <label>Dress code</label>
              <input value={ev.dressCode} onChange={(e) => updateEvent(ev.tempId, "dressCode", e.target.value)} />
            </div>
            <div className="field-group">
              <label>Description</label>
              <input value={ev.description} onChange={(e) => updateEvent(ev.tempId, "description", e.target.value)} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-add-dashed" onClick={addEvent}>
          + Add another event
        </button>

        <div className="step-nav" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn-primary-inline" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
