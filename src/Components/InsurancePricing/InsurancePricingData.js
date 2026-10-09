/* ── helpers ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const rs = (n) => `Rs. ${Number(n || 0).toLocaleString("en-US")}`;
// "2026-10-07" → "07-Oct-2026"
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

/* ── service types / services ── */
const SERVICE_TYPES = ["Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"];

const split = (s) => s.split("|");
const brands = (generic, list) => split(list).map((b) => `${b} (${generic})`);
const views = (modality, rows) => rows.flatMap(([body, list]) => split(list).map((v) => `${modality} - ${body} - ${v}`));
const WO = "Without Contrast|With Contrast";
const WOW = "Without Contrast|With Contrast|With & Without Contrast";

const SERVICE_LISTS = {
  Lab: split("Complete Blood Count (CBC)|ESR|Peripheral Blood Film|Reticulocyte Count|Coagulation Profile (PT/APTT)|Fasting Blood Sugar|HbA1c|Lipid Profile|Liver Function Tests|Kidney Function Tests|Uric Acid|Culture & Sensitivity (Urine)|Culture & Sensitivity (Sputum)|Mantoux / TB Screen|Urine R/E|Urine C/S|24-hr Urine Protein|TSH|T3 / T4|FSH / LH|Testosterone|Cortisol (morning)"),
  Procedure: split("Spirometry|Nebulisation|Peak Flow Measurement|Skin Testing|Wound Dressing (Simple)|Wound Debridement|Suture Removal|Incision & Drainage|Lipoma Excision|Nail Avulsion|Catheterisation|Bladder Irrigation"),
  Formulary: [
    ...brands("Paracetamol", "Panadol 500mg|Panadol 250mg|Tylenol 500mg|Calpol 120mg/5ml (Syrup)"),
    ...brands("Tramadol", "Tramal 50mg|Tramal 100mg|Ultram 50mg"),
    ...brands("Ibuprofen", "Brufen 200mg|Brufen 400mg|Advil 200mg|Nurofen 400mg"),
    ...brands("Diclofenac", "Voltaren 25mg|Voltaren 50mg|Cataflam 50mg"),
    ...brands("Aspirin (ASA)", "Disprin 300mg|Ecotrin 75mg (EC)|Ecotrin 325mg (EC)"),
    ...brands("Amoxicillin", "Amoxil 250mg|Amoxil 500mg|Trimox 500mg"),
    ...brands("Amoxicillin + Clavulanate", "Augmentin 375mg|Augmentin 625mg|Augmentin 1g/200ml (IV)"),
    ...brands("Azithromycin", "Zithromax 250mg|Zithromax 500mg|Azithral 500mg"),
    ...brands("Ciprofloxacin", "Cipro 250mg|Cipro 500mg|Ciflox 500mg"),
    ...brands("Metronidazole", "Flagyl 200mg|Flagyl 400mg|Flagyl 500mg/100ml (IV)"),
    ...brands("Doxycycline", "Vibramycin 100mg|Doxylin 100mg"),
    ...brands("Metformin", "Glucophage 500mg|Glucophage 850mg|Glucophage 1000mg|Glucophage XR 500mg (SR)"),
    ...brands("Glibenclamide (Glyburide)", "Daonil 2.5mg|Daonil 5mg"),
    ...brands("Amlodipine", "Norvasc 5mg|Norvasc 10mg|Amlor 5mg"),
    ...brands("Atorvastatin", "Lipitor 10mg|Lipitor 20mg|Lipitor 40mg|Sortis 20mg"),
    ...brands("Metoprolol", "Lopressor 25mg|Lopressor 50mg|Betaloc 100mg"),
    ...brands("Lisinopril", "Zestril 5mg|Zestril 10mg|Zestril 20mg"),
    ...brands("Furosemide", "Lasix 20mg|Lasix 40mg|Lasix 80mg"),
    ...brands("Salbutamol (Albuterol)", "Ventolin 2mg|Ventolin 4mg|Ventolin Inhaler 100mcg/dose"),
    ...brands("Prednisolone", "Prelone 5mg|Prelone 25mg|Deltacortril 5mg"),
    ...brands("Cetirizine", "Zyrtec 5mg|Zyrtec 10mg|Reactine 10mg"),
    ...brands("Omeprazole", "Losec 20mg|Losec 40mg|Prilosec 20mg"),
    ...brands("Pantoprazole", "Protonix 20mg|Protonix 40mg|Pantoloc 40mg"),
    ...brands("Ondansetron", "Zofran 4mg|Zofran 8mg|Onday 4mg"),
  ],
  Consumables: split("Gauze Swabs 4x4|Cotton Roll|Adhesive Tape (2.5cm)|Suture Material (Vicryl 2-0)|Suture Material (Nylon 3-0)|5ml Syringe|10ml Syringe|20ml Syringe|Needle 18G|Needle 22G|IV Cannula 18G|IV Cannula 20G|Examination Gloves Small|Examination Gloves Medium|Examination Gloves Large|Surgical Mask|N95 Respirator|Face Shield|IV Administration Set|Blood Transfusion Set|Scalp Vein Set (21G)|3-Way Stopcock|Non-Adherent Dressing|Transparent Film Dressing|Hydrocolloid Dressing|Blood Collection Tube (EDTA)|Blood Collection Tube (Plain)|Urine Collection Cup|Lancets|Tongue Depressor"),
  Imaging: [
    ...views("X-Ray", [
      ["Chest", "Single View|AP Portable|PA View|PA & Lateral (2 Views)|3 Views|Decubitus|Rib Series"],
      ["Abdomen", "Supine|Erect|Supine & Erect"],
      ["Cervical Spine", "AP & Lateral|Flexion & Extension|3 Views|4 Views"],
      ["Lumbar Spine", "AP & Lateral|Flexion & Extension|3 Views|4 Views"],
      ["Thoracic Spine", "AP & Lateral|3 Views"],
      ["Pelvis", "AP View|AP & Lateral"],
      ["Knee", "AP & Lateral|Sunrise View|3 Views|Weight Bearing"],
      ["Shoulder", "AP View|Y-View|AP & Axillary (2 Views)"],
      ["Wrist", "AP & Lateral|3 Views"],
      ["Hand", "AP & Oblique|3 Views"],
      ["Ankle", "AP & Lateral|3 Views"],
      ["Foot", "AP & Lateral|3 Views|Weight Bearing"],
      ["Hip", "AP View|AP & Lateral"],
      ["Elbow", "AP & Lateral|3 Views"],
      ["Forearm", "AP & Lateral"],
      ["Tibia/Fibula", "AP & Lateral"],
      ["Skull", "AP & Lateral|Towne's View|3 Views"],
      ["Facial Bones", "Standard Views|Waters View"],
      ["Sinuses", "Waters View|Paranasal Sinus Series"],
    ]),
    ...views("CT", [
      ["Head/Brain", WOW],
      ["Chest", "Without Contrast|With Contrast|Pulmonary Angiography (CTPA)|High Resolution (HRCT)"],
      ["Abdomen", WOW],
      ["Pelvis", WOW],
      ["Abdomen & Pelvis", `${WOW}|Triple Phase`],
      ["Spine (Cervical)", WO],
      ["Spine (Lumbar)", WO],
      ["Spine (Thoracic)", WO],
      ["Coronary", "CT Coronary Angiography (CTCA)|Calcium Score"],
      ["Peripheral Angiography", "Standard Protocol"],
      ["KUB / Urogram", "Non-Contrast (NCCT KUB)|With Contrast (IVU)"],
      ["Neck/Soft Tissue", WO],
      ["Sinuses", "Without Contrast"],
      ["Orbits", WO],
    ]),
    ...views("MRI", [
      ["Brain", `${WOW}|Spectroscopy|Diffusion (DWI)`],
      ["Spine (Cervical)", WO],
      ["Spine (Lumbar)", WO],
      ["Spine (Thoracic)", WO],
      ["Knee", "Without Contrast"],
      ["Shoulder", "Without Contrast|With Contrast (Arthrogram)"],
      ["Hip", WO],
      ["Wrist", "Without Contrast"],
      ["Ankle/Foot", "Without Contrast"],
      ["Abdomen", WOW],
      ["Pelvis", WO],
      ["Prostate", "Multi-parametric (mpMRI)"],
      ["Breast", "Bilateral With Contrast"],
      ["Cardiac (CMR)", "Standard Protocol|Stress Protocol|Viability Protocol"],
      ["Whole Body", "Without Contrast"],
      ["MRCP", "Standard Protocol"],
    ]),
    ...views("Ultrasound", [
      ["Abdomen", "Complete|Limited|Focused"],
      ["Pelvis", "Transabdominal|Transvaginal (TVS)"],
      ["Thyroid & Neck", "Standard"],
      ["Renal", "Bilateral Kidneys|Single Kidney|KUB"],
      ["Testicular/Scrotal", "Standard with Doppler"],
      ["Breast", "Bilateral|Unilateral Right|Unilateral Left"],
      ["Doppler – Carotid", "Bilateral Carotid Doppler"],
      ["Doppler – Lower Limb Veins", "Bilateral DVT Screen|Unilateral Right|Unilateral Left"],
      ["Doppler – Lower Limb Arteries", "Bilateral|Unilateral Right|Unilateral Left"],
      ["Doppler – Upper Limb Veins", "Bilateral|Unilateral"],
      ["Obstetric (Dating)", "Standard Dating Scan"],
      ["Obstetric (Anatomy)", "Detailed Anomaly Scan (18–22 weeks)"],
      ["Shoulder", "Standard"],
      ["Soft Tissue / Mass", "Standard"],
      ["Guided Procedure", "Aspiration|Biopsy|Drainage"],
    ]),
    ...views("Mammography", [
      ["Bilateral", "Standard Screening (2 Views Each)|Diagnostic|Tomosynthesis (3D)"],
      ["Unilateral Right", "Standard|Diagnostic|Tomosynthesis (3D)"],
      ["Unilateral Left", "Standard|Diagnostic|Tomosynthesis (3D)"],
    ]),
    ...views("Echocardiography", [
      ["Transthoracic (TTE)", "2D Echo with Doppler|M-Mode|Bubble Study"],
      ["Stress Echo", "Exercise Stress|Dobutamine Stress"],
      ["Trans-Esophageal (TEE)", "Standard Protocol"],
    ]),
    ...views("Nuclear Medicine", [
      ["Bone Scan", "Whole Body|3-Phase|SPECT/CT"],
      ["Thyroid Scan", "Technetium-99m|Iodine I-131"],
      ["PET-CT", "Whole Body FDG|Brain FDG|Cardiac Viability"],
      ["Renal Scan", "MAG3 (Dynamic)|DMSA (Static)"],
      ["Hepatobiliary", "HIDA Scan|Cholecystokinin (CCK) HIDA"],
      ["Ventilation/Perfusion (V/Q)", "Standard Protocol"],
    ]),
    ...views("Fluoroscopy", [
      ["Oesophagus", "Barium Swallow"],
      ["Stomach", "Barium Meal|Upper GI Series"],
      ["Colon", "Barium Enema|Water-Soluble Enema"],
      ["Uterus/Tubes", "HSG (Hysterosalpingogram)"],
      ["Bladder", "VCUG (Voiding Cystourethrogram)|Cystogram"],
      ["Bile Ducts", "ERCP|T-Tube Cholangiogram"],
    ]),
  ],
  Vaccine: split("BCG|Hepatitis B|OPV|DTP|MMR|Varicella|PCV13 (Pneumococcal)|HPV|Td|Influenza|COVID-19|Typhoid|Hepatitis A|Rabies (Pre-exposure)|Meningococcal"),
};

