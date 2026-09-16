export const initialFieldWorker = {
  id: 'fw-001',
  name: 'Ravi Kumar',
  role: 'Field Worker',
  organization: 'Waste Warriors Society',
  location: 'Warangal, Telangana',
  avatar: 'RK',
  stats: {
    pendingSyncCount: 3,
    schoolsVisited: 12,
    activitiesCompleted: 18,
    participantsRegistered: 142
  }
};

export const initialPrograms = [
  {
    id: 'prog-ecolympics',
    name: 'Ecolympics',
    category: 'Competition & Sports',
    tagline: 'Environmental competitions for schools',
    description: 'Environmental awareness through dynamic sports, quizzes, and inter-school climate challenges.',
    icon: 'Trophy',
    stats: {
      schools: 248,
      students: '12,430',
      activities: '1,248'
    },
    features: [
      'Inter-school competitions',
      'Environmental awareness',
      'Hands-on activities',
      'Youth engagement'
    ],
    themeColor: '#1B4D3E'
  },
  {
    id: 'prog-green-gurukul',
    name: 'Green Gurukul',
    category: 'Curriculum & Hands-on',
    tagline: 'Climate education & awareness program',
    description: 'Hands-on climate education, nature-based learning, and sustainable school campus initiatives.',
    icon: 'GraduationCap',
    stats: {
      schools: 186,
      students: '9,840',
      activities: '962'
    },
    features: [
      'Learning sessions',
      'Skill building',
      'Community engagement',
      'Sustainable practices'
    ],
    themeColor: '#2D6A4F'
  }
];

export const initialSchools = [
  {
    id: 'sch-01',
    name: 'ZP High School',
    location: 'Warangal, Telangana',
    district: 'Warangal',
    mandal: 'Warangal Urban',
    code: 'ZPHS-WGL-01',
    distance: '1.2 km',
    participantsCount: 312,
    totalActivities: 24,
    type: 'Government School'
  },
  {
    id: 'sch-02',
    name: 'Govt. High School',
    location: 'Narsampet, Telangana',
    district: 'Warangal',
    mandal: 'Narsampet',
    code: 'GHS-NPT-02',
    distance: '4.3 km',
    participantsCount: 248,
    totalActivities: 18,
    type: 'Government High School'
  },
  {
    id: 'sch-03',
    name: 'MJPUS',
    location: 'Regonda, Telangana',
    district: 'Jayashankar Bhupalpally',
    mandal: 'Regonda',
    code: 'MJP-RGD-03',
    distance: '5.8 km',
    participantsCount: 186,
    totalActivities: 14,
    type: 'Residential School'
  },
  {
    id: 'sch-04',
    name: 'KGBV',
    location: 'Deveruppula, Telangana',
    district: 'Jangaon',
    mandal: 'Deveruppula',
    code: 'KGBV-DVP-04',
    distance: '8.1 km',
    participantsCount: 142,
    totalActivities: 9,
    type: 'Girls Residential School'
  },
  {
    id: 'sch-05',
    name: 'Kendriya Vidyalaya',
    location: 'Subedari, Hanamkonda',
    district: 'Hanamkonda',
    mandal: 'Hanamkonda',
    code: 'KV-HNK-05',
    distance: '9.4 km',
    participantsCount: 96,
    totalActivities: 7,
    type: 'Central School'
  },
  {
    id: 'sch-06',
    name: 'St. Joseph\'s High School',
    location: 'Kazipet, Telangana',
    district: 'Hanamkonda',
    mandal: 'Kazipet',
    code: 'SJS-KZP-06',
    distance: '11.2 km',
    participantsCount: 210,
    totalActivities: 16,
    type: 'Private Aided School'
  }
];

export const initialParticipants = [
  {
    id: 'part-01',
    fullName: 'Rahul Sharma',
    className: 'Class 8',
    age: 14,
    gender: 'Male',
    schoolId: 'sch-01',
    schoolName: 'ZP High School',
    score: 85,
    contact: '+91 98765 43210',
    status: 'Active',
    addedAt: '2025-09-14'
  },
  {
    id: 'part-02',
    fullName: 'Sneha Reddy',
    className: 'Class 9',
    age: 15,
    gender: 'Female',
    schoolId: 'sch-01',
    schoolName: 'ZP High School',
    score: 88,
    contact: '+91 98765 43211',
    status: 'Active',
    addedAt: '2025-09-14'
  },
  {
    id: 'part-03',
    fullName: 'Arjun Kumar',
    className: 'Class 7',
    age: 13,
    gender: 'Male',
    schoolId: 'sch-01',
    schoolName: 'ZP High School',
    score: 92,
    contact: '+91 98765 43212',
    status: 'Active',
    addedAt: '2025-09-14'
  },
  {
    id: 'part-04',
    fullName: 'Pooja Verma',
    className: 'Class 6',
    age: 12,
    gender: 'Female',
    schoolId: 'sch-01',
    schoolName: 'ZP High School',
    score: 78,
    contact: '',
    status: 'Active',
    addedAt: '2025-09-15'
  },
  {
    id: 'part-05',
    fullName: 'Imran Khan',
    className: 'Class 8',
    age: 14,
    gender: 'Male',
    schoolId: 'sch-01',
    schoolName: 'ZP High School',
    score: 81,
    contact: '+91 98765 43214',
    status: 'Active',
    addedAt: '2025-09-15'
  },
  {
    id: 'part-06',
    fullName: 'Kartik Singh',
    className: 'Class 10',
    age: 16,
    gender: 'Male',
    schoolId: 'sch-02',
    schoolName: 'Govt. High School',
    score: 75,
    contact: '',
    status: 'Active',
    addedAt: '2025-09-15'
  }
];

