import mongoose from "mongoose";

// Fail fast on each attempt instead of waiting Mongoose's 30s default -
// a misconfigured .env should produce a clear error within a few seconds,
// not leave the server hanging silently.
const CONNECT_OPTIONS = { serverSelectionTimeoutMS: 8000 };

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, CONNECT_OPTIONS);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    // Clear any in-progress connection state before retrying, otherwise
    // the second connect() call can hang using leftover state from the
    // first failed attempt instead of failing on its own terms.
    await mongoose.disconnect().catch(() => {});

    // Fallback to local MongoDB for development, mirrors the pattern
    // used in the FlashFit project when Atlas SRV resolution is blocked.
    try {
      const localConn = await mongoose.connect(
        "mongodb://127.0.0.1:27017/wedding-invites",
        CONNECT_OPTIONS
      );
      console.log(`Fell back to local MongoDB: ${localConn.connection.host}`);
    } catch (localError) {
      console.error("Local MongoDB fallback also failed:", localError.message);
      process.exit(1);
    }
  }
};

export default connectDB;
