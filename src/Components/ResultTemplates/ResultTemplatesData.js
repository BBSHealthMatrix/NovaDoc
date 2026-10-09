const TEMPLATES = [
  {
    id: 1, name: "Complete Blood Count (CBC)", status: "Published", updated: "2025-01-10",
    desc: "Standard haematology panel covering RBCs, WBCs, platelets and differential.",
    sections: [
      {
        id: 1, name: "CBC Parameters",
        params: [
          { id: 1, name: "Haemoglobin", unit: "g/dL", range: "13.0 – 17.0" },
          { id: 2, name: "WBC", unit: "×10³/µL", range: "4.5 – 11.0" },
          { id: 3, name: "Platelets", unit: "×10³/µL", range: "150 – 400" },
          { id: 4, name: "Neutrophils", unit: "%", range: "40 – 70" },
          { id: 5, name: "Lymphocytes", unit: "%", range: "20 – 40" },
          { id: 6, name: "MCV", unit: "fL", range: "80 – 100" },
        ],
      },
    ],
  },
  {
    id: 2, name: "Liver Function Tests (LFTs)", status: "Draft", updated: "2025-02-14",
    desc: "Comprehensive liver panel including transaminases, bilirubin and proteins.",
    sections: [
      {
        id: 1, name: "LFT Parameters",
        params: [
          { id: 1, name: "ALT", unit: "U/L", range: "7 – 56" },
          { id: 2, name: "AST", unit: "U/L", range: "10 – 40" },
          { id: 3, name: "ALP", unit: "U/L", range: "44 – 147" },
          { id: 4, name: "Total Bilirubin", unit: "mg/dL", range: "0.1 – 1.2" },
        ],
      },
      {
        id: 2, name: "Protein Panel",
        params: [
          { id: 5, name: "Total Protein", unit: "g/dL", range: "6.0 – 8.3" },
          { id: 6, name: "Albumin", unit: "g/dL", range: "3.5 – 5.0" },
          { id: 7, name: "GGT", unit: "U/L", range: "9 – 48" },
          { id: 8, name: "Direct Bilirubin", unit: "mg/dL", range: "0 – 0.3" },
        ],
      },
    ],
  },
];

const BLANK_TEMPLATE = { name: "", desc: "", status: "Draft", sections: [] };
const BLANK_PARAM = { name: "", unit: "", range: "" };

export { TEMPLATES, BLANK_TEMPLATE, BLANK_PARAM };