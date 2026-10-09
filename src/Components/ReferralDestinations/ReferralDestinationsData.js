const CATEGORIES = ["Hospital", "Clinic", "Diagnostic Lab", "Pharmacy", "Rehab Centre", "Other"];

const DESTINATIONS = [
  { id: 1, name: "Agha Khan University Hospital", category: "Hospital", services: ["Cardiology", "Neurology", "Oncology"], active: true },
  { id: 2, name: "Liaquat National Hospital", category: "Hospital", services: ["Emergency", "Orthopaedics", "Surgery"], active: true },
  { id: 3, name: "Essa Lab", category: "Diagnostic Lab", services: ["Haematology", "Biochemistry", "Microbiology"], active: true },
  { id: 4, name: "Umair Physiotherapy Centre", category: "Rehab Centre", services: ["Physiotherapy", "Occupational Therapy"], active: true },
];

const BLANK = { name: "", category: CATEGORIES[0], services: [], active: true };

export { CATEGORIES, DESTINATIONS, BLANK };