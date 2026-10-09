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

// ledger is stored oldest → newest; returns newest first with running balance
const ledgerView = (ledger) => {
  let bal = 0;
  return ledger.map((e) => ({ ...e, balance: (bal += e.type === "Deposit" ? e.amount : -e.amount) })).reverse();
};
const ledgerTotals = (ledger) => {
  const deposits = ledger.filter((e) => e.type === "Deposit").reduce((s, e) => s + e.amount, 0);
  const disbursed = ledger.filter((e) => e.type === "Disbursed").reduce((s, e) => s + e.amount, 0);
  return { deposits, disbursed, balance: deposits - disbursed };
};

/* ── lookups ── */
const SCHEME_TYPES = ["Government", "Hospital", "NGO", "Zakat / Religious", "Corporate Welfare"];
const TYPE_KEY = { Government: "gov", Hospital: "hosp", NGO: "ngo", "Zakat / Religious": "zakat", "Corporate Welfare": "corp" };

const SERVICE_TYPES = ["Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"];
const DOCUMENTS = [
  "CNIC", "B-Form (Child)", "Income Certificate", "BISP Card", "Disability Certificate",
  "Death Certificate", "Employment Letter", "Zakat Certificate", "EOBI Card", "Widow Certificate",
];
const AGE_GROUPS = ["Paediatric (0–12 yrs)", "Adult (13–59 yrs)", "Senior (60+ yrs)"];
const RENEWALS = ["Every 6 Months", "Annual (1 Year)", "Every 2 Years"];
const RENEWAL_SHORT = { "Every 6 Months": "Every 6 Months", "Annual (1 Year)": "Annual", "Every 2 Years": "Every 2 Years" };

// coverage chip/pill label + tone
const coverageStatus = (c) => {
  if (!c.covered) return { label: "Not covered", tone: "none" };
  const pct = Number(c.pct) || 0;
  return pct >= 100 ? { label: "Full 100%", tone: "full" } : { label: `Partial ${pct}%`, tone: "partial" };
};

/* ── builders ── */
const cov = (pcts) => Object.fromEntries(SERVICE_TYPES.map((t, i) => [t, { covered: pcts[i] > 0, pct: String(pcts[i]) }]));
const copay = (vals) => Object.fromEntries(SERVICE_TYPES.map((t, i) => [t, String(vals[i])]));
let lid = 0;
const l = (date, type, amount, ref, notes) => ({ id: ++lid, date, type, amount, ref, notes });

const newScheme = (data) => ({
  id: Date.now(), active: true, beneficiaries: 0, created: fmtDate(todayIso()), ledger: [], forms: [],
  eligibility: { maxIncome: "0", maxHousehold: "0", documents: [], ageGroups: [...AGE_GROUPS], pwd: false, notes: "" },
  coverage: cov([100, 100, 100, 100, 100, 100, 100]),
  limits: { creditLimit: "0", maxOpd: "0", maxInpatient: "0", grace: "0", renewal: "Annual (1 Year)" },
  copay: copay([0, 0, 0, 0, 0, 0, 0]),
  ...data,
});

