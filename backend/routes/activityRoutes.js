import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} from '../controllers/activityController.js';

const router = express.Router();

// Route: /api/activities
router.route('/')
  .post(createActivity)
  .get(getActivities);

// Route: /api/activities/:id
router.route('/:id')
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

export default router;

