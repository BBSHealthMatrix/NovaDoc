const FEE_TYPES = [
  { key: "consult", label: "Consultation", short: "Consult" },
  { key: "follow", label: "Follow-up", short: "Follow-up" },
  { key: "emergency", label: "Emergency", short: "Emergency", tag: "Emergency" },
  { key: "tele", label: "Tele-Consult", short: "Tele", tag: "Tele" },
];

const fees = (f, s) => ({
  consult: { fee: f[0], mode: "%", share: s[0] },
  follow: { fee: f[1], mode: "%", share: s[1] },
  emergency: { fee: f[2], mode: "%", share: s[2] },
  tele: { fee: f[3], mode: "%", share: s[3] },
});

const mkRow = (id, shareVal = "") => ({
  id, useBase: true, adjusted: "", shareType: "%", shareVal, sel: false,
});

const DOCTORS = [
  {
    id: 1, name: "Dr. Emily Wong", status: "active", shift: "Morning shift",
    depts: {
      Cardiology: fees([2000, 1000, 3000, 1500], [70, 70, 60, 70]),
      Orthopedics: fees([2500, 1200, 3500, 1800], [65, 65, 55, 65]),
    },
    services: [
      "Echocardiography - Transthoracic (TTE) - 2D Echo with Doppler",
      "X-Ray - Chest - PA View",
      "X-Ray - Knee - AP & Lateral",
      "MRI - Knee - Without Contrast",
    ],
  },
  {
    id: 2, name: "Dr. James Wilson", status: "active", shift: "Afternoon shift",
    depts: { Orthopedics: fees([2500, 1200, 3500, 1800], [65, 65, 55, 65]) },
    services: [
      "X-Ray - Knee - AP & Lateral",
      "X-Ray - Shoulder - AP View",
      "MRI - Knee - Without Contrast",
      "MRI - Shoulder - Without Contrast",
    ],
  },
  {
    id: 3, name: "Dr. Sarah Connor", status: "inactive", shift: "Morning shift",
    depts: { Neurology: fees([3000, 1500, 4000, 2000], [70, 70, 60, 70]) },
    services: [
      "CT - Head/Brain - Without Contrast",
      "MRI - Brain - Without Contrast",
      "MRI - Brain - With Contrast",
      "MRI - Spine (Cervical) - Without Contrast",
    ],
  },
  {
    id: 4, name: "Dr. Asif Imam", status: "active", shift: "Morning shift",
    depts: { Immunology: fees([2000, 1000, 3000, 1500], [70, 70, 60, 70]) },
    services: ["Skin Testing"],
  },
];

const initials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const num = (v) => Number(v) || 0;

const r1 = (v) => Math.round(v * 10) / 10;

const TYPE_OPTS = ["Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"]
  .map((t) => ({ v: t, label: t }));

const xp = (pre, arr) => arr.map((a) => `${pre} - ${a}`);

const rx = (drug, arr) => arr.map((b) => `${b} (${drug})`);

const WO = ["Without Contrast"];

const WW2 = ["Without Contrast", "With Contrast"];

const WW3 = ["Without Contrast", "With Contrast", "With & Without Contrast"];

