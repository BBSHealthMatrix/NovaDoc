const Q_TYPES = ["Yes/No Radio", "Single Dropdown", "Multi Dropdown", "Number Input", "Text Input"];
const F_TYPES = ["Single Dropdown", "Multi Dropdown", "Number Input", "Text Input"];
const CHOICE = ["Single Dropdown", "Multi Dropdown"];

let n = 0;
const uid = () => `s${Date.now()}${++n}`;

const field = (label, type, options = [], placeholder = "") => ({ id: uid(), label, type, options, placeholder });

const question = (label, type, enabled, extra = {}) => ({
  id: uid(), label, type, enabled, options: [], placeholder: "", followups: [], ...extra,
});

const blankQuestion = () => question("", "Yes/No Radio", false);
const blankFollowup = () => field("", "Text Input");

const SEED = [
  question("Tobacco / Smoking", "Yes/No Radio", true, {
    followups: [
      field("Type", "Single Dropdown", ["Cigarettes", "Hookah", "Vape"]),
      field("Packs per day", "Number Input", [], "e.g. 1"),
    ],
  }),
  question("Alcohol Consumption", "Yes/No Radio", true, {
    followups: [field("Frequency", "Single Dropdown", ["Daily", "Weekly", "Occasionally"])],
  }),
  question("Occupation", "Text Input", false, { placeholder: "e.g. Teacher, Engineer..." }),
  question("Marital Status", "Single Dropdown", false, { options: ["Single", "Married", "Divorced", "Widowed"] }),
  question("Exercise", "Single Dropdown", false, { options: ["None", "Occasional", "Regular"] }),
];

export { Q_TYPES, F_TYPES, CHOICE, SEED, blankQuestion, blankFollowup };