// ── helpers to build the long service lists without repeating fields ──
const W = "Without Contrast";
const WC = "With Contrast";
const WW = "With & Without Contrast";

// [modality, [[region, [views...]], ...]] → "Modality - Region - View"
const expand = (groups) =>
  groups.flatMap(([modality, regions]) =>
    regions.flatMap(([region, views]) => views.map((v) => `${modality} - ${region} - ${v}`)));

// [generic, [brands...]] → "Brand (Generic)"
const drugs = (groups) => groups.flatMap(([generic, brands]) => brands.map((b) => `${b} (${generic})`));

const LAB = [
  "Complete Blood Count (CBC)", "ESR", "Peripheral Blood Film", "Reticulocyte Count", "Coagulation Profile (PT/APTT)",
  "Fasting Blood Sugar", "HbA1c", "Lipid Profile", "Liver Function Tests", "Kidney Function Tests", "Uric Acid",
  "Culture & Sensitivity (Urine)", "Culture & Sensitivity (Sputum)", "Mantoux / TB Screen", "Urine R/E", "Urine C/S",
  "24-hr Urine Protein", "TSH", "T3 / T4", "FSH / LH", "Testosterone", "Cortisol (morning)",
];

const PROCEDURE = [
  "Spirometry", "Nebulisation", "Peak Flow Measurement", "Skin Testing", "Wound Dressing (Simple)", "Wound Debridement",
  "Suture Removal", "Incision & Drainage", "Lipoma Excision", "Nail Avulsion", "Catheterisation", "Bladder Irrigation",
];

const FORMULARY = drugs([
  ["Paracetamol", ["Panadol 500mg", "Panadol 250mg", "Tylenol 500mg", "Calpol 120mg/5ml (Syrup)"]],
  ["Tramadol", ["Tramal 50mg", "Tramal 100mg", "Ultram 50mg"]],
  ["Ibuprofen", ["Brufen 200mg", "Brufen 400mg", "Advil 200mg", "Nurofen 400mg"]],
  ["Diclofenac", ["Voltaren 25mg", "Voltaren 50mg", "Cataflam 50mg"]],
  ["Aspirin (ASA)", ["Disprin 300mg", "Ecotrin 75mg (EC)", "Ecotrin 325mg (EC)"]],
  ["Amoxicillin", ["Amoxil 250mg", "Amoxil 500mg", "Trimox 500mg"]],
  ["Amoxicillin + Clavulanate", ["Augmentin 375mg", "Augmentin 625mg", "Augmentin 1g/200ml (IV)"]],
  ["Azithromycin", ["Zithromax 250mg", "Zithromax 500mg", "Azithral 500mg"]],
  ["Ciprofloxacin", ["Cipro 250mg", "Cipro 500mg", "Ciflox 500mg"]],
  ["Metronidazole", ["Flagyl 200mg", "Flagyl 400mg", "Flagyl 500mg/100ml (IV)"]],
  ["Doxycycline", ["Vibramycin 100mg", "Doxylin 100mg"]],
  ["Metformin", ["Glucophage 500mg", "Glucophage 850mg", "Glucophage 1000mg", "Glucophage XR 500mg (SR)"]],
  ["Glibenclamide (Glyburide)", ["Daonil 2.5mg", "Daonil 5mg"]],
  ["Amlodipine", ["Norvasc 5mg", "Norvasc 10mg", "Amlor 5mg"]],
  ["Atorvastatin", ["Lipitor 10mg", "Lipitor 20mg", "Lipitor 40mg", "Sortis 20mg"]],
  ["Metoprolol", ["Lopressor 25mg", "Lopressor 50mg", "Betaloc 100mg"]],
  ["Lisinopril", ["Zestril 5mg", "Zestril 10mg", "Zestril 20mg"]],
  ["Furosemide", ["Lasix 20mg", "Lasix 40mg", "Lasix 80mg"]],
  ["Salbutamol (Albuterol)", ["Ventolin 2mg", "Ventolin 4mg", "Ventolin Inhaler 100mcg/dose"]],
  ["Prednisolone", ["Prelone 5mg", "Prelone 25mg", "Deltacortril 5mg"]],
  ["Cetirizine", ["Zyrtec 5mg", "Zyrtec 10mg", "Reactine 10mg"]],
  ["Omeprazole", ["Losec 20mg", "Losec 40mg", "Prilosec 20mg"]],
  ["Pantoprazole", ["Protonix 20mg", "Protonix 40mg", "Pantoloc 40mg"]],
  ["Ondansetron", ["Zofran 4mg", "Zofran 8mg", "Onday 4mg"]],
]);

