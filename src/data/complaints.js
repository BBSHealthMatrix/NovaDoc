// Chief complaints + specialties — shared by ChiefComplaints and HpiTemplates
const SPECIALTIES = [
  "General", "Cardiology", "Respiratory", "Neurology", "Orthopedics", "Gastroenterology",
  "Endocrine", "ENT", "Ophthalmology", "Dermatology", "Urology", "Pediatrics",
];

const cc = (id, name, specs, active = true) => ({ id, name, specs, active });

const COMPLAINTS = [
  cc(1, "Chest Pain", ["General", "Cardiology"]),
  cc(2, "Shortness of Breath", ["General", "Respiratory", "Cardiology"]),
  cc(3, "Headache", ["General", "Neurology"]),
  cc(4, "Abdominal Pain", ["General", "Gastroenterology"]),
  cc(5, "Fever", ["General", "Pediatrics"]),
  cc(6, "Cough", ["General", "Respiratory"]),
  cc(7, "Back Pain", ["General", "Orthopedics"]),
  cc(8, "Dizziness", ["General", "Neurology", "ENT"]),
  cc(9, "Palpitations", ["Cardiology"]),
  cc(10, "Joint Pain", ["Orthopedics", "General"], false),
];

export { SPECIALTIES, COMPLAINTS };