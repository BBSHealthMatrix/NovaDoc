// Central library of system components (data comes from the clinical libraries)
const SYSTEM_LIBRARY = [
  { key: "chief-complaint", name: "Chief Complaint", desc: "Primary reason for visit (Chief Complaint Library)" },
  { key: "allergies", name: "Allergies", desc: "Drug and food allergies (Clinical Libraries)" },
  { key: "past-history", name: "Past History", desc: "Previous medical history (Clinical Libraries)" },
  { key: "surgical-history", name: "Surgical History", desc: "Previous surgeries and procedures (Clinical Libraries)" },
  { key: "family-history", name: "Family History", desc: "Hereditary and family conditions (Clinical Libraries)" },
  { key: "social-history", name: "Social History", desc: "Lifestyle, habits and social factors (Clinical Libraries)" },
  { key: "current-medicines", name: "Current Medicines", desc: "Active medication list (Formulary)" },
  { key: "hpi", name: "HPI", desc: "History of present illness (HPI Templates)" },
];

const FIELD_TYPES = ["Text", "Number", "Dropdown", "Multi-Select", "Checkbox", "Date", "Textarea", "Toggle"];

const VISIT_TYPES = [
  { id: "norm", letter: "C", name: "Normal Consultation", sub: "NORM · Multi-Step", color: "#4a7fd4" },
  { id: "emer", letter: "U", name: "Urgent / Emergency", sub: "EMER · Single Queue", color: "#ef4444" },
];

let uid = 0;
const newId = (prefix) => `${prefix}${++uid}_${Date.now()}`;
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const sys = (key) => ({ id: newId("c"), kind: "system", key });
const field = (label, type, placeholder = "", req = false) => ({ id: newId("f"), label, type, placeholder, req, on: true });

const newCustom = (name) => ({
  id: newId("c"), kind: "custom", name,
  repeat: false, limit: "", layout: "vertical", cols: 2,
  fields: [], rules: [],
});

const SEED = [
  {
    id: "t1", name: "General Nursing Assessment", on: true,
    comps: [sys("chief-complaint"), sys("allergies"), sys("past-history"), sys("current-medicines")],
  },
  {
    id: "t2", name: "Emergency Intake", on: false,
    comps: [
      sys("chief-complaint"),
      sys("allergies"),
      {
        ...newCustom("Injury Details"),
        fields: [
          field("Mechanism of Injury", "Dropdown", "", true),
          field("Time of Injury", "Text", "e.g. 2 hours ago"),
          field("Location of Injury", "Textarea", "Describe location..."),
        ],
      },
    ],
  },
];

export { SYSTEM_LIBRARY, FIELD_TYPES, VISIT_TYPES, SEED, newId, slug, newCustom };