// [{ type, services: [{ id, name, base }] }] — order shown on Service Prices
const SERVICE_GROUPS = Object.entries(SERVICE_LISTS).map(([type, names]) => ({
  type,
  services: names.map((name, i) => ({ id: `${type}-${i}`, name, base: 0 })),
}));

const defaultRules = () => Object.fromEntries(SERVICE_TYPES.map((t) => [t, { mode: "%", amount: "" }]));

/* ── insurances ── */
let cid = 0;
// c(name, mrn, visitDate, services, claimDate, total, paid, tax)
const c = (name, mrn, visit, services, claimDate, total, paid, tax = 0) => ({ id: ++cid, name, mrn, visit, services, claimDate, total, paid, tax });

// both insurances show the same 6 claims in the screenshots
const demoClaims = () => [
  c("Ahmed Khan", "MR-10123", "17-Sept-2026", "General Consultation, CBC", "19-Sept-2026", 950, 0),
  c("Sana Malik", "MR-10456", "22-Sept-2026", "Specialist Consultation, X-Ray Chest", "24-Sept-2026", 2100, 1000),
  c("Usman Ali", "MR-10789", "27-Sept-2026", "Echocardiogram", "29-Sept-2026", 3500, 0),
  c("Fatima Hassan", "MR-11001", "07-Sept-2026", "Blood Glucose (Fasting), Liver Function Test", "09-Sept-2026", 1000, 1000, 50),
  c("Bilal Ahmed", "MR-11234", "02-Oct-2026", "Follow-up Consultation", "04-Oct-2026", 300, 0),
  c("Nadia Rehan", "MR-11450", "30-Sept-2026", "Specialist Consultation, Echocardiogram", "02-Oct-2026", 4700, 2000),
];

