import express from "express";
import { Movie } from "../models/ModelSchema.mjs";

const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error("Fetch movies error:", error);
        res.status(500).json({
            message: "Failed to fetch movies",
            error: error.message,
            stack: process.env.NODE_ENV === "production" ? null : error.stack
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("CRITICAL: Failed to fetch movies:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            hint: "Check DB connection and ModelSchema"
        });
    }
});


export default router;
