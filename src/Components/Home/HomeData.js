import { Calendar, Ticket, Stethoscope, Activity, ClipboardList, UserCheck, Globe, ShieldCheck, Home as HomeIcon, Video, CircleAlert, Dna, Brain, Headphones, MapPin, MonitorPlay, BarChart3, Users, FileImage, CircleCheck, GraduationCap } from "lucide-react";

const MODULES = [
  ['Appointments', 'Schedule & manage patient appointments', Calendar, 'purple', '/appointments/frontdesk'],
  ['Patient Queue', 'Token management & live queue', Ticket, 'blue', '/queue/token/single' ],
  ['Primary Healthcare', 'OPD multi-step visit workflow', Stethoscope, 'green', '/queue/token/multistep'],
  ['NCD Clinic', null, Activity],
  ['Specialist Care Modules', 'Manage specialty consultation forms', ClipboardList, 'purple', '/admin/specialty-forms'],
  ['Care Manager', 'Patient care plans & nursing care management', UserCheck, 'cyan', '/appointments/nursing?section=care-plan'],
  ['Social Determinants', 'Patient registration & demographics', Globe, 'blue', '/admin/demographics'],

  ['Preventive Health Protocol', null, ShieldCheck],
  ['Home Healthcare', null, HomeIcon],
  ['Tele-Clinic', null, Video],
  ['Urgent Care & Emergency Clinic', 'Emergency triage', CircleAlert, 'red', '/appointments/nursing'],
  ['Genetic Disease Diabetes', null, Dna],
  ['Mental Health', 'Mental health assessments & vital monitoring', Brain, 'pink', '/appointments/nursing'],
  ['Support Staff', null, Headphones],

  ['Rural Healthcare', null, MapPin],
  ['Physician Assistant', null, MonitorPlay],
  ['Data Analytics', 'Financial records & transactions', BarChart3, 'blue', '/reports/financial'],
  ['Population Healthcare', null, Users],
  ['Research Documents', 'Health education materials & patient handouts', FileImage, 'purple', '/admin/health-ed-library'],
  ['Quality Assurance', null, CircleCheck],
  ['Learning Management System', null, GraduationCap],
]

const today = () => {
  const d = new Date()
  const day = d.toLocaleDateString('en-GB', { weekday: 'long' })
  const month = d.toLocaleDateString('en-GB', { month: 'long' })
  return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}`
}

export { MODULES, today };
