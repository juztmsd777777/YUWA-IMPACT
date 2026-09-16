import Activity from "../models/Activity.js";

export async function listActivities(_req, res, next) {
  try {
    const data = await Activity.find()
      .populate("programId", "name description")
      .populate("schoolId", "name location")
      .sort({ date: -1 });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req, res, next) {
  try {
    const item = await Activity.findById(req.params.id)
      .populate("programId", "name description")
      .populate("schoolId", "name location");
    if (!item) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createActivity(req, res, next) {
  try {
    const item = await Activity.create(req.body);
    res.status(201).json({
      success: true,
      activity: { id: item._id },
      data: item,
    });
  } catch (err) {
    next(err);
  }
}
