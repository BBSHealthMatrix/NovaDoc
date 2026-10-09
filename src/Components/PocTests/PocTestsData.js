const RESULT_TYPES = ["Positive/Negative", "Numeric"];

const TESTS = [
  { id: 1, name: "Blood Glucose", type: "Numeric", unit: "mg/dL", min: "70", max: "100", active: true },
  { id: 2, name: "Urine Protein", type: "Positive/Negative", unit: "", min: "", max: "", active: true },
  { id: 3, name: "Urine Glucose", type: "Positive/Negative", unit: "", min: "", max: "", active: true },
  { id: 4, name: "Malaria (RDT)", type: "Positive/Negative", unit: "", min: "", max: "", active: true },
  { id: 5, name: "Haemoglobin", type: "Numeric", unit: "g/dL", min: "12", max: "17", active: true },
  { id: 6, name: "INR", type: "Numeric", unit: "", min: "0.8", max: "1.2", active: false },
];

// new-test form defaults
const BLANK = { name: "", type: RESULT_TYPES[0], unit: "", min: "", max: "" };

export { RESULT_TYPES, TESTS, BLANK };