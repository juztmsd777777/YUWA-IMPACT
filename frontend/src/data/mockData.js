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
