// on/off rules (type "toggle") and number rules (type "number")
const RULES = [
  { key: "fifo", type: "toggle", title: "Enable FIFO Lock Mechanism", desc: "When on, only the first patient in line can be called. When off, any patient can be called as long as no one is currently active." },
  { key: "autoMove", type: "toggle", title: "Auto Move to Next Step", desc: "Automatically advance token to the next step upon completion." },
  { key: "manualComplete", type: "toggle", title: "Require Manual Completion", desc: "Staff must explicitly mark each step as complete." },
  { key: "stepSkip", type: "toggle", title: "Allow Step Skip", desc: "Staff can skip optional workflow steps for a token." },
  { key: "recall", type: "toggle", title: "Allow Recall", desc: "Already-called tokens can be recalled to a counter." },
  { key: "maxRecall", type: "number", width: 72, title: "Max Recall Attempts", desc: "Maximum number of times a token can be recalled." },
  { key: "expiry", type: "number", width: 86, title: "Token Expiry (minutes)", desc: "Tokens expire and are marked no-show after this duration." },
];

const SETTINGS = { fifo: true, autoMove: true, manualComplete: false, stepSkip: true, recall: true, maxRecall: "3", expiry: "120" };

// groups shown in the Billing Settings section, in this order
const COUNTER_TYPES = ["Registration Counter", "Nursing Counter", "Doctor Room", "Lab Counter", "Pharmacy Counter"];

const COUNTERS = [
  { id: "ctr-1", name: "Registration Desk 1", type: "Registration Counter", multi: false, billing: true },
  { id: "ctr-2", name: "Registration Desk 2", type: "Registration Counter", multi: false, billing: true },
  { id: "ctr-7", name: "Vitals Desk 1", type: "Nursing Counter", multi: false, billing: false },
  { id: "ctr-3", name: "Dr. Room A", type: "Doctor Room", multi: false, billing: false },
  { id: "ctr-4", name: "Dr. Room B", type: "Doctor Room", multi: false, billing: false },
  { id: "ctr-5", name: "Lab Desk 1", type: "Lab Counter", multi: true, billing: false },
  { id: "ctr-6", name: "Pharmacy Desk", type: "Pharmacy Counter", multi: false, billing: false },
];

export { RULES, SETTINGS, COUNTER_TYPES, COUNTERS };