import "dotenv/config";
import mongoose from "mongoose";
import Program from "../models/Program.js";
import School from "../models/School.js";
import Activity from "../models/Activity.js";
import Assessment from "../models/Assessment.js";
import Participant from "../models/Participant.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yuwa";

async function seed() {
  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    Program.deleteMany({}),
    School.deleteMany({}),
    Activity.deleteMany({}),
    Assessment.deleteMany({}),
    Participant.deleteMany({}),
  ]);

  const [eco, gg] = await Program.create([
    { name: "Ecolympics", description: "Youth climate and waste management olympiad" },
    { name: "Green Gurukul", description: "Comprehensive school environmental curriculum" },
  ]);

  const [school1, school2, school3] = await School.create([
    {
      name: "Doon Public School",
      location: "Dehradun",
      programId: eco._id,
    },
    {
      name: "Himalayan Academy",
      location: "Rishikesh",
      programId: eco._id,
    },
    {
      name: "Valley Green School",
      location: "Mussoorie",
      programId: gg._id,
    },
  ]);

  const [p1, p2, p3] = await Participant.create([
    {
      name: "Asha Devi",
      age: 14,
      schoolId: school1._id,
      score: 76,
      localId: "seed-participant-1",
    },
    {
      name: "Rahul Verma",
      age: 15,
      schoolId: school2._id,
      score: 82,
      localId: "seed-participant-2",
    },
    {
      name: "Priya Sharma",
      age: 13,
      schoolId: school3._id,
      score: 88,
      localId: "seed-participant-3",
    },
  ]);

  await Activity.create([
    {
      programId: eco._id,
      schoolId: school1._id,
      activityType: "Climate Quiz",
      date: new Date("2026-09-10"),
      participants: 45,
      averageScore: 76,
      notes: "Interactive quiz on waste segregation and recycling principles.",
      photos: [],
      localId: "seed-activity-1",
    },
    {
      programId: eco._id,
      schoolId: school2._id,
      activityType: "Waste Audit Workshop",
      date: new Date("2026-09-12"),
      participants: 35,
      averageScore: 82,
      notes: "Hands-on waste audit identifying single-use plastic waste.",
      photos: [],
      localId: "seed-activity-2",
    },
    {
      programId: gg._id,
      schoolId: school3._id,
      activityType: "Composting Demonstration",
      date: new Date("2026-09-14"),
      participants: 50,
      averageScore: 88,
      notes: "Demonstration of organic waste pit composting.",
      photos: [],
      localId: "seed-activity-3",
    },
  ]);

  await Assessment.create([
    {
      participantId: p1._id,
      programId: eco._id,
      beforeScore: 42,
      afterScore: 76,
      localId: "seed-assessment-1",
    },
    {
      participantId: p2._id,
      programId: eco._id,
      beforeScore: 48,
      afterScore: 82,
      localId: "seed-assessment-2",
    },
    {
      participantId: p3._id,
      programId: gg._id,
      beforeScore: 50,
      afterScore: 88,
      localId: "seed-assessment-3",
    },
  ]);

  console.log("Seeded Programs, Schools, Participants, Activities, and Assessments successfully.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
