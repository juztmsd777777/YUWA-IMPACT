// Realistic Mock Data for YUWA Impact & Evaluation Portal (Waste Warriors Society)

export const OVERVIEW_METRICS = {
  totalSchools: { value: 124, trend: '+12% vs last month', isPositive: true },
  totalStudents: { value: '8,450', trend: '+18% vs last month', isPositive: true },
  totalActivities: { value: 342, trend: '+8% vs last month', isPositive: true },
  totalEvidence: { value: '1,280', trend: '+25% verified', isPositive: true },
};

export const PROGRAMS = [
  {
    id: 'ecolympics',
    title: 'Ecolympics',
    badge: 'Active Program',
    description: 'Gamified inter-school environmental sports and waste segregation competitions empowering student champions.',
    schoolsReached: 68,
    studentsReached: '4,820',
    avgScore: '82%',
    completionRate: '94%',
    color: '#0f4632'
  },
  {
    id: 'green-gurukul',
    title: 'Green Gurukul',
    badge: 'Active Program',
    description: 'Continuous classroom curriculum on circular economy, composting pits, and institutional solid waste audits.',
    schoolsReached: 56,
    studentsReached: '3,630',
    avgScore: '76%',
    completionRate: '89%',
    color: '#2e7d32'
  }
];

export const IMPACT_KPIS = [
  { label: 'Average Score', value: '80%', trend: '+4% overall benchmark', isPositive: true },
  { label: 'Improvement', value: '+24%', trend: 'Pre to Post baseline gain', isPositive: true },
  { label: 'Participants Reached', value: '8,450', trend: 'Across 124 partner schools', isPositive: true },
  { label: 'Schools Reached', value: '124', trend: 'Active in 6 regional clusters', isPositive: true },
];

export const BEFORE_AFTER_DATA = [
  { category: 'Waste Segregation', pre: 44, post: 84 },
  { category: 'Composting & Soil', pre: 36, post: 78 },
  { category: 'Plastic Reduction', pre: 50, post: 88 },
  { category: 'Cleanliness & Sanitation', pre: 58, post: 90 },
  { category: 'Circular Economy', pre: 32, post: 75 },
];

export const PROGRAM_COMPARISON_DATA = [
  { metric: 'Knowledge Retention', Ecolympics: 86, GreenGurukul: 78 },
  { metric: 'Practical Action', Ecolympics: 92, GreenGurukul: 82 },
  { metric: 'Engagement', Ecolympics: 88, GreenGurukul: 85 },
  { metric: 'Attendance', Ecolympics: 94, GreenGurukul: 89 },
  { metric: 'Improvement Rate', Ecolympics: 82, GreenGurukul: 74 },
];

export const PROGRAM_PERFORMANCE_TABLE = [
  {
    id: 'ecolympics',
    name: 'Ecolympics',
    schools: 68,
    students: '4,820',
    preScore: '56%',
    postScore: '82%',
    netImprovement: '+26%',
    status: 'Exceeding Target'
  },
  {
    id: 'green-gurukul',
    name: 'Green Gurukul',
    schools: 56,
    students: '3,630',
    preScore: '54%',
    postScore: '76%',
    netImprovement: '+22%',
    status: 'On Track'
  }
];

// Sample realistic high quality photo evidence
export const SAMPLE_PHOTOS = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    caption: 'Green Quiz - Interactive Session',
    date: '12 Apr 2025',
    school: 'Sunrise High School'
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    caption: 'Waste Segregation Demonstration',
    date: '05 Apr 2025',
    school: 'Sunrise High School'
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80',
    caption: 'Composting Bed Setup & Organic Waste Audit',
    date: '28 Mar 2025',
    school: 'Sunrise High School'
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    caption: 'Student Green Ambassadors Felicitated',
    date: '18 Mar 2025',
    school: 'Sunrise High School'
  }
];

