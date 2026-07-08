import mongoose from "mongoose";

// One ceremony/function within the wedding (e.g. Mehendi, Sangeet, Phere, Reception)
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Sangeet Night"
    date: { type: Date, required: true },
    time: { type: String, trim: true }, // e.g. "7:00 PM" - kept as display string
    venueName: { type: String, trim: true },
    venueAddress: { type: String, trim: true },
    dressCode: { type: String, trim: true }, // e.g. "Pastel Pink, Peach, Mint"
    description: { type: String, trim: true }, // e.g. tagline for the event
  },
  { _id: true }
);

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // needed to delete from Cloudinary later
    caption: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const rsvpSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    attendingEvents: { type: [String], default: [] }, // event _id strings the guest checked
    songRequest: { type: String, trim: true, default: "" },
    dietaryPreference: { type: String, trim: true, default: "none" },
    advice: { type: String, trim: true, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const inviteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: String,
      enum: ["royal-blue", "purple-magenta", "carmine-red"],
      required: true,
    },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "en",
    },
    brideName: { type: String, required: true, trim: true },
    groomName: { type: String, required: true, trim: true },
    brideFamily: { type: String, trim: true, default: "" }, // e.g. "Daughter of Mr. & Mrs. Sharma"
    groomFamily: { type: String, trim: true, default: "" },
    weddingDate: { type: Date, required: true },
    mainVenueName: { type: String, trim: true, default: "" },
    mainVenueAddress: { type: String, trim: true, default: "" },
    mainVenueMapLink: { type: String, trim: true, default: "" },
    ourStory: { type: String, trim: true, default: "" },
    photos: { type: [photoSchema], default: [] },
    events: { type: [eventSchema], default: [] },
    rsvps: { type: [rsvpSchema], default: [] },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
