// same shape as the Lab Test Master List catalogue (sample, fasting, desc)
const SECTIONS = [
  {
    name: "Haematology",
    tests: [
      { id: 1, name: "Complete Blood Count (CBC)", sample: "Blood (Venous)", desc: "WBC, RBC, Haemoglobin, Platelets", fasting: false },
      { id: 2, name: "ESR", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 3, name: "Peripheral Blood Film", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 4, name: "Reticulocyte Count", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 5, name: "Coagulation Profile (PT/APTT)", sample: "Blood (Venous)", desc: "", fasting: false },
    ],
  },
  {
    name: "Blood Chemistry",
    tests: [
      { id: 6, name: "Fasting Blood Sugar", sample: "Blood (Venous)", desc: "", fasting: true },
      { id: 7, name: "HbA1c", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 8, name: "Lipid Profile", sample: "Serum / Plasma", desc: "Cholesterol, Triglycerides, HDL, LDL", fasting: true },
      { id: 9, name: "Liver Function Tests", sample: "Serum / Plasma", desc: "ALT, AST, ALP, Bilirubin", fasting: false },
      { id: 10, name: "Kidney Function Tests", sample: "Serum / Plasma", desc: "Urea, Creatinine, eGFR", fasting: false },
      { id: 11, name: "Uric Acid", sample: "Serum / Plasma", desc: "", fasting: false },
    ],
  },
  {
    name: "Microbiology",
    tests: [
      { id: 12, name: "Culture & Sensitivity (Urine)", sample: "Urine (Spot)", desc: "", fasting: false },
      { id: 13, name: "Culture & Sensitivity (Sputum)", sample: "Sputum", desc: "", fasting: false },
      { id: 14, name: "Mantoux / TB Screen", sample: "N/A", desc: "", fasting: false },
    ],
  },
  {
    name: "Urinalysis",
    tests: [
      { id: 15, name: "Urine R/E", sample: "Urine (Spot)", desc: "Routine examination", fasting: false },
      { id: 16, name: "Urine C/S", sample: "Urine (Spot)", desc: "Culture & Sensitivity", fasting: false },
      { id: 17, name: "24-hr Urine Protein", sample: "Urine (24-hr)", desc: "", fasting: false },
    ],
  },
  {
    name: "Hormones",
    tests: [
      { id: 18, name: "TSH", sample: "Serum / Plasma", desc: "Thyroid Stimulating Hormone", fasting: false },
      { id: 19, name: "T3 / T4", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 20, name: "FSH / LH", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 21, name: "Testosterone", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 22, name: "Cortisol (morning)", sample: "Serum / Plasma", desc: "", fasting: false },
    ],
  },
];

const ALL_TESTS = SECTIONS.flatMap((s) => s.tests);

const CATEGORIES = [
  "Routine Workup", "Cardiac Panel", "Pre-operative", "Emergency / Acute", "Diabetes Screen",
  "Thyroid Panel", "Liver Screen", "Renal Screen", "Infection / Sepsis", "Oncology Panel", "Paediatric", "Custom",
];

const CATEGORY_COLOR = {
  "Routine Workup": "ls-c-blue",
  "Pre-operative": "ls-c-purple",
  "Cardiac Panel": "ls-c-red",
  "Diabetes Screen": "ls-c-amber",
};

const ORDER_SETS = [
  {
    id: 1, name: "General Wellness Panel", category: "Routine Workup", active: false, created: "2024-01-10",
    desc: "Standard annual workup for healthy adults. Covers blood count, metabolic panel, and hormone screen.",
    items: [1, 6, 8, 9, 10, 18],
  },
  {
    id: 2, name: "Pre-Operative Workup", category: "Pre-operative", active: true, created: "2024-03-05",
    desc: "Standard pre-op assessment for elective surgery. Blood work and coagulation screen.",
    items: [1, 5, 9, 10],
  },
  {
    id: 3, name: "Cardiac Lab Panel", category: "Cardiac Panel", active: true, created: "2024-02-14",
    desc: "Lab component of the cardiac evaluation. Lipid profile and full blood count.",
    items: [1, 8],
  },
  {
    id: 4, name: "Diabetes Follow-up", category: "Diabetes Screen", active: true, created: "2024-04-01",
    desc: "Quarterly diabetes monitoring panel. HbA1c, renal function, urine protein, and lipids.",
    items: [7, 6, 10, 17, 8],
  },
];

const BLANK_ORDER_SET = { name: "", category: CATEGORIES[0], desc: "", items: [] };

export { SECTIONS, ALL_TESTS, CATEGORIES, CATEGORY_COLOR, ORDER_SETS, BLANK_ORDER_SET };