import { Router } from "express";
import { syncRecords } from "../controllers/syncController.js";

const router = Router();
router.post("/", syncRecords);
export default router;
