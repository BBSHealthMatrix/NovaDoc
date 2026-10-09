const PROVIDER_TYPES = ["In-House Store", "External Supplier"];

// category order = order in the modal list and in the expanded card
const CATEGORIES = [
  { name: "Diagnostic Supplies", color: "#6366f1" },
  { name: "Dressings", color: "#f59e0b" },
  { name: "Gloves & PPE", color: "#10b981" },
  { name: "IV Supplies", color: "#0ea5e9" },
  { name: "Syringes & Needles", color: "#8b5cf6" },
];

let id = 0;
const i = (category, name, unit) => ({ id: ++id, category, name, unit });

// 23 items shown in "Item Selection & Pricing"
const ITEMS = [
  i("Diagnostic Supplies", "Blood Collection Tube (EDTA)", "box"),
  i("Diagnostic Supplies", "Blood Collection Tube (Plain)", "box"),
  i("Diagnostic Supplies", "Urine Collection Cup", "piece"),
  i("Diagnostic Supplies", "Lancets", "box"),
  i("Diagnostic Supplies", "Tongue Depressor", "pack"),

  i("Dressings", "Non-Adherent Dressing", "pack"),
  i("Dressings", "Transparent Film Dressing", "pack"),
  i("Dressings", "Hydrocolloid Dressing", "piece"),

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

  i("Syringes & Needles", "20ml Syringe", "box"),
  i("Syringes & Needles", "Needle 18G", "box"),
  i("Syringes & Needles", "Needle 22G", "box"),
  i("Syringes & Needles", "IV Cannula 18G", "piece"),
  i("Syringes & Needles", "IV Cannula 20G", "piece"),
];

const idOf = (name) => ITEMS.find((x) => x.name === name).id;

// p([[item name, cost, sell], ...]) → { items, prices }
const p = (rows) => ({
  items: rows.map(([name]) => idOf(name)),
  prices: Object.fromEntries(rows.map(([name, cost, sell]) => [idOf(name), { cost, sell }])),
});

const PROVIDERS = [
  {
    id: 1, name: "Central Store", type: "In-House Store", contact: "", active: false,
    ...p([
      ["Examination Gloves Small", "600", "750"],
      ["Examination Gloves Medium", "600", "750"],
      ["IV Administration Set", "80", "100"],
      ["IV Cannula 18G", "45", "60"],
    ]),
  },
  {
    id: 2, name: "MedSupply Co.", type: "External Supplier", contact: "0321-5556677", active: true,
    ...p([
      ["Blood Collection Tube (EDTA)", "1200", "1500"],
      ["Blood Collection Tube (Plain)", "1000", "1300"],
      ["Urine Collection Cup", "25", "40"],
      ["Lancets", "350", "450"],
      ["Non-Adherent Dressing", "400", "520"],
      ["Transparent Film Dressing", "650", "800"],
      ["Examination Gloves Large", "600", "750"],
      ["Surgical Mask", "300", "400"],
      ["N95 Respirator", "120", "180"],
      ["20ml Syringe", "900", "1150"],
    ]),
  },
];

export { PROVIDER_TYPES, CATEGORIES, ITEMS, PROVIDERS };