// severity order = filter chip order + editor pill order
const SEVERITIES = [
  { key: "contraindicated", label: "Contraindicated" },
  { key: "major", label: "Major" },
  { key: "moderate", label: "Moderate" },
  { key: "minor", label: "Minor" },
];

const QT = "Both prolong the QT interval — risk of fatal arrhythmia (Torsades de Pointes).";
const STEROID_NSAID = "Corticosteroid + NSAID combination significantly increases risk of GI ulceration and bleeding.";
const NSAID_ACE = "NSAIDs blunt ACE inhibitor antihypertensive effect and increase risk of acute kidney injury.";

let rid = 0;
const r = (severity, a, b, note, active = true) => ({ id: ++rid, severity, a, b, note, active });

const INTERACTIONS = [
  // Contraindicated
  r("contraindicated", "Ciprofloxacin", "Ondansetron", QT),
  r("contraindicated", "Azithromycin", "Ondansetron", QT, false),

  // Major
  r("major", "Aspirin (ASA)", "Ibuprofen", "Ibuprofen competitively inhibits aspirin's antiplatelet effect; concurrent use increases GI bleed risk."),
  r("major", "Aspirin (ASA)", "Diclofenac", "Concurrent NSAIDs increase GI bleed risk and reduce aspirin's antiplatelet efficacy."),
  r("major", "Prednisolone", "Ibuprofen", STEROID_NSAID),
  r("major", "Prednisolone", "Aspirin (ASA)", STEROID_NSAID),
  r("major", "Tramadol", "Metronidazole", "Metronidazole lowers seizure threshold; combined with tramadol significantly increases seizure risk."),
  r("major", "Tramadol", "Ondansetron", "Ondansetron (5-HT3 antagonist) reduces tramadol's analgesic efficacy via serotonergic mechanism."),

  // Moderate
  r("moderate", "Ibuprofen", "Lisinopril", NSAID_ACE),
  r("moderate", "Diclofenac", "Lisinopril", NSAID_ACE),
  r("moderate", "Metoprolol", "Amlodipine", "Additive negative chronotropic and inotropic effect; monitor for bradycardia and heart block."),
  r("moderate", "Prednisolone", "Metformin", "Corticosteroids cause hyperglycemia, counteracting metformin's glucose-lowering effect; monitor blood glucose."),
  r("moderate", "Tramadol", "Metoprolol", "Tramadol inhibits CYP2D6, increasing metoprolol plasma levels; risk of bradycardia and hypotension."),
  r("moderate", "Ciprofloxacin", "Metformin", "Ciprofloxacin inhibits renal tubular secretion of metformin, increasing exposure and hypoglycemia risk."),
  r("moderate", "Ibuprofen", "Furosemide", "NSAIDs reduce diuretic efficacy and may worsen fluid retention in cardiac patients."),
  r("moderate", "Aspirin (ASA)", "Furosemide", "High-dose aspirin antagonises the natriuretic effect of furosemide."),
  r("moderate", "Metformin", "Glibenclamide (Glyburide)", "Additive hypoglycemia risk; combination is common but requires blood glucose monitoring."),

  // Minor
  r("minor", "Atorvastatin", "Amlodipine", "Amlodipine weakly inhibits CYP3A4; slightly increases atorvastatin exposure (usually clinically insignificant)."),
  r("minor", "Furosemide", "Lisinopril", "Additive hypotension; may cause first-dose hypotension, especially in volume-depleted patients."),
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

export { SEVERITIES, INTERACTIONS, GENERICS };