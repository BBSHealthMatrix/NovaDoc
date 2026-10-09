// group order = order in the Category dropdown; chips are sorted A–Z
const CATEGORIES = [
  { name: "Wound Care", color: "#f97316" },
  { name: "Syringes & Needles", color: "#8b5cf6" },
  { name: "Gloves & PPE", color: "#10b981" },
  { name: "IV Supplies", color: "#0ea5e9" },
  { name: "Dressings", color: "#f59e0b" },
  { name: "Diagnostic Supplies", color: "#6366f1" },
];

// colours for categories added with "+ Custom..."
const PALETTE = ["#ec4899", "#14b8a6", "#84cc16", "#a855f7", "#64748b", "#ef4444"];

const UNITS = ["piece", "box", "pack", "ml", "roll", "pair", "set", "vial"];

let id = 0;
const i = (category, name, unit) => ({ id: ++id, category, name, unit, active: true });

const ITEMS = [
  i("Wound Care", "Gauze Swabs 4×4", "pack"),
  i("Wound Care", "Cotton Roll", "roll"),
  i("Wound Care", "Adhesive Tape (2.5cm)", "roll"),
  i("Wound Care", "Suture Material (Vicryl 2-0)", "box"),
  i("Wound Care", "Suture Material (Nylon 3-0)", "box"),

  i("Syringes & Needles", "5ml Syringe", "box"),
  i("Syringes & Needles", "10ml Syringe", "box"),
  i("Syringes & Needles", "20ml Syringe", "box"),
  i("Syringes & Needles", "Needle 18G", "box"),
  i("Syringes & Needles", "Needle 22G", "box"),
  i("Syringes & Needles", "IV Cannula 18G", "piece"),
  i("Syringes & Needles", "IV Cannula 20G", "piece"),

  i("Gloves & PPE", "Examination Gloves Small", "box"),
  i("Gloves & PPE", "Examination Gloves Medium", "box"),
  i("Gloves & PPE", "Examination Gloves Large", "box"),
  i("Gloves & PPE", "Surgical Mask", "box"),
  i("Gloves & PPE", "N95 Respirator", "piece"),
  i("Gloves & PPE", "Face Shield", "piece"),

  i("IV Supplies", "IV Administration Set", "piece"),
  i("IV Supplies", "Blood Transfusion Set", "piece"),
  i("IV Supplies", "Scalp Vein Set (21G)", "piece"),
  i("IV Supplies", "3-Way Stopcock", "piece"),

  i("Dressings", "Non-Adherent Dressing", "pack"),
  i("Dressings", "Transparent Film Dressing", "pack"),
  i("Dressings", "Hydrocolloid Dressing", "piece"),

  i("Diagnostic Supplies", "Blood Collection Tube (EDTA)", "box"),
  i("Diagnostic Supplies", "Blood Collection Tube (Plain)", "box"),
  i("Diagnostic Supplies", "Urine Collection Cup", "piece"),
  i("Diagnostic Supplies", "Lancets", "box"),
  i("Diagnostic Supplies", "Tongue Depressor", "pack"),
];

const CUSTOM = "__custom__";

export { CATEGORIES, PALETTE, UNITS, ITEMS, CUSTOM };