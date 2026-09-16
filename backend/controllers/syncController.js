import { processSyncRecords } from "../services/syncService.js";

export async function syncRecords(req, res, next) {
  try {
    const records = req.body?.records || [];
    const result = await processSyncRecords(records);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
