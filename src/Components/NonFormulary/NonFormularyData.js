let did = 0;
let bid = 0;
// drug(generic, category, [[brand, strength], ...])
const drug = (generic, category, brands) => ({
  id: ++did, generic, category,
  brands: brands.map(([name, strength]) => ({ id: ++bid, name, strength })),
});

const NF_DRUGS = [
  drug("Adalimumab", "Biologics", [["Humira", "40mg/0.8ml (SC)"], ["Amgevita", "40mg/0.8ml (SC)"]]),
  drug("Rituximab", "Biologics", [["MabThera", "100mg/10ml (IV)"], ["MabThera", "500mg/50ml (IV)"]]),
  drug("Etanercept", "Biologics", [["Enbrel", "25mg (SC)"], ["Enbrel", "50mg (SC)"]]),
  drug("Infliximab", "Biologics", [["Remicade", "100mg (IV infusion)"]]),

  drug("Apixaban", "Anticoagulants", [["Eliquis", "2.5mg"], ["Eliquis", "5mg"]]),
  drug("Rivaroxaban", "Anticoagulants", [["Xarelto", "10mg"], ["Xarelto", "15mg"], ["Xarelto", "20mg"]]),
  drug("Dabigatran", "Anticoagulants", [["Pradaxa", "110mg"], ["Pradaxa", "150mg"]]),

  drug("Sitagliptin", "Antidiabetics", [["Januvia", "50mg"], ["Januvia", "100mg"]]),
  drug("Empagliflozin", "Antidiabetics", [["Jardiance", "10mg"], ["Jardiance", "25mg"]]),
  drug("Liraglutide", "Antidiabetics", [["Victoza", "0.6mg/dose"], ["Victoza", "1.2mg/dose"], ["Victoza", "1.8mg/dose"]]),

  drug("Quetiapine", "Psychotropics", [["Seroquel", "25mg"], ["Seroquel", "100mg"], ["Seroquel XR", "200mg XR"], ["Seroquel XR", "400mg XR"]]),
  drug("Aripiprazole", "Psychotropics", [["Abilify", "5mg"], ["Abilify", "10mg"], ["Abilify", "15mg"]]),
  drug("Clozapine", "Psychotropics", [["Clozaril", "25mg"], ["Clozaril", "100mg"]]),

  drug("Venlafaxine", "Antidepressants", [["Effexor", "37.5mg"], ["Effexor", "75mg"], ["Effexor XR", "150mg XR"]]),
  drug("Duloxetine", "Antidepressants", [["Cymbalta", "30mg"], ["Cymbalta", "60mg"]]),
  drug("Mirtazapine", "Antidepressants", [["Remeron", "15mg"], ["Remeron", "30mg"], ["Remeron", "45mg"]]),

  drug("Pregabalin", "Neuropathic Pain", [["Lyrica", "75mg"], ["Lyrica", "150mg"], ["Lyrica", "300mg"]]),
  drug("Gabapentin", "Neuropathic Pain", [["Neurontin", "100mg"], ["Neurontin", "300mg"], ["Neurontin", "400mg"]]),

  drug("Imatinib", "Oncology", [["Gleevec", "100mg"], ["Gleevec", "400mg"]]),
  drug("Erlotinib", "Oncology", [["Tarceva", "100mg"], ["Tarceva", "150mg"]]),

  drug("Mycophenolate Mofetil", "Immunosuppressants", [["CellCept", "250mg"], ["CellCept", "500mg"]]),
  drug("Tacrolimus", "Immunosuppressants", [["Prograf", "0.5mg"], ["Prograf", "1mg"], ["Prograf", "5mg"]]),
];

const NF_SETTINGS = { allowNF: false, requireJustification: false };

let rid = 0;
const JUSTIFICATION_REASONS = [
  "Drug shortage",
  "No formulary equivalent",
  "Patient intolerance to formulary option",
  "Specialist recommendation",
  "Patient already on this medication",
  "Clinical necessity / urgent requirement",
].map((text) => ({ id: ++rid, text }));

export { NF_DRUGS, NF_SETTINGS, JUSTIFICATION_REASONS };