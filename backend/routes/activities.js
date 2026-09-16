import { Router } from "express";
import {
  createActivity,
  getActivity,
  listActivities,
} from "../controllers/activityController.js";

const router = Router();
router.get("/", listActivities);
router.get("/:id", getActivity);
router.post("/", createActivity);
// BE 2: attach multer here for photos, e.g. upload.array("photos")
export default router;
