const PATIENTS = [
  ['MR-40291', 'Sarah Jenkins', '+92 300 234-9182', 'Female', 'General', 'Active', '#ef4444'],
  ['MR-39102', 'Michael Chang', '+92 311 882-1023', 'Male', 'Corporate', 'Active', '#ec4899'],
  ['MR-38201', 'Aisha Patel', '+92 321 441-2903', 'Female', 'General', 'Inactive', '#10b981'],
  ['MR-41103', 'Carlos Rivera', '+92 333 763-0018', 'Male', 'Insurance', 'Active', '#ef4444'],
  ['MR-42210', 'Emma Thompson', '+92 345 301-4782', 'Female', 'VIP', 'Active', '#ec4899'],
  ['MR-43001', 'Raj Sharma', '+92 300 529-7201', 'Male', 'General', 'Inactive', '#f59e0b'],
  ['MR-44120', 'Fatima Al-Hassan', '+92 312 917-3340', 'Female', 'Corporate', 'Active', '#06b6d4'],
  ['MR-45000', 'David Okonkwo', '+92 321 643-8827', 'Male', 'General', 'Active', '#8b5cf6'],
  ['MR-45812', 'Layla Ahmadi', '+92 302 118-4477', 'Female', 'Insurance', 'Active', '#8b5cf6'],
  ['MR-46230', 'Omar Siddiqui', '+92 315 774-2019', 'Male', 'VIP', 'Active', '#3b82f6'],
  ['MR-46904', 'Hina Qureshi', '+92 331 208-6655', 'Female', 'General', 'Inactive', '#14b8a6'],
  ['MR-47315', 'James Walker', '+92 347 590-1182', 'Male', 'Corporate', 'Active', '#f97316'],
]

const SELECTS = [
  ['Consultation', ['General', 'Follow-up', 'Specialist']],
  ['Appointment Type', ['Walk-in', 'Scheduled', 'Online']],
  ['Patient Type', ['General', 'Corporate', 'Insurance', 'VIP']],
  ['Visit', ['First Visit', 'Revisit']],
  ['Patient Status', ['Active', 'Inactive']],
]

const HEADERS = ['Sr No.', 'MR No.', 'Patient Name', 'Phone Number', 'Gender', 'Patient Type', 'Status', 'Actions']

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2)

export { PATIENTS, SELECTS, HEADERS, initials };
