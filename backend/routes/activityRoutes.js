const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

// Route: /api/activities
router.route('/')
  .post(createActivity)
  .get(getActivities);

// Route: /api/activities/:id
router.route('/:id')
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;
