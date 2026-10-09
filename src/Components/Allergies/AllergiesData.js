const TABS = [
  { key: "allergens", label: "Allergens", placeholder: "Allergen name..." },
  { key: "reactions", label: "Reactions", placeholder: "Add reaction..." },
  { key: "onsets", label: "Onset Options", placeholder: "Add onset option..." },
];

const TYPES = ["Drug", "Food", "Environmental", "Other"];

const ALLERGENS = [
  { id: 1, name: "Penicillin", type: "Drug" },
  { id: 2, name: "Amoxicillin", type: "Drug" },
  { id: 3, name: "Peanuts", type: "Food" },
  { id: 4, name: "Shellfish", type: "Food" },
  { id: 5, name: "Dust Mites", type: "Environmental" },
  { id: 6, name: "Pollen", type: "Environmental" },
];

const LISTS = {
  reactions: ["Urticaria / Hives", "Anaphylaxis", "Angioedema", "Rash / Erythema", "Bronchospasm", "Gastrointestinal upset"],
  onsets: ["Immediate (< 1 hr)", "Delayed (1–24 hrs)", "Late (> 24 hrs)"],
};

export { TABS, TYPES, ALLERGENS, LISTS };