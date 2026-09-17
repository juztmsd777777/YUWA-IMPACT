const mongoose = require('mongoose');
const School = require('../models/School');

/**
 * @desc    Create a new school
 * @route   POST /api/schools
 * @access  Public / Field Team
 */
const createSchool = async (req, res) => {
  try {
    const { schoolName, location, district, state, contactPerson, contactPhone, contactEmail, program } = req.body;

    // Validate required fields
    if (!schoolName || !location || !district || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide schoolName, location, district, and state'
      });
    }

    const school = await School.create({
      schoolName,
      location,
      district,
      state,
      contactPerson,
      contactPhone,
      contactEmail,
      program
    });

    return res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error creating school: ' + error.message
    });
  }
};

/**
 * @desc    Get all schools (optional filter by program or district)
 * @route   GET /api/schools
 * @access  Public / Dashboard
 */
const getSchools = async (req, res) => {
  try {
    const { program, district } = req.query;
    const filter = {};

    if (program) filter.program = program;
    if (district) filter.district = new RegExp(`^${district}$`, 'i'); // Case-insensitive match

    const schools = await School.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      count: schools.length,
      data: schools
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving schools: ' + error.message
    });
  }
};

/**
 * @desc    Get single school by ID
 * @route   GET /api/schools/:id
 * @access  Public
 */
const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID format'
      });
    }

    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'School retrieved successfully',
      data: school
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving school: ' + error.message
    });
  }
};

/**
 * @desc    Update school details
 * @route   PUT /api/schools/:id
 * @access  Public / Field Team
 */
const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID format'
      });
    }

    const updatedSchool = await School.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run schema validations on update
    });

    if (!updatedSchool) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: updatedSchool
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
      message: 'Server error updating school: ' + error.message
    });
  }
};

/**
 * @desc    Delete school
 * @route   DELETE /api/schools/:id
 * @access  Public / Admin
 */
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid school ID format'
      });
    }

    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'School deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting school: ' + error.message
    });
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
};
