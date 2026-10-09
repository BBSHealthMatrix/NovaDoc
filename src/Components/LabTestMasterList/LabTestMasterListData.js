const SAMPLE_TYPES = ["Blood (Venous)", "Serum / Plasma", "Urine (Spot)", "Urine (24-hr)", "Sputum", "N/A"];

const SECTIONS = [
  {
    id: "haem", name: "Haematology",
    tests: [
      { id: 1, name: "Complete Blood Count (CBC)", sample: "Blood (Venous)", desc: "WBC, RBC, Haemoglobin, Platelets", fasting: false },
      { id: 2, name: "ESR", sample: "Blood (Venous)", desc: "Erythrocyte Sedimentation Rate", fasting: false },
      { id: 3, name: "Peripheral Blood Film", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 4, name: "Reticulocyte Count", sample: "Blood (Venous)", desc: "", fasting: false },
      { id: 5, name: "Coagulation Profile (PT/APTT)", sample: "Blood (Venous)", desc: "", fasting: false },
    ],
  },
  {
    id: "chem", name: "Blood Chemistry",
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
    id: "micro", name: "Microbiology",
    tests: [
      { id: 12, name: "Culture & Sensitivity (Urine)", sample: "Urine (Spot)", desc: "", fasting: false },
      { id: 13, name: "Culture & Sensitivity (Sputum)", sample: "Sputum", desc: "", fasting: false },
      { id: 14, name: "Mantoux / TB Screen", sample: "N/A", desc: "", fasting: false },
    ],
  },
  {
    id: "urine", name: "Urinalysis",
    tests: [
      { id: 15, name: "Urine R/E", sample: "Urine (Spot)", desc: "Routine examination", fasting: false },
      { id: 16, name: "Urine C/S", sample: "Urine (Spot)", desc: "Culture & Sensitivity", fasting: false },
      { id: 17, name: "24-hr Urine Protein", sample: "Urine (24-hr)", desc: "", fasting: false },
    ],
  },
  {
    id: "horm", name: "Hormones",
    tests: [
      { id: 18, name: "TSH", sample: "Serum / Plasma", desc: "Thyroid Stimulating Hormone", fasting: false },
      { id: 19, name: "T3 / T4", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 20, name: "FSH / LH", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 21, name: "Testosterone", sample: "Serum / Plasma", desc: "", fasting: false },
      { id: 22, name: "Cortisol (morning)", sample: "Serum / Plasma", desc: "", fasting: false },
    ],
  },
];

export { SAMPLE_TYPES, SECTIONS };