const CATALOG = {
  Lab: [
    "Complete Blood Count (CBC)", "ESR", "Peripheral Blood Film", "Reticulocyte Count",
    "Coagulation Profile (PT/APTT)", "Fasting Blood Sugar", "HbA1c", "Lipid Profile",
    "Liver Function Tests", "Kidney Function Tests", "Uric Acid",
    "Culture & Sensitivity (Urine)", "Culture & Sensitivity (Sputum)", "Mantoux / TB Screen",
    "Urine R/E", "Urine C/S", "24-hr Urine Protein", "TSH", "T3 / T4", "FSH / LH",
    "Testosterone", "Cortisol (morning)",
  ],
  Procedure: [
    "Spirometry", "Nebulisation", "Peak Flow Measurement", "Skin Testing",
    "Wound Dressing (Simple)", "Wound Debridement", "Suture Removal", "Incision & Drainage",
    "Lipoma Excision", "Nail Avulsion", "Catheterisation", "Bladder Irrigation",
  ],
  Formulary: [
    rx("Paracetamol", ["Panadol 500mg", "Panadol 250mg", "Tylenol 500mg", "Calpol 120mg/5ml (Syrup)"]),
    rx("Tramadol", ["Tramal 50mg", "Tramal 100mg", "Ultram 50mg"]),
    rx("Ibuprofen", ["Brufen 200mg", "Brufen 400mg", "Advil 200mg", "Nurofen 400mg"]),
    rx("Diclofenac", ["Voltaren 25mg", "Voltaren 50mg", "Cataflam 50mg"]),
    rx("Aspirin (ASA)", ["Disprin 300mg", "Ecotrin 75mg (EC)", "Ecotrin 325mg (EC)"]),
    rx("Amoxicillin", ["Amoxil 250mg", "Amoxil 500mg", "Trimox 500mg"]),
    rx("Amoxicillin + Clavulanate", ["Augmentin 375mg", "Augmentin 625mg", "Augmentin 1g/200ml (IV)"]),
    rx("Azithromycin", ["Zithromax 250mg", "Zithromax 500mg", "Azithral 500mg"]),
    rx("Ciprofloxacin", ["Cipro 250mg", "Cipro 500mg", "Ciflox 500mg"]),
    rx("Metronidazole", ["Flagyl 200mg", "Flagyl 400mg", "Flagyl 500mg/100ml (IV)"]),
    rx("Doxycycline", ["Vibramycin 100mg", "Doxylin 100mg"]),
    rx("Metformin", ["Glucophage 500mg", "Glucophage 850mg", "Glucophage 1000mg", "Glucophage XR 500mg (SR)"]),
    rx("Glibenclamide (Glyburide)", ["Daonil 2.5mg", "Daonil 5mg"]),
    rx("Amlodipine", ["Norvasc 5mg", "Norvasc 10mg", "Amlor 5mg"]),
    rx("Atorvastatin", ["Lipitor 10mg", "Lipitor 20mg", "Lipitor 40mg", "Sortis 20mg"]),
    rx("Metoprolol", ["Lopressor 25mg", "Lopressor 50mg", "Betaloc 100mg"]),
    rx("Lisinopril", ["Zestril 5mg", "Zestril 10mg", "Zestril 20mg"]),
    rx("Furosemide", ["Lasix 20mg", "Lasix 40mg", "Lasix 80mg"]),
    rx("Salbutamol (Albuterol)", ["Ventolin 2mg", "Ventolin 4mg", "Ventolin Inhaler 100mcg/dose"]),
    rx("Prednisolone", ["Prelone 5mg", "Prelone 25mg", "Deltacortril 5mg"]),
    rx("Cetirizine", ["Zyrtec 5mg", "Zyrtec 10mg", "Reactine 10mg"]),
    rx("Omeprazole", ["Losec 20mg", "Losec 40mg", "Prilosec 20mg"]),
    rx("Pantoprazole", ["Protonix 20mg", "Protonix 40mg", "Pantoloc 40mg"]),
    rx("Ondansetron", ["Zofran 4mg", "Zofran 8mg", "Onday 4mg"]),
  ].flat(),
  Consumables: [
    "Gauze Swabs 4x4", "Cotton Roll", "Adhesive Tape (2.5cm)", "Suture Material (Vicryl 2-0)",
    "Suture Material (Nylon 3-0)", "5ml Syringe", "10ml Syringe", "20ml Syringe",
    "Needle 18G", "Needle 22G", "IV Cannula 18G", "IV Cannula 20G",
    "Examination Gloves Small", "Examination Gloves Medium", "Examination Gloves Large",
    "Surgical Mask", "N95 Respirator", "Face Shield", "IV Administration Set",
    "Blood Transfusion Set", "Scalp Vein Set (21G)", "3-Way Stopcock", "Non-Adherent Dressing",
    "Transparent Film Dressing", "Hydrocolloid Dressing", "Blood Collection Tube (EDTA)",
    "Blood Collection Tube (Plain)", "Urine Collection Cup", "Lancets", "Tongue Depressor",
  ],
  Imaging: [
    xp("X-Ray - Chest", ["Single View", "AP Portable", "PA View", "PA & Lateral (2 Views)", "3 Views", "Decubitus", "Rib Series"]),
    xp("X-Ray - Abdomen", ["Supine", "Erect", "Supine & Erect"]),
    xp("X-Ray - Cervical Spine", ["AP & Lateral", "Flexion & Extension", "3 Views", "4 Views"]),
    xp("X-Ray - Lumbar Spine", ["AP & Lateral", "Flexion & Extension", "3 Views", "4 Views"]),
    xp("X-Ray - Thoracic Spine", ["AP & Lateral", "3 Views"]),
    xp("X-Ray - Pelvis", ["AP View", "AP & Lateral"]),
    xp("X-Ray - Knee", ["AP & Lateral", "Sunrise View", "3 Views", "Weight Bearing"]),
    xp("X-Ray - Shoulder", ["AP View", "Y-View", "AP & Axillary (2 Views)"]),
    xp("X-Ray - Wrist", ["AP & Lateral", "3 Views"]),
    xp("X-Ray - Hand", ["AP & Oblique", "3 Views"]),
    xp("X-Ray - Ankle", ["AP & Lateral", "3 Views"]),
    xp("X-Ray - Foot", ["AP & Lateral", "3 Views", "Weight Bearing"]),
    xp("X-Ray - Hip", ["AP View", "AP & Lateral"]),
    xp("X-Ray - Elbow", ["AP & Lateral", "3 Views"]),
    xp("X-Ray - Forearm", ["AP & Lateral"]),
    xp("X-Ray - Tibia/Fibula", ["AP & Lateral"]),
    xp("X-Ray - Skull", ["AP & Lateral", "Towne's View", "3 Views"]),
    xp("X-Ray - Facial Bones", ["Standard Views", "Waters View"]),
    xp("X-Ray - Sinuses", ["Waters View", "Paranasal Sinus Series"]),
    xp("CT - Head/Brain", WW3),
    xp("CT - Chest", [...WW2, "Pulmonary Angiography (CTPA)", "High Resolution (HRCT)"]),
    xp("CT - Abdomen", WW3),
    xp("CT - Pelvis", WW3),
    xp("CT - Abdomen & Pelvis", [...WW3, "Triple Phase"]),
    xp("CT - Spine (Cervical)", WW2),
    xp("CT - Spine (Lumbar)", WW2),
    xp("CT - Spine (Thoracic)", WW2),
    xp("CT - Coronary", ["CT Coronary Angiography (CTCA)", "Calcium Score"]),
    xp("CT - Peripheral Angiography", ["Standard Protocol"]),
    xp("CT - KUB / Urogram", ["Non-Contrast (NCCT KUB)", "With Contrast (IVU)"]),
    xp("CT - Neck/Soft Tissue", WW2),
    xp("CT - Sinuses", WO),
    xp("CT - Orbits", WW2),
    xp("MRI - Brain", [...WW3, "Spectroscopy", "Diffusion (DWI)"]),
    xp("MRI - Spine (Cervical)", WW2),
    xp("MRI - Spine (Lumbar)", WW2),
    xp("MRI - Spine (Thoracic)", WW2),
    xp("MRI - Knee", WO),
    xp("MRI - Shoulder", ["Without Contrast", "With Contrast (Arthrogram)"]),
    xp("MRI - Hip", WW2),
    xp("MRI - Wrist", WO),
    xp("MRI - Ankle/Foot", WO),
    xp("MRI - Abdomen", WW3),
    xp("MRI - Pelvis", WW2),
    xp("MRI - Prostate", ["Multi-parametric (mpMRI)"]),
    xp("MRI - Breast", ["Bilateral With Contrast"]),
    xp("MRI - Cardiac (CMR)", ["Standard Protocol", "Stress Protocol", "Viability Protocol"]),
    xp("MRI - Whole Body", WO),
    xp("MRI - MRCP", ["Standard Protocol"]),
    xp("Ultrasound - Abdomen", ["Complete", "Limited", "Focused"]),
    xp("Ultrasound - Pelvis", ["Transabdominal", "Transvaginal (TVS)"]),
    xp("Ultrasound - Thyroid & Neck", ["Standard"]),
    xp("Ultrasound - Renal", ["Bilateral Kidneys", "Single Kidney", "KUB"]),
    xp("Ultrasound - Testicular/Scrotal", ["Standard with Doppler"]),
    xp("Ultrasound - Breast", ["Bilateral", "Unilateral Right", "Unilateral Left"]),
    xp("Ultrasound - Doppler – Carotid", ["Bilateral Carotid Doppler"]),
    xp("Ultrasound - Doppler – Lower Limb Veins", ["Bilateral DVT Screen", "Unilateral Right", "Unilateral Left"]),
    xp("Ultrasound - Doppler – Lower Limb Arteries", ["Bilateral", "Unilateral Right", "Unilateral Left"]),
    xp("Ultrasound - Doppler – Upper Limb Veins", ["Bilateral", "Unilateral"]),
    xp("Ultrasound - Obstetric (Dating)", ["Standard Dating Scan"]),
    xp("Ultrasound - Obstetric (Anatomy)", ["Detailed Anomaly Scan (18–22 weeks)"]),
    xp("Ultrasound - Shoulder", ["Standard"]),
    xp("Ultrasound - Soft Tissue / Mass", ["Standard"]),
    xp("Ultrasound - Guided Procedure", ["Aspiration", "Biopsy", "Drainage"]),
    xp("Mammography - Bilateral", ["Standard Screening (2 Views Each)", "Diagnostic", "Tomosynthesis (3D)"]),
    xp("Mammography - Unilateral Right", ["Standard", "Diagnostic", "Tomosynthesis (3D)"]),
    xp("Mammography - Unilateral Left", ["Standard", "Diagnostic", "Tomosynthesis (3D)"]),
    xp("Echocardiography - Transthoracic (TTE)", ["2D Echo with Doppler", "M-Mode", "Bubble Study"]),
    xp("Echocardiography - Stress Echo", ["Exercise Stress", "Dobutamine Stress"]),
    xp("Echocardiography - Trans-Esophageal (TEE)", ["Standard Protocol"]),
    xp("Nuclear Medicine - Bone Scan", ["Whole Body", "3-Phase", "SPECT/CT"]),
    xp("Nuclear Medicine - Thyroid Scan", ["Technetium-99m", "Iodine I-131"]),
    xp("Nuclear Medicine - PET-CT", ["Whole Body FDG", "Brain FDG", "Cardiac Viability"]),
    xp("Nuclear Medicine - Renal Scan", ["MAG3 (Dynamic)", "DMSA (Static)"]),
    xp("Nuclear Medicine - Hepatobiliary", ["HIDA Scan", "Cholecystokinin (CCK) HIDA"]),
    xp("Nuclear Medicine - Ventilation/Perfusion (V/Q)", ["Standard Protocol"]),
    xp("Fluoroscopy - Oesophagus", ["Barium Swallow"]),
    xp("Fluoroscopy - Stomach", ["Barium Meal", "Upper GI Series"]),
    xp("Fluoroscopy - Colon", ["Barium Enema", "Water-Soluble Enema"]),
    xp("Fluoroscopy - Uterus/Tubes", ["HSG (Hysterosalpingogram)"]),
    xp("Fluoroscopy - Bladder", ["VCUG (Voiding Cystourethrogram)", "Cystogram"]),
    xp("Fluoroscopy - Bile Ducts", ["ERCP", "T-Tube Cholangiogram"]),
  ].flat(),
  Vaccine: [
    "BCG", "Hepatitis B", "OPV", "DTP", "MMR", "Varicella", "PCV13 (Pneumococcal)", "HPV",
    "Td", "Influenza", "COVID-19", "Typhoid", "Hepatitis A", "Rabies (Pre-exposure)", "Meningococcal",
  ],
};

const SERVICES = Object.entries(CATALOG).flatMap(([type, names]) =>
  names.map((name) => ({ id: name, name, type, price: 0 }))
);

const SVC_MAP = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

export { FEE_TYPES, mkRow, DOCTORS, initials, num, r1, SERVICES, SVC_MAP, TYPE_OPTS };
