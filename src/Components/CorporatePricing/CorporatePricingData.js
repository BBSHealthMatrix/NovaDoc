/* ── helpers ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const rs = (n) => `Rs. ${Number(n || 0).toLocaleString("en-US")}`;
// "2026-10-08" → "08-Oct-2026"
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}-${MONTHS[Number(m) - 1]}-${y}`;
};
const todayIso = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};
const pendingOf = (c) => c.total - c.paid;
const statusOf = (c) => (c.paid === 0 ? "Unpaid" : pendingOf(c) <= 0 ? "Paid" : "Partial");

// ledger is stored oldest → newest; returns newest first with running balance
const SIGN = { Advance: 1, "Tax Credit": 1, "Claim Debit": -1 };
const ledgerView = (ledger) => {
  let bal = 0;
  return ledger.map((e) => ({ ...e, balance: (bal += SIGN[e.type] * e.amount) })).reverse();
};

/* ── pricing rules ── */
const SERVICE_TYPES = ["Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"];
const defaultRules = () => Object.fromEntries(SERVICE_TYPES.map((t) => [t, { mode: "%", amount: "" }]));

/* ── doctors (consultations) ── */
const VISIT_TYPES = [["consult", "Consultation"], ["followUp", "Follow-up"], ["emergency", "Emergency"], ["tele", "Tele-Consult"]];
const sp = (name, consult, followUp, emergency, tele) => ({ name, consult, followUp, emergency, tele });

const DOCTORS = [
  { id: 1, name: "Dr. Emily Wong", specialties: [sp("Cardiology", 2000, 1000, 3000, 1500), sp("Orthopedics", 2500, 1200, 3500, 1800)] },
  { id: 2, name: "Dr. James Wilson", specialties: [sp("Orthopedics", 3000, 1500, 4000, 2000)] },
  { id: 3, name: "Dr. Sarah Connor", specialties: [sp("Neurology", 2500, 1200, 3500, 1500)] },
  { id: 4, name: "Dr. Asif Imam", specialties: [sp("Immunology", 2500, 1200, 3500, 1800)] },
];

/* ── providers per service group ── */
const opt = (id, name, type, rows) => ({ id, name, type, items: rows.map(([n, base], i) => ({ id: `${id}-${i}`, name: n, base })) });

const PROVIDER_GROUPS = [
  {
    key: "lab", label: "Lab", color: "#6366f1",
    options: [
      opt("hashmani", "Hashmani Laboratories", "", [
        ["Complete Blood Count (CBC)", 850], ["ESR", 250], ["Fasting Blood Sugar", 150], ["HbA1c", 600], ["Lipid Profile", 950],
        ["Liver Function Tests", 1100], ["Kidney Function Tests", 750], ["Urine R/E", 200], ["TSH", 550], ["T3 / T4", 800],
      ]),
      opt("chughtai", "Chughtai Lab", "", [
        ["Complete Blood Count (CBC)", 800], ["ESR", 220], ["Fasting Blood Sugar", 140], ["HbA1c", 580],
        ["Lipid Profile", 900], ["Liver Function Tests", 1050], ["Kidney Function Tests", 700], ["Urine R/E", 180],
      ]),
    ],
  },
  {
    key: "pharmacy", label: "Pharmacy", color: "#10b981",
    options: [
      opt("inhouse-disp", "In-House Dispensary", "In-Clinic Dispensary", []),
      opt("alshifa", "Al-Shifa Pharmacy", "External Pharmacy", []),
    ],
  },
  {
    key: "consumables", label: "Consumables", color: "#f59e0b",
    options: [
      opt("central", "Central Store", "In-House Store", [
        ["Gauze Swabs 4×4", 200], ["Cotton Roll", 100], ["Adhesive Tape (2.5cm)", 80], ["5ml Syringe", 280], ["10ml Syringe", 320],
        ["IV Cannula 18G", 60], ["Examination Gloves Small", 750], ["Examination Gloves Medium", 750], ["IV Administration Set", 100],
      ]),
      opt("medsupply", "MedSupply Co.", "External Supplier", [
        ["Blood Collection Tube (EDTA)", 1500], ["Blood Collection Tube (Plain)", 1300], ["Urine Collection Cup", 40], ["Lancets", 450],
        ["Non-Adherent Dressing", 520], ["Transparent Film Dressing", 800], ["Examination Gloves Large", 750], ["Surgical Mask", 400],
        ["N95 Respirator", 180], ["20ml Syringe", 1150],
      ]),
    ],
  },
  {
    key: "procedures", label: "Procedures", color: "#8b5cf6",
    options: [
      opt("inclinic", "In-Clinic (Main)", "Internal Clinic", [
        ["Spirometry", 1500], ["Nebulisation", 500], ["Wound Dressing (Simple)", 800], ["Wound Debridement", 1200],
        ["Suture Removal", 400], ["Incision & Drainage", 1800], ["Skin Testing", 25000],
      ]),
      opt("surgical", "Surgical Associates", "External Provider", [
        ["Lipoma Excision", 15000], ["Nail Avulsion", 6000], ["Incision & Drainage", 2500], ["Wound Debridement", 1800], ["Catheterisation", 1200],
      ]),
    ],
  },
  {
    key: "imaging", label: "Imaging", color: "#0ea5e9",
    options: [
      opt("inhouse-rad", "In-House Radiology", "Internal Radiology", []),
    ],
  },
];