/* ── schemes ── */
const SCHEMES = [
  {
    id: 1, name: "Sehat Sahulat Programme", type: "Government", active: true, beneficiaries: 0,
    sponsor: "Punjab Health Initiative — Government of Punjab", created: "15-Jan-2024",
    description: "A provincial government health insurance scheme providing cashless medical treatment to low-income and vulnerable families registered under BISP or earning below the poverty threshold.",
    ledger: [
      l("01-Jul-2024", "Deposit", 300000, "PHI-Q3-2024", "Q3 government fund release"),
      l("15-Aug-2024", "Disbursed", 87450, "DISB-AUG-001", "12 patient claims settled — Aug batch"),
      l("01-Oct-2024", "Deposit", 250000, "PHI-Q4-2024", "Q4 government fund release"),
    ],
    eligibility: {
      maxIncome: "25000", maxHousehold: "8", documents: ["CNIC", "Income Certificate", "BISP Card"],
      ageGroups: [...AGE_GROUPS], pwd: true,
      notes: "Beneficiary must be a Punjab domicile holder. Family unit includes spouse and dependent children under 18.",
    },
    coverage: cov([100, 80, 100, 50, 50, 80, 100]),
    limits: { creditLimit: "720000", maxOpd: "24", maxInpatient: "30", grace: "30", renewal: "Annual (1 Year)" },
    copay: copay([0, 20, 0, 50, 50, 20, 0]),
    forms: [],
  },
  {
    id: 2, name: "Hospital Charity Fund", type: "Hospital", active: true, beneficiaries: 0,
    sponsor: "NovaDoc Hospital — Social Welfare Department", created: "01-Jan-2024",
    description: "Internal charity fund administered by the hospital's social welfare officer. Provides subsidised or free care to destitute patients on a case-by-case basis after means testing.",
    ledger: [
      l("01-Jan-2024", "Deposit", 150000, "HCF-ALLOC-2024", "Annual hospital charity allocation"),
      l("15-Jun-2024", "Deposit", 50000, "DON-JUN-2024", "Donor contribution"),
      l("30-Sep-2024", "Disbursed", 63200, "DISB-Q3-001", "Charity cases settled — Q3"),
    ],
    eligibility: {
      maxIncome: "30000", maxHousehold: "10", documents: ["CNIC", "Income Certificate"],
      ageGroups: [...AGE_GROUPS], pwd: true,
      notes: "Means test interview with the social welfare officer is mandatory before enrolment.",
    },
    coverage: cov([100, 100, 80, 100, 100, 80, 100]),
    limits: { creditLimit: "300000", maxOpd: "12", maxInpatient: "15", grace: "15", renewal: "Annual (1 Year)" },
    copay: copay([0, 0, 0, 0, 0, 0, 0]),
    forms: [],
  },
  {
    id: 3, name: "Zakat Aid Programme", type: "Zakat / Religious", active: true, beneficiaries: 0,
    sponsor: "Shaukat Khanum Memorial Cancer Hospital & Research Centre", created: "01-Apr-2024",
    description: "Zakat-funded healthcare assistance for deserving cancer and chronic disease patients. Full coverage for investigation and treatment upon Zakat committee approval.",
    ledger: [
      l("01-Apr-2024", "Deposit", 400000, "ZKT-2024-01", "Zakat fund allocation"),
      l("01-Jul-2024", "Deposit", 250000, "ZKT-2024-02", "Ramadan Zakat collection"),
      l("20-Sep-2024", "Disbursed", 145000, "DISB-SEP-001", "8 patient cases settled — Sep batch"),
    ],
    eligibility: {
      maxIncome: "20000", maxHousehold: "8", documents: ["CNIC", "Income Certificate", "Zakat Certificate"],
      ageGroups: [...AGE_GROUPS], pwd: true,
      notes: "Case must be approved by the Zakat committee. Applicant must be eligible to receive Zakat.",
    },
    coverage: cov([100, 100, 100, 100, 100, 100, 100]),
    limits: { creditLimit: "1000000", maxOpd: "0", maxInpatient: "60", grace: "30", renewal: "Annual (1 Year)" },
    copay: copay([0, 0, 0, 0, 0, 0, 0]),
    forms: [],
  },
  {
    id: 4, name: "EOBI Workers Welfare", type: "Government", active: true, beneficiaries: 0,
    sponsor: "Employees Old-Age Benefits Institution — Government of Pakistan", created: "15-Jan-2024",
    description: "Healthcare benefit scheme for registered workers and their dependents under EOBI. Covers OPD, lab, and pharmacy services with co-payment for imaging and procedures.",
    ledger: [
      l("15-Jan-2024", "Deposit", 250000, "EOBI-H1-2024", "H1 EOBI fund release"),
      l("15-Jul-2024", "Deposit", 150000, "EOBI-H2-2024", "H2 EOBI fund release"),
      l("10-Sep-2024", "Disbursed", 112000, "DISB-SEP-002", "Worker claims settled — Sep batch"),
    ],
    eligibility: {
      maxIncome: "0", maxHousehold: "0", documents: ["CNIC", "EOBI Card", "Employment Letter"],
      ageGroups: [...AGE_GROUPS], pwd: false,
      notes: "Covers registered workers and dependents listed on the EOBI card.",
    },
    coverage: cov([100, 100, 70, 100, 100, 70, 100]),
    limits: { creditLimit: "400000", maxOpd: "24", maxInpatient: "20", grace: "30", renewal: "Annual (1 Year)" },
    copay: copay([0, 0, 30, 0, 0, 30, 0]),
    forms: [],
  },
];

export {
  rs, fmtDate, todayIso, ledgerView, ledgerTotals, coverageStatus, newScheme,
  SCHEME_TYPES, TYPE_KEY, SERVICE_TYPES, DOCUMENTS, AGE_GROUPS, RENEWALS, RENEWAL_SHORT, SCHEMES,
};