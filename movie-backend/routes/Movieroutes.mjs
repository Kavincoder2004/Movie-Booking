import express from "express";
import { Movie } from "../models/ModelSchema.mjs";

const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movies", error: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: "Failed to create movie", error: error.message });
    }
});


export default router;
