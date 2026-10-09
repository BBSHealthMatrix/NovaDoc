let mid = 0;
// m(brand, strength, generic, frequency, duration, dose, unit, route)
const m = (brand, strength, generic, frequency = "Once daily (OD)", duration = "Ongoing", dose = "1", unit = "tablet(s)", route = "Oral") => ({
  id: ++mid, brand, strength, generic, dose, unit, route, frequency, duration,
});

const BUNDLES = [
  {
    id: 1, name: "Hypertension Bundle", desc: "First-line antihypertensive + statin regimen", active: true,
    meds: [m("Norvasc", "5mg", "Amlodipine"), m("Zestril", "10mg", "Lisinopril"), m("Lipitor", "20mg", "Atorvastatin")],
  },
  {
    id: 2, name: "Upper Respiratory Infection", desc: "Antibiotic + antipyretic + antihistamine for URI", active: true,
    meds: [
      m("Augmentin", "625mg", "Amoxicillin + Clavulanate", "Twice daily (BID)", "5 days"),
      m("Panadol", "500mg", "Paracetamol", "As needed (PRN)", "3 days"),
      m("Zyrtec", "10mg", "Cetirizine", "Once daily (OD)", "5 days"),
    ],
  },
  {
    id: 3, name: "Gastritis / GERD Bundle", desc: "PPI + antiemetic cover for acute gastritis", active: true,
    meds: [
      m("Losec", "20mg", "Omeprazole", "Once daily (OD)", "14 days"),
      m("Zofran", "4mg", "Ondansetron", "Three times daily (TID)", "3 days"),
      m("Onset", "4mg/2ml (IV)", "Ondansetron", "Once daily (OD)", "1 day", "1", "dose(s)", "IV"),
    ],
  },
];

// defaults given to a medicine picked from the search
const NEW_MED_DEFAULTS = { dose: "1", unit: "tablet(s)", route: "Oral", frequency: "Once daily (OD)", duration: "Ongoing" };

// medicine list (own copy — was read from Formulary/FormularyData.js)
// display order of the category groups (filter chips are sorted A–Z separately)
const CATEGORIES = [
  { name: "Analgesics & Antipyretics", color: "#f97316" },
  { name: "NSAIDs", color: "#ef4444" },
  { name: "Antibiotics", color: "#8b5cf6" },
  { name: "Antidiabetics", color: "#10b981" },
  { name: "Cardiovascular", color: "#4982cf" },
  { name: "Respiratory", color: "#0ea5e9" },
  { name: "GI / Gastroprotective", color: "#f59e0b" },
];

let bid = 0;
// brands: [name, strength, fav?]
const g = (id, name, category, allergy, brands) => ({
  id, name, category, active: true, allergy,
  brands: brands.map(([b, strength, fav = false]) => ({ id: ++bid, name: b, strength, fav })),
});

