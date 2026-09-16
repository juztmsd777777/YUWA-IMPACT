import School from "../models/School.js";

export async function listSchools(_req, res, next) {
  try {
    const data = await School.find().sort({ name: 1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createSchool(req, res, next) {
  try {
    const item = await School.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
