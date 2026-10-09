const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
// today → "08-Oct-2026"
const todayLabel = () => {
  const t = new Date();
  return `${String(t.getDate()).padStart(2, "0")}-${MONTHS[t.getMonth()]}-${t.getFullYear()}`;
};

const initials = (name) => name.replace(/^Dr\.\s*/i, "D ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const ROLES = ["Admin", "Front Desk", "Doctor"];
const ROLE_KEY = { Admin: "admin", "Front Desk": "desk", Doctor: "doc" };
const FILTERS = ["All", ...ROLES];

const COUNTERS = ["None", "Registration Desk 1", "Registration Desk 2", "Dr. Room A", "Dr. Room B", "Lab Desk 1", "Pharmacy Desk"];

// avatar colours (new users cycle through these)
const AVATAR_COLORS = ["#8e51ff", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#4982cf", "#ec4899"];

const USERS = [
  { id: 1, name: "System Admin", loginId: "admin", password: "Admin@123", role: "Admin", counter: "None", active: false, joined: "01-Jan-2024", color: "#8e51ff" },
  { id: 2, name: "Ayesha Khan", loginId: "ayesha.k", password: "Pass@1234", role: "Front Desk", counter: "Registration Desk 1", active: true, joined: "10-Mar-2024", color: "#10b981" },
  { id: 3, name: "Bilal Chaudhry", loginId: "bilal.c", password: "Pass@1234", role: "Front Desk", counter: "Registration Desk 2", active: true, joined: "15-Mar-2024", color: "#f59e0b" },
  { id: 4, name: "Dr. Emily Wong", loginId: "dr.emily", password: "Pass@1234", role: "Doctor", counter: "Dr. Room A", active: true, joined: "01-Apr-2024", color: "#ef4444" },
  { id: 5, name: "Dr. James Wilson", loginId: "dr.james", password: "Pass@1234", role: "Doctor", counter: "Dr. Room B", active: false, joined: "05-Apr-2024", color: "#06b6d4" },
];

export { todayLabel, initials, ROLES, ROLE_KEY, FILTERS, COUNTERS, AVATAR_COLORS, USERS };