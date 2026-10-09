const ROLES = ['All', 'Doctor', 'Nurse', 'Front Desk', 'Lab', 'Admin']

const STAFF = [
  { id: 'pn', name: 'Priya Nair', initials: 'PN', color: '#84cc16', role: 'Front Desk', dept: 'Reception', online: true, date: 'Today', messages: [
    ['me', 'Please share the insurance forms for MR-40291.', '09:18 AM'],
    ['them', 'Got it, sending them now.', '09:23 AM'],
  ] },
  { id: 'na', name: 'Nurse Amina', initials: 'NA', color: '#ec4899', role: 'Nurse', dept: 'General Ward', online: true, date: 'Today', messages: [
    ['me', 'The family in bed 7 is asking when the doctor will visit.', '09:01 AM'],
    ['them', 'Tell them Dr. Wong will round at 11 AM.', '09:05 AM'],
  ] },
  { id: 'ew', name: 'Dr. Emily Wong', initials: 'EW', color: '#4a7fd4', role: 'Doctor', dept: 'Cardiology', online: true, date: 'Jul 10', messages: [
    ['them', 'Can you check on the vitals for bed 4 when you get a chance?', '08:12 AM'],
    ['me', 'On it, will update the chart in 10 mins.', '08:14 AM'],
    ['them', 'Thank you! Let me know if the BP is still elevated.', '08:15 AM'],
  ] },
  { id: 'ak', name: 'Ahmed Khalid', initials: 'AK', color: '#ef4444', role: 'Lab', dept: 'Laboratory', online: false, date: 'Yesterday', messages: [
    ['me', 'Any update on the CBC for MR-40291?', '04:10 PM'],
    ['them', 'Lab results for MR-40291 are ready in the system.', '04:40 PM'],
  ] },
  { id: 'jw', name: 'Dr. James Wilson', initials: 'JW', color: '#10b981', role: 'Doctor', dept: 'Orthopedics', online: false, date: 'Yesterday', messages: [
    ['them', 'Patient is scheduled for a follow-up next week.', '02:05 PM'],
  ] },
  { id: 'sc', name: 'Dr. Sarah Connor', initials: 'SC', color: '#f59e0b', role: 'Doctor', dept: 'Pediatrics', online: true, messages: [] },
  { id: 'ns', name: 'Nurse Sara', initials: 'NS', color: '#8b5cf6', role: 'Nurse', dept: 'Orthopedics', online: true, messages: [] },
  { id: 'lr', name: 'Nurse Lena Roy', initials: 'LR', color: '#06b6d4', role: 'Nurse', dept: 'Pediatrics', online: false, messages: [] },
]

export { ROLES, STAFF };
