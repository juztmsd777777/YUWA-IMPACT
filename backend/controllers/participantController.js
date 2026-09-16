import Participant from "../models/Participant.js";

export async function listParticipants(_req, res, next) {
  try {
    const data = await Participant.find().sort({ name: 1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createParticipant(req, res, next) {
  try {
    const item = await Participant.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
