/** Mock payload so FE 2 can build UI before MongoDB aggregation exists. */
export const mockDashboard = {
  totalSchools: 1,
  totalParticipants: 40,
  totalActivities: 1,
  totalPhotos: 0,
  byProgram: [
    {
      name: "Ecolympics",
      schools: 1,
      participants: 40,
      activities: 1,
      averageScore: 76,
    },
    {
      name: "Green Gurukul",
      schools: 0,
      participants: 0,
      activities: 0,
      averageScore: 0,
    },
  ],
  activities: [
    {
      id: "demo-1",
      school: "ABC School",
      program: "Ecolympics",
      activityType: "Climate Quiz",
      date: "2026-09-16",
      participants: 40,
      averageScore: 76,
    },
  ],
};

export const mockEvaluation = {
  participants: 40,
  averageBefore: 45,
  averageAfter: 75,
  improvement: 30,
};

export const mockPrograms = [
  { id: "p-eco", name: "Ecolympics", description: "Youth climate olympiad" },
  { id: "p-gg", name: "Green Gurukul", description: "School climate program" },
];

export const mockSchools = [
  { id: "s-abc", name: "ABC School", location: "Dehradun", programId: "p-eco" },
];