const PRICING_MODES = ["Use Base Price", "Use Adjusted Price"];

const INSURANCES = [
  {
    id: 1, code: "C2", name: "Sui Northern Gas (SNGPL)", email: "welfare@sngpl.com.pk",
    person: "Nadia Baig", phone: "0321-9876543", mou: "SNGPL_MOU_2024.pdf",
    creditEnabled: true, creditLimit: 750000, newPricing: "Use Adjusted Price",
    ledger: [
      { id: 1, date: "15-Sept-2024", type: "Advance", amount: 100000, tax: 0, ref: "ADV-C2-001", remarks: "Annual advance Q4" },
      { id: 2, date: "20-Oct-2024", type: "Claim Debit", amount: 67500, tax: 0, ref: "CLM-C2-001", remarks: "Invoice batch Oct (8 patients)" },
      { id: 3, date: "20-Oct-2024", type: "Tax Credit", amount: 4725, tax: 4725, ref: "CLM-C2-001", remarks: "WHT 7% on CLM-C2-001" },
    ],
    claims: demoClaims(),
    rules: defaultRules(), overrides: {},
  },
  {
    id: 2, code: "C3", name: "Packages Limited", email: "hr@packages.com.pk",
    person: "Sana Tariq", phone: "0301-4567890", mou: "",
    creditEnabled: false, creditLimit: 0, newPricing: "Use Base Price",
    ledger: [],
    claims: demoClaims(),
    rules: defaultRules(), overrides: {},
  },
];

export {
  rs, fmtDate, todayIso, pendingOf, statusOf, ledgerView, defaultRules,
  SERVICE_TYPES, SERVICE_GROUPS, PRICING_MODES, INSURANCES,
};