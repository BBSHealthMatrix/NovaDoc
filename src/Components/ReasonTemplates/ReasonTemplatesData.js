// Reason templates seed
let uid = 0;
const newId = (prefix) => `${prefix}${++uid}_${Date.now()}`;

const REASON_TEMPLATES = [
  "Rule out infection",
  "Trauma evaluation",
  "Chronic pain assessment",
  "Rule out malignancy",
  "Post-operative follow-up",
  "Rule out fracture",
  "Monitoring disease progression",
  "Pre-operative assessment",
  "Rule out pulmonary embolism",
  "Evaluate soft tissue injury",
  "Rule out intracranial pathology",
  "Assess joint pathology",
  "Rule out renal calculi",
  "Cardiac evaluation",
  "Routine follow-up",
].map((text) => ({ id: newId("r"), text }));

export { REASON_TEMPLATES, newId };