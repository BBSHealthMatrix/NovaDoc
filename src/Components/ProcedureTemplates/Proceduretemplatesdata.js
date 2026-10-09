// Built-in procedure modules (system components)
const SYSTEM_LIBRARY = [
  { key: "vitals", name: "Vital Signs", desc: "Capture patient vitals before/after the procedure", tone: "blue" },
  { key: "medications", name: "Medications", desc: "Record medications given during the procedure", tone: "purple" },
  { key: "consent", name: "Consent", desc: "Document patient consent status and witness name", tone: "teal" },
  { key: "billing", name: "Billing", desc: "Generate procedure billing line items for the front desk", tone: "orange" },
];

const FIELD_TYPES = ["Text", "Number", "Dropdown", "Multi-Select", "Checkbox", "Date", "Textarea", "Toggle"];

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
    id: "t1", name: "General Procedure", on: true,
    comps: [
      sys("vitals"),
      sys("consent"),
      sys("billing"),
      {
        ...newCustom("Procedure Notes"),
        fields: [
          field("Procedure Name", "Text", "e.g. IV Cannulation", true),
          field("Procedure Type", "Dropdown"),
          field("Priority", "Dropdown"),
          field("Reason", "Textarea", "Clinical reason for this procedure..."),
          field("Nurse Notes", "Textarea", "Observations and recovery notes..."),
        ],
      },
    ],
  },
  {
    id: "t2", name: "Wound Care", on: true,
    comps: [
      sys("vitals"),
      sys("consent"),
      {
        ...newCustom("Wound Assessment"),
        fields: [
          field("Wound Location", "Text", "e.g. Left forearm", true),
          field("Wound Type", "Dropdown", "", true),
          field("Wound Size (cm)", "Text", "e.g. 3 × 2 cm"),
          field("Dressing Used", "Dropdown"),
          field("Condition", "Dropdown"),
          field("Next Dressing", "Date"),
        ],
      },
      sys("billing"),
    ],
  },
];

export { SYSTEM_LIBRARY, FIELD_TYPES, SEED, newId, slug, newCustom };