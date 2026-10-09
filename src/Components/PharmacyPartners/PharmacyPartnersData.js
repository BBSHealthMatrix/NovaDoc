const PARTNER_TYPES = ["In-Clinic Dispensary", "External Pharmacy"];

let gid = 0;
let bid = 0;
// g(generic, [[brand, strength], ...])
const g = (name, brands) => ({
  id: ++gid, name,
  brands: brands.map(([b, strength]) => ({ id: ++bid, name: b, strength })),
});

// catalogue shown in step 2 (same order as screenshots)
const CATALOGUE = [
  {
    category: "Analgesics & Antipyretics",
    generics: [
      g("Paracetamol", [["Panadol", "500mg"], ["Panadol", "250mg"], ["Tylenol", "500mg"], ["Calpol", "120mg/5ml (Syrup)"]]),
      g("Tramadol", [["Tramal", "50mg"], ["Tramal", "100mg"], ["Ultram", "50mg"]]),
    ],
  },
  {
    category: "Antibiotics",
    generics: [
      g("Amoxicillin", [["Amoxil", "250mg"], ["Amoxil", "500mg"], ["Trimox", "500mg"]]),
      g("Amoxicillin + Clavulanate", [["Augmentin", "375mg"], ["Augmentin", "625mg"], ["Augmentin", "1g/200ml (IV)"]]),
      g("Azithromycin", [["Zithromax", "250mg"], ["Zithromax", "500mg"], ["Azithral", "500mg"]]),
      g("Ciprofloxacin", [["Cipro", "250mg"], ["Cipro", "500mg"], ["Ciflox", "500mg"]]),
      g("Metronidazole", [["Flagyl", "200mg"], ["Flagyl", "400mg"], ["Flagyl", "500mg/100ml (IV)"]]),
      g("Doxycycline", [["Vibramycin", "100mg"], ["Doxylin", "100mg"]]),
    ],
  },
  {
    category: "Antidiabetics",
    generics: [
      g("Metformin", [["Glucophage", "500mg"], ["Glucophage", "850mg"], ["Glucophage", "1000mg"], ["Glucophage XR", "500mg (SR)"]]),
      g("Glibenclamide (Glyburide)", [["Daonil", "2.5mg"], ["Daonil", "5mg"]]),
    ],
  },
  {
    category: "Cardiovascular",
    generics: [
      g("Amlodipine", [["Norvasc", "5mg"], ["Norvasc", "10mg"], ["Amlor", "5mg"]]),
      g("Atorvastatin", [["Lipitor", "10mg"], ["Lipitor", "20mg"], ["Lipitor", "40mg"], ["Sortis", "20mg"]]),
      g("Metoprolol", [["Lopressor", "25mg"], ["Lopressor", "50mg"], ["Betaloc", "100mg"]]),
      g("Lisinopril", [["Zestril", "5mg"], ["Zestril", "10mg"], ["Zestril", "20mg"]]),
      g("Furosemide", [["Lasix", "20mg"], ["Lasix", "40mg"], ["Lasix", "80mg"]]),
    ],
  },
  {
    category: "GI / Gastroprotective",
    generics: [
      g("Omeprazole", [["Losec", "20mg"], ["Losec", "40mg"], ["Prilosec", "20mg"]]),
      g("Pantoprazole", [["Protonix", "20mg"], ["Protonix", "40mg"], ["Pantoloc", "40mg"]]),
      g("Ondansetron", [["Zofran", "4mg"], ["Zofran", "8mg"], ["Onday", "4mg"]]),
    ],
  },
  {
    category: "NSAIDs",
    generics: [
      g("Ibuprofen", [["Brufen", "200mg"], ["Brufen", "400mg"], ["Advil", "200mg"], ["Nurofen", "400mg"]]),
      g("Diclofenac", [["Voltaren", "25mg"], ["Voltaren", "50mg"], ["Cataflam", "50mg"]]),
      g("Aspirin (ASA)", [["Disprin", "300mg"], ["Ecotrin", "75mg (EC)"], ["Ecotrin", "325mg (EC)"]]),
    ],
  },
  {
    category: "Respiratory",
    generics: [
      g("Salbutamol (Albuterol)", [["Ventolin", "2mg"], ["Ventolin", "4mg"], ["Ventolin Inhaler", "100mcg/dose"]]),
      g("Prednisolone", [["Prelone", "5mg"], ["Prelone", "25mg"], ["Deltacortril", "5mg"]]),
      g("Cetirizine", [["Zyrtec", "5mg"], ["Zyrtec", "10mg"], ["Reactine", "10mg"]]),
    ],
  },
];

const ALL_GENERICS = CATALOGUE.flatMap((c) => c.generics);

// selected = generic ids; prices = { [brandId]: { price, fee } }
const PARTNERS = [
  { id: 1, name: "In-House Dispensary", type: "In-Clinic Dispensary", contact: "", active: false, selected: [], prices: {} },
  { id: 2, name: "Al-Shifa Pharmacy", type: "External Pharmacy", contact: "0300-1234567", active: true, selected: [], prices: {} },
];

export { PARTNER_TYPES, CATALOGUE, ALL_GENERICS, PARTNERS };