export const initialActivities = [
  {
    id: 'act-01',
    programId: 'prog-ecolympics',
    programName: 'Ecolympics',
    schoolId: 'sch-01',
    schoolName: 'ZP High School, Warangal',
    activityType: 'Tree Plantation',
    activityName: 'Tree Plantation Drive',
    date: '2025-09-16',
    timeAgo: '2 hours ago',
    participantsCount: 25,
    averageScore: 82,
    description: 'Students participated enthusiastically in native tree planting and composting setup on school grounds.',
    photosCount: 4,
    status: 'Pending Sync'
  },
  {
    id: 'act-02',
    programId: 'prog-green-gurukul',
    programName: 'Green Gurukul',
    schoolId: 'sch-02',
    schoolName: 'Govt. High School, Narsampet',
    activityType: 'Clean Campus Drive',
    activityName: 'Clean Campus Activity',
    date: '2025-09-16',
    timeAgo: '5 hours ago',
    participantsCount: 32,
    averageScore: 78,
    description: 'Waste segregation workshop and clean campus drive across 4 zones of the high school.',
    photosCount: 3,
    status: 'Pending Sync'
  },
  {
    id: 'act-03',
    programId: 'prog-green-gurukul',
    programName: 'Green Gurukul',
    schoolId: 'sch-03',
    schoolName: 'MJPUS, Regonda',
    activityType: 'Awareness Session',
    activityName: 'Awareness Session',
    date: '2025-09-15',
    timeAgo: '1 day ago',
    participantsCount: 18,
    averageScore: 76,
    description: 'Interactive climate lecture with audio-visual presentation and poster making session.',
    photosCount: 5,
    status: 'Pending Sync'
  },
  {
    id: 'act-04',
    programId: 'prog-ecolympics',
    programName: 'Ecolympics',
    schoolId: 'sch-01',
    schoolName: 'Sunrise High School',
    activityType: 'Green Quiz',
    activityName: 'Inter-House Green Quiz',
    date: '2025-04-12',
    timeAgo: '2 weeks ago',
    participantsCount: 25,
    averageScore: 82,
    description: 'Quarterly environmental trivia competition covering biodiversity and circular economy.',
    photosCount: 6,
    status: 'Synced'
  }
];

export const initialOfflineRecords = [
  {
    id: 'off-01',
    type: 'Activity',
    title: 'Tree Plantation Drive',
    school: 'ZP High School',
    status: 'Pending Sync',
    timestamp: 'Today, 10:20 AM',
    itemsCount: '25 participants, 4 photos'
  },
  {
    id: 'off-02',
    type: 'Activity',
    title: 'Clean Campus Activity',
    school: 'Govt. High School',
    status: 'Pending Sync',
    timestamp: 'Today, 09:15 AM',
    itemsCount: '32 participants, 3 photos'
  },
  {
    id: 'off-03',
    type: 'Activity',
    title: 'Awareness Session',
    school: 'MJPUS',
    status: 'Pending Sync',
    timestamp: 'Yesterday, 04:30 PM',
    itemsCount: '18 participants, 5 photos'
  }
];

export const initialSyncLogs = [
  {
    id: 'sync-01',
    entity: 'Participants',
    details: '8 records synced',
    status: 'Success',
    time: '10:20 AM'
  },
  {
    id: 'sync-02',
    entity: 'Photos',
    details: '5 records synced',
    status: 'Success',
    time: '10:10 AM'
  },
  {
    id: 'sync-03',
    entity: 'Activities',
    details: '2 records pending',
    status: 'Pending',
    time: '10:15 AM'
  },
  {
    id: 'sync-04',
    entity: 'School Data',
    details: '1 record failed (timeout)',
    status: 'Failed',
    time: '10:10 AM'
  }
];

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
