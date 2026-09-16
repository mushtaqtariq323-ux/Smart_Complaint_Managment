import { 
  Institution, 
  Department, 
  Staff, 
  User, 
  Complaint, 
  InstitutionRegistrationRequest, 
  Notification,
  CategoryItem
} from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'National University of Sciences & Technology (NUST)',
    type: 'university',
    city: 'Islamabad',
    province: 'Federal Capital',
    code: 'NUST-ISB',
    studentsCount: 18450,
    staffCount: 1240,
    status: 'active',
    contactEmail: 'admin@nust.edu.pk',
    phone: '+92 51 9085 1000',
    address: 'Sector H-12, Islamabad, 44000',
    joinedDate: '2024-01-15',
    logo: '🎓'
  },
  {
    id: 'inst-2',
    name: 'Lahore University of Management Sciences (LUMS)',
    type: 'university',
    city: 'Lahore',
    province: 'Punjab',
    code: 'LUMS-LHR',
    studentsCount: 5200,
    staffCount: 680,
    status: 'active',
    contactEmail: 'registrar@lums.edu.pk',
    phone: '+92 42 3560 8000',
    address: 'DHA Phase 5, Cantt, Lahore, 54792',
    joinedDate: '2024-02-10',
    logo: '🏛️'
  },
  {
    id: 'inst-3',
    name: 'FAST National University of Computer & Emerging Sciences',
    type: 'university',
    city: 'Lahore',
    province: 'Punjab',
    code: 'FAST-LHR',
    studentsCount: 8900,
    staffCount: 420,
    status: 'active',
    contactEmail: 'info.lhr@nu.edu.pk',
    phone: '+92 42 111 128 128',
    address: 'Faisal Town, Block B, Lahore',
    joinedDate: '2024-03-01',
    logo: '💻'
  },
  {
    id: 'inst-4',
    name: 'NED University of Engineering & Technology',
    type: 'university',
    city: 'Karachi',
    province: 'Sindh',
    code: 'NED-KHI',
    studentsCount: 12300,
    staffCount: 810,
    status: 'active',
    contactEmail: 'dean@neduet.edu.pk',
    phone: '+92 21 9926 1261',
    address: 'University Road, Karachi, 75270',
    joinedDate: '2024-04-18',
    logo: '⚙️'
  },
  {
    id: 'inst-5',
    name: 'Government College University (GCU)',
    type: 'college',
    city: 'Lahore',
    province: 'Punjab',
    code: 'GCU-LHR',
    studentsCount: 11400,
    staffCount: 590,
    status: 'active',
    contactEmail: 'admissions@gcu.edu.pk',
    phone: '+92 42 111 000 010',
    address: 'Katchery Road, Lahore',
    joinedDate: '2024-05-12',
    logo: '🏫'
  },
  {
    id: 'inst-6',
    name: 'Army Public School & College (APS)',
    type: 'school',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    code: 'APS-PSH',
    studentsCount: 2400,
    staffCount: 180,
    status: 'active',
    contactEmail: 'info@aps-peshawar.edu.pk',
    phone: '+92 91 527 6534',
    address: 'Warsak Road, Peshawar',
    joinedDate: '2024-06-20',
    logo: '📚'
  }
];

