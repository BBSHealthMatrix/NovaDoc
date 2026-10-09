const CATEGORIES = [
  "Cardiovascular", "Endocrine", "Respiratory", "Renal", "Neurological",
  "Musculoskeletal", "Gastroenterology", "Haematology", "Other",
];

const c = (id, name, code, cat) => ({ id, name, code, cat });

const SEED = [
  c(1, "Type 2 Diabetes Mellitus", "E11", "Endocrine"),
  c(2, "Essential Hypertension", "I10", "Cardiovascular"),
  c(3, "Ischaemic Heart Disease", "I25", "Cardiovascular"),
  c(4, "Chronic Kidney Disease", "N18", "Renal"),
  c(5, "Bronchial Asthma", "J45", "Respiratory"),
  c(6, "COPD", "J44", "Respiratory"),
  c(7, "Hypothyroidism", "E03", "Endocrine"),
  c(8, "Rheumatoid Arthritis", "M06", "Musculoskeletal"),
];

export { CATEGORIES, SEED };