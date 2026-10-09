const OUTCOMES = [
  { v: "continue", label: "Continue to next step", short: "Continue" },
  { v: "ambulance", label: "Call Ambulance", short: "Call Ambulance" },
  { v: "tele", label: "Teleconsultation", short: "Teleconsultation" },
  { v: "nearby", label: "Nearby Doctor Visit", short: "Nearby Doctor Visit" },
  { v: "advice", label: "Custom Advice", short: "Custom Advice" },
];

const outcome = (v) => OUTCOMES.find((o) => o.v === v) || OUTCOMES[0];

const STEP_TYPES = {
  patient: { label: "Patient Details", title: "Patient Basic Details", desc: "Name, age, gender, phone, address", single: true },
  complaint: { label: "Complaint", title: "Presenting Complaint", desc: "Shows the presenting complaint", single: true },
  qgroup: { label: "Question Group", title: "Question Group", desc: "Yes/No questions with routing" },
  flag: { label: "Flag Checklist", title: "Flag Checklist", desc: "Risk / red / yellow flag items" },
  severity: { label: "Severity Scale", title: "Severity Scale", desc: "Numeric scale with grade bands" },
  character: { label: "Character Check", title: "Character Check", desc: "Descriptive yes/no checklist" },
  outcome: { label: "Outcome", title: "Outcome", desc: "Terminal routing outcome" },
};

const TYPE_ORDER = ["patient", "complaint", "qgroup", "flag", "severity", "character", "outcome"];

const PATIENT_FIELDS = ["Patient Name", "Age", "Gender", "Phone No.", "Address"];

let uid = 0;

const newId = (p) => p + ++uid + "_" + Date.now();

const defaultBands = () => [
  { id: newId("b"), name: "Mild", color: "#22c55e", from: 1, to: 3 },
  { id: newId("b"), name: "Moderate", color: "#f59e0b", from: 4, to: 7 },
  { id: newId("b"), name: "Severe", color: "#ef4444", from: 8, to: 10 },
];

const makeStep = (type, extra = {}) => ({
  id: newId("s"),
  type,
  title: STEP_TYPES[type].title,
  items: [],
  yes: "continue",
  no: "continue",
  max: 10,
  bands: type === "severity" ? defaultBands() : [],
  outcome: "continue",
  ...extra,
});

const SEED = [
  {
    id: "a1",
    name: "First Responder Backpain Triage",
    complaint: "Back Pain",
    on: true,
    steps: [
      makeStep("patient"),
      makeStep("complaint"),
      makeStep("qgroup", {
        title: "Emergency Screening Questions",
        items: ["Loss of bladder or bowel control?", "Numbness in the groin or saddle area?", "Sudden weakness in both legs?"],
        yes: "ambulance",
      }),
      makeStep("qgroup", {
        title: "Back Pain Assessment Questions",
        items: ["Did the pain start after an injury or fall?", "Does the pain spread down the leg?", "Is the pain worse at night?"],
      }),
      makeStep("flag", {
        title: "Co-morbid Diseases & High Risk Flags",
        items: ["Diabetes", "Hypertension", "History of cancer", "On blood thinners"],
        yes: "tele",
      }),
      makeStep("severity", { title: "Severity of Pain (1 Least – 10 Highest)" }),
      makeStep("character", { title: "Character of Pain", items: ["Sharp", "Dull / aching", "Burning", "Shooting"] }),
      makeStep("flag", {
        title: "Red Flags",
        items: ["Fever with back pain", "Unexplained weight loss", "Pain not relieved by rest"],
        yes: "tele",
      }),
      makeStep("flag", {
        title: "Yellow Flags",
        items: ["Feeling low or anxious", "Fear that movement will cause harm", "Off work due to pain"],
        yes: "nearby",
        no: "advice",
      }),
    ],
  },
];

export { STEP_TYPES, TYPE_ORDER, newId, makeStep, SEED, outcome, PATIENT_FIELDS, OUTCOMES };