export const INITIAL_REQUESTS: InstitutionRegistrationRequest[] = [
  {
    id: 'req-1',
    institutionName: 'Quaid-i-Azam University (QAU)',
    type: 'university',
    city: 'Islamabad',
    province: 'Federal Capital',
    adminName: 'Dr. Shahbaz Alam',
    adminEmail: 'provost@qau.edu.pk',
    adminPhone: '+92 51 9064 0000',
    status: 'pending',
    submittedAt: '2026-09-12T10:30:00Z',
    website: 'https://qau.edu.pk',
    notes: 'Requesting onboarding for 9 academic faculties, 4 hostel wings and campus maintenance division.'
  },
  {
    id: 'req-2',
    institutionName: 'Karachi Grammar School (KGS)',
    type: 'school',
    city: 'Karachi',
    province: 'Sindh',
    adminName: 'Mrs. Sabeen Farooqi',
    adminEmail: 'principal.middle@kgs.edu.pk',
    adminPhone: '+92 21 3583 4521',
    status: 'pending',
    submittedAt: '2026-09-14T08:15:00Z',
    website: 'https://kgs.edu.pk',
    notes: 'Deploying for junior and senior campus transport, labs, and student wellness complaints.'
  },
  {
    id: 'req-3',
    institutionName: 'Balochistan University of Information Technology (BUITEMS)',
    type: 'university',
    city: 'Quetta',
    province: 'Balochistan',
    adminName: 'Engr. Jameel Mengal',
    adminEmail: 'registrar@buitms.edu.pk',
    adminPhone: '+92 81 288 0410',
    status: 'pending',
    submittedAt: '2026-09-15T04:20:00Z',
    website: 'https://buitms.edu.pk',
    notes: 'Seeking central portal to streamline student internet connectivity, solar power, and classroom tech issues.'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Electrical & Power Engineering',
    institutionId: 'inst-1',
    headName: 'Engr. Tariq Mehmood',
    email: 'electrical.works@nust.edu.pk',
    phone: '+92 51 9085 2201',
    staffCount: 14,
    activeComplaintsCount: 3,
    primaryCategory: 'Electricity'
  },
  {
    id: 'dept-2',
    name: 'Information Technology & Networks',
    institutionId: 'inst-1',
    headName: 'Muhammad Salman Siddiqui',
    email: 'helpdesk.it@nust.edu.pk',
    phone: '+92 51 9085 2202',
    staffCount: 18,
    activeComplaintsCount: 5,
    primaryCategory: 'Internet'
  },
  {
    id: 'dept-3',
    name: 'Water, Plumbing & Sanitation',
    institutionId: 'inst-1',
    headName: 'Subedar (R) Aslam Khan',
    email: 'maintenance.water@nust.edu.pk',
    phone: '+92 51 9085 2203',
    staffCount: 12,
    activeComplaintsCount: 2,
    primaryCategory: 'Water'
  },
  {
    id: 'dept-4',
    name: 'Academic Facilities & Classrooms',
    institutionId: 'inst-1',
    headName: 'Prof. Naila Rehman',
    email: 'facilities.academic@nust.edu.pk',
    phone: '+92 51 9085 2204',
    staffCount: 9,
    activeComplaintsCount: 2,
    primaryCategory: 'Classroom'
  },
  {
    id: 'dept-5',
    name: 'Transport & Campus Logistics',
    institutionId: 'inst-1',
    headName: 'Malik Zafar Iqbal',
    email: 'transport.office@nust.edu.pk',
    phone: '+92 51 9085 2205',
    staffCount: 22,
    activeComplaintsCount: 1,
    primaryCategory: 'Transport'
  },
  {
    id: 'dept-6',
    name: 'Campus Security & Access Control',
    institutionId: 'inst-1',
    headName: 'Major (R) Kamran Yousaf',
    email: 'security.hq@nust.edu.pk',
    phone: '+92 51 9085 2206',
    staffCount: 35,
    activeComplaintsCount: 1,
    primaryCategory: 'Security'
  },
  {
    id: 'dept-7',
    name: 'Laboratories & Technical Equipment',
    institutionId: 'inst-1',
    headName: 'Dr. Shahzad Rasheed',
    email: 'labs.supervision@nust.edu.pk',
    phone: '+92 51 9085 2207',
    staffCount: 15,
    activeComplaintsCount: 2,
    primaryCategory: 'Laboratory'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'staff-1',
    name: 'Engr. Bilal Tariq',
    email: 'bilal.tariq@nust.edu.pk',
    phone: '+92 300 5544332',
    institutionId: 'inst-1',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    roleTitle: 'Senior Network Infrastructure Engineer',
    activeAssignedCount: 3,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'staff-2',
    name: 'Rashid Mehmood',
    email: 'rashid.elec@nust.edu.pk',
    phone: '+92 333 9876543',
    institutionId: 'inst-1',
    departmentId: 'dept-1',
    departmentName: 'Electrical & Power Engineering',
    roleTitle: 'Sub-Divisional Officer (Electrical)',
    activeAssignedCount: 2
  },
  {
    id: 'staff-3',
    name: 'Hafiz Waqas',
    email: 'waqas.civil@nust.edu.pk',
    phone: '+92 321 4455667',
    institutionId: 'inst-1',
    departmentId: 'dept-3',
    departmentName: 'Water, Plumbing & Sanitation',
    roleTitle: 'Sanitation Supervisor',
    activeAssignedCount: 1
  },
  {
    id: 'staff-4',
    name: 'Samina Kausar',
    email: 'samina.admin@nust.edu.pk',
    phone: '+92 345 8899001',
    institutionId: 'inst-1',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    roleTitle: 'Block Incharge - SEECS Building',
    activeAssignedCount: 2
  },
  {
    id: 'staff-5',
    name: 'Akram Bhatti',
    email: 'akram.transport@nust.edu.pk',
    phone: '+92 302 1122334',
    institutionId: 'inst-1',
    departmentId: 'dept-5',
    departmentName: 'Transport & Campus Logistics',
    roleTitle: 'Route Operations Officer',
    activeAssignedCount: 1
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-0820',
    title: 'Faulty Split AC Unit in Faculty Office 204 (SEECS)',
    description: 'The 1.5 ton inverter AC in Faculty Office 204 trips the breaker after 15 minutes of operation and is blowing warm ambient air. Makes conducting student consultations during afternoon hours difficult.',
    category: 'Electricity',
    priority: 'High',
    status: 'Pending',
    location: 'SEECS Academic Block B, 2nd Floor, Faculty Office 204',
    studentId: 'user-staff-1',
    userId: 'user-staff-1',
    studentName: 'Engr. Bilal Tariq',
    studentRollNumber: 'EMP-SEECS-089',
    studentEmail: 'bilal.tariq@nust.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-1',
    departmentName: 'Electrical & Power Engineering',
    assignedDepartment: 'Electrical & Power Engineering',
    attachmentName: 'ac_breaker_trip_error.jpg',
    attachmentSize: '740 KB',
    createdAt: '2026-09-15T08:30:00Z',
    updatedAt: '2026-09-15T08:30:00Z',
    activityLogs: [
      {
        id: 'log-staff-1',
        timestamp: '2026-09-15T08:30:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'Complaint Submitted',
        note: 'Submitted by Faculty Member. High priority requested due to office temperature.'
      }
    ]
  },
  {
    id: 'CMP-2026-0818',
    title: 'Intermittent VoIP Phone Line and Switch Port in Telecom Research Lab',
    description: 'The IP phone handset and Wall Port #12 in Telecom Research Lab are failing DHCP negotiation, causing dropped internal communications and conference calls with collaborative researchers.',
    category: 'Internet',
    priority: 'Urgent',
    status: 'In Progress',
    location: 'SEECS Annex, 1st Floor, Telecom Lab 102',
    studentId: 'user-staff-1',
    userId: 'user-staff-1',
    studentName: 'Engr. Bilal Tariq',
    studentRollNumber: 'EMP-SEECS-089',
    studentEmail: 'bilal.tariq@nust.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    assignedDepartment: 'Information Technology & Networks',
    assignedStaff: 'Engr. Bilal Tariq',
    assignedStaffName: 'Engr. Bilal Tariq',
    assignedStaffId: 'staff-1',
    attachmentName: 'voip_sip_trace.txt',
    attachmentSize: '210 KB',
    createdAt: '2026-09-14T10:15:00Z',
    updatedAt: '2026-09-14T15:20:00Z',
    activityLogs: [
      {
        id: 'log-staff-2',
        timestamp: '2026-09-14T10:15:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'Complaint Submitted',
        note: 'Urgent ticket logged for Telecom Research Lab IP infrastructure.'
      },
      {
        id: 'log-staff-3',
        timestamp: '2026-09-14T12:00:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Under Review & Routed',
        note: 'Administrative assessment complete. Dispatched to Network Operations.'
      },
      {
        id: 'log-staff-4',
        timestamp: '2026-09-14T15:20:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'In Progress',
        note: 'VLAN trunking and Cisco switch port transceiver inspection underway.'
      }
    ]
  },
  {
    id: 'CMP-2026-0812',
    title: 'Broken Handle and Lock on Faculty Meeting Room Door',
    description: 'The mortise door lock on Faculty Meeting Room 114 became stuck with the latch disengaged, leaving sensitive examination paper records unsecured.',
    category: 'Furniture',
    priority: 'Medium',
    status: 'Resolved',
    location: 'SEECS Ground Floor, Faculty Meeting Room 114',
    studentId: 'user-staff-1',
    userId: 'user-staff-1',
    studentName: 'Engr. Bilal Tariq',
    studentRollNumber: 'EMP-SEECS-089',
    studentEmail: 'bilal.tariq@nust.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    assignedDepartment: 'Academic Facilities & Classrooms',
    assignedStaff: 'Samina Kausar',
    assignedStaffName: 'Samina Kausar',
    assignedStaffId: 'staff-4',
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-09-13T17:00:00Z',
    resolutionNotes: 'Commercial heavy-duty mortise lock assembly installed and tested. Duplicate keys handed over to department coordinator.',
    activityLogs: [
      {
        id: 'log-staff-5',
        timestamp: '2026-09-12T14:00:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'Complaint Submitted'
      },
      {
        id: 'log-staff-6',
        timestamp: '2026-09-13T10:00:00Z',
        authorName: 'Samina Kausar',
        authorRole: 'department_staff',
        action: 'In Progress',
        note: 'Carpentry and hardware technician assigned.'
      },
      {
        id: 'log-staff-7',
        timestamp: '2026-09-13T17:00:00Z',
        authorName: 'Samina Kausar',
        authorRole: 'department_staff',
        action: 'Resolved',
        note: 'Heavy-duty lock fitted and tested operational.'
      }
    ]
  },
  {
    id: 'CMP-2026-0808',
    title: 'Request for Personal Ergonomic Executive Chair Upgrade in Annex',
    description: 'Requesting procurement of high-back ergonomic mesh chair for prolonged grading and research sessions in the annex cubicle.',
    category: 'Furniture',
    priority: 'Low',
    status: 'Rejected',
    location: 'SEECS Annex, 2nd Floor, Cubicle 22',
    studentId: 'user-staff-1',
    userId: 'user-staff-1',
    studentName: 'Engr. Bilal Tariq',
    studentRollNumber: 'EMP-SEECS-089',
    studentEmail: 'bilal.tariq@nust.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    assignedDepartment: 'Academic Facilities & Classrooms',
    adminResponse: 'Declined per University Furniture Allocation Policy FY26-27. Faculty chair replacements must be submitted via the Annual Departmental Requisition Committee, not as operational repair tickets.',
    createdAt: '2026-09-11T09:00:00Z',
    updatedAt: '2026-09-11T16:00:00Z',
    activityLogs: [
      {
        id: 'log-staff-8',
        timestamp: '2026-09-11T09:00:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'Complaint Submitted'
      },
      {
        id: 'log-staff-9',
        timestamp: '2026-09-11T16:00:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Rejected',
        note: 'Declined per University Furniture Allocation Policy FY26-27. Please route via Departmental Budget Committee.'
      }
    ]
  },
  {
    id: 'CMP-2026-0814',
    title: 'High-speed Eduroam Wi-Fi dropping frequently in CS Lab 3',
    description: 'During online lab evaluations and programming assignments, the Eduroam access points in SEECS Lab 3 disconnect every 10-15 minutes. Over 45 students were affected today during the Distributed Systems lab.',
    category: 'Internet',
    priority: 'High',
    status: 'In Progress',
    location: 'SEECS Building, Ground Floor, Computer Lab 3',
    studentId: 'user-student-1',
    studentName: 'Ayesha Khan',
    studentRollNumber: '2023-CS-184',
    studentEmail: 'ayesha.khan@seecs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Engr. Bilal Tariq',
    attachmentName: 'wifi_ping_drop_log.png',
    attachmentSize: '480 KB',
    createdAt: '2026-09-14T09:15:00Z',
    updatedAt: '2026-09-15T08:30:00Z',
    activityLogs: [
      {
        id: 'log-1',
        timestamp: '2026-09-14T09:15:00Z',
        authorName: 'Ayesha Khan',
        authorRole: 'student',
        action: 'Complaint Submitted',
        note: 'Submitted via SCMS Mobile Web Portal with ping log screenshot.'
      },
      {
        id: 'log-2',
        timestamp: '2026-09-14T11:00:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Routed to IT & Networks Department',
        note: 'Verified impact on ongoing academic lab sessions. High priority marked.'
      },
      {
        id: 'log-3',
        timestamp: '2026-09-14T14:20:00Z',
        authorName: 'Engr. Bilal Tariq',
        authorRole: 'department_staff',
        action: 'Assigned & In Progress',
        note: 'Inspected Cisco AP-3802. Found 2 damaged patch cables in the switch rack; new Cat6 cabling in progress.'
      }
    ]
  },
  {
    id: 'CMP-2026-0815',
    title: 'Water cooler dispenser leaking and non-chilling in Jinnah Hostel Wing B',
    description: 'The main drinking water unit on the 2nd floor corridor of Liaquat Hostel Wing B has developed a continuous leakage. Water is pooling around the staircase, creating a severe slip hazard, and the cooling unit is tripping the circuit breaker.',
    category: 'Water',
    priority: 'Urgent',
    status: 'In Progress',
    location: 'Liaquat Boys Hostel, 2nd Floor, Wing B staircase',
    studentId: 'user-student-2',
    studentName: 'Hamza Ali',
    studentRollNumber: '2022-EE-092',
    studentEmail: 'hamza.ali@smme.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-3',
    departmentName: 'Water, Plumbing & Sanitation',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Hafiz Waqas',
    attachmentName: 'water_leak_corridor.jpg',
    attachmentSize: '1.2 MB',
    createdAt: '2026-09-15T07:10:00Z',
    updatedAt: '2026-09-15T08:45:00Z',
    activityLogs: [
      {
        id: 'log-4',
        timestamp: '2026-09-15T07:10:00Z',
        authorName: 'Hamza Ali',
        authorRole: 'student',
        action: 'Complaint Submitted',
        note: 'Urgent priority flagged due to electrical safety hazard.'
      },
      {
        id: 'log-5',
        timestamp: '2026-09-15T08:00:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Assigned to Sanitation & Plumbing',
        note: 'Dispatched emergency maintenance team to turn off main valve.'
      }
    ]
  },
  {
    id: 'CMP-2026-0810',
    title: 'Ceiling projector lamp burnt out in Seminar Hall 1',
    description: 'During the guest lecture series, the EPSON overhead projector shut down with a red warning lamp indicator. The bulb requires replacement before tomorrow’s final year project presentations.',
    category: 'Classroom',
    priority: 'Medium',
    status: 'Resolved',
    location: 'NUST Business School (NBS), 1st Floor, Seminar Hall 1',
    studentId: 'user-student-1',
    studentName: 'Ayesha Khan',
    studentRollNumber: '2023-CS-184',
    studentEmail: 'ayesha.khan@seecs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    assignedStaffId: 'staff-4',
    assignedStaffName: 'Samina Kausar',
    createdAt: '2026-09-12T11:40:00Z',
    updatedAt: '2026-09-13T16:20:00Z',
    resolutionNotes: 'Brand new OEM lamp bulb replaced by audio-visual technician. Tested HDMI output at 1080p, operational.',
    activityLogs: [
      {
        id: 'log-6',
        timestamp: '2026-09-12T11:40:00Z',
        authorName: 'Ayesha Khan',
        authorRole: 'student',
        action: 'Complaint Submitted'
      },
      {
        id: 'log-7',
        timestamp: '2026-09-12T14:10:00Z',
        authorName: 'Samina Kausar',
        authorRole: 'department_staff',
        action: 'In Progress',
        note: 'Requisitioned bulb from central procurement store.'
      },
      {
        id: 'log-8',
        timestamp: '2026-09-13T16:20:00Z',
        authorName: 'Samina Kausar',
        authorRole: 'department_staff',
        action: 'Marked as Resolved',
        note: 'Hardware replaced and tested successfully.'
      }
    ]
  },
  {
    id: 'CMP-2026-0805',
    title: 'Evening Rawalpindi Shuttle Route 4 delayed over 40 minutes',
    description: 'The Saddar / Chandni Chowk student bus (Bus # 14) did not arrive at Central Library Stop until 5:45 PM. Students missed their evening connecting transit without prior notification.',
    category: 'Transport',
    priority: 'Medium',
    status: 'Closed',
    location: 'Central Library Bus Stop, NUST H-12 Campus',
    studentId: 'user-student-3',
    studentName: 'Zainab Fatima',
    studentRollNumber: '2024-BBA-045',
    studentEmail: 'zainab.fatima@nbs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-5',
    departmentName: 'Transport & Campus Logistics',
    assignedStaffId: 'staff-5',
    assignedStaffName: 'Akram Bhatti',
    createdAt: '2026-09-10T13:00:00Z',
    updatedAt: '2026-09-11T17:00:00Z',
    resolutionNotes: 'Driver replacement due to sudden medical emergency. Backup fleet protocol activated and SMS alert broadcast system adjusted.',
    activityLogs: [
      {
        id: 'log-9',
        timestamp: '2026-09-10T13:00:00Z',
        authorName: 'Zainab Fatima',
        authorRole: 'student',
        action: 'Complaint Submitted'
      },
      {
        id: 'log-10',
        timestamp: '2026-09-11T17:00:00Z',
        authorName: 'Akram Bhatti',
        authorRole: 'department_staff',
        action: 'Resolved & Closed',
        note: 'Fleet supervisor resolved inquiry.'
      }
    ]
  },
  {
    id: 'CMP-2026-0818',
    title: 'Main substation UPS backup failure during load shedding in SCME Labs',
    description: 'The specialized spectroscopy and electron microscope units in Chemical Engineering lost power when WAPDA grid failed, because the automatic transfer switch (ATS) did not crank the diesel generator.',
    category: 'Electricity',
    priority: 'Urgent',
    status: 'Pending',
    location: 'School of Chemical & Materials Engineering, Ground Floor',
    studentId: 'user-student-2',
    studentName: 'Hamza Ali',
    studentRollNumber: '2022-EE-092',
    studentEmail: 'hamza.ali@smme.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-1',
    departmentName: 'Electrical & Power Engineering',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-15T09:00:00Z',
    activityLogs: [
      {
        id: 'log-11',
        timestamp: '2026-09-15T09:00:00Z',
        authorName: 'Hamza Ali',
        authorRole: 'student',
        action: 'Complaint Submitted',
        note: 'Awaiting institution admin review and assignment.'
      }
    ]
  },
  {
    id: 'CMP-2026-0819',
    title: 'Damaged ergonomic chairs in Postgraduate Research Room 204',
    description: 'Three hydraulic swivel chairs have broken height-adjustment levers and torn armrests. Students working long thesis hours are facing posture issues.',
    category: 'Furniture',
    priority: 'Low',
    status: 'Submitted',
    location: 'C3A Postgraduate Block, 2nd Floor, Room 204',
    studentId: 'user-student-1',
    userId: 'user-student-1',
    studentName: 'Ayesha Khan',
    studentRollNumber: '2023-CS-184',
    studentEmail: 'ayesha.khan@seecs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    assignedDepartment: 'Academic Facilities & Classrooms',
    createdAt: '2026-09-15T09:30:00Z',
    updatedAt: '2026-09-15T09:30:00Z',
    activityLogs: [
      {
        id: 'log-12',
        timestamp: '2026-09-15T09:30:00Z',
        authorName: 'Ayesha Khan',
        authorRole: 'student',
        action: 'Complaint Submitted'
      }
    ]
  },
  {
    id: 'CMP-2026-0821',
    title: 'Water filtration plant TDS sensor failure and alkaline taste',
    description: 'The drinking water cooler beside Central Cafeteria is dispensing water with a sharp chalky alkaline taste. TDS reading on the external digital gauge is flashing 680 PPM (well above safe WHO standards of <300 PPM).',
    category: 'Water',
    priority: 'High',
    status: 'Under Review',
    location: 'Central Student Cafeteria, Outer North Pavilion',
    studentId: 'user-student-1',
    userId: 'user-student-1',
    studentName: 'Ayesha Khan',
    studentRollNumber: '2023-CS-184',
    studentEmail: 'ayesha.khan@seecs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-3',
    departmentName: 'Water, Plumbing & Sanitation',
    assignedDepartment: 'Water, Plumbing & Sanitation',
    attachmentName: 'tds_meter_reading.jpg',
    attachmentSize: '840 KB',
    createdAt: '2026-09-15T08:15:00Z',
    updatedAt: '2026-09-15T08:30:00Z',
    activityLogs: [
      {
        id: 'log-13',
        timestamp: '2026-09-15T08:15:00Z',
        authorName: 'Ayesha Khan',
        authorRole: 'student',
        action: 'Complaint Submitted',
        note: 'High priority flagged due to drinking water health concern.'
      },
      {
        id: 'log-14',
        timestamp: '2026-09-15T08:30:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Pending Assignment',
        note: 'Reviewing water quality complaint. Routing to water filtration team.'
      }
    ]
  },
  {
    id: 'CMP-2026-0803',
    title: 'Campus Perimeter Gate 2 biometric card reader reboot loop',
    description: 'During morning peak hours, RFID turnstile 3 at Gate 2 frequently freezes on "Reading Card..." causing a 15-minute queue for walking day scholars.',
    category: 'Security',
    priority: 'Medium',
    status: 'Closed',
    location: 'Main Campus Entrance Gate 2, Turnstile 3',
    studentId: 'user-student-1',
    userId: 'user-student-1',
    studentName: 'Ayesha Khan',
    studentRollNumber: '2023-CS-184',
    studentEmail: 'ayesha.khan@seecs.edu.pk',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-6',
    departmentName: 'Campus Security & Access Control',
    assignedDepartment: 'Campus Security & Access Control',
    assignedStaff: 'Major (R) Kamran Yousaf',
    assignedStaffName: 'Major (R) Kamran Yousaf',
    assignedStaffId: 'staff-6',
    adminResponse: 'Firmware updated to v4.12 and optical sensor recalibrated. All 4 turnstiles tested at 60 scans/min throughput.',
    resolutionNotes: 'Firmware updated to v4.12 and optical sensor recalibrated. All 4 turnstiles tested at 60 scans/min throughput.',
    createdAt: '2026-09-08T07:45:00Z',
    updatedAt: '2026-09-09T15:00:00Z',
    activityLogs: [
      {
        id: 'log-15',
        timestamp: '2026-09-08T07:45:00Z',
        authorName: 'Ayesha Khan',
        authorRole: 'student',
        action: 'Complaint Submitted'
      },
      {
        id: 'log-16',
        timestamp: '2026-09-08T10:00:00Z',
        authorName: 'Major (R) Kamran Yousaf',
        authorRole: 'department_staff',
        action: 'In Progress',
        note: 'Diagnostics started on network controller.'
      },
      {
        id: 'log-17',
        timestamp: '2026-09-09T14:30:00Z',
        authorName: 'Major (R) Kamran Yousaf',
        authorRole: 'department_staff',
        action: 'Resolved',
        note: 'Firmware flashed and turnstile verified.'
      },
      {
        id: 'log-18',
        timestamp: '2026-09-09T15:00:00Z',
        authorName: 'Prof. Dr. Farooq Ahmed',
        authorRole: 'institution_admin',
        action: 'Closed',
        note: 'Administrative sign-off completed.'
      }
    ]
  }
];

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: 'user-student-1',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@seecs.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    rollNumber: '2023-CS-184',
    phone: '+92 301 2345678',
    status: 'active'
  },
  institution_admin: {
    id: 'user-admin-1',
    name: 'Prof. Dr. Farooq Ahmed',
    email: 'registrar@nust.edu.pk',
    role: 'institution_admin',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    phone: '+92 51 9085 1020',
    status: 'active'
  },
  department_staff: {
    id: 'user-staff-1',
    name: 'Engr. Bilal Tariq',
    email: 'bilal.tariq@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    phone: '+92 300 5544332',
    status: 'active'
  },
  super_admin: {
    id: 'user-super-1',
    name: 'Dr. Tariq Mushtaq',
    email: 'director.scms@hec.gov.pk',
    role: 'super_admin',
    phone: '+92 51 9040 0000',
    status: 'active'
  }
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Electricity', description: 'Power grid, wiring, air conditioning, generators, and lighting fixtures', enabled: true, departmentName: 'Electrical & Power Engineering' },
  { id: 'cat-2', name: 'Water', description: 'Plumbing, drinking water filtration plants, washrooms, and water coolers', enabled: true, departmentName: 'Water, Plumbing & Sanitation' },
  { id: 'cat-3', name: 'Internet', description: 'Campus Wi-Fi APs, lab LAN drops, bandwidth, and proxy portal issues', enabled: true, departmentName: 'Information Technology & Networks' },
  { id: 'cat-4', name: 'Classroom', description: 'Audio-visual projectors, smart podiums, marker boards, and lecture hall mics', enabled: true, departmentName: 'Academic Facilities & Classrooms' },
  { id: 'cat-5', name: 'Laboratory', description: 'Lab instruments, chemicals safety, test rigs, and experimental apparatus', enabled: true, departmentName: 'Laboratories & Technical Equipment' },
  { id: 'cat-6', name: 'Cleaning', description: 'Janitorial sanitation, waste disposal, dust control, and grounds upkeep', enabled: true, departmentName: 'Water, Plumbing & Sanitation' },
  { id: 'cat-7', name: 'Transport', description: 'Student & faculty shuttle routes, bus timings, permits, and driver grievances', enabled: true, departmentName: 'Transport & Campus Logistics' },
  { id: 'cat-8', name: 'Security', description: 'RFID turnstiles, biometric gates, CCTV monitoring, and visitor tracking', enabled: true, departmentName: 'Campus Security & Access Control' },
  { id: 'cat-9', name: 'Furniture', description: 'Ergonomic chairs, exam desks, office tables, and library carrels', enabled: true, departmentName: 'Academic Facilities & Classrooms' },
  { id: 'cat-10', name: 'Academic', description: 'Course schedule clashes, portal grading errors, and syllabus queries', enabled: true, departmentName: 'Academic Facilities & Classrooms' },
  { id: 'cat-11', name: 'Examination', description: 'Exam hall seating plans, date sheets, invigilation grievances', enabled: true, departmentName: 'Academic Facilities & Classrooms' },
  { id: 'cat-12', name: 'Hostel', description: 'Dorm room allotments, mess food quality, and laundry machines', enabled: true, departmentName: 'Campus Logistics' },
  { id: 'cat-13', name: 'Library', description: 'Book reservation desk, digital catalog kiosks, and quiet study rooms', enabled: true, departmentName: 'Information Technology & Networks' },
  { id: 'cat-14', name: 'Other', description: 'Miscellaneous university inquiries and general campus administration matters', enabled: true, departmentName: 'Registrar & Campus Governance' }
];

