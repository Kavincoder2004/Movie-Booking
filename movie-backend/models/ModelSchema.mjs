import mongoose from "mongoose";

// 🎬 Movie Schema
const movieSchema = new mongoose.Schema({
  image: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  runtime: { type: String },
  runtime_minutes: { type: Number },
  certification: { type: String }
}, { timestamps: true });

// 🎭 Theater Schema
const theaterSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String }, // Add name because DB uses it
  location: { type: String, required: true },
  audio: { type: String },
  cancellable: { type: Boolean, default: false }
}, { timestamps: true });

// 🖥️ Screen Schema
const screenSchema = new mongoose.Schema({
  theater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true
  },
  screen_name: { type: String, required: true },
  total_seats: { type: Number, required: true }
}, { timestamps: true });

// 🎟️ Show Schema
const showSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  screen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true
  },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  price: { type: Number, required: true },
  booked_seats: { type: [Number], default: [] },
  show_time: { type: String } // Keeping for migration compatibility
}, { timestamps: true });

// 👤 User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  googleId: { type: String },
  role: { type: String, default: "user" }
}, { timestamps: true });

// ✅ Models
export const Movie = mongoose.model("Movie", movieSchema);
export const Theater = mongoose.model("Theater", theaterSchema);
export const Screen = mongoose.model("Screen", screenSchema);
export const Show = mongoose.model("Show", showSchema);
export const User = mongoose.model("User", userSchema);