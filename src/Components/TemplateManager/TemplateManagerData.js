const SPECIALTIES = [
  "All Specialties", "Internal Medicine", "Cardiology", "Pulmonology", "Gastroenterology",
  "Neurology", "Paediatrics", "Gynaecology", "ENT", "Orthopaedics",
];

const DEPARTMENTS = [
  "OPD General", "OPD Cardiology", "OPD Pulmonology", "OPD Neurology", "Paediatrics",
  "Gynaecology", "Emergency", "ICU", "Surgery",
];

// note sections in display order, each with its tag / dot colour
const SECTIONS = [
  { name: "Chief Complaint", color: "#4982cf" },
  { name: "HPI", color: "#8b5cf6" },
  { name: "Review of Systems", color: "#0ea5e9" },
  { name: "Medications", color: "#7c3aed" },
  { name: "Imaging", color: "#0369a1" },
  { name: "Care Plan", color: "#10b981" },
  { name: "Procedures", color: "#0d9488" },
  { name: "Health Education", color: "#f97316" },
  { name: "Patient Goals", color: "#ec4899" },
  { name: "Referrals", color: "#6366f1" },
  { name: "Other Orders", color: "#f59e0b" },
  { name: "Visit Note", color: "#64748b" },
];

const TEMPLATES = [
  {
    id: 1, name: "URTI Standard", desc: "Upper respiratory tract infection", specialty: "Internal Medicine",
    departments: ["OPD General"], sections: ["Chief Complaint", "HPI", "Review of Systems", "Care Plan"],
    system: true, isDefault: true,
  },
  {
    id: 2, name: "DM Follow-Up", desc: "Diabetes mellitus routine follow-up", specialty: "Internal Medicine",
    departments: ["OPD General"], sections: ["Chief Complaint", "HPI", "Medications", "Care Plan", "Patient Goals"],
    system: true, isDefault: false,
  },
  {
    id: 3, name: "Cardiology Consult", desc: "Cardiac evaluation note", specialty: "Cardiology",
    departments: ["OPD Cardiology"], sections: ["Chief Complaint", "HPI", "Review of Systems", "Medications", "Imaging", "Care Plan"],
    system: true, isDefault: true,
  },
];

const BLANK = {
  name: "", desc: "", specialty: "All Specialties", departments: [], sections: ["Chief Complaint", "HPI"], isDefault: false,
};

export { SPECIALTIES, DEPARTMENTS, SECTIONS, TEMPLATES, BLANK };