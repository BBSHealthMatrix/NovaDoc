// trigger events (shown with a description line in the dropdown)
const EVENTS = [
  { value: "Doctor Action", desc: "Doctor performs an action during consultation" },
  { value: "Registration", desc: "Patient is registered at the front desk" },
  { value: "Step Complete", desc: "A queue step is marked as complete" },
  { value: "Payment Complete", desc: "A payment transaction is successful" },
];

const ACTIONS = ["Order Created", "Order Updated", "Consultation Ended"];

const SERVICE_TYPES = ["Any Service Type", "Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"];

const STATUSES = ["Active", "Inactive", "Draft"];

// footer "save as" dropdown → status it applies on Save Rule
const SAVE_AS = [
  { value: "Active", label: "Set Active" },
  { value: "Inactive", label: "Set Inactive" },
  { value: "Draft", label: "Save as Draft" },
];

// condition fields → selectable values
const FIELDS = {
  "Payment Type": ["Cash", "Corporate", "Insurance", "Zakat"],
  "Patient Status": ["New", "Returning"],
  "Token Status": ["Active", "Paused", "Expired", "Recalled"],
  "Visit Type": ["Normal Consultation", "Urgent / Emergency", "Follow-up Visit"],
};

const OPERATORS = ["equals", "is one of", "is not one of"];

const COUNTERS = ["Registration Counter", "Doctor Room", "Lab Counter", "Pharmacy Counter", "Billing Counter"];

const AFTER_STEP = [{ value: "auto", label: "Last destination step (auto)" }, ...COUNTERS];

const RULES = [
  {
    id: 1,
    name: "Doctor Orders Lab → Direct to Lab (Covered Patient)",
    desc: "When a doctor creates a lab order and the patient is covered by Corporate, Insurance, or Zakat — skip billing and route the patient directly to the Lab Counter. After lab completion, recall the patient to the Doctor Room.",
    status: "Active",
    event: "Doctor Action",
    action: "Order Created",
    service: "Lab",
    match: "AND",
    conditions: [
      { id: 1, field: "Payment Type", op: "is one of", values: ["Corporate", "Insurance", "Zakat"] },
      { id: 2, field: "Token Status", op: "equals", values: ["Active"] },
    ],
    steps: [{ id: 1, counter: "Lab Counter", label: "Lab Counter", payment: false, invoice: false, skip: false }],
    recall: true,
    recallAfter: "Lab Counter",
    recallTo: "Doctor Room",
  },
  {
    id: 2,
    name: "Doctor Orders Lab → Billing then Lab (Cash Patient)",
    desc: "When a doctor creates a lab order and the patient pays Cash — route the patient to the Billing Counter first, then to the Lab Counter. After lab completion, recall the patient to the Doctor Room.",
    status: "Active",
    event: "Doctor Action",
    action: "Order Created",
    service: "Lab",
    match: "AND",
    conditions: [
      { id: 1, field: "Payment Type", op: "is one of", values: ["Cash"] },
      { id: 2, field: "Token Status", op: "equals", values: ["Active"] },
    ],
    steps: [
      { id: 1, counter: "Billing Counter", label: "Billing Counter", payment: true, invoice: true, skip: false },
      { id: 2, counter: "Lab Counter", label: "Lab Counter", payment: false, invoice: false, skip: false },
    ],
    recall: true,
    recallAfter: "Lab Counter",
    recallTo: "Doctor Room",
  },
];

const BLANK_CONDITION = { field: "Payment Type", op: "is one of", values: [] };

const BLANK_STEP = { counter: "Lab Counter", label: "Lab Counter", payment: false, invoice: false, skip: false };

const BLANK_RULE = {
  name: "New Routing Rule",
  desc: "",
  status: "Draft",
  event: "Doctor Action",
  action: "Order Created",
  service: "Any Service Type",
  match: "AND",
  conditions: [],
  steps: [],
  recall: false,
  recallAfter: "auto",
  recallTo: "Doctor Room",
};

export {
  EVENTS, ACTIONS, SERVICE_TYPES, STATUSES, SAVE_AS, FIELDS, OPERATORS,
  COUNTERS, AFTER_STEP, RULES, BLANK_CONDITION, BLANK_STEP, BLANK_RULE,
};