const CONSUMABLES = [
  "Gauze Swabs 4×4", "Cotton Roll", "Adhesive Tape (2.5cm)", "Suture Material (Vicryl 2-0)", "Suture Material (Nylon 3-0)",
  "5ml Syringe", "10ml Syringe", "20ml Syringe", "Needle 18G", "Needle 22G", "IV Cannula 18G", "IV Cannula 20G",
  "Examination Gloves Small", "Examination Gloves Medium", "Examination Gloves Large", "Surgical Mask", "N95 Respirator",
  "Face Shield", "IV Administration Set", "Blood Transfusion Set", "Scalp Vein Set (21G)", "3-Way Stopcock",
  "Non-Adherent Dressing", "Transparent Film Dressing", "Hydrocolloid Dressing", "Blood Collection Tube (EDTA)",
  "Blood Collection Tube (Plain)", "Urine Collection Cup", "Lancets", "Tongue Depressor",
];

const IMAGING = expand([
  ["X-Ray", [
    ["Chest", ["Single View", "AP Portable", "PA View", "PA & Lateral (2 Views)", "3 Views", "Decubitus", "Rib Series"]],
    ["Abdomen", ["Supine", "Erect", "Supine & Erect"]],
    ["Cervical Spine", ["AP & Lateral", "Flexion & Extension", "3 Views", "4 Views"]],
    ["Lumbar Spine", ["AP & Lateral", "Flexion & Extension", "3 Views", "4 Views"]],
    ["Thoracic Spine", ["AP & Lateral", "3 Views"]],
    ["Pelvis", ["AP View", "AP & Lateral"]],
    ["Knee", ["AP & Lateral", "Sunrise View", "3 Views", "Weight Bearing"]],
    ["Shoulder", ["AP View", "Y-View", "AP & Axillary (2 Views)"]],
    ["Wrist", ["AP & Lateral", "3 Views"]],
    ["Hand", ["AP & Oblique", "3 Views"]],
    ["Ankle", ["AP & Lateral", "3 Views"]],
    ["Foot", ["AP & Lateral", "3 Views", "Weight Bearing"]],
    ["Hip", ["AP View", "AP & Lateral"]],
    ["Elbow", ["AP & Lateral", "3 Views"]],
    ["Forearm", ["AP & Lateral"]],
    ["Tibia/Fibula", ["AP & Lateral"]],
    ["Skull", ["AP & Lateral", "Towne's View", "3 Views"]],
    ["Facial Bones", ["Standard Views", "Waters View"]],
    ["Sinuses", ["Waters View", "Paranasal Sinus Series"]],
  ]],
  ["CT", [
    ["Head/Brain", [W, WC, WW]],
    ["Chest", [W, WC, "Pulmonary Angiography (CTPA)", "High Resolution (HRCT)"]],
    ["Abdomen", [W, WC, WW]],
    ["Pelvis", [W, WC, WW]],
    ["Abdomen & Pelvis", [W, WC, WW, "Triple Phase"]],
    ["Spine (Cervical)", [W, WC]],
    ["Spine (Lumbar)", [W, WC]],
    ["Spine (Thoracic)", [W, WC]],
    ["Coronary", ["CT Coronary Angiography (CTCA)", "Calcium Score"]],
    ["Peripheral Angiography", ["Standard Protocol"]],
    ["KUB / Urogram", ["Non-Contrast (NCCT KUB)", "With Contrast (IVU)"]],
    ["Neck/Soft Tissue", [W, WC]],
    ["Sinuses", [W]],
    ["Orbits", [W, WC]],
  ]],
  ["MRI", [
    ["Brain", [W, WC, WW, "Spectroscopy", "Diffusion (DWI)"]],
    ["Spine (Cervical)", [W, WC]],
    ["Spine (Lumbar)", [W, WC]],
    ["Spine (Thoracic)", [W, WC]],
    ["Knee", [W]],
    ["Shoulder", [W, "With Contrast (Arthrogram)"]],
    ["Hip", [W, WC]],
    ["Wrist", [W]],
    ["Ankle/Foot", [W]],
    ["Abdomen", [W, WC, WW]],
    ["Pelvis", [W, WC]],
    ["Prostate", ["Multi-parametric (mpMRI)"]],
    ["Breast", ["Bilateral With Contrast"]],
    ["Cardiac (CMR)", ["Standard Protocol", "Stress Protocol", "Viability Protocol"]],
    ["Whole Body", [W]],
    ["MRCP", ["Standard Protocol"]],
  ]],
  ["Ultrasound", [
    ["Abdomen", ["Complete", "Limited", "Focused"]],
    ["Pelvis", ["Transabdominal", "Transvaginal (TVS)"]],
    ["Thyroid & Neck", ["Standard"]],
    ["Renal", ["Bilateral Kidneys", "Single Kidney", "KUB"]],
    ["Testicular/Scrotal", ["Standard with Doppler"]],
    ["Breast", ["Bilateral", "Unilateral Right", "Unilateral Left"]],
    ["Doppler – Carotid", ["Bilateral Carotid Doppler"]],
    ["Doppler – Lower Limb Veins", ["Bilateral DVT Screen", "Unilateral Right", "Unilateral Left"]],
    ["Doppler – Lower Limb Arteries", ["Bilateral", "Unilateral Right", "Unilateral Left"]],
    ["Doppler – Upper Limb Veins", ["Bilateral", "Unilateral"]],
    ["Obstetric (Dating)", ["Standard Dating Scan"]],
    ["Obstetric (Anatomy)", ["Detailed Anomaly Scan (18–22 weeks)"]],
    ["Shoulder", ["Standard"]],
    ["Soft Tissue / Mass", ["Standard"]],
    ["Guided Procedure", ["Aspiration", "Biopsy", "Drainage"]],
  ]],
  ["Mammography", [
    ["Bilateral", ["Standard Screening (2 Views Each)", "Diagnostic", "Tomosynthesis (3D)"]],
    ["Unilateral Right", ["Standard", "Diagnostic", "Tomosynthesis (3D)"]],
    ["Unilateral Left", ["Standard", "Diagnostic", "Tomosynthesis (3D)"]],
  ]],
  ["Echocardiography", [
    ["Transthoracic (TTE)", ["2D Echo with Doppler", "M-Mode", "Bubble Study"]],
    ["Stress Echo", ["Exercise Stress", "Dobutamine Stress"]],
    ["Trans-Esophageal (TEE)", ["Standard Protocol"]],
  ]],
  ["Nuclear Medicine", [
    ["Bone Scan", ["Whole Body", "3-Phase", "SPECT/CT"]],
    ["Thyroid Scan", ["Technetium-99m", "Iodine I-131"]],
    ["PET-CT", ["Whole Body FDG", "Brain FDG", "Cardiac Viability"]],
    ["Renal Scan", ["MAG3 (Dynamic)", "DMSA (Static)"]],
    ["Hepatobiliary", ["HIDA Scan", "Cholecystokinin (CCK) HIDA"]],
    ["Ventilation/Perfusion (V/Q)", ["Standard Protocol"]],
  ]],
  ["Fluoroscopy", [
    ["Oesophagus", ["Barium Swallow"]],
    ["Stomach", ["Barium Meal", "Upper GI Series"]],
    ["Colon", ["Barium Enema", "Water-Soluble Enema"]],
    ["Uterus/Tubes", ["HSG (Hysterosalpingogram)"]],
    ["Bladder", ["VCUG (Voiding Cystourethrogram)", "Cystogram"]],
    ["Bile Ducts", ["ERCP", "T-Tube Cholangiogram"]],
  ]],
]);

