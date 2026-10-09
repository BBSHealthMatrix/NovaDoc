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

const PARTNER_TYPES = ["Internal Clinic", "External Provider"];

const PARTNERS = [
  {
    id: 1, name: "In-Clinic (Main)", type: "Internal Clinic", contact: "", active: true,
    prices: { 1: 1500, 2: 500, 4: 25000, 5: 800, 6: 1200, 7: 400, 11: 1000 },
  },
  {
    id: 2, name: "Surgical Associates", type: "External Provider", contact: "0300-1234567", active: true,
    prices: { 8: 2000, 9: 3500, 10: 1200 },
  },
];

const BLANK_PARTNER = { name: "", type: "External Provider", contact: "", prices: {} };

export { SECTIONS, PARTNER_TYPES, PARTNERS, BLANK_PARTNER };