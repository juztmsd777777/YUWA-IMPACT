const express = require('express');
const router = express.Router();
const {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');

// Route: /api/schools
router.route('/')
  .post(createSchool)
  .get(getSchools);

// Route: /api/schools/:id
router.route('/:id')
  .get(getSchoolById)
  .put(updateSchool)
  .delete(deleteSchool);

module.exports = router;
