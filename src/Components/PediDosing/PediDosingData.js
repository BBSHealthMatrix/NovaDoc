// native dropdown options (same order as screenshots)
const ROUTES = ["Oral", "IV", "Oral / IV", "Nebulised", "Topical", "IM", "Rectal", "Intranasal"];
const FREQUENCIES = [
  "Once daily", "BD", "TDS", "QDS", "4 hourly", "6 hourly", "6–8 hourly",
  "8 hourly", "12 hourly", "24 hourly", "4–6 hourly", "PRN",
];

const PARA_5 = "Do not exceed 5 doses in 24 hours.";
const CIPRO = "Reserve for specific indications only. Avoid routine use — risk of tendinopathy.";

let id = 0;
// d(medicine, age label, min age in months, route, dose, frequency, max, notes)
const d = (medicine, age, minAge, route, dose, frequency, max, notes = "") => ({
  id: ++id, medicine, age, minAge, route, dose, frequency, max, notes, active: true,
});

// seed order = order of the "All medicines" filter dropdown; the list itself is shown A–Z by medicine, then by min age
const PEDI_RULES = [
  d("Paracetamol", "Neonate (0–28 days)", 0, "Oral / IV", "10–15 mg/kg/dose", "6–8 hourly", "60 mg/kg/day", "IV route for neonates unable to take orally."),
  d("Paracetamol", "1 month – 1 year", 1, "Oral", "15 mg/kg/dose", "6 hourly", "90 mg/kg/day", "Max 4 doses in 24 hours."),
  d("Paracetamol", "1–5 years", 12, "Oral", "120–250 mg/dose", "4–6 hourly", "1 g/dose", PARA_5),
  d("Paracetamol", "6–12 years", 72, "Oral", "250–500 mg/dose", "4–6 hourly", "1 g/dose", PARA_5),

  d("Ibuprofen", "3 months – 1 year", 3, "Oral", "5 mg/kg/dose", "6–8 hourly", "30 mg/kg/day", "Not recommended under 3 months. Use with food."),
  d("Ibuprofen", "1–5 years", 12, "Oral", "5–10 mg/kg/dose", "6–8 hourly", "40 mg/kg/day", "Use lowest effective dose. Take with food."),
  d("Ibuprofen", "6–12 years", 72, "Oral", "200–400 mg/dose", "6–8 hourly", "2.4 g/day"),

  d("Amoxicillin", "1 month – 1 year", 1, "Oral", "20–30 mg/kg/day ÷ 3 doses", "TDS", "30 mg/kg/day", "Standard infections. Double dose for severe infection."),
  d("Amoxicillin", "1–5 years", 12, "Oral", "125–250 mg/dose", "TDS", "750 mg/day"),
  d("Amoxicillin", "6–12 years", 72, "Oral", "250–500 mg/dose", "TDS", "1.5 g/day"),

  d("Azithromycin", "6 months – 12 years", 6, "Oral", "10 mg/kg on Day 1, then 5 mg/kg Days 2–5", "Once daily", "500 mg/dose", "5-day course. Take 1 hour before or 2 hours after food."),

  d("Metronidazole", "1–3 months", 1, "Oral", "15 mg/kg/day ÷ 3 doses", "TDS", "50 mg/kg/day", "Use with caution; limited data in young infants."),
  d("Metronidazole", "3 months – 12 years", 3, "Oral", "7.5 mg/kg/dose", "TDS", "400 mg/dose", "Duration: 5–7 days for infections; 7–10 days for amoebic colitis."),

  d("Ciprofloxacin", "1–5 years", 12, "Oral", "10–15 mg/kg/dose", "BD", "750 mg/day", CIPRO),
  d("Ciprofloxacin", "6–12 years", 72, "Oral", "250–500 mg/dose", "BD", "1 g/day", CIPRO),

  d("Cetirizine", "2–5 years", 24, "Oral", "2.5 mg/dose", "Once or twice daily", "5 mg/day"),
  d("Cetirizine", "6–12 years", 72, "Oral", "5 mg/dose", "Once daily", "10 mg/day", "May cause sedation — caution if school-age."),

  d("Salbutamol (Albuterol)", "0–1 year", 0, "Nebulised", "0.15 mg/kg/dose (min 1.25 mg)", "4–6 hourly", "5 mg/dose", "Dilute to 2.5–3 mL with normal saline."),
  d("Salbutamol (Albuterol)", "1–5 years", 12, "Nebulised", "2.5 mg/dose", "4–6 hourly", "10 mg/day", "Continuous nebulisation may be used in severe acute asthma under monitoring."),
  d("Salbutamol (Albuterol)", "6–12 years", 72, "Nebulised", "2.5–5 mg/dose", "4–6 hourly", "10 mg/day"),

  d("Prednisolone", "1 month – 5 years", 1, "Oral", "1–2 mg/kg/day", "Once daily (morning)", "40 mg/day", "Short course 3–5 days for croup/asthma. Taper if > 5 days."),
  d("Prednisolone", "6–12 years", 72, "Oral", "1–2 mg/kg/day", "Once daily (morning)", "40 mg/day", "Taper if course > 5 days. Monitor blood glucose in diabetic patients."),

  d("Ondansetron", "6 months – 12 years", 6, "Oral / IV", "0.15 mg/kg/dose", "8 hourly (max 3 doses/day)", "4 mg/dose", "Avoid in hepatic impairment. QT-prolonging — check other medications."),

  d("Omeprazole", "1–2 years", 12, "Oral", "0.5–1 mg/kg/day", "Once daily", "20 mg/day", "Take 30–60 min before meals."),
  d("Omeprazole", "2–12 years", 24, "Oral", "10–20 mg/day", "Once daily", "20 mg/day", "Take 30–60 min before meals. Reassess after 4–8 weeks."),

  d("Furosemide", "Neonate (0–28 days)", 0, "Oral / IV", "0.5–1 mg/kg/dose", "12–24 hourly", "2 mg/kg/day", "Monitor electrolytes closely. Use with caution — risk of ototoxicity."),
  d("Furosemide", "1 month – 12 years", 1, "Oral", "0.5–2 mg/kg/dose", "6–12 hourly", "6 mg/kg/day", "Monitor electrolytes (K⁺, Na⁺). Supplement potassium if prolonged use."),
];

// medicine list (own copy — was read from Formulary/FormularyData.js)
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

export { ROUTES, FREQUENCIES, PEDI_RULES, GENERICS };