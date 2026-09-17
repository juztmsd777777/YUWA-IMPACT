import "dotenv/config";
import mongoose from "mongoose";
import Program from "../models/Program.js";
import School from "../models/School.js";
import Activity from "../models/Activity.js";
import Assessment from "../models/Assessment.js";
import Participant from "../models/Participant.js";
import ActivityReport from "../models/ActivityReport.js";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yuwa_portal";

async function seed() {
  console.log("Connecting to MongoDB for database seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", mongoose.connection.host);

  // Clear existing collections
  await Promise.all([
    Program.deleteMany({}),
    School.deleteMany({}),
    Activity.deleteMany({}),
    Assessment.deleteMany({}),
    Participant.deleteMany({}),
    ActivityReport.deleteMany({}),
  ]);
  console.log("Cleared existing database records.");

  // 1. Seed Programs
  const [eco, gg] = await Program.create([
    {
      name: "Ecolympics",
      description: "Youth climate challenge & competitive environmental waste audit olympiad for secondary schools",
    },
    {
      name: "Green Gurukul",
      description: "Year-round experiential climate curriculum, composting labs, and campus biodiversity stewardship",
    },
  ]);
  console.log("Seeded 2 core YUWA programs.");

  // 2. Seed Schools
  const schoolsData = [
    {
      schoolName: "ZP High School, Warangal",
      name: "ZP High School, Warangal",
      location: "Subedari, Warangal, Telangana",
      district: "Warangal",
      state: "Telangana",
      contactPerson: "Dr. K. Srinivas",
      contactPhone: "+91 98480 12345",
      contactEmail: "principal.zphs@telangana.gov.in",
      program: "Ecolympics",
      programId: eco._id,
    },
    {
      schoolName: "Govt. High School, Hanamkonda",
      name: "Govt. High School, Hanamkonda",
      location: "Nayeemnagar, Hanamkonda, Telangana",
      district: "Hanamkonda",
      state: "Telangana",
      contactPerson: "Mrs. M. Radhika",
      contactPhone: "+91 94401 56789",
      contactEmail: "ghs.hanamkonda@gmail.com",
      program: "Both",
      programId: eco._id,
    },
    {
      schoolName: "Sunrise High School, Kazipet",
      name: "Sunrise High School, Kazipet",
      location: "Railway Colony, Kazipet, Telangana",
      district: "Warangal",
      state: "Telangana",
      contactPerson: "Mr. B. Rajesh",
      contactPhone: "+91 98662 33445",
      contactEmail: "sunrise.kazipet@edu.org",
      program: "Green Gurukul",
      programId: gg._id,
    },
    {
      schoolName: "Doon Public School, Dehradun",
      name: "Doon Public School, Dehradun",
      location: "Rajpur Road, Dehradun, Uttarakhand",
      district: "Dehradun",
      state: "Uttarakhand",
      contactPerson: "Mr. Alok Rawat",
      contactPhone: "+91 97580 11223",
      contactEmail: "alok.rawat@doonpublic.edu",
      program: "Ecolympics",
      programId: eco._id,
    },
    {
      schoolName: "Valley Green Model School, Mussoorie",
      name: "Valley Green Model School, Mussoorie",
      location: "Library Bazaar, Mussoorie, Uttarakhand",
      district: "Dehradun",
      state: "Uttarakhand",
      contactPerson: "Sister Anne Joseph",
      contactPhone: "+91 94120 88990",
      contactEmail: "valleygreen.mussoorie@gmail.com",
      program: "Green Gurukul",
      programId: gg._id,
    },
    {
      schoolName: "Himalayan Academy, Rishikesh",
      name: "Himalayan Academy, Rishikesh",
      location: "Tapovan, Rishikesh, Uttarakhand",
      district: "Tehri Garhwal",
      state: "Uttarakhand",
      contactPerson: "Swami Shivananda",
      contactPhone: "+91 98970 44556",
      contactEmail: "info@himalayanacademy.org",
      program: "Both",
      programId: eco._id,
    },
  ];

  const createdSchools = await School.create(schoolsData);
  console.log(`Seeded ${createdSchools.length} registered schools.`);

  // 3. Seed Participants
  const participantsData = [
    // School 0: ZP High School, Warangal
    {
      name: "Rahul Sharma",
      fullName: "Rahul Sharma",
      age: 14,
      gender: "Male",
      schoolId: createdSchools[0]._id,
      schoolName: createdSchools[0].schoolName,
      gradeOrClass: "Class 8",
      className: "Class 8",
      contact: "+91 98765 43210",
      score: 85,
      notes: "Eco-club volunteer and waste segregation lead",
      program: "Ecolympics",
      programId: eco._id,
    },
    {
      name: "Ananya Reddy",
      fullName: "Ananya Reddy",
      age: 13,
      gender: "Female",
      schoolId: createdSchools[0]._id,
      schoolName: createdSchools[0].schoolName,
      gradeOrClass: "Class 7",
      className: "Class 7",
      contact: "+91 98765 43211",
      score: 92,
      notes: "Top scorer in campus plastic audit",
      program: "Ecolympics",
      programId: eco._id,
    },
    {
      name: "Sai Teja",
      fullName: "Sai Teja",
      age: 15,
      gender: "Male",
      schoolId: createdSchools[0]._id,
      schoolName: createdSchools[0].schoolName,
      gradeOrClass: "Class 9",
      className: "Class 9",
      contact: "+91 98765 43212",
      score: 78,
      notes: "Compost pit maintenance team member",
      program: "Ecolympics",
      programId: eco._id,
    },

    // School 1: Govt. High School, Hanamkonda
    {
      name: "Pooja Verma",
      fullName: "Pooja Verma",
      age: 14,
      gender: "Female",
      schoolId: createdSchools[1]._id,
      schoolName: createdSchools[1].schoolName,
      gradeOrClass: "Class 8",
      className: "Class 8",
      contact: "+91 98765 43213",
      score: 88,
      notes: "Active climate rally presenter",
      program: "Both",
      programId: eco._id,
    },
    {
      name: "Karthik Kumar",
      fullName: "Karthik Kumar",
      age: 15,
      gender: "Male",
      schoolId: createdSchools[1]._id,
      schoolName: createdSchools[1].schoolName,
      gradeOrClass: "Class 9",
      className: "Class 9",
      contact: "+91 98765 43214",
      score: 80,
      notes: "Upcycling workshop coordinator",
      program: "Both",
      programId: gg._id,
    },

    // School 2: Sunrise High School, Kazipet
    {
      name: "Divya Sri",
      fullName: "Divya Sri",
      age: 13,
      gender: "Female",
      schoolId: createdSchools[2]._id,
      schoolName: createdSchools[2].schoolName,
      gradeOrClass: "Class 7",
      className: "Class 7",
      contact: "+91 98765 43215",
      score: 95,
      notes: "School Green Ambassador",
      program: "Green Gurukul",
      programId: gg._id,
    },
    {
      name: "Manoj Chander",
      fullName: "Manoj Chander",
      age: 14,
      gender: "Male",
      schoolId: createdSchools[2]._id,
      schoolName: createdSchools[2].schoolName,
      gradeOrClass: "Class 8",
      className: "Class 8",
      contact: "+91 98765 43216",
      score: 74,
      notes: "Herbal garden volunteer",
      program: "Green Gurukul",
      programId: gg._id,
    },

    // School 3: Doon Public School, Dehradun
    {
      name: "Asha Devi",
      fullName: "Asha Devi",
      age: 14,
      gender: "Female",
      schoolId: createdSchools[3]._id,
      schoolName: createdSchools[3].schoolName,
      gradeOrClass: "Class 8",
      className: "Class 8",
      contact: "+91 98765 43217",
      score: 89,
      notes: "Waste warrior captain",
      program: "Ecolympics",
      programId: eco._id,
    },
    {
      name: "Vikram Negi",
      fullName: "Vikram Negi",
      age: 15,
      gender: "Male",
      schoolId: createdSchools[3]._id,
      schoolName: createdSchools[3].schoolName,
      gradeOrClass: "Class 9",
      className: "Class 9",
      contact: "+91 98765 43218",
      score: 83,
      notes: "Audit log keeper",
      program: "Ecolympics",
      programId: eco._id,
    },

    // School 4: Valley Green Model School, Mussoorie
    {
      name: "Sneha Rawat",
      fullName: "Sneha Rawat",
      age: 13,
      gender: "Female",
      schoolId: createdSchools[4]._id,
      schoolName: createdSchools[4].schoolName,
      gradeOrClass: "Class 7",
      className: "Class 7",
      contact: "+91 98765 43219",
      score: 91,
      notes: "Biodiversity inventory lead",
      program: "Green Gurukul",
      programId: gg._id,
    },

    // School 5: Himalayan Academy, Rishikesh
    {
      name: "Rohan Joshi",
      fullName: "Rohan Joshi",
      age: 14,
      gender: "Male",
      schoolId: createdSchools[5]._id,
      schoolName: createdSchools[5].schoolName,
      gradeOrClass: "Class 8",
      className: "Class 8",
      contact: "+91 98765 43220",
      score: 86,
      notes: "Clean Ganga youth cohort lead",
      program: "Both",
      programId: eco._id,
    },
  ];

  const createdParticipants = await Participant.create(participantsData);
  console.log(`Seeded ${createdParticipants.length} student participants.`);

  // 4. Seed Activities
  const activitiesData = [
    {
      schoolId: createdSchools[0]._id,
      schoolName: createdSchools[0].schoolName,
      programId: eco._id,
      program: "Ecolympics",
      programName: "Ecolympics",
      activityName: "Tree Plantation Drive",
      title: "Tree Plantation Drive",
      name: "Tree Plantation Drive",
      activityType: "Cleanliness Drive",
      date: new Date("2026-09-15T10:30:00Z"),
      description: "Planted 45 native neem and fruit saplings across the school perimeter with student eco-clubs.",
      participantCount: 38,
      participantsCount: 38,
      averageScore: 88,
      participants: [createdParticipants[0]._id, createdParticipants[1]._id, createdParticipants[2]._id],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
          caption: "Students planting native saplings along the north boundary wall",
        },
        {
          url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80",
          caption: "Sapling watering and bio-fence installation",
        },
      ],
    },
    {
      schoolId: createdSchools[1]._id,
      schoolName: createdSchools[1].schoolName,
      programId: eco._id,
      program: "Ecolympics",
      programName: "Ecolympics",
      activityName: "Campus Waste Audit & Sorting",
      title: "Campus Waste Audit & Sorting",
      name: "Campus Waste Audit & Sorting",
      activityType: "Waste Audit",
      date: new Date("2026-09-14T09:00:00Z"),
      description: "Collected and weighed 62kg of dry and wet campus waste; categorized plastic wrappers, paper, and food scraps.",
      participantCount: 42,
      participantsCount: 42,
      averageScore: 84,
      participants: [createdParticipants[3]._id, createdParticipants[4]._id],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
          caption: "Waste segregation table setup with multi-color bins",
        },
      ],
    },
    {
      schoolId: createdSchools[2]._id,
      schoolName: createdSchools[2].schoolName,
      programId: gg._id,
      program: "Green Gurukul",
      programName: "Green Gurukul",
      activityName: "Organic Composting Pit Workshop",
      title: "Organic Composting Pit Workshop",
      name: "Organic Composting Pit Workshop",
      activityType: "Composting Session",
      date: new Date("2026-09-12T11:15:00Z"),
      description: "Set up two aerobic compost bins using dry leaves and cafeteria organic waste; trained student caretakers.",
      participantCount: 30,
      participantsCount: 30,
      averageScore: 92,
      participants: [createdParticipants[5]._id, createdParticipants[6]._id],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80",
          caption: "Compost layering demonstration by field instructor",
        },
      ],
    },
    {
      schoolId: createdSchools[3]._id,
      schoolName: createdSchools[3].schoolName,
      programId: eco._id,
      program: "Ecolympics",
      programName: "Ecolympics",
      activityName: "Single-Use Plastic Awareness Rally",
      title: "Single-Use Plastic Awareness Rally",
      name: "Single-Use Plastic Awareness Rally",
      activityType: "Awareness Rally",
      date: new Date("2026-09-10T08:45:00Z"),
      description: "Student rally through Rajpur Road neighborhood carrying handmade placards advocating cloth bags.",
      participantCount: 65,
      participantsCount: 65,
      averageScore: 86,
      participants: [createdParticipants[7]._id, createdParticipants[8]._id],
      photos: [
        {
          url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80",
          caption: "Students with eco-placards marching in school zone",
        },
      ],
    },
    {
      schoolId: createdSchools[4]._id,
      schoolName: createdSchools[4].schoolName,
      programId: gg._id,
      program: "Green Gurukul",
      programName: "Green Gurukul",
      activityName: "Biodiversity Herbarium & Flora Survey",
      title: "Biodiversity Herbarium & Flora Survey",
      name: "Biodiversity Herbarium & Flora Survey",
      activityType: "Other",
      date: new Date("2026-09-08T14:00:00Z"),
      description: "Cataloged 34 indigenous plant and shrub species in the school estate; created educational name plaques.",
      participantCount: 25,
      participantsCount: 25,
      averageScore: 90,
      participants: [createdParticipants[9]._id],
      photos: [],
    },
    {
      schoolId: createdSchools[5]._id,
      schoolName: createdSchools[5].schoolName,
      programId: eco._id,
      program: "Ecolympics",
      programName: "Ecolympics",
      activityName: "Ghat Cleanup & Segregation Drive",
      title: "Ghat Cleanup & Segregation Drive",
      name: "Ghat Cleanup & Segregation Drive",
      activityType: "Cleanliness Drive",
      date: new Date("2026-09-05T07:30:00Z"),
      description: "Riverbank cleanliness drive recovering 110kg of non-biodegradable debris and plastic bottles for recycling.",
      participantCount: 52,
      participantsCount: 52,
      averageScore: 89,
      participants: [createdParticipants[10]._id],
      photos: [],
    },
  ];

  const createdActivities = await Activity.create(activitiesData);
  console.log(`Seeded ${createdActivities.length} field activities with evidence photos.`);

  // 5. Seed Assessments (Before / After scores)
  const assessmentsData = [
    {
      participantId: createdParticipants[0]._id,
      programId: eco._id,
      schoolId: createdSchools[0]._id,
      beforeScore: 42,
      afterScore: 85,
    },
    {
      participantId: createdParticipants[1]._id,
      programId: eco._id,
      schoolId: createdSchools[0]._id,
      beforeScore: 48,
      afterScore: 92,
    },
    {
      participantId: createdParticipants[2]._id,
      programId: eco._id,
      schoolId: createdSchools[0]._id,
      beforeScore: 38,
      afterScore: 78,
    },
    {
      participantId: createdParticipants[3]._id,
      programId: eco._id,
      schoolId: createdSchools[1]._id,
      beforeScore: 45,
      afterScore: 88,
    },
    {
      participantId: createdParticipants[4]._id,
      programId: gg._id,
      schoolId: createdSchools[1]._id,
      beforeScore: 50,
      afterScore: 80,
    },
    {
      participantId: createdParticipants[5]._id,
      programId: gg._id,
      schoolId: createdSchools[2]._id,
      beforeScore: 54,
      afterScore: 95,
    },
    {
      participantId: createdParticipants[6]._id,
      programId: gg._id,
      schoolId: createdSchools[2]._id,
      beforeScore: 40,
      afterScore: 74,
    },
    {
      participantId: createdParticipants[7]._id,
      programId: eco._id,
      schoolId: createdSchools[3]._id,
      beforeScore: 46,
      afterScore: 89,
    },
    {
      participantId: createdParticipants[8]._id,
      programId: eco._id,
      schoolId: createdSchools[3]._id,
      beforeScore: 43,
      afterScore: 83,
    },
    {
      participantId: createdParticipants[9]._id,
      programId: gg._id,
      schoolId: createdSchools[4]._id,
      beforeScore: 52,
      afterScore: 91,
    },
    {
      participantId: createdParticipants[10]._id,
      programId: eco._id,
      schoolId: createdSchools[5]._id,
      beforeScore: 49,
      afterScore: 86,
    },
  ];

  await Assessment.create(assessmentsData);
  console.log(`Seeded ${assessmentsData.length} participant assessment before/after evaluations.`);

  // 6. Seed ActivityReports for Offline Sync Engine
  const activityReportsData = [
    {
      clientGeneratedId: "sync-report-warangal-01",
      schoolId: createdSchools[0]._id,
      programName: "Ecolympics",
      studentCount: 38,
      activityDetails: {
        activityName: "Tree Plantation Drive",
        date: "2026-09-15",
        location: "Warangal",
      },
      photoUrls: ["/uploads/proofs/proof-1.jpg"],
      status: "synced",
      clientCreatedAt: new Date("2026-09-15T10:30:00Z"),
      syncedAt: new Date("2026-09-15T11:00:00Z"),
    },
    {
      clientGeneratedId: "sync-report-hanamkonda-02",
      schoolId: createdSchools[1]._id,
      programName: "Ecolympics",
      studentCount: 42,
      activityDetails: {
        activityName: "Campus Waste Audit & Sorting",
        date: "2026-09-14",
        location: "Hanamkonda",
      },
      photoUrls: ["/uploads/proofs/proof-2.jpg"],
      status: "synced",
      clientCreatedAt: new Date("2026-09-14T09:00:00Z"),
      syncedAt: new Date("2026-09-14T09:45:00Z"),
    },
    {
      clientGeneratedId: "sync-report-kazipet-03",
      schoolId: createdSchools[2]._id,
      programName: "Green Gurukul",
      studentCount: 30,
      activityDetails: {
        activityName: "Organic Composting Pit Workshop",
        date: "2026-09-12",
        location: "Kazipet",
      },
      photoUrls: ["/uploads/proofs/proof-3.jpg"],
      status: "synced",
      clientCreatedAt: new Date("2026-09-12T11:15:00Z"),
      syncedAt: new Date("2026-09-12T11:45:00Z"),
    },
    {
      clientGeneratedId: "sync-report-dehradun-04",
      schoolId: createdSchools[3]._id,
      programName: "Ecolympics",
      studentCount: 65,
      activityDetails: {
        activityName: "Single-Use Plastic Awareness Rally",
        date: "2026-09-10",
        location: "Dehradun",
      },
      photoUrls: [],
      status: "synced",
      clientCreatedAt: new Date("2026-09-10T08:45:00Z"),
      syncedAt: new Date("2026-09-10T09:15:00Z"),
    },
  ];

  await ActivityReport.create(activityReportsData);
  console.log(`Seeded ${activityReportsData.length} activity sync reports.`);

  console.log("==================================================");
  console.log("✅ DATABASE SEED COMPLETE: All data successfully written to MongoDB Atlas");
  console.log("==================================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed Error:", err);
  process.exit(1);
});
