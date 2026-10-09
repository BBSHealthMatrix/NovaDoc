// days: 0 = Sun, 1 = Mon ... 6 = Sat   | start/end = working hours
export const DOCTORS = [
  { id: 'emily', name: 'Dr. Emily Wong', specialty: 'Interventional Cardiology', sub: 'Electrophysiology', days: [1, 3], start: 9, end: 13 },
  { id: 'asif', name: 'Dr. Asif Imam', specialty: 'General Immunology', days: [1, 3, 5], start: 10, end: 16 },
]
export const SPECIALTIES = [...new Set(DOCTORS.map((d) => d.specialty))].sort()
export const TYPES = ['Consultation', 'FollowUp', 'Tele-consultation', 'Procedures']
export const WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

/* ---------- date helpers ---------- */
export const pad2 = (n) => String(n).padStart(2, '0')
export const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7))
export const toTime = (mins) => `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`
export const endOf = (t) => { const [h, m] = t.split(':').map(Number); return toTime(h * 60 + m + 30) }
export const weekday = (d) => d.toLocaleDateString('en-US', { weekday: 'long' })

// every 30-min start time in a doctor's working hours (in minutes)
export const rows = (doc) => {
  const out = []
  for (let m = doc.start * 60; m < doc.end * 60; m += 30) out.push(m)
  return out
}

// time slots for a doctor on a date ([] if the doctor is off that day)
export const slotsFor = (doc, date) => (doc.days.includes(date.getDay()) ? rows(doc).map(toTime) : [])