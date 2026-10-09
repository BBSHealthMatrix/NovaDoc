const SEED = [
  { id: 1, name: "Cardiology", active: true, open: true, subs: [
    { id: 11, name: "Outpatient", active: true }, { id: 12, name: "Inpatient", active: false },
  ] },
  { id: 2, name: "Orthopedics", active: true, open: true, subs: [
    { id: 21, name: "Outpatient", active: true }, { id: 22, name: "Inpatient", active: false },
  ] },
  { id: 3, name: "Neurology", active: true, open: false, subs: [
    { id: 31, name: "Outpatient", active: true }, { id: 32, name: "Inpatient", active: false },
  ] },
  { id: 4, name: "Immunology", active: true, open: false, subs: [
    { id: 41, name: "Outpatient", active: true },
  ] },
];

const subLabel = (n) => `${n} sub-dept${n === 1 ? "" : "s"}`;

export { subLabel, SEED };
