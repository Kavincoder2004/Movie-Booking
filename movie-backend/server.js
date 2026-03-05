// Removed manual DNS overrides for production stability
import express from 'express'
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import MovieRoute from "./routes/Movieroutes.mjs";
import Theatersroutes from './routes/Theatersroutes.mjs';
import Screenroutes from './routes/Screenroutes.mjs';
import Showroutes from './routes/Showroutes.mjs';
import Authroutes from './routes/Authroutes.mjs';
import Userroutes from './routes/Userroutes.mjs'

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Allow all origins to eliminate CORS as a variable during debugging
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Robust Health Check
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    // Attempt a real query to verify DB permissions/connectivity
    let moviesCount = 0;
    try {
      const { Movie } = await import("./models/ModelSchema.mjs");
      moviesCount = await Movie.countDocuments();
    } catch (dbErr) {
      console.error("Health check DB query failed:", dbErr);
      moviesCount = "Error: " + dbErr.message;
    }

    res.json({
      status: "alive",
      database: states[dbState] || "unknown",
      test_query: {
        movies_count: moviesCount
      },
      env: {
        hasMongoUri: !!process.env.MONGO_URI,
        NODE_ENV: process.env.NODE_ENV
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});


app.use("/api/movies", MovieRoute);
app.use('/api/theaters', Theatersroutes);
app.use('/api/screens', Screenroutes);
app.use('/api/shows', Showroutes);
app.use('/api/auth', Authroutes);
app.use('/api/users', Userroutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));