export const SCHOOL_DETAILS_DATA = {
  id: 'sunrise-high-school',
  name: 'Sunrise High School',
  location: 'Bangalore, Karnataka',
  studentsCount: 450,
  coordinator: 'Mr. R. Sundaram (Eco-Club Head)',
  image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  overview: {
    totalStudents: 450,
    totalActivities: 18,
    averageScore: '84%',
  },
  recentActivities: [
    {
      id: 'green-quiz-12apr2025',
      date: '12 Apr 2025',
      program: 'Ecolympics',
      activity: 'Green Quiz',
      participants: 25,
      avgScore: '82%',
      status: 'Completed'
    },
    {
      id: 'act-2',
      date: '05 Apr 2025',
      program: 'Ecolympics',
      activity: 'Waste Segregation Workshop',
      participants: 40,
      avgScore: '86%',
      status: 'Completed'
    },
    {
      id: 'act-3',
      date: '28 Mar 2025',
      program: 'Green Gurukul',
      activity: 'Composting Demo',
      participants: 32,
      avgScore: '80%',
      status: 'Completed'
    },
    {
      id: 'act-4',
      date: '18 Mar 2025',
      program: 'Ecolympics',
      activity: 'Campus Cleanliness Audit',
      participants: 55,
      avgScore: '88%',
      status: 'Completed'
    },
    {
      id: 'act-5',
      date: '10 Mar 2025',
      program: 'Green Gurukul',
      activity: 'Plastic Upcycling Challenge',
      participants: 30,
      avgScore: '85%',
      status: 'Completed'
    }
  ],
  photos: SAMPLE_PHOTOS
};

export const ACTIVITY_DETAILS_DATA = {
  id: 'green-quiz-12apr2025',
  title: 'Activity Details',
  program: 'Ecolympics',
  school: 'Sunrise High School',
  schoolId: 'sunrise-high-school',
  date: '12 Apr 2025',
  activityType: 'Green Quiz',
  participants: 25,
  avgScore: '82%',
  notes: 'Students were very enthusiastic and participated actively. Demonstrated strong understanding of organic vs inorganic waste segregation.',
  bannerImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  photos: SAMPLE_PHOTOS
};

export const ALL_ACTIVITIES = [
  {
    id: 'green-quiz-12apr2025',
    date: '12 Apr 2025',
    program: 'Ecolympics',
    activity: 'Green Quiz',
    school: 'Sunrise High School',
    schoolId: 'sunrise-high-school',
    activityType: 'Green Quiz',
    participants: 25,
    avgScore: '82%',
    status: 'Completed'
  },
  {
    id: 'act-2',
    date: '10 Apr 2025',
    program: 'Green Gurukul',
    activity: 'Waste Segregation Workshop',
    school: 'Pinecrest Academy',
    schoolId: 'pinecrest-academy',
    activityType: 'Waste Segregation Workshop',
    participants: 42,
    avgScore: '78%',
    status: 'Completed'
  },
  {
    id: 'act-3',
    date: '08 Apr 2025',
    program: 'Ecolympics',
    activity: 'Cleanliness Drive',
    school: 'Doon Valley Public School',
    schoolId: 'doon-valley',
    activityType: 'Cleanliness Drive',
    participants: 60,
    avgScore: '88%',
    status: 'Completed'
  },
  {
    id: 'act-4',
    date: '05 Apr 2025',
    program: 'Green Gurukul',
    activity: 'Composting Demo',
    school: 'Himalayan Day School',
    schoolId: 'himalayan-day',
    activityType: 'Composting Demo',
    participants: 35,
    avgScore: '74%',
    status: 'Completed'
  },
  {
    id: 'act-5',
    date: '02 Apr 2025',
    program: 'Ecolympics',
    activity: 'Plastic Audit & Upcycling',
    school: 'Sunrise High School',
    schoolId: 'sunrise-high-school',
    activityType: 'Cleanliness Drive',
    participants: 30,
    avgScore: '85%',
    status: 'Completed'
  },
  {
    id: 'act-6',
    date: '30 Mar 2025',
    program: 'Green Gurukul',
    activity: 'Green Quiz',
    school: 'Oakridge International',
    schoolId: 'oakridge',
    activityType: 'Green Quiz',
    participants: 48,
    avgScore: '80%',
    status: 'Completed'
  },
  {
    id: 'act-7',
    date: '25 Mar 2025',
    program: 'Ecolympics',
    activity: 'Waste Segregation Workshop',
    school: 'Doon Valley Public School',
    schoolId: 'doon-valley',
    activityType: 'Waste Segregation Workshop',
    participants: 50,
    avgScore: '84%',
    status: 'Completed'
  }
];

export const FILTER_OPTIONS = {
  programs: ['All Programs', 'Ecolympics', 'Green Gurukul'],
  schools: [
    'All Schools',
    'Sunrise High School',
    'Pinecrest Academy',
    'Doon Valley Public School',
    'Himalayan Day School',
    'Oakridge International'
  ],
  activityTypes: [
    'All Activity Types',
    'Green Quiz',
    'Waste Segregation Workshop',
    'Cleanliness Drive',
    'Composting Demo'
  ]
};
