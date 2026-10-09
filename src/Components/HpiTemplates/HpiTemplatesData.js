const TYPES = ["Free Text", "Multi-select", "Radio", "Number"];

// field types that have options (can drive "Show only when...")
const CHOICE = ["Multi-select", "Radio"];

let n = 0;
const f = (label, type = "Free Text", opts = [], req = false, placeholder = "") => ({
  id: `f${++n}`, label, type, opts, req, placeholder, cond: null,
});

const blankField = () => ({ ...f(""), id: `f${Date.now()}${Math.floor(Math.random() * 1000)}` });

const tpl = (id, name, complaint, fields, active = true) => ({ id, name, complaint, active, fields });

const YES_NO = ["Yes", "No"];

const radiation = f("Radiation", "Radio", ["Without radiation", "With radiation"]);
const coughType = f("Type", "Radio", ["Dry", "Productive"], true);

const SEED = [
  tpl(1, "Chest Pain Assessment", "Chest Pain", [
    f("Onset", "Radio", ["Sudden", "Gradual"], true),
    f("Character", "Multi-select", ["Sharp", "Dull", "Pressure", "Burning"]),
    f("Severity (0–10)", "Number", [], true, "0–10"),
    f("Radiation", "Multi-select", ["Left arm", "Jaw", "Back", "None"]),
    f("Associated symptoms", "Free Text", [], false, "e.g. sweating, nausea"),
  ]),
  tpl(2, "Headache Workup", "Headache", [
    f("Location", "Multi-select", ["Frontal", "Temporal", "Occipital", "Diffuse"], true),
    f("Duration", "Free Text", [], false, "e.g. 2 days"),
    f("Severity (0–10)", "Number", [], true, "0–10"),
    f("Aura", "Radio", YES_NO),
  ]),
  tpl(3, "Abdominal Pain HPI", "Abdominal Pain", [
    f("Quality", "Multi-select", ["Aching", "Burning", "Colicky", "Cramping", "Dull", "Hot", "Pressure-like", "Sharp", "Shooting", "Stabbing", "Tingling", "None"], true),
    f("Pain Score (0–10)", "Number", [], true, "0–10"),
    f("Location", "Multi-select", ["RUQ", "LUQ", "Epigastric", "Periumbilical", "LLQ", "RLQ", "Suprapubic", "Diffusively", "CVA"], true),
    radiation,
    {
      ...f("Radiation to", "Multi-select", ["Right shoulder", "Left shoulder", "Right flank", "Left flank", "Groin", "Back", "Right scapula", "Epigastric region"]),
      cond: { field: radiation.id, values: ["With radiation"] },
    },
    f("Onset", "Free Text", [], true, "e.g. 3 days"),
    f("Course", "Radio", ["Stable", "Unchanged", "Gradually worsening", "Rapidly worsening", "Gradually improving", "Rapidly improving", "Completely resolved", "Controlled"], true),
    f("Aggravating Factors", "Multi-select", ["Eating", "Fatty foods", "Spicy foods", "Alcohol", "Stress", "Movement", "Deep breathing", "Defecation", "Urination", "Hunger", "None"]),
    f("Alleviating Factors", "Multi-select", ["Eating", "Antacids", "Recumbency", "Sitting forward", "Defecation", "Passing flatus", "Vomiting", "Analgesics", "Heat", "None"]),
    f("Associated Symptoms", "Multi-select", ["Nausea", "Vomiting", "Fever", "Diarrhea", "Constipation", "Bloating", "Loss of appetite", "Weight loss", "Jaundice", "Blood in stool", "Heartburn", "Flatulence"]),
    f("Patient Denies", "Multi-select", ["Fever", "Nausea", "Vomiting", "Diarrhea", "Constipation", "Blood in stool", "Weight loss", "Jaundice", "Heartburn", "Flatulence"]),
  ]),
  tpl(4, "Cough Assessment", "Cough", [
    f("Duration", "Free Text", [], true, "e.g. 1 week"),
    coughType,
    { ...f("Sputum color", "Radio", ["Clear", "White", "Yellow", "Green", "Blood-tinged"]), cond: { field: coughType.id, values: ["Productive"] } },
    f("Timing", "Multi-select", ["Morning", "Night", "Constant", "With exertion"]),
    f("Fever", "Radio", YES_NO),
    f("Shortness of breath", "Radio", YES_NO),
    f("Wheezing", "Radio", YES_NO),
    f("Chest pain", "Radio", YES_NO),
    f("Smoking history", "Radio", ["Never", "Former", "Current"]),
    f("Recent travel / sick contacts", "Free Text"),
    f("Notes", "Free Text"),
  ]),
];

export { TYPES, CHOICE, blankField, SEED };