const SPECIALTIES = [
  "General / All", "Internal Medicine", "Cardiology", "Pulmonology", "Gastroenterology", "Neurology",
  "Orthopaedics", "Paediatrics", "Gynaecology", "ENT", "Ophthalmology", "Dermatology", "Psychiatry",
];

let n = 0;
const uid = () => `pe${++n}`;

// finding: label, normal text, abnormal options
const f = (label, normal = "Normal", opts = []) => ({ id: uid(), label, normal, opts });
const sec = (name, findings) => ({ id: uid(), name, findings });
const sys = (name, code, sections) => ({ id: uid(), name, code, on: true, sections });

const SYSTEMS = [
  sys("General", "GEN", [
    sec("General Appearance", [
      f("Level of alertness / distress", "Normal", ["Drowsy / obtunded", "Acute distress", "Confused / disoriented"]),
      f("Build & nutritional status"),
      f("Hygiene & grooming"),
    ]),
    sec("Vital Signs", [
      f("Blood Pressure (mmHg)", "Normal", ["Hypertensive (>140/90 mmHg)", "Hypotensive (<90/60 mmHg)", "Stage 2 HTN (>160/100 mmHg)"]),
      f("Heart Rate (bpm)", "Normal", ["Tachycardia (>100 bpm)", "Bradycardia (<60 bpm)", "Irregular rate"]),
      f("Respiratory Rate (/min)", "Normal", ["Tachypnoea (>20/min)", "Bradypnoea (<12/min)"]),
      f("Temperature (°C)"),
      f("SpO₂ (%)", "Normal", ["Hypoxic (<94%)", "Severely hypoxic (<88%)", "On supplemental O₂"]),
    ]),
    sec("Anthropometrics", [f("Weight (kg)"), f("Height (cm)"), f("BMI")]),
  ]),
  sys("HEENT", "HENT", [
    sec("Head", [f("Scalp & skull"), f("Facial symmetry")]),
    sec("Eyes", [f("Pupils", "PERRLA"), f("Conjunctiva"), f("Sclera")]),
    sec("Ears", [f("External ear"), f("Tympanic membrane")]),
    sec("Nose", [f("Nasal mucosa"), f("Septum", "Midline")]),
    sec("Throat", [f("Oropharynx"), f("Tonsils"), f("Dentition")]),
  ]),
  sys("Cardiovascular", "CVS", [
    sec("Inspection", [
      f("JVP", "Not raised", ["Raised JVP"]),
      f("Precordium", "Normal", ["Visible pulsation"]),
      f("Peripheral oedema", "Absent", ["Pitting oedema", "Non-pitting oedema"]),
    ]),
    sec("Palpation", [
      f("Apex beat", "Non-displaced", ["Displaced apex", "Heaving apex"]),
      f("Peripheral pulses", "Present & equal", ["Weak pulses", "Absent pulses"]),
      f("Thrills", "Absent", ["Thrill present"]),
    ]),
    sec("Auscultation", [
      f("Heart sounds", "S1 S2 normal", ["S3 present", "S4 present"]),
      f("Murmurs", "No murmurs", ["Systolic murmur", "Diastolic murmur"]),
      f("Rub", "Absent", ["Pericardial rub"]),
    ]),
    sec("Rhythm", [f("Rhythm", "Regular"), f("Capillary refill", "< 2 seconds")]),
  ]),
  sys("Respiratory", "RESP", [
    sec("Inspection", [
      f("Chest shape", "Normal", ["Barrel chest", "Pectus excavatum"]),
      f("Work of breathing", "Normal", ["Use of accessory muscles", "Intercostal recession"]),
    ]),
    sec("Palpation", [
      f("Chest expansion", "Symmetrical", ["Reduced expansion"]),
      f("Trachea", "Central", ["Deviated trachea"]),
    ]),
    sec("Percussion", [f("Percussion note", "Resonant", ["Dull", "Stony dull", "Hyper-resonant"])]),
    sec("Auscultation", [
      f("Breath sounds", "Vesicular", ["Reduced air entry"]),
      f("Added sounds", "None", ["Wheeze", "Crackles"]),
    ]),
  ]),
  sys("Gastrointestinal", "GIT", [
    sec("Inspection", [
      f("Abdominal contour (flat / distended / scaphoid)", "Flat / Scaphoid", ["Distended", "Gaseous distension", "Ascites"]),
      f("Soft / Non-tender"),
      f("Visible peristalsis / pulsations"),
      f("Scars / caput medusae / other"),
    ]),
    sec("Auscultation", [f("Bowel sounds (character)"), f("Bruits")]),
    sec("Palpation", [
      f("Tenderness (site / severity)", "Non-tender", ["Localised tenderness", "Generalised tenderness", "Tenderness with guarding"]),
      f("Guarding", "Absent", ["Voluntary guarding", "Involuntary guarding / rigidity"]),
      f("Rebound tenderness", "Absent", ["Rebound tenderness positive", "Peritonism present"]),
      f("Mass"),
      f("Liver (size / edge / tenderness)", "Not palpable", ["Hepatomegaly (2 cm below costal margin)", "Tender hepatomegaly", "Nodular liver edge"]),
      f("Spleen palpation"),
      f("Kidneys / other masses"),
      f("CVA tenderness — Right"),
      f("CVA tenderness — Left"),
    ]),
    sec("Percussion", [f("Percussion note", "Tympanic"), f("Shifting dullness", "Absent"), f("Liver span")]),
        sec("Other", [f("Hernia orifices"), f("PR examination (if applicable)")]),
  ]),
    sys("Genitourinary", "GUS", [
    sec("Bladder", [f("Suprapubic fullness / tenderness"), f("Bladder percussion")]),
    sec("Kidneys", [
      f("Renal angle (CVA) tenderness — Right"),
      f("Renal angle (CVA) tenderness — Left"),
      f("Ballotable kidneys"),
    ]),
    sec("External Genitalia", [f("External inspection (if applicable)"), f("Scrotal / penile / vulvar findings")]),
  ]),
  sys("Musculoskeletal", "MSK", [
    sec("Gait & Posture", [f("Gait"), f("Posture"), f("Spinal alignment")]),
    sec("Joints", [f("Swelling", "Absent"), f("Tenderness", "Non-tender"), f("Deformity", "Absent")]),
    sec("Range of Motion", [f("Upper limbs", "Full"), f("Lower limbs", "Full"), f("Spine", "Full")]),
    sec("Muscle Strength", [f("Upper limbs", "5/5"), f("Lower limbs", "5/5"), f("Grip strength")]),
  ]),
  
  sys("Neurological", "NEURO", [
    sec("Consciousness", [
      f("Level of consciousness (GCS)", "GCS 15/15"),
      f("Orientation", "Oriented ×3"),
    ]),
    sec("Cranial Nerves", [
      f("CN II — Visual acuity / fields", "Intact"),
      f("CN III, IV, VI — Eye movements", "Intact"),
      f("CN V — Facial sensation", "Intact"),
      f("CN VII — Facial movement", "Symmetrical"),
      f("CN VIII — Hearing", "Intact"),
      f("CN IX–XII — Palate, tongue, shoulder shrug", "Intact"),
    ]),
    sec("Motor", [
      f("Power", "5/5 all limbs", ["Weakness — upper limb", "Weakness — lower limb", "Hemiparesis"]),
      f("Tone", "Normal", ["Hypertonia / spasticity", "Hypotonia"]),
      f("Bulk & involuntary movements", "Normal", ["Muscle wasting", "Tremor"]),
    ]),
    sec("Sensory", [
      f("Light touch", "Intact"),
      f("Pain / pinprick", "Intact"),
      f("Vibration", "Intact"),
      f("Proprioception", "Intact"),
    ]),
    sec("Reflexes", [
      f("Deep tendon reflexes", "2+ symmetrical", ["Hyperreflexia", "Hyporeflexia / absent"]),
      f("Plantar response", "Flexor", ["Extensor (Babinski +)"]),
      f("Clonus", "Absent"),
    ]),
    sec("Cerebellar", [
      f("Finger–nose test", "Normal"),
      f("Heel–shin test", "Normal"),
      f("Rapid alternating movements", "Normal"),
      f("Romberg test", "Negative"),
    ]),
  ]),
  sys("Dermatology", "DERM", [
    sec("Skin", [
      f("Colour", "Normal", ["Pallor", "Jaundice", "Cyanosis"]),
      f("Turgor", "Normal", ["Reduced turgor"]),
      f("Temperature & moisture", "Warm & dry"),
    ]),
    sec("Lesions", [
      f("Rash", "None"),
      f("Lesion type / distribution", "None"),
      f("Wounds / ulcers", "None"),
    ]),
    sec("Nails & Hair", [
      f("Nails", "Normal"),
      f("Clubbing", "Absent"),
      f("Hair distribution", "Normal"),
    ]),
    sec("Mucous Membranes", [
      f("Oral mucosa", "Moist & pink"),
      f("Lips", "Normal"),
    ]),
  ]),
  sys("Psychiatric", "PSYC", [
    sec("Appearance & Behavior", [
      f("Appearance", "Well-groomed"),
      f("Behavior", "Cooperative"),
      f("Eye contact", "Appropriate"),
    ]),
    sec("Speech", [
      f("Rate & volume", "Normal"),
      f("Fluency & articulation", "Normal"),
    ]),
    sec("Mood & Affect", [
      f("Mood", "Euthymic"),
      f("Affect", "Congruent"),
      f("Affect range", "Full range"),
    ]),
    sec("Thought", [
      f("Thought process", "Linear"),
      f("Thought content"),
    ]),
    sec("Cognition & Insight", [
      f("Orientation", "Oriented ×3"),
      f("Memory", "Intact"),
      f("Insight", "Good"),
      f("Judgement", "Good"),
    ]),
  ]),
  sys("Endocrine", "ENDO", [
    sec("Thyroid", [
      f("Size", "Not enlarged"),
      f("Nodules", "None"),
      f("Tenderness", "Non-tender"),
    ]),
    sec("Metabolic Signs", [
      f("Cushingoid features", "Absent"),
      f("Acanthosis nigricans", "Absent"),
      f("Acromegalic features", "Absent"),
    ]),
    sec("Peripheral", [
      f("Foot pulses", "Present"),
      f("Foot sensation (monofilament)", "Intact"),
      f("Skin & nail changes", "Normal"),
    ]),
  ]),
  sys("Hematologic", "HEME", [
    sec("Lymph Nodes", [
      f("Cervical", "Not palpable"),
      f("Axillary", "Not palpable"),
      f("Inguinal", "Not palpable"),
      f("Supraclavicular", "Not palpable"),
    ]),
    sec("Organomegaly", [
      f("Liver", "Not palpable"),
      f("Spleen", "Not palpable"),
      f("Abdominal masses", "None"),
    ]),
    sec("Signs of Anemia / Bleeding", [
      f("Conjunctival pallor", "Absent", ["Mild pallor", "Severe pallor"]),
      f("Petechiae / purpura", "Absent", ["Petechiae present"]),
      f("Bruising", "Absent"),
    ]),
  ]),
  sys("Immunologic / Allergic", "IMM", [
    sec("Allergic Signs", [f("Allergic shiners", "Absent"), f("Dennie–Morgan lines", "Absent"), f("Nasal crease", "Absent")]),
    sec("Skin Manifestations", [f("Urticaria", "Absent"), f("Angioedema", "Absent"), f("Eczema", "Absent")]),
    sec("Respiratory", [f("Wheeze", "Absent"), f("Stridor", "Absent"), f("Nasal polyps", "Absent")]),
  ]),
];

export { SPECIALTIES, SYSTEMS };