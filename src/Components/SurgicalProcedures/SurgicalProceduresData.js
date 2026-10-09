const TABS = [
  { key: "procedures", label: "Procedures", search: "Search procedures...", placeholder: "Procedure name" },
  { key: "complications", label: "Complications", search: "Search complications...", placeholder: "Complication name" },
];

const CATEGORIES = [
  "General Surgery", "Orthopaedics", "Cardiothoracic", "Neurosurgery", "Urology", "Gynaecology",
  "ENT", "Ophthalmology", "Vascular", "Plastic Surgery", "Other",
];

let n = 0;
const group = (cat, names) => names.map((name) => ({ id: ++n, name, cat }));

const PROCEDURES = [
  ...group("General Surgery", [
    "Appendectomy", "Cholecystectomy", "Hernia Repair (Inguinal)", "Hernia Repair (Umbilical)", "Bowel Resection",
    "Colostomy", "Mastectomy", "Thyroidectomy", "Haemorrhoidectomy", "Gastric Bypass / Bariatric Surgery",
    "Fistulotomy", "Wound Debridement",
  ]),
  ...group("Orthopaedics", ["Hip Replacement", "Knee Replacement", "Spinal Fusion / Laminectomy"]),
  ...group("Cardiothoracic", ["CABG (Coronary Artery Bypass Graft)", "Angioplasty / Stenting", "Pacemaker Insertion"]),
  ...group("Gynaecology", ["Caesarean Section (C-section)", "Hysterectomy"]),
  ...group("Urology", ["Prostatectomy", "Nephrectomy", "Varicocelectomy", "Circumcision"]),
  ...group("ENT", ["Tonsillectomy", "Tympanoplasty"]),
  ...group("Ophthalmology", ["Cataract Surgery"]),
  ...group("Plastic Surgery", ["Skin Graft"]),
];

const COMPLICATIONS = [
  "None", "Wound Infection", "Bleeding / Haemorrhage", "Anastomotic Leak", "Adhesions / Bowel Obstruction",
  "Post-op Pneumonia", "DVT / Pulmonary Embolism", "Urinary Retention", "Nerve Damage", "Seroma / Haematoma",
  "Incisional Hernia", "Keloid / Hypertrophic Scar", "Re-operation Required", "ICU Admission Required",
  "Prolonged Wound Healing", "Anaesthesia Reaction",
].map((name) => ({ id: ++n, name }));

export { TABS, CATEGORIES, PROCEDURES, COMPLICATIONS };