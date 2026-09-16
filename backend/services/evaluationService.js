import Activity from "../models/Activity.js";
import Participant from "../models/Participant.js";
import School from "../models/School.js";
import Assessment from "../models/Assessment.js";
import Program from "../models/Program.js";
import mongoose from "mongoose";

/**
 * BE 3: before/after averages and program-wise impact.
 * Example: before 45, after 75, improvement 30 percentage points.
 */
export async function getEvaluation(programId) {
  const query = {};
  if (programId && mongoose.isValidObjectId(programId)) {
    query.programId = new mongoose.Types.ObjectId(programId);
  }

  const assessments = await Assessment.find(query);

  if (!assessments.length) {
    return {
      participants: 0,
      averageBefore: 0,
      averageAfter: 0,
      improvement: 0,
      programId: programId || null,
    };
  }

  const totalBefore = assessments.reduce((acc, curr) => acc + (curr.beforeScore || 0), 0);
  const totalAfter = assessments.reduce((acc, curr) => acc + (curr.afterScore || 0), 0);
  const count = assessments.length;

  const averageBefore = Math.round((totalBefore / count) * 10) / 10;
  const averageAfter = Math.round((totalAfter / count) * 10) / 10;
  const improvement = Math.round((averageAfter - averageBefore) * 10) / 10;

  return {
    participants: count,
    averageBefore,
    averageAfter,
    improvement,
    programId: programId || null,
  };
}

export async function getDashboardSummary() {
  const [schoolsCount, participantsCount, activities, programs] = await Promise.all([
    School.countDocuments(),
    Participant.countDocuments(),
    Activity.find().populate("programId", "name").populate("schoolId", "name location"),
    Program.find(),
  ]);

  let totalPhotos = 0;
  for (const act of activities) {
    if (Array.isArray(act.photos)) {
      totalPhotos += act.photos.length;
    }
  }

  // Calculate statistics grouped by program
  const byProgram = programs.map((prog) => {
    const progActivities = activities.filter(
      (a) => a.programId && a.programId._id && a.programId._id.toString() === prog._id.toString()
    );

    const schoolSet = new Set(
      progActivities.map((a) => a.schoolId?._id?.toString()).filter(Boolean)
    );

    const totalProgParticipants = progActivities.reduce(
      (acc, a) => acc + (a.participants || 0),
      0
    );

    const scores = progActivities
      .map((a) => a.averageScore)
      .filter((s) => typeof s === "number" && !isNaN(s));

    const avgScore = scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

    return {
      id: prog._id.toString(),
      name: prog.name,
      description: prog.description,
      schools: schoolSet.size,
      participants: totalProgParticipants,
      activities: progActivities.length,
      averageScore: avgScore,
    };
  });

  return {
    totalSchools: schoolsCount,
    totalParticipants: participantsCount,
    totalActivities: activities.length,
    totalPhotos,
    byProgram,
  };
}

