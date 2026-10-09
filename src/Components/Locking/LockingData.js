// number rules (type "number") and on/off rules (type "toggle")
const RULES = [
  { key: "timeout", type: "number", title: "Lock Timeout (seconds)", desc: "Duration before an unattended lock is automatically released." },
  { key: "autoRelease", type: "toggle", title: "Auto Release Lock", desc: "Locks are released automatically after the timeout period." },
  { key: "forceTakeover", type: "toggle", title: "Allow Force Takeover (Admin Only)", desc: "Admins can forcefully take over a locked counter or token." },
];

const SETTINGS = { timeout: "30", autoRelease: true, forceTakeover: false };

const WARNING = "Force Takeover should only be enabled for administrators. Enabling it for general users can cause data conflicts in high-traffic scenarios.";

export { RULES, SETTINGS, WARNING };