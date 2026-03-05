import express from 'express';
import mongoose from 'mongoose';
import { Theater, Show, Screen } from '../models/ModelSchema.mjs'
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("DEBUG: Reached GET / callback in Theatersroutes");
    try {
        const Theaters = await Theater.find();

        res.status(200).json(Theaters);
    } catch (error) {
        console.error("DEBUG: Error in GET /theaters:", error);
        res.status(500).json({ message: "Failed to fetch Theaters", error: error.message });
    }
});

router.get("/movie/:movieId", async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date } = req.query;

        console.log(`DEBUG: Fetching theaters for movie: ${movieId}, date: ${date}`);

        let showFilter = { movie_id: movieId };

        /* 
        if (date) {
            const d = new Date(date);
            const startOfDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
            showFilter.start_time = { $gte: startOfDay, $lte: endOfDay };
            console.log(`DEBUG: Date Filter: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
        }
        */

        const [allTheaters, allScreens, movieShows] = await Promise.all([
            Theater.find().lean(),
            Screen.find().lean(),
            movieId && movieId !== 'undefined' ? Show.find(showFilter).lean() : Promise.resolve([])
        ]);

        console.log(`DEBUG: Total screens found: ${allScreens.length}`);
        console.log(`DEBUG: Total shows found for movie: ${movieShows.length}`);

        const result = allTheaters.map(theater => {
            const theaterIdStr = theater._id.toString();
            const theaterScreens = allScreens.filter(s =>
                s.theater_id?.toString() === theaterIdStr
            );

            // Map screens to include their specific showtimes for this movie
            const screensWithShows = theaterScreens.map(screen => {
                const screenIdStr = screen._id.toString();
                const screenShows = movieShows.filter(show =>
                    show.screen_id?.toString() === screenIdStr
                );

                return {
                    ...screen,
                    _id: screenIdStr,
                    theater_id: theaterIdStr,
                    showtimes: screenShows.map(s => ({
                        id: s._id.toString(),
                        time: s.show_time || new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }))
                };
            });

            return {
                ...theater,
                _id: theaterIdStr,
                screens: screensWithShows
            };
        });

        console.log(`DEBUG: Final result contains ${result.length} theaters`);

        res.status(200).json(result);
    } catch (error) {
        console.error("DEBUG: Error in GET /movie/:movieId:", error);
        res.status(500).json({ message: "Failed to fetch theaters for movie", error: error.message });
    }
});

export default router;


