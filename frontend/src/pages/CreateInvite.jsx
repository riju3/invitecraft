import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import api from "../utils/api";
import "../styles/app-pages.css";

const TEMPLATES = [
  {
    id: "royal-blue",
    name: "Rajwada",
    tagline: "Regal navy & gold",
    swatch: "linear-gradient(135deg, #0B1F3D, #0F4C4C)",
  },
  {
    id: "purple-magenta",
    name: "Sangeet Nights",
    tagline: "Jewel-toned plum & magenta",
    swatch: "linear-gradient(135deg, #1A0E1A, #A91079)",
  },
  {
    id: "carmine-red",
    name: "Shubh Vivah",
    tagline: "Classic red & gold",
    swatch: "linear-gradient(135deg, #9B1B30, #5C0F1F)",
  },
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

const TOTAL_STEPS = 5;

export default function CreateInvite() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { invite, publicUrl }
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    templateId: "",
    language: "en",
    brideName: "",
    groomName: "",
    brideFamily: "",
    groomFamily: "",
    weddingDate: "",
    mainVenueName: "",
    mainVenueAddress: "",
    mainVenueMapLink: "",
    ourStory: "",
    photos: [],
    events: [emptyEvent()],
  });

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
      setError(err.response?.data?.message || "Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (publicId) => {
    setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.publicId !== publicId) }));
  };

  const canProceed = () => {
    if (step === 1) return !!form.templateId;
    if (step === 2) return form.brideName.trim() && form.groomName.trim() && form.weddingDate;
    return true;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };
  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const cleanEvents = form.events
        .filter((ev) => ev.name.trim() && ev.date)
        .map(({ tempId, ...rest }) => rest);

      const payload = { ...form, events: cleanEvents };
      delete payload.tempId;

      const { data } = await api.post("/invites", payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Success screen ----------
  if (result) {
    const fullUrl = `${window.location.origin}${result.publicUrl}`;
    return (
      <div className="app-shell">
        <div className="form-page">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-card success-card"
          >
            <h2>Your invitation is ready 🎉</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Share this link or QR code with your guests. No login needed on their end.
            </p>

            <div className="link-box">
              <span style={{ flex: 1 }}>{fullUrl}</span>
              <button
                className="btn-text"
                onClick={() => navigator.clipboard.writeText(fullUrl)}
                type="button"
              >
                Copy
              </button>
            </div>

            <div className="qr-wrapper">
              <QRCodeCanvas value={fullUrl} size={180} />
            </div>

            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <a href={result.publicUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                Preview
              </a>
              <Link to="/dashboard" className="btn-primary-inline" style={{ display: "inline-block" }}>
                Go to dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <span className="brand">InviteCraft</span>
        <Link to="/dashboard" className="btn-text">
          Cancel
        </Link>
      </div>

      <div className="form-page">
        <div className="step-indicator">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`step-dot ${i < step ? "active" : ""}`} />
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1: Template + Language */}
            {step === 1 && (
              <>
                <h1 className="step-title">Choose a theme</h1>
                <p className="step-sub">Pick the look for your invitation. You can preview it before sharing.</p>

                <div className="template-grid">
                  {TEMPLATES.map((tpl) => (
                    <div
                      key={tpl.id}
                      className={`template-card ${form.templateId === tpl.id ? "selected" : ""}`}
                      onClick={() => update("templateId", tpl.id)}
                    >
                      <div className="template-swatch" style={{ background: tpl.swatch }} />
                      <h3>{tpl.name}</h3>
                      <p>{tpl.tagline}</p>
                    </div>
                  ))}
                </div>

                <h2 className="step-title" style={{ fontSize: "1.2rem" }}>
                  Invitation language
                </h2>
                <p className="step-sub" style={{ marginBottom: "1rem" }}>
                  Guests can still switch this themselves when viewing the invite.
                </p>
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
              </>
            )}

            {/* STEP 2: Couple details */}
            {step === 2 && (
              <>
                <h1 className="step-title">About the couple</h1>
                <p className="step-sub">These appear right at the top of your invitation.</p>

                <div className="form-row">
                  <div className="field-group">
                    <label>Bride's name</label>
                    <input value={form.brideName} onChange={(e) => update("brideName", e.target.value)} required />
                  </div>
                  <div className="field-group">
                    <label>Groom's name</label>
                    <input value={form.groomName} onChange={(e) => update("groomName", e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field-group">
                    <label>Bride's family (optional)</label>
                    <input
                      value={form.brideFamily}
                      onChange={(e) => update("brideFamily", e.target.value)}
                      placeholder="Daughter of Mr. & Mrs. Sharma"
                    />
                  </div>
                  <div className="field-group">
                    <label>Groom's family (optional)</label>
                    <input
                      value={form.groomFamily}
                      onChange={(e) => update("groomFamily", e.target.value)}
                      placeholder="Son of Mr. & Mrs. Patel"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label>Wedding date</label>
                  <input
                    type="date"
                    value={form.weddingDate}
                    onChange={(e) => update("weddingDate", e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* STEP 3: Venue + Story */}
            {step === 3 && (
              <>
                <h1 className="step-title">Venue & your story</h1>
                <p className="step-sub">All optional, but guests love knowing where to go and how you met.</p>

                <div className="field-group">
                  <label>Main venue name</label>
                  <input value={form.mainVenueName} onChange={(e) => update("mainVenueName", e.target.value)} />
                </div>
                <div className="field-group">
                  <label>Venue address</label>
                  <input
                    value={form.mainVenueAddress}
                    onChange={(e) => update("mainVenueAddress", e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Google Maps link</label>
                  <input
                    value={form.mainVenueMapLink}
                    onChange={(e) => update("mainVenueMapLink", e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                  <p className="field-hint">Powers the "Get Directions" button on your invite.</p>
                </div>
                <div className="field-group">
                  <label>Our story</label>
                  <textarea
                    rows={5}
                    value={form.ourStory}
                    onChange={(e) => update("ourStory", e.target.value)}
                    placeholder="How you met, your journey together..."
                  />
                </div>
              </>
            )}

            {/* STEP 4: Photos */}
            {step === 4 && (
              <>
                <h1 className="step-title">Photos</h1>
                <p className="step-sub">Upload a few favourites for your gallery section.</p>

                {form.photos.length > 0 && (
                  <div className="photo-grid">
                    {form.photos.map((photo) => (
                      <div className="photo-thumb" key={photo.publicId}>
                        <img src={photo.url} alt="" />
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removePhoto(photo.publicId)}
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="upload-dropzone" style={{ display: "block" }}>
                  {uploading ? "Uploading..." : "Tap to choose photos"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </label>
              </>
            )}

            {/* STEP 5: Event schedule */}
            {step === 5 && (
              <>
                <h1 className="step-title">Event schedule</h1>
                <p className="step-sub">Add each ceremony — Mehendi, Sangeet, Phere, Reception, anything you like.</p>

                {form.events.map((ev, i) => (
                  <div className="event-card" key={ev.tempId}>
                    <div className="event-card-header">
                      <h4>Event {i + 1}</h4>
                      {form.events.length > 1 && (
                        <button
                          type="button"
                          className="icon-btn-danger"
                          onClick={() => removeEvent(ev.tempId)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="field-group">
                      <label>Event name</label>
                      <input
                        value={ev.name}
                        onChange={(e) => updateEvent(ev.tempId, "name", e.target.value)}
                        placeholder="e.g. Sangeet Night"
                      />
                    </div>

                    <div className="form-row">
                      <div className="field-group">
                        <label>Date</label>
                        <input
                          type="date"
                          value={ev.date}
                          onChange={(e) => updateEvent(ev.tempId, "date", e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label>Time</label>
                        <input
                          type="text"
                          value={ev.time}
                          onChange={(e) => updateEvent(ev.tempId, "time", e.target.value)}
                          placeholder="7:00 PM"
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Venue (optional, if different from main venue)</label>
                      <input
                        value={ev.venueName}
                        onChange={(e) => updateEvent(ev.tempId, "venueName", e.target.value)}
                      />
                    </div>

                    <div className="field-group">
                      <label>Dress code (optional)</label>
                      <input
                        value={ev.dressCode}
                        onChange={(e) => updateEvent(ev.tempId, "dressCode", e.target.value)}
                        placeholder="Pastel Pink, Peach, Mint"
                      />
                    </div>

                    <div className="field-group">
                      <label>Description (optional)</label>
                      <input
                        value={ev.description}
                        onChange={(e) => updateEvent(ev.tempId, "description", e.target.value)}
                        placeholder="A vibrant burst of colors, games, and laughter!"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="btn-add-dashed" onClick={addEvent}>
                  + Add another event
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="step-nav">
          <button
            type="button"
            className="btn-secondary"
            onClick={goBack}
            disabled={step === 1}
            style={{ visibility: step === 1 ? "hidden" : "visible" }}
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button type="button" className="btn-primary-inline" onClick={goNext} disabled={!canProceed()}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn-primary-inline" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Creating..." : "Create invitation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
