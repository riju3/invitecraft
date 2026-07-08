import express from "express";
import { nanoid } from "nanoid";
import Invite from "../models/Invite.js";
import verifyToken from "../middleware/auth.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";

const router = express.Router();

// Turn "Meenal" + "Avinash" into a clean, URL-safe, unique slug
// e.g. meenal-avinash-x7k2p9
const generateSlug = (brideName, groomName) => {
  const clean = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

  const base = `${clean(brideName)}-${clean(groomName)}`;
  const uniquePart = nanoid(6).toLowerCase();
  return `${base}-${uniquePart}`;
};

// ---------- PROTECTED ROUTES (couple / account holder only) ----------

// POST /api/invites - create a new invite
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      templateId,
      language,
      brideName,
      groomName,
      brideFamily,
      groomFamily,
      weddingDate,
      mainVenueName,
      mainVenueAddress,
      mainVenueMapLink,
      ourStory,
      photos,
      events,
    } = req.body;

    if (!templateId || !brideName || !groomName || !weddingDate) {
      return res.status(400).json({
        message: "Template, bride name, groom name, and wedding date are required.",
      });
    }

    const slug = generateSlug(brideName, groomName);

    const invite = await Invite.create({
      owner: req.userId,
      templateId,
      language: language || "en",
      brideName,
      groomName,
      brideFamily,
      groomFamily,
      weddingDate,
      mainVenueName,
      mainVenueAddress,
      mainVenueMapLink,
      ourStory,
      photos: photos || [],
      events: events || [],
      slug,
    });

    res.status(201).json({ invite, publicUrl: `/invite/${invite.slug}` });
  } catch (error) {
    res.status(500).json({ message: "Could not create invitation.", error: error.message });
  }
});

// GET /api/invites/my - all invites belonging to the logged-in user (dashboard list)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const invites = await Invite.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ invites });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch your invitations.", error: error.message });
  }
});

// ---------- PUBLIC ROUTE (no auth - this is what guests hit via the link/QR) ----------
// IMPORTANT: this must be defined BEFORE "/:id" below, otherwise Express would
// match "/public/some-slug" to the "/:id" route first and force a login check
// on guests who should never need to authenticate.

// GET /api/invites/public/:slug - anyone with the link can view, no login required
router.get("/public/:slug", async (req, res) => {
  try {
    const invite = await Invite.findOne({ slug: req.params.slug, isPublished: true });
    if (!invite) {
      return res.status(404).json({ message: "This invitation could not be found." });
    }
    res.status(200).json({ invite });
  } catch (error) {
    res.status(500).json({ message: "Could not load invitation.", error: error.message });
  }
});

// POST /api/invites/:id/rsvp - guests submit their RSVP, no login required.
// Uses the invite's database _id (taken from the publicly-fetched invite
// object above), not a route a guest would type by hand.
router.post("/:id/rsvp", async (req, res) => {
  try {
    const { guestName, attendingEvents, songRequest, dietaryPreference, advice } = req.body;

    if (!guestName || !guestName.trim()) {
      return res.status(400).json({ message: "Please tell us your name." });
    }

    const invite = await Invite.findOne({ _id: req.params.id, isPublished: true });
    if (!invite) {
      return res.status(404).json({ message: "This invitation could not be found." });
    }

    invite.rsvps.push({
      guestName,
      attendingEvents: attendingEvents || [],
      songRequest: songRequest || "",
      dietaryPreference: dietaryPreference || "none",
      advice: advice || "",
    });

    await invite.save();
    res.status(201).json({ message: "RSVP received." });
  } catch (error) {
    res.status(500).json({ message: "Could not submit RSVP.", error: error.message });
  }
});

// GET /api/invites/:id/rsvps - couple views all RSVPs for their invite (protected)
router.get("/:id/rsvps", verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({ _id: req.params.id, owner: req.userId });
    if (!invite) {
      return res.status(404).json({ message: "Invitation not found." });
    }
    res.status(200).json({ rsvps: invite.rsvps });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch RSVPs.", error: error.message });
  }
});

// GET /api/invites/:id - fetch one invite for editing (must be the owner)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({ _id: req.params.id, owner: req.userId });
    if (!invite) {
      return res.status(404).json({ message: "Invitation not found." });
    }
    res.status(200).json({ invite });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch invitation.", error: error.message });
  }
});

// PUT /api/invites/:id - update an invite (must be the owner)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({ _id: req.params.id, owner: req.userId });
    if (!invite) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    const updatableFields = [
      "templateId",
      "language",
      "brideName",
      "groomName",
      "brideFamily",
      "groomFamily",
      "weddingDate",
      "mainVenueName",
      "mainVenueAddress",
      "mainVenueMapLink",
      "ourStory",
      "photos",
      "events",
      "isPublished",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        invite[field] = req.body[field];
      }
    });

    await invite.save();
    res.status(200).json({ invite });
  } catch (error) {
    res.status(500).json({ message: "Could not update invitation.", error: error.message });
  }
});

// DELETE /api/invites/:id - delete an invite + its Cloudinary photos (must be the owner)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const invite = await Invite.findOne({ _id: req.params.id, owner: req.userId });
    if (!invite) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    await Promise.all(
      invite.photos.map((photo) => deleteFromCloudinary(photo.publicId).catch(() => null))
    );

    await invite.deleteOne();
    res.status(200).json({ message: "Invitation deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete invitation.", error: error.message });
  }
});

export default router;
