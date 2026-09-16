import { getDashboardSummary, getEvaluation } from "../services/evaluationService.js";

export async function dashboard(_req, res, next) {
  try {
    const data = await getDashboardSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function evaluation(req, res, next) {
  try {
    const data = await getEvaluation(req.params.programId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
