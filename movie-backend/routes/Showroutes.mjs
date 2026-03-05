import express from "express";
import { Show } from "../models/ModelSchema.mjs";

const router = express.Router();

// POST: create a show with overlap validation
router.post("/", async (req, res) => {
  try {
    const { movie_id, screen_id, start_time, price } = req.body;
    const { Movie } = await import("../models/ModelSchema.mjs");

    const movie = await Movie.findById(movie_id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const runtime = movie.runtime_minutes || 120; // Default 2 hours if not set
    const start = new Date(start_time);
    const end = new Date(start.getTime() + (runtime + 15) * 60000); // runtime + 15 min buffer

    // Check for overlaps on the same screen
    const overlappingShow = await Show.findOne({
      screen_id,
      $or: [
        { start_time: { $lt: end }, end_time: { $gt: start } }
      ]
    });

    if (overlappingShow) {
      return res.status(400).json({
        message: "Showtime overlaps with an existing show on this screen",
        overlappingShow
      });
    }

    const newShow = await Show.create({
      movie_id,
      screen_id,
      start_time: start,
      end_time: end,
      price
    });

    res.status(201).json(newShow);
  } catch (error) {
    res.status(500).json({ message: "Failed to create show", error: error.message });
  }
});

// PATCH: book seats for a show
router.patch("/:id/book", async (req, res) => {
  try {
    const { seats } = req.body;
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Check if any of the requested seats are already booked
    const alreadyBooked = seats.filter(seat => show.booked_seats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: `Seats already booked: ${alreadyBooked.join(", ")}` });
    }

    show.booked_seats.push(...seats);
    await show.save();

    res.json({ message: "Booking successful", booked_seats: show.booked_seats });
  } catch (error) {
    res.status(500).json({ message: "Failed to book seats", error: error.message });
  }
});

// PATCH: unbook seats for a show
router.patch("/:id/unbook", async (req, res) => {
  try {
    const { seats } = req.body;
    console.log(`Unbooking request for show ${req.params.id}:`, seats);

    if (!Array.isArray(seats)) {
      return res.status(400).json({ message: "Seats must be an array" });
    }

    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Convert seats to numbers just in case
    const seatsToUnbook = seats.map(Number);
    console.log("Current booked seats:", show.booked_seats);
    console.log("Seats to remove:", seatsToUnbook);

    // Remove the specified seats from the booked_seats array
    show.booked_seats = show.booked_seats.filter(seat => !seatsToUnbook.includes(Number(seat)));

    // Mark as modified to ensure Mongoose saves the array change
    show.markModified('booked_seats');

    await show.save();
    console.log("Updated booked seats:", show.booked_seats);

    res.json({ message: "Unbooking successful", booked_seats: show.booked_seats });
  } catch (error) {
    console.error("Unbook error:", error);
    res.status(500).json({ message: "Failed to unbook seats", error: error.message });
  }
});

// GET: fetch all shows with movie and screen info
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("screen_id")
      .populate("movie_id");
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shows", error: error.message });
  }
});

// GET: fetch single show with movie and screen info
router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate({
        path: "screen_id",
        populate: { path: "theater_id" }
      })
      .populate("movie_id");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch show", error: error.message });
  }
});



export default router;