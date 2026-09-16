import { Router } from "express";
import { createSchool, listSchools } from "../controllers/schoolController.js";

const router = Router();
router.get("/", listSchools);
router.post("/", createSchool);
export default router;
