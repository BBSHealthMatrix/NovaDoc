// lists that power the prescription drawer dropdowns (factory defaults)
const PRESCRIPTION_DEFAULTS = [
  { key: "routes", title: "Routes", items: ["Oral", "IV", "IM", "SC", "Inhaled", "Topical", "Sublingual", "Rectal"] },
  {
    key: "frequencies", title: "Frequencies", items: [
      "Once daily (OD)", "Twice daily (BID)", "Three times daily (TID)", "Four times daily (QID)",
      "Every 6 hours (q6h)", "Every 8 hours (q8h)", "Every 12 hours (q12h)", "As needed (PRN)", "Weekly", "Monthly",
    ],
  },
  {
    key: "durations", title: "Durations", items: [
      "1 day", "3 days", "5 days", "7 days", "10 days", "14 days", "21 days", "30 days", "3 months", "6 months", "Ongoing",
    ],
  },
  { key: "units", title: "Units", items: ["tablet(s)", "capsule(s)", "ml", "dose(s)", "drop(s)", "puff(s)", "sachet(s)"] },
];

export { PRESCRIPTION_DEFAULTS };