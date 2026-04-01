import express from "express";
import Event from "../models/Event.model.js";

const router = express.Router();
router.delete("/process/cleanup", async (req, res) => {
  const result = await Event.deleteMany({ payload: { $exists: false } });
  res.json({ deleted: result.deletedCount });
});

router.post("/process", async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).limit(50);

    if (!events.length) {
      return res.json({ message: "No pending events" });
    }

    for (const event of events) {
      console.log("Processing:", event._id);

      // ✅ ADD THIS (IMPORTANT FIX)
      if (!event.payload) {
        console.log("Skipping bad event:", event._id);
        continue;
      }
      // ✅ ONLY UPDATE EXISTING EVENT
      event.status = "success";
      event.processedAt = new Date();
      event.responseCode = 200;

      await event.save();
    }

    res.json({
      success: true,
      processed: events.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;