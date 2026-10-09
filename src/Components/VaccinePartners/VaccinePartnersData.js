const v = (id, name, route, schedule, desc) => ({ id, name, route, schedule, desc });

const SECTIONS = [
  {
    id: "routine", name: "Routine Immunization",
    vaccines: [
      v(1, "BCG", "Intradermal (ID)", "Single dose (at birth)", "Tuberculosis prevention"),
      v(2, "Hepatitis B", "Intramuscular (IM)", "3 doses: 0, 1, 6 months", "Hepatitis B virus prevention"),
      v(3, "OPV", "Oral (PO)", "4 doses: birth, 6, 10, 14 weeks", "Oral Polio Vaccine"),
    ],
  },
  {
    id: "childhood", name: "Childhood Immunization",
    vaccines: [
      v(4, "DTP", "Intramuscular (IM)", "3 primary + 1 booster", "Diphtheria, Tetanus, Pertussis"),
      v(5, "MMR", "Subcutaneous (SC)", "2 doses: 12–15 months & 4–6 yrs", "Measles, Mumps, Rubella"),
      v(6, "Varicella", "Subcutaneous (SC)", "2 doses", "Chickenpox prevention"),
      v(7, "PCV13 (Pneumococcal)", "Intramuscular (IM)", "4 doses: 2, 4, 6, 12–15 months", "Pneumococcal conjugate vaccine"),
    ],
  },
  {
    id: "adult", name: "Adolescent & Adult",
    vaccines: [
      v(8, "HPV", "Intramuscular (IM)", "2–3 doses (age-dependent)", "Human Papillomavirus"),
      v(9, "Td", "Intramuscular (IM)", "Every 10 years", "Tetanus-Diphtheria booster"),
      v(10, "Influenza", "Intramuscular (IM)", "Annual", "Seasonal flu vaccine"),
      v(11, "COVID-19", "Intramuscular (IM)", "2 primary + booster", "Coronavirus disease prevention"),
    ],
  },
  {
    id: "travel", name: "Travel Vaccines",
    vaccines: [
      v(12, "Typhoid", "Intramuscular (IM)", "Single dose (injectable)", "Typhoid fever prevention"),
      v(13, "Hepatitis A", "Intramuscular (IM)", "2 doses: 0, 6–12 months", "Hepatitis A virus prevention"),
      v(14, "Rabies (Pre-exposure)", "Intramuscular (IM)", "3 doses: 0, 7, 21 days", "Pre-exposure prophylaxis"),
      v(15, "Meningococcal", "Intramuscular (IM)", "Single dose", "Meningitis prevention (travel)"),
    ],
  },
];

const PARTNER_TYPES = ["Internal Clinic", "Government Program", "Private Centre"];

const TYPE_CLASS = {
  "Internal Clinic": "vp-t-internal",
  "Government Program": "vp-t-gov",
  "Private Centre": "vp-t-private",
};

// prices keyed by vaccine id ("" = selected but not priced yet)
const PARTNERS = [
  {
    id: 1, name: "In-Clinic Vaccination Centre", type: "Internal Clinic", contact: "", active: true,
    prices: { 1: 0, 2: 800, 3: 0, 5: 1500, 10: 1200, 11: 2000 },
  },
  {
    id: 2, name: "National Immunization Program", type: "Government Program", contact: "0800-45222", active: true,
    prices: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
];

const BLANK_PARTNER = { name: "", type: "Internal Clinic", contact: "", prices: {} };

export { SECTIONS, PARTNER_TYPES, TYPE_CLASS, PARTNERS, BLANK_PARTNER };