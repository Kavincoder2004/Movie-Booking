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
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // For Netlify
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // In production, you might want to be more strict. 
      // For now, let's allow all during initial deployment to avoid blockers.
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
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