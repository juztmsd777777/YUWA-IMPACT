import Assessment from "../models/Assessment.js";

export async function listAssessments(_req, res, next) {
  try {
    const data = await Assessment.find();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createAssessment(req, res, next) {
  try {
    const item = await Assessment.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
