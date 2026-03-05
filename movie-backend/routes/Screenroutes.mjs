import express from "express";
import { Screen } from "../models/ModelSchema.mjs";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const newScreen = await Screen.create(req.body);
    res.status(201).json(newScreen);
  } catch (error) {
    res.status(500).json({ message: "Failed to create screen", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const screens = await Screen.find().populate("theater_id");
    res.json(screens);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shows", error: error.message });
  }
});

export default router;