const VACCINE = [
  "BCG", "Hepatitis B", "OPV", "DTP", "MMR", "Varicella", "PCV13 (Pneumococcal)", "HPV", "Td", "Influenza",
  "COVID-19", "Typhoid", "Hepatitis A", "Rabies (Pre-exposure)", "Meningococcal",
];

const BY_TYPE = { Lab: LAB, Procedure: PROCEDURE, Formulary: FORMULARY, Consumables: CONSUMABLES, Imaging: IMAGING, Vaccine: VACCINE };

const SERVICES = Object.entries(BY_TYPE).flatMap(([type, names]) =>
  names.map((name, i) => ({
    id: `${type}-${i + 1}`, name, type, dept: "", sub: "", taxable: false, active: true, created: "Jan 1, 2024",
  })));

// tabs: "all" + "consult" + one per service type (provider columns per type)
const TABS = [
  { key: "all", label: "All" },
  { key: "consult", label: "Consult Fees" },
  { key: "Lab", label: "Lab", providers: ["Hashmani Laboratories", "Chughtai Lab"] },
  { key: "Procedure", label: "Procedure", providers: ["In-Clinic (Main)", "Surgical Associates"] },
  { key: "Formulary", label: "Formulary", providers: ["In-House Dispensary", "Al-Shifa Pharmacy"] },
  { key: "Consumables", label: "Consumables", providers: ["Central Store", "MedSupply Co."] },
  { key: "Imaging", label: "Imaging", providers: ["In-House Radiology", "City Diagnostics Centre"] },
  { key: "Vaccine", label: "Vaccine", providers: ["In-Clinic Vaccination Centre", "National Immunization Program"] },
];