/* ── corporates ── */
let cid = 0;
// c(name, mrn, visitDate, services, claimDate, total, paid, tax)
const c = (name, mrn, visit, services, claimDate, total, paid, tax = 0) => ({ id: ++cid, name, mrn, visit, services, claimDate, total, paid, tax });

const demoClaims = () => [
  c("Ahmed Khan", "MR-10123", "18-Sept-2026", "General Consultation, CBC", "20-Sept-2026", 950, 0),
  c("Sana Malik", "MR-10456", "23-Sept-2026", "Specialist Consultation, X-Ray Chest", "25-Sept-2026", 2100, 1000),
  c("Usman Ali", "MR-10789", "28-Sept-2026", "Echocardiogram", "30-Sept-2026", 3500, 0),
  c("Fatima Hassan", "MR-11001", "08-Sept-2026", "Blood Glucose (Fasting), Liver Function Test", "10-Sept-2026", 1000, 1000, 50),
  c("Bilal Ahmed", "MR-11234", "03-Oct-2026", "Follow-up Consultation", "05-Oct-2026", 300, 0),
  c("Nadia Rehan", "MR-11450", "01-Oct-2026", "Specialist Consultation, Echocardiogram", "03-Oct-2026", 4700, 2000),
];

const CORPORATES = [
  {
    id: 1, code: "C2", name: "Sui Northern Gas (SNGPL)", email: "welfare@sngpl.com.pk",
    person: "Nadia Baig", phone: "0321-9876543", mou: "SNGPL_MOU_2024.pdf",
    creditEnabled: true, creditLimit: 750000, newPricing: "Use Adjusted Price",
    doctors: [1, 2, 3],
    providers: { lab: "hashmani", pharmacy: "inhouse-disp", consumables: "central", procedures: "inclinic", imaging: "inhouse-rad" },
    ledger: [
      { id: 1, date: "15-Sept-2024", type: "Advance", amount: 100000, tax: 0, ref: "ADV-C2-001", remarks: "Annual advance Q4" },
      { id: 2, date: "20-Oct-2024", type: "Claim Debit", amount: 67500, tax: 0, ref: "CLM-C2-001", remarks: "Invoice batch Oct (8 patients)" },
      { id: 3, date: "20-Oct-2024", type: "Tax Credit", amount: 4725, tax: 4725, ref: "CLM-C2-001", remarks: "WHT 7% on CLM-C2-001" },
    ],
    claims: demoClaims(),
    rules: defaultRules(), overrides: {}, inactive: [],
  },
  {
    id: 2, code: "C3", name: "Packages Limited", email: "hr@packages.com.pk",
    person: "Sana Tariq", phone: "0301-4567890", mou: "",
    creditEnabled: false, creditLimit: 0, newPricing: "Use Base Price",
    doctors: [1, 2],
    providers: { lab: "chughtai", pharmacy: null, consumables: "medsupply", procedures: "surgical", imaging: null },
    ledger: [],
    claims: demoClaims(),
    rules: defaultRules(), overrides: {}, inactive: [],
  },
];

export {
  rs, fmtDate, todayIso, pendingOf, statusOf, ledgerView, defaultRules,
  SERVICE_TYPES, VISIT_TYPES, DOCTORS, PROVIDER_GROUPS, CORPORATES,
};