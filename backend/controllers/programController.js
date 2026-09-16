import Program from "../models/Program.js";

export async function listPrograms(_req, res, next) {
  try {
    const data = await Program.find().sort({ name: 1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createProgram(req, res, next) {
  try {
    const item = await Program.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
