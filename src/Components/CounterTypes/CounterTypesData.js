const COUNTER_TYPES = [
  { id: 1, name: "Registration Counter", desc: "Initial patient registration and token issuance.", max: 5 },
  { id: 2, name: "Nursing Counter", desc: "Vitals recording — BP, temperature, weight, SPO₂.", max: 3 },
  { id: 3, name: "Doctor Room", desc: "Doctor consultation room. Partitioned per doctor.", max: 10 },
  { id: 4, name: "Lab Counter", desc: "Sample collection and lab test processing.", max: 4 },
  { id: 5, name: "Pharmacy Counter", desc: "Medicine dispensing and billing.", max: 3 },
];

const BLANK = { name: "", desc: "", max: "1" };

export { COUNTER_TYPES, BLANK };