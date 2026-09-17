import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import School from '../models/School.js';

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
      programName,
      programId,
      activityName: reqName,
      title,
      name,
      activityType: reqType,
      date,
      description,
      participantCount: reqCount,
      participantsCount,
      averageScore,
      participants,
      photos
    } = req.body;

    const activityName = reqName || title || name || reqType || 'YUWA Activity';
    const activityType = reqType || 'Other';
    const participantCount = reqCount !== undefined ? reqCount : (participantsCount || 0);

    let resolvedProgram = program || programName || 'Ecolympics';
    let schoolDoc = null;
    if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
      schoolDoc = await School.findById(schoolId);
      if (schoolDoc?.program && schoolDoc.program !== 'Both') {
        resolvedProgram = program || schoolDoc.program;
      }
    }

    // Validate participant IDs if provided
    if (participants && Array.isArray(participants)) {
      for (const pId of participants) {
        if (typeof pId === 'string' && mongoose.Types.ObjectId.isValid(pId)) {
          // valid ObjectId format
        }
      }
    }

    // Calculate participant count if not provided
    const calculatedCount = participantCount !== undefined
      ? participantCount
      : (participants && Array.isArray(participants) ? participants.length : 0);

    const activity = await Activity.create({
      schoolId,
      schoolName: req.body.schoolName || schoolDoc?.schoolName || schoolDoc?.name || '',
      programId,
      program: resolvedProgram,
      programName: resolvedProgram,
      activityName,
      name: activityName,
      title: activityName,
      activityType,
      date: date || Date.now(),
      description: description || '',
      participantCount: calculatedCount,
      participantsCount: calculatedCount,
      averageScore: averageScore || 0,
      participants: participants || [],
      photos: photos || []
    });

    let populatedActivity = activity;
    if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
      populatedActivity = (await Activity.findById(activity._id)
        .populate('schoolId', 'schoolName name district state')
        .populate('participants', 'name age gradeOrClass')) || activity;
    }

    return res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity: { id: activity._id },
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

export const listActivities = getActivities;
export const getActivity = getActivityById;

export {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
};

export default {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  listActivities,
  getActivity
};

