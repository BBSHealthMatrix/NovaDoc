const DEPTS = [
  { id: 1, name: "Cardiology", active: true, subs: [{ id: 11, name: "Outpatient", active: true }, { id: 12, name: "Inpatient", active: false }] },
  { id: 2, name: "Orthopedics", active: true, subs: [{ id: 21, name: "Outpatient", active: true }, { id: 22, name: "Inpatient", active: false }] },
  { id: 3, name: "Neurology", active: true, subs: [{ id: 31, name: "Outpatient", active: true }, { id: 32, name: "Inpatient", active: false }] },
  { id: 4, name: "Immunology", active: true, subs: [{ id: 41, name: "Outpatient", active: true }] },
];

const sp = (id, dept, name, desc, active = true) => ({ id, dept, sub: null, name, desc, active });

const SEED = [
  sp(1, 1, "Interventional Cardiology", "Diagnosis and treatment of heart conditions using catheter-based procedures such as angioplasty and stenting."),
  sp(2, 1, "Electrophysiology", "Management of heart rhythm disorders, arrhythmias, and electrical system abnormalities."),
  sp(3, 1, "Heart Failure & Transplant", "Comprehensive care for advanced heart failure including transplant evaluation and support.", false),
  sp(4, 2, "Joint Replacement", "Hip, knee, and shoulder replacement surgeries for arthritis and injury-related joint damage."),
  sp(5, 2, "Sports Medicine", "Treatment of sports-related injuries including ligament tears, fractures, and muscle conditions."),
  sp(6, 3, "Stroke & Cerebrovascular", "Emergency and long-term management of stroke, TIA, and cerebrovascular disease."),
  sp(7, 3, "Epilepsy", "Diagnosis and management of seizure disorders using EEG, medications, and surgical options.", false),
  sp(8, 4, "General Immunology", "Diagnosis and management of immune system disorders, allergies, and autoimmune conditions."),
  sp(9, 4, "Clinical Allergy", "Evaluation and treatment of allergic diseases including asthma, rhinitis, and anaphylaxis."),
];

const plural = (n, word) => `${n} ${word}${n === 1 ? "y" : "ies"}`.replace("specialtyy", "specialty");

export { DEPTS, SEED, plural };
