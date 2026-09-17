import express from 'express';
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
} from '../controllers/participantController.js';

const router = express.Router();

// Route: /api/participants
router.route('/')
  .post(createParticipant)
  .get(getParticipants);

// Route: /api/participants/:id
router.route('/:id')
  .get(getParticipantById)
  .put(updateParticipant)
  .delete(deleteParticipant);

export default router;

