let n = 0;
const uid = () => `r${++n}`;

// code = first 6 letters of the name, e.g. "Nose/Sinuses" → NOSESI
const toCode = (name) => name.replace(/[^a-z]/gi, "").slice(0, 6).toUpperCase();

const sys = (name, symptoms) => ({
  id: uid(), name, code: toCode(name), active: true,
  symptoms: symptoms.map((text) => ({ id: uid(), text })),
});

const blankSystem = () => ({ id: `r${Date.now()}`, name: "New System", code: "SYS", active: true, symptoms: [] });
const blankSymptom = () => ({ id: `y${Date.now()}`, text: "" });

const SEED = [
  sys("Skin", ["Rash", "Itching", "Lesions"]),
  sys("Head", ["Headache", "Head injury"]),
  sys("Eyes", ["Blurred vision", "Double vision", "Eye pain", "Redness", "Discharge", "Photophobia", "Vision loss"]),
  sys("Ears", ["Ear pain", "Hearing loss", "Tinnitus", "Discharge", "Vertigo"]),
  sys("Nose/Sinuses", ["Congestion", "Nosebleeds", "Sinus pain"]),
  sys("Allergies", ["Sneezing", "Itchy eyes", "Runny nose", "Hives", "Food allergy", "Seasonal allergy"]),
  sys("Mouth/Throat", ["Sore throat", "Mouth ulcers", "Hoarseness", "Difficulty swallowing"]),
  sys("Neck", ["Neck pain", "Stiffness", "Swelling", "Lumps"]),
  sys("Breast", ["Breast lump", "Breast pain", "Nipple discharge", "Skin changes"]),
  sys("Respiratory/Cardiac", [
    "Cough", "Sputum", "Hemoptysis", "Shortness of breath", "Wheezing", "Chest pain", "Chest tightness", "Palpitations",
    "Orthopnea", "PND", "Edema", "Syncope", "Exercise intolerance", "Cyanosis", "Snoring", "Night sweats",
  ]),
  sys("Gastrointestinal", [
    "Nausea", "Vomiting", "Abdominal pain", "Diarrhea", "Constipation", "Heartburn", "Bloating", "Blood in stool",
    "Black stools", "Dysphagia", "Loss of appetite", "Weight loss", "Jaundice", "Flatulence", "Hematemesis",
  ]),
  sys("Urinary", ["Dysuria", "Frequency", "Urgency", "Hematuria", "Incontinence", "Nocturia", "Retention", "Flank pain", "Weak stream"]),
  sys("Peripheral Vascular", ["Claudication", "Leg swelling", "Varicose veins"]),
  sys("Musculoskeletal", ["Joint pain", "Joint swelling", "Stiffness", "Back pain", "Muscle pain", "Muscle weakness", "Cramps", "Limited motion"]),
  sys("Neurologic", [
    "Dizziness", "Fainting", "Seizures", "Weakness", "Numbness", "Tingling", "Tremor", "Memory loss",
    "Speech difficulty", "Balance problems", "Headache", "Confusion",
  ]),
  sys("Hematologic", ["Easy bruising", "Bleeding", "Anemia"]),
  sys("Endocrine", ["Heat intolerance", "Cold intolerance", "Excessive thirst", "Excessive urination", "Excessive hunger", "Weight change", "Hair loss", "Sweating"]),
  sys("Psychiatric", ["Anxiety", "Depression", "Insomnia", "Mood swings", "Irritability", "Panic attacks", "Poor concentration"]),
];

export { SEED, blankSystem, blankSymptom };