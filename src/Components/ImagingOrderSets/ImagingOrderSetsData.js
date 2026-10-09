import { MODALITIES } from "../ImagingTestList/ImagingTestListData.js";

// every protocol gets a stable key "Modality|Body part|Protocol"
const keyOf = (m, b, p) => `${m}|${b}|${p}`;

const CATALOGUE = MODALITIES.map((m) => ({
  name: m.name,
  parts: m.parts.map((b) => ({
    name: b.name,
    protocols: b.protocols.map((p) => ({ key: keyOf(m.name, b.name, p.name), name: p.name })),
  })),
}));

// "X-Ray|Chest|PA View" -> "X-Ray — Chest — PA View"
const labelOf = (key) => key.split("|").join(" — ");

const CATEGORIES = [
  "Routine Workup", "Cardiac Panel", "Pre-operative", "Emergency / Acute", "Diabetes Screen",
  "Thyroid Panel", "Liver Screen", "Renal Screen", "Infection / Sepsis", "Oncology Panel", "Paediatric", "Custom",
];

const CATEGORY_COLOR = {
  "Routine Workup": "io-c-blue",
  "Pre-operative": "io-c-purple",
  "Cardiac Panel": "io-c-red",
  "Diabetes Screen": "io-c-amber",
};

const ORDER_SETS = [
  {
    id: 1, name: "Cardiac Imaging Panel", category: "Cardiac Panel", active: true, created: "2024-02-14",
    desc: "Cardiac imaging evaluation including echocardiography and chest X-ray.",
    items: [keyOf("Echocardiography", "Transthoracic (TTE)", "2D Echo with Doppler"), keyOf("X-Ray", "Chest", "PA View")],
  },
  {
    id: 2, name: "Pre-Op Imaging", category: "Pre-operative", active: true, created: "2024-03-05",
    desc: "Imaging component of pre-operative clearance — chest X-ray.",
    items: [keyOf("X-Ray", "Chest", "PA View")],
  },
];

const BLANK_ORDER_SET = { name: "", category: CATEGORIES[0], desc: "", items: [] };

export { CATALOGUE, labelOf, CATEGORIES, CATEGORY_COLOR, ORDER_SETS, BLANK_ORDER_SET };