const express = require('express');
const router = express.Router();
const {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
} = require('../controllers/participantController');

// Route: /api/participants
router.route('/')
  .post(createParticipant)
  .get(getParticipants);

// Route: /api/participants/:id
router.route('/:id')
  .get(getParticipantById)
  .put(updateParticipant)
  .delete(deleteParticipant);

module.exports = router;
