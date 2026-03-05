import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");
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
app.use(cors()); // Most permissive: allow everything
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
      status: "alive",
      database: states[dbState] || "unknown",
      env: {
        hasMongoUri: !!process.env.MONGO_URI,
        hasFrontendUrl: !!process.env.FRONTEND_URL
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