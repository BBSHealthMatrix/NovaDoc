const SECTIONS = [
  {
    id: "resp", name: "Respiratory",
    procedures: [
      { id: 1, name: "Spirometry", cpt: "94010", desc: "Pulmonary function test" },
      { id: 2, name: "Nebulisation", cpt: "94640", desc: "" },
      { id: 3, name: "Peak Flow Measurement", cpt: "94150", desc: "" },
      { id: 4, name: "Skin Testing", cpt: "95004", desc: "Allergy skin prick test" },
    ],
  },
  {
    id: "wound", name: "Wound Care",
    procedures: [
      { id: 5, name: "Wound Dressing (Simple)", cpt: "97602", desc: "" },
      { id: 6, name: "Wound Debridement", cpt: "97597", desc: "" },
      { id: 7, name: "Suture Removal", cpt: "99211", desc: "" },
    ],
  },
  {
    id: "minor", name: "Minor Surgery",
    procedures: [
      { id: 8, name: "Incision & Drainage", cpt: "10060", desc: "Abscess I&D" },
      { id: 9, name: "Lipoma Excision", cpt: "21931", desc: "" },
      { id: 10, name: "Nail Avulsion", cpt: "11730", desc: "" },
    ],
  },
  {
    id: "urinary", name: "Urinary",
    procedures: [
      { id: 11, name: "Catheterisation", cpt: "51702", desc: "" },
      { id: 12, name: "Bladder Irrigation", cpt: "51700", desc: "" },
    ],
  },
];

const BLANK_PROCEDURE = { name: "", cpt: "", auto: false };

export { SECTIONS, BLANK_PROCEDURE };