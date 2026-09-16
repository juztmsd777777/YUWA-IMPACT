import { Router } from "express";
import { createParticipant, listParticipants } from "../controllers/participantController.js";

const router = Router();
router.get("/", listParticipants);
router.post("/", createParticipant);
export default router;
