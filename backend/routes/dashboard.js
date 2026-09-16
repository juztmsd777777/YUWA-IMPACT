import { Router } from "express";
import { dashboard, evaluation } from "../controllers/dashboardController.js";

const router = Router();
router.get("/dashboard", dashboard);
router.get("/evaluation", evaluation);
router.get("/evaluation/:programId", evaluation);
export default router;
