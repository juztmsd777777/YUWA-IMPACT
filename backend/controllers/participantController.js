import mongoose from 'mongoose';
import Participant from '../models/Participant.js';
import School from '../models/School.js';

/**
 * @desc    Create a new participant
 * @route   POST /api/participants
 * @access  Public / Field Team
 */
const createParticipant = async (req, res) => {
  try {
    const name = req.body.name || req.body.fullName;
    const age = req.body.age !== undefined ? req.body.age : 12;
    const gender = req.body.gender || 'Prefer not to say';
    const schoolId = req.body.schoolId;
    const gradeOrClass = req.body.gradeOrClass || req.body.className || '';
    const { program, schoolName, contact, score, notes } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name (or fullName)'
      });
    }

    let programValue = program || 'Both';
    if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
      const schoolExists = await School.findById(schoolId);
      if (schoolExists?.program) {
        programValue = program || schoolExists.program;
      }
    }


    const participant = await Participant.create({
      name,
      fullName: name,
      age,
      gender,
      schoolId,
      schoolName: schoolName || '',
      gradeOrClass,
      className: gradeOrClass,
      contact: contact || '',
      score: score || 0,
      notes: notes || '',
      program: programValue
    });

    let populatedParticipant = participant;
    if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
      populatedParticipant = (await Participant.findById(participant._id).populate(
        'schoolId',
        'schoolName name district state'
      )) || participant;
    }

    return res.status(201).json({
      success: true,
      message: 'Participant created successfully',
      data: populatedParticipant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error creating participant: ' + error.message
    });
  }
};

/**
 * @desc    Get all participants (supports filter by schoolId and program)
 * @route   GET /api/participants
 * @access  Public / Field Team & Dashboard
 */
const getParticipants = async (req, res) => {
  try {
    const { schoolId, program } = req.query;
    const filter = {};

    if (schoolId) {
      if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID format in query filter'
        });
      }
      filter.schoolId = schoolId;
    }

    if (program) {
      filter.program = program;
    }

    const participants = await Participant.find(filter)
      .populate('schoolId', 'schoolName district state')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Participants retrieved successfully',
      count: participants.length,
      data: participants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving participants: ' + error.message
    });
  }
};

/**
 * @desc    Get single participant by ID
 * @route   GET /api/participants/:id
 * @access  Public
 */
const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID format'
      });
    }

    const participant = await Participant.findById(id).populate(
      'schoolId',
      'schoolName location district state'
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Participant retrieved successfully',
      data: participant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving participant: ' + error.message
    });
  }
};

/**
 * @desc    Update participant
 * @route   PUT /api/participants/:id
 * @access  Public / Field Team
 */
const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID format'
      });
    }

    // If changing schoolId, verify the new school exists
    if (req.body.schoolId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.schoolId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID format'
        });
      }
      const schoolExists = await School.findById(req.body.schoolId);
      if (!schoolExists) {
        return res.status(404).json({
          success: false,
          message: 'Referenced school does not exist'
        });
      }
    }

    const updatedParticipant = await Participant.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('schoolId', 'schoolName district state');

    if (!updatedParticipant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Participant updated successfully',
      data: updatedParticipant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error updating participant: ' + error.message
    });
  }
};

/**
 * @desc    Delete participant
 * @route   DELETE /api/participants/:id
 * @access  Public / Field Team
 */
const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID format'
      });
    }

    const participant = await Participant.findByIdAndDelete(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Participant deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting participant: ' + error.message
    });
  }
};

export const listParticipants = getParticipants;
export const getParticipant = getParticipantById;

export {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
};

export default {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
  listParticipants,
  getParticipant
};