const GENERICS = [
  // Analgesics & Antipyretics
  g(1, "Paracetamol", "Analgesics & Antipyretics", ["Paracetamol", "Acetaminophen"], [
    ["Panadol", "500mg"], ["Panadol", "250mg"], ["Tylenol", "500mg"], ["Calpol", "120mg/5ml (Syrup)"],
  ]),
  g(2, "Tramadol", "Analgesics & Antipyretics", ["Tramadol"], [
    ["Tramal", "50mg"], ["Tramal", "100mg"], ["Ultram", "50mg"],
  ]),

  // NSAIDs
  g(3, "Ibuprofen", "NSAIDs", ["Ibuprofen", "Aspirin"], [
    ["Brufen", "200mg", true], ["Brufen", "400mg"], ["Advil", "200mg"], ["Nurofen", "400mg"],
  ]),
  g(4, "Diclofenac", "NSAIDs", ["Diclofenac", "Aspirin"], [
    ["Voltaren", "25mg"], ["Voltaren", "50mg"], ["Cataflam", "50mg"],
  ]),
  g(5, "Aspirin (ASA)", "NSAIDs", ["Aspirin", "Salicylate"], [
    ["Disprin", "300mg"], ["Ecotrin", "75mg"], ["Loprin", "75mg"],
  ]),

  // Antibiotics
  g(6, "Amoxicillin", "Antibiotics", ["Amoxicillin", "Penicillin"], [
    ["Amoxil", "250mg"], ["Amoxil", "500mg"], ["Trimox", "500mg"],
  ]),
  g(7, "Amoxicillin + Clavulanate", "Antibiotics", ["Amoxicillin", "Penicillin", "Clavulanate"], [
    ["Augmentin", "375mg"], ["Augmentin", "625mg"], ["Augmentin", "1g/200ml (IV)"],
  ]),
  g(8, "Azithromycin", "Antibiotics", ["Azithromycin", "Macrolide"], [
    ["Zithromax", "250mg"], ["Zithromax", "500mg"], ["Azithral", "500mg"],
  ]),
  g(9, "Ciprofloxacin", "Antibiotics", ["Ciprofloxacin", "Quinolone"], [
    ["Cipro", "250mg"], ["Cipro", "500mg"], ["Ciproxin", "500mg"],
  ]),
  g(10, "Metronidazole", "Antibiotics", ["Metronidazole"], [
    ["Flagyl", "200mg"], ["Flagyl", "400mg"], ["Metrozine", "400mg"],
  ]),
  g(11, "Doxycycline", "Antibiotics", ["Doxycycline", "Tetracycline"], [
    ["Vibramycin", "100mg"], ["Doxy", "100mg"],
  ]),

  // Antidiabetics
  g(12, "Metformin", "Antidiabetics", ["Metformin"], [
    ["Glucophage", "500mg"], ["Glucophage", "850mg"], ["Glucophage", "1000mg"], ["Neodipar", "500mg"],
  ]),
  g(13, "Glibenclamide (Glyburide)", "Antidiabetics", ["Glibenclamide", "Sulfonylurea"], [
    ["Daonil", "5mg"], ["Euglucon", "5mg"],
  ]),

  // Cardiovascular
  g(14, "Amlodipine", "Cardiovascular", ["Amlodipine"], [
    ["Norvasc", "5mg"], ["Norvasc", "10mg"], ["Amlocard", "5mg"],
  ]),
  g(15, "Atorvastatin", "Cardiovascular", ["Atorvastatin", "Statin"], [
    ["Lipitor", "10mg"], ["Lipitor", "20mg"], ["Lipitor", "40mg"], ["Atorva", "20mg"],
  ]),
  g(16, "Metoprolol", "Cardiovascular", ["Metoprolol"], [
    ["Lopressor", "50mg"], ["Betaloc", "25mg"], ["Betaloc", "50mg"],
  ]),
  g(17, "Lisinopril", "Cardiovascular", ["Lisinopril", "ACE inhibitor"], [
    ["Zestril", "5mg"], ["Zestril", "10mg"], ["Prinivil", "10mg"],
  ]),
  g(18, "Furosemide", "Cardiovascular", ["Furosemide", "Sulfonamide"], [
    ["Lasix", "20mg"], ["Lasix", "40mg"], ["Lasix", "20mg/2ml (IV)"],
  ]),

  // Respiratory
  g(19, "Salbutamol (Albuterol)", "Respiratory", ["Salbutamol", "Albuterol"], [
    ["Ventolin", "100mcg (Inhaler)"], ["Ventolin", "2mg/5ml (Syrup)"], ["Ventolin", "2.5mg (Nebule)"],
  ]),
  g(20, "Prednisolone", "Respiratory", ["Prednisolone"], [
    ["Deltacortril", "5mg"], ["Predsol", "5mg/5ml (Syrup)"], ["Prelone", "15mg/5ml (Syrup)"],
  ]),
  g(21, "Cetirizine", "Respiratory", ["Cetirizine"], [
    ["Zyrtec", "10mg"], ["Zyrtec", "5mg/5ml (Syrup)"], ["Rigix", "10mg"],
  ]),

  // GI / Gastroprotective
  g(22, "Omeprazole", "GI / Gastroprotective", ["Omeprazole"], [
    ["Losec", "20mg"], ["Losec", "40mg"], ["Risek", "20mg"],
  ]),
  g(23, "Pantoprazole", "GI / Gastroprotective", ["Pantoprazole"], [
    ["Protonix", "40mg"], ["Pantra", "40mg"], ["Protonix", "40mg (IV)"],
  ]),
  g(24, "Ondansetron", "GI / Gastroprotective", ["Ondansetron"], [
    ["Zofran", "4mg"], ["Zofran", "8mg"], ["Onset", "4mg/2ml (IV)"],
  ]),
];

export { BUNDLES, NEW_MED_DEFAULTS, CATEGORIES, GENERICS };