const DESCRIPTIONS = {
  all: "Manage all billable services. Switch to a service type tab to configure provider prices.",
  consult: "Auto-generated from doctor profiles. Configure amounts in Doctor Fees & Shares.",
  type: "Compare provider prices side-by-side. Click any price cell to edit inline.",
};

// read-only consult fees (from Doctor Fees & Shares)
const CONSULT_FEES = [
  { id: "emily", name: "Dr. Emily Wong", initials: "EW", rows: [
    { dept: "Cardiology", sub: "Outpatient", type: "Consultation", fee: 2000, share: "70%" },
    { dept: "Cardiology", sub: "Outpatient", type: "Follow-up", fee: 1000, share: "70%" },
    { dept: "Orthopedics", sub: "Outpatient", type: "Consultation", fee: 2500, share: "Rs. 65", fixed: true },
    { dept: "Orthopedics", sub: "Outpatient", type: "Follow-up", fee: 1200, share: "65%" },
  ] },
  { id: "james", name: "Dr. James Wilson", initials: "JW", rows: [
    { dept: "Orthopedics", sub: "Outpatient", type: "Consultation", fee: 3000, share: "70%" },
  ] },
  { id: "sarah", name: "Dr. Sarah Connor", initials: "SC", rows: [
    { dept: "Neurology", sub: "Outpatient", type: "Consultation", fee: 2500, share: "65%" },
    { dept: "Neurology", sub: "Outpatient", type: "Follow-up", fee: 1200, share: "65%" },
    { dept: "Neurology", sub: "Outpatient", type: "Tele-consultation", fee: 1500, share: "65%" },
  ] },
  { id: "asif", name: "Dr. Asif Imam", initials: "AI", rows: [
    { dept: "Immunology", sub: "Outpatient", type: "Consultation", fee: 2500, share: "70%" },
    { dept: "Immunology", sub: "Outpatient", type: "Follow-up", fee: 1200, share: "70%" },
    { dept: "Immunology", sub: "Outpatient", type: "Tele-consultation", fee: 1800, share: "70%" },
  ] },
];

// edit modal department → sub-department options
const DEPARTMENTS = {
  Cardiology: ["Outpatient", "Inpatient"],
  Orthopedics: ["Outpatient", "Inpatient"],
  Neurology: ["Outpatient", "Inpatient"],
  Immunology: ["Outpatient", "Inpatient"],
};

export { SERVICES, TABS, DESCRIPTIONS, CONSULT_FEES, DEPARTMENTS };