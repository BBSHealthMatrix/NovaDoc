// Visit types shown as columns
const VISIT_COLS = [
  { key: "opd", label: "OPD" },
  { key: "consult", label: "Consult" },
  { key: "followup", label: "Follow-up" },
  { key: "emergency", label: "Emergency" },
];

// Clicking a status cycles through these in order
const STATUSES = ["Required", "Optional", "Skip"];

const COLOURS = [
  "#4a7fd4", "#ef4444", "#f59e0b", "#10b981",
  "#8b5cf6", "#64748b", "#0ea5e9", "#f43f5e",
  "#06b6d4", "#84cc16",
];

let uid = 0;
const newId = () => `v${++uid}_${Date.now()}`;

const vital = (name, unit, opd, consult, followup, emergency, min, max, colour) => ({
  id: newId(), name, unit, custom: false,
  status: { opd, consult, followup, emergency },
  min, max, colour,
});

const R = "Required";
const O = "Optional";
const S = "Skip";

const SEED = [
  vital("Blood Pressure", "mmHg", R, R, R, R, "90/60", "140/90", "#4a7fd4"),
  vital("Pulse", "bpm", R, R, R, R, "60", "100", "#ef4444"),
  vital("Temperature", "°F", R, O, O, R, "97.0", "99.0", "#f43f5e"),
  vital("SpO₂", "%", R, O, O, R, "95", "100", "#10b981"),
  vital("Weight", "kg", O, O, O, O, "", "", "#8b5cf6"),
  vital("Height", "cm", O, O, S, S, "", "", "#64748b"),
  vital("BMI", "kg/m²", O, O, O, S, "18.5", "24.9", "#0ea5e9"),
  vital("Pain Score", "/10", O, O, O, R, "0", "3", "#f43f5e"),
];

const newCustomVital = () => ({
  id: newId(), name: "New Vital", unit: "", custom: true,
  status: { opd: O, consult: O, followup: O, emergency: O },
  min: "", max: "", colour: "#06b6d4",
});

export { VISIT_COLS, STATUSES, COLOURS, SEED, newCustomVital };