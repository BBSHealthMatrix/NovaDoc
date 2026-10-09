const TABS = [
  { key: "conditions", label: "Conditions", placeholder: "Condition name..." },
  { key: "genetic", label: "Genetic Diseases", placeholder: "Genetic disease name..." },
];

const DEFAULT_RELS = "Father, Mother, Sibling, Grandparent";

const CONDITIONS = ["Hypertension", "Diabetes", "Heart Disease", "Cancer", "Stroke"]
  .map((name, i) => ({ id: i + 1, name, rels: DEFAULT_RELS }));

const GENETIC = ["Sickle Cell Disease", "Thalassaemia", "Cystic Fibrosis", "Haemophilia"];

export { TABS, DEFAULT_RELS, CONDITIONS, GENETIC };