export const INITIAL_USERS: User[] = [
  // Students
  {
    id: 'user-student-1',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@seecs.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    rollNumber: '2023-CS-184',
    phone: '+92 301 2345678',
    status: 'active',
    joinedDate: '2023-09-01'
  },
  {
    id: 'user-student-2',
    name: 'Hamza Ali',
    email: 'hamza.ali@smme.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-1',
    departmentName: 'Electrical & Power Engineering',
    rollNumber: '2022-EE-092',
    phone: '+92 321 9876543',
    status: 'active',
    joinedDate: '2022-09-15'
  },
  {
    id: 'user-student-3',
    name: 'Zainab Fatima',
    email: 'zainab.fatima@nbs.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    rollNumber: '2024-BBA-045',
    phone: '+92 333 5566778',
    status: 'active',
    joinedDate: '2024-02-01'
  },
  {
    id: 'user-student-4',
    name: 'Bilal Hassan',
    email: 'bilal.hassan@smme.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-1',
    departmentName: 'Mechanical Engineering',
    rollNumber: '2021-ME-110',
    phone: '+92 345 1122334',
    status: 'inactive',
    joinedDate: '2021-09-10'
  },
  {
    id: 'user-student-5',
    name: 'Maryam Tariq',
    email: 'maryam.tariq@seecs.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Software Engineering',
    rollNumber: '2023-SE-054',
    phone: '+92 300 4455667',
    status: 'active',
    joinedDate: '2023-09-01'
  },
  {
    id: 'user-student-6',
    name: 'Saad Ur Rehman',
    email: 'saad.rehman@nice.edu.pk',
    role: 'student',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-3',
    departmentName: 'Civil Engineering',
    rollNumber: '2022-CE-033',
    phone: '+92 312 8899001',
    status: 'active',
    joinedDate: '2022-09-20'
  },
  // Faculty & Staff
  {
    id: 'user-staff-1',
    name: 'Engr. Bilal Tariq',
    email: 'bilal.tariq@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-2',
    departmentName: 'Information Technology & Networks',
    employeeId: 'EMP-SEECS-089',
    rollNumber: 'EMP-SEECS-089',
    phone: '+92 300 5544332',
    status: 'active',
    office: 'SEECS Block B, Office 204',
    joinedDate: '2020-03-15'
  },
  {
    id: 'user-staff-2',
    name: 'Rashid Mehmood',
    email: 'rashid.elec@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-1',
    departmentName: 'Electrical & Power Engineering',
    employeeId: 'EMP-ELEC-042',
    rollNumber: 'EMP-ELEC-042',
    phone: '+92 333 9876543',
    status: 'active',
    office: 'Power Substation 1',
    joinedDate: '2019-07-10'
  },
  {
    id: 'user-staff-3',
    name: 'Hafiz Waqas',
    email: 'waqas.civil@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-3',
    departmentName: 'Water, Plumbing & Sanitation',
    employeeId: 'EMP-CIVIL-015',
    rollNumber: 'EMP-CIVIL-015',
    phone: '+92 321 4455667',
    status: 'active',
    office: 'Sanitation Wing H-12',
    joinedDate: '2021-01-05'
  },
  {
    id: 'user-staff-4',
    name: 'Samina Kausar',
    email: 'samina.admin@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-4',
    departmentName: 'Academic Facilities & Classrooms',
    employeeId: 'EMP-ACAD-077',
    rollNumber: 'EMP-ACAD-077',
    phone: '+92 345 8899001',
    status: 'active',
    office: 'Academic Block Admin 101',
    joinedDate: '2018-11-20'
  },
  {
    id: 'user-staff-5',
    name: 'Akram Bhatti',
    email: 'akram.transport@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-5',
    departmentName: 'Transport & Campus Logistics',
    employeeId: 'EMP-TRANS-012',
    rollNumber: 'EMP-TRANS-012',
    phone: '+92 302 1122334',
    status: 'active',
    office: 'Transport Fleet Terminal Gate 1',
    joinedDate: '2017-04-12'
  },
  {
    id: 'user-staff-6',
    name: 'Major (R) Kamran Yousaf',
    email: 'security.hq@nust.edu.pk',
    role: 'department_staff',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    departmentId: 'dept-6',
    departmentName: 'Campus Security & Access Control',
    employeeId: 'EMP-SEC-003',
    rollNumber: 'EMP-SEC-003',
    phone: '+92 51 9085 2206',
    status: 'active',
    office: 'Central Security HQ Gate 2',
    joinedDate: '2016-08-01'
  },
  // Institution Admin
  {
    id: 'user-admin-1',
    name: 'Prof. Dr. Farooq Ahmed',
    email: 'registrar@nust.edu.pk',
    role: 'institution_admin',
    institutionId: 'inst-1',
    institutionName: 'National University of Sciences & Technology (NUST)',
    employeeId: 'EMP-ADM-001',
    departmentName: 'Registrar & Campus Governance',
    phone: '+92 51 9085 1020',
    status: 'active',
    office: 'Main Secretariat, Room 302',
    joinedDate: '2015-01-10'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Wi-Fi Complaint In Progress',
    message: 'Engr. Bilal Tariq has been assigned to CMP-2026-0814 and is replacing the rack cabling.',
    type: 'assigned',
    read: false,
    timestamp: '2026-09-14T14:25:00Z',
    complaintId: 'CMP-2026-0814'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Projector Lamp Complaint Resolved',
    message: 'CMP-2026-0810 (Seminar Hall 1 Projector) was resolved and tested successfully.',
    type: 'status_change',
    read: true,
    timestamp: '2026-09-13T16:25:00Z',
    complaintId: 'CMP-2026-0810'
  },
  {
    id: 'notif-3',
    userId: 'user-admin-1',
    title: 'New Urgent Complaint Submitted',
    message: 'Urgent complaint regarding Water Dispenser electrical leakage logged in Liaquat Hostel.',
    type: 'urgent',
    read: false,
    timestamp: '2026-09-15T07:15:00Z',
    complaintId: 'CMP-2026-0815'
  },
  {
    id: 'notif-4',
    userId: 'user-staff-1',
    title: 'Complaint Submitted Successfully',
    message: 'Your complaint CMP-2026-0820 (Faculty Office AC) has been registered in the Electrical review queue.',
    type: 'status_change',
    read: false,
    timestamp: '2026-09-15T08:30:00Z',
    complaintId: 'CMP-2026-0820'
  },
  {
    id: 'notif-5',
    userId: 'user-staff-1',
    title: 'Complaint Moved to In Progress',
    message: 'CMP-2026-0818 (Telecom Lab VoIP Switch Port) has been taken up by Network Operations.',
    type: 'status_change',
    read: false,
    timestamp: '2026-09-14T15:20:00Z',
    complaintId: 'CMP-2026-0818'
  },
  {
    id: 'notif-6',
    userId: 'user-staff-1',
    title: 'Complaint Resolved: CMP-2026-0812',
    message: 'CMP-2026-0812 (Faculty Meeting Room Door) was resolved and spare keys issued.',
    type: 'status_change',
    read: true,
    timestamp: '2026-09-13T17:00:00Z',
    complaintId: 'CMP-2026-0812'
  },
  {
    id: 'notif-7',
    userId: 'user-staff-1',
    title: 'Administrative Decision on CMP-2026-0808',
    message: 'Administration reviewed and recorded remarks on your chair upgrade request.',
    type: 'announcement',
    read: true,
    timestamp: '2026-09-11T16:00:00Z',
    complaintId: 'CMP-2026-0808'
  }
];

export const PAKISTAN_CITIES = [
  'Islamabad',
  'Lahore',
  'Karachi',
  'Rawalpindi',
  'Peshawar',
  'Quetta',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Hyderabad',
  'Sialkot',
  'Bahawalpur',
  'Abbottabad',
  'Sukkur',
  'Muzaffarabad',
  'Gilgit'
];

export const PAKISTAN_PROVINCES = [
  'Federal Capital (Islamabad)',
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Jammu & Kashmir (AJK)',
  'Gilgit-Baltistan'
];
