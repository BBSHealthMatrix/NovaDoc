const COUNTER_TYPES = ["Registration Counter", "Nursing Counter", "Doctor Room", "Lab Counter", "Pharmacy Counter"];

const LHR = "Main Branch — Lahore";
const ISB = "North Branch — Islamabad";

const COUNTERS = [
  { id: 1, name: "Registration Desk 1", type: "Registration Counter", branch: LHR, multi: false, active: false },
  { id: 2, name: "Registration Desk 2", type: "Registration Counter", branch: LHR, multi: false, active: true },
  { id: 3, name: "Dr. Room A", type: "Doctor Room", branch: LHR, multi: false, active: true },
  { id: 4, name: "Dr. Room B", type: "Doctor Room", branch: LHR, multi: false, active: true },
  { id: 5, name: "Lab Desk 1", type: "Lab Counter", branch: LHR, multi: true, active: true },
  { id: 6, name: "Pharmacy Desk", type: "Pharmacy Counter", branch: ISB, multi: false, active: true },
  { id: 7, name: "Vitals Desk 1", type: "Nursing Counter", branch: LHR, multi: false, active: true },
];

export { COUNTER_TYPES, COUNTERS };