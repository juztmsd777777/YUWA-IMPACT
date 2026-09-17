const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const School = require('../models/School');

/**
 * @desc    Create a new activity
 * @route   POST /api/activities
 * @access  Public / Field Team
 */
const createActivity = async (req, res) => {
  try {
    const {
      schoolId,
      program,
      activityName,
      activityType,
      date,
      description,
      participantCount,
      participants,
      photos
    } = req.body;

    // Validate required fields
    if (!schoolId || !activityName || !activityType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide schoolId, activityName, and activityType'
      });
    }

    // Validate schoolId format
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID format'
      });
    }

    // Ensure referenced school exists in database
    const schoolExists = await School.findById(schoolId);
    if (!schoolExists) {
      return res.status(404).json({
        success: false,
        message: 'Referenced school does not exist'
      });
    }

    // Determine program: use provided program, or fallback to school program if school is single-program
    const assignedProgram = program || (schoolExists.program !== 'Both' ? schoolExists.program : null);
    if (!assignedProgram) {
      return res.status(400).json({
        success: false,
        message: 'Please specify program (Ecolympics or Green Gurukul)'
      });
    }

    // Validate participant IDs if provided
    if (participants && Array.isArray(participants)) {
      for (const pId of participants) {
        if (!mongoose.Types.ObjectId.isValid(pId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid participant ID format: ${pId}`
          });
        }
      }
    }

    // Calculate participant count if not provided
    const calculatedCount = participantCount !== undefined
      ? participantCount
      : (participants && Array.isArray(participants) ? participants.length : 0);

    const activity = await Activity.create({
      schoolId,
      program: assignedProgram,
      activityName,
      activityType,
      date: date || Date.now(),
      description,
      participantCount: calculatedCount,
      participants: participants || [],
      photos: photos || []
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('schoolId', 'schoolName district state')
      .populate('participants', 'name age gradeOrClass');

    return res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity
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
      message: 'Server error creating activity: ' + error.message
    });
  }
};

/**
 * @desc    Get all activities (supports filter by schoolId, activityType, and program)
 * @route   GET /api/activities
 * @access  Public / Field Team & Dashboard
 */
const getActivities = async (req, res) => {
  try {
    const { schoolId, activityType, program } = req.query;
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

    if (activityType) {
      filter.activityType = activityType;
    }

    if (program) {
      filter.program = program;
    }

    const activities = await Activity.find(filter)
      .populate('schoolId', 'schoolName district state')
      .populate('participants', 'name age gradeOrClass')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: 'Activities retrieved successfully',
      count: activities.length,
      data: activities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving activities: ' + error.message
    });
  }
};

/**
 * @desc    Get single activity by ID
 * @route   GET /api/activities/:id
 * @access  Public
 */
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }

    const activity = await Activity.findById(id)
      .populate('schoolId', 'schoolName location district state')
      .populate('participants', 'name age gradeOrClass');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity retrieved successfully',
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving activity: ' + error.message
    });
  }
};

/**
 * @desc    Update activity
 * @route   PUT /api/activities/:id
 * @access  Public / Field Team
 */
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }

    // If updating schoolId, verify new school exists
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

    const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('schoolId', 'schoolName district state')
      .populate('participants', 'name age gradeOrClass');

    if (!updatedActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: updatedActivity
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
      message: 'Server error updating activity: ' + error.message
    });
  }
};

/**
 * @desc    Delete activity
 * @route   DELETE /api/activities/:id
 * @access  Public / Field Team
 */
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID format'
      });
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting activity: ' + error.message
    });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
};
