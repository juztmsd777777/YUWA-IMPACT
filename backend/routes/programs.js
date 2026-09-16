import { Router } from "express";
import { createProgram, listPrograms } from "../controllers/programController.js";

const router = Router();
router.get("/", listPrograms);
router.post("/", createProgram);
export default router;
