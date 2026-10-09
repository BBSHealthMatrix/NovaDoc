// browser storage — ProfileMenu reads the same key + event name to update the navbar avatar
export const STORAGE_KEY = "novadoc-profile";
export const PROFILE_UPDATED_EVENT = "novadoc-profile-updated";
export const MAX_PHOTO_MB = 1;


// logged-in user (same name/role the profile menu shows)

export const PROFILE = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@novadoc.health",
  phone: "+92 300 1234567",
  designation: "Finance Manager",
  department: "Finance",
  employeeId: "EMP-1042",
  branch: "Main Branch — Karachi",
  role: "Finance Manager",
  joined: "12 Mar 2024",
  bio: "",
};

export const DEPARTMENTS = ["Finance", "Administration", "Front Desk", "Nursing", "Laboratory", "Pharmacy", "Radiology"];

export const PASSWORD_RULES = [
  { id: "len", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "num", label: "One number", test: (v) => /\d/.test(v) },
  { id: "special", label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const SESSIONS = [
  { id: 1, device: "Chrome on Windows", location: "Karachi, PK", lastActive: "Active now", current: true, type: "desktop" },
  { id: 2, device: "Safari on iPhone", location: "Karachi, PK", lastActive: "2 hours ago", current: false, type: "mobile" },
  { id: 3, device: "Edge on Windows", location: "Lahore, PK", lastActive: "3 days ago", current: false, type: "desktop" },
];

export const NOTIFICATIONS = [
  { id: "appointments", label: "Appointment updates", desc: "New bookings, reschedules and cancellations", email: true, app: true },
  { id: "billing", label: "Billing & payments", desc: "Invoices raised, payments received and refunds", email: true, app: true },
  { id: "reports", label: "Financial reports", desc: "Daily and monthly report summaries", email: true, app: false },
  { id: "messages", label: "Messages", desc: "Direct messages from staff", email: false, app: true },
  { id: "queue", label: "Queue alerts", desc: "Long waits and token overflow warnings", email: false, app: true },
  { id: "system", label: "System announcements", desc: "Maintenance windows and new features", email: true, app: true },
];

export const LANGUAGES = ["English", "Urdu", "Arabic"];
export const TIMEZONES = ["(UTC+05:00) Karachi", "(UTC+04:00) Dubai", "(UTC+03:00) Riyadh", "(UTC+00:00) London"];
export const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
export const TIME_FORMATS = ["12-hour (2:30 PM)", "24-hour (14:30)"];
export const LANDING_PAGES = ["Home", "Queue", "Appointments", "Patients", "Reports"];

export const PREFERENCES = {
  language: "English",
  timezone: "(UTC+05:00) Karachi",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour (2:30 PM)",
  landing: "Reports",
  compact: false,
  sound: true,
};