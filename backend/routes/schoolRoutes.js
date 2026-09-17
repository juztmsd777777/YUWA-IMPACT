import express from 'express';
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from '../controllers/schoolController.js';

const router = express.Router();

// Route: /api/schools
router.route('/')
  .post(createSchool)
  .get(getSchools);

// Route: /api/schools/:id
router.route('/:id')
  .get(getSchoolById)
  .put(updateSchool)
  .delete(deleteSchool);

export default router;

