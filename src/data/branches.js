export const ZONES = [
  "Asia/Karachi", "Asia/Dubai", "Asia/Kolkata", "Asia/Dhaka", "Asia/Riyadh",
  "Europe/London", "America/New_York", "America/Chicago",
];

export const MODES = {
  queue: { label: "Queue-Based Only", desc: "Branch operates exclusively via token queue walk-ins.", cls: "br-m-purple" },
  appt: { label: "Appointment-Based Only", desc: "Branch operates exclusively via scheduled appointments.", cls: "br-m-blue" },
  both: { label: "Queue & Appointment-Based", desc: "Branch supports both walk-in token queues and scheduled appointments.", cls: "br-m-green" },
};

export const SEED = [
  { id: 1, name: "Main Branch — Lahore", code: "LHR-MAIN", mode: "both", tz: "Asia/Karachi", start: "08:00", end: "22:00", reset: "00:00", active: true, created: "01-Jan-2024" },
  { id: 2, name: "North Branch — Islamabad", code: "ISB-NORTH", mode: "queue", tz: "Asia/Karachi", start: "09:00", end: "20:00", reset: "00:00", active: true, created: "15-Jun-2024" },
  { id: 3, name: "East Branch — Karachi", code: "KHI-EAST", mode: "appt", tz: "Asia/Karachi", start: "07:30", end: "21:00", reset: "00:00", active: false, created: "01-Sept-2024" },
];

export const BLANK = { name: "", code: "", tz: "Asia/Karachi", start: "08:00", end: "22:00", reset: "00:00", active: true, mode: "queue" };
