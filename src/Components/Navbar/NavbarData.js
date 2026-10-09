import { LayoutGrid, Ticket, CalendarDays, Users, FileText, MessageSquare, BarChart3, Zap, UsersRound, Route, UserRound, Heart, Stethoscope, FlaskConical, Calendar, Eye } from "lucide-react";

const NAV = [
  { label: 'Home', icon: LayoutGrid, path: '/', menu: [
    { title: 'Home', items: [
      ['Platform', 'Healthcare management modules', LayoutGrid, 'blue', '/'],
      ['Our Scope', 'Our continuum of care', Eye, 'purple', '/our-scope'],
      ['Our Vision', 'Principles guiding our platform', Heart, 'green', '/our-vision'],
    ]},
  ]},
  { label: 'Queue', icon: Ticket, path: '/queue', menu: [
    { title: 'Token Generation', items: [
      ['Single Queue', 'Camp / Walk-in mode', Zap, 'green', '/queue/token/single'],
      ['Partitioned Queue', 'Multi-doctor clinic', UsersRound, 'blue', '/queue/token/partitioned'],
      ['Multi-Step Visit', 'Clinic OPD', Route, 'purple', '/queue/token/multistep'],
    ]},
    { title: 'Queue Users', items: [
      ['Front Desk User', 'Registration · Billing counter', UserRound, 'blue', '/queue/frontdesk'],
      ['Nursing', 'Vitals · Patient assessment', Heart, 'red', '/queue/nursing'],
      ['Doctor', 'Consultation · Step 3', Stethoscope, 'blue', '/queue/doctor'],
      ['Lab', 'Sample collection · Step 4', FlaskConical, 'gray', '/queue/lab'],
    ]},
  ]},
  { label: 'Appointments', icon: CalendarDays, path: '/appointments', menu: [
    { title: 'Scheduling', items: [
      ['Front Desk', 'Book & manage appointments', Calendar, 'purple', '/appointments/frontdesk'],
      ['Nursing', 'View & track appointments', Heart, 'red', '/appointments/nursing'],
    ]},
    { title: 'Doctors', items: [
      ['Dr. Emily Wong', 'Cardiology · Orthopedics', Stethoscope, 'teal', '/appointments/doctor/doc-1'],
      ['Dr. Asif Imam', 'Immunology · Outpatient', Stethoscope, 'teal', '/appointments/doctor/doc-asif'],
    ]},
  ]},
  { label: 'Patients', icon: Users, path: '/patients' },
  { label: 'Health Records', icon: FileText, path: '/health-records' },
  { label: 'Messaging', icon: MessageSquare, path: '/messaging' },
  { label: 'Reports', icon: BarChart3, path: '/reports', menu: [
    { title: 'Reports', items: [
      ['Financial Transactions', 'Billing & payments', BarChart3, 'green', '/reports/financial'],
    ]},
  ]},
]

export { NAV };
