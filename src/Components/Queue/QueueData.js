import { Zap, Users, Route } from "lucide-react";

const MODES = {
  single: { title: 'Single Queue', sub: 'Camp / Walk-in mode · Zero input required', icon: Zap, tone: 'green', badge: 'Active' },
  partitioned: { title: 'Partitioned Queue', sub: 'Multi-doctor clinic · Separate queue per doctor', icon: Users, tone: 'blue', badge: '3 Doctors' },
  multistep: { title: 'Multi-Step Visit', sub: 'Clinic OPD · Token follows patient through every step', icon: Route, tone: 'purple', badge: 'OPD Active' },
}

const DOCTORS = [
  { id: 'EW', name: 'Dr. Emily Wong', short: 'Emily Wong', spec: 'Cardiologist', room: 'Room A', color: '#3b82f6', counter: 'C042', waiting: [['C043', '3m'], ['C044', '2m']], done: ['C040', 'C041'], next: 45 },
  { id: 'JW', name: 'Dr. James Wilson', short: 'James Wilson', spec: 'Orthopedic Surgeon', room: 'Room B', color: '#10b981', counter: 'C017', waiting: [['C018', '4m']], done: ['C016'], next: 19 },
  { id: 'SC', name: 'Dr. Sarah Connor', short: 'Sarah Connor', spec: 'Pediatrician', room: 'Room C', color: '#f59e0b', counter: 'C028', waiting: [['C029', '5m'], ['C030', '3m']], done: ['C027'], next: 31 },
]

const VISITS = [
  { name: 'Normal Consultation (OPD)', prefix: 'C', start: 101, color: '#3b82f6', steps: ['Registration', 'Vitals', 'Doctor', 'Lab', 'Pharmacy'] },
  { name: 'Urgent / Emergency', prefix: 'U', start: 0, color: '#ef4444', steps: ['Triage', 'Emergency'], first: 'Triage & Registration' },
  { name: 'Follow-up Visit', prefix: 'F', start: 0, color: '#10b981', steps: ['Registration', 'Doctor'] },
]

const PATIENTS = [
  { name: 'Layla Ahmadi', mrn: 'MR-45812', phone: '+92 300 512-4471' },
  { name: 'Michael Chang', mrn: 'MR-39102', phone: '+92 311 882-1023' },
  { name: 'Carlos Rivera', mrn: 'MR-41103', phone: '+92 333 207-6618' },
  { name: 'Aisha Patel', mrn: 'MR-38201', phone: '+92 321 441-2903' },
]

const pad = (n) => String(n).padStart(3, '0')

const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const stepName = (v, i) => (i === 0 && v.first) || v.steps[i]

const since = (at) => {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000))
  return s < 60 ? `${s}s` : `${Math.round(s / 60)}m`
}

const stamp = () => {
  const d = new Date()
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} · ${time}`
}

export { MODES, PATIENTS, initials, pad, stamp, DOCTORS, VISITS, stepName, since };
