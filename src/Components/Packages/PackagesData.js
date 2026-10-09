const SERVICE_TYPES = ["Consultation", "Lab", "Procedure", "Formulary", "Consumables", "Imaging", "Vaccine"];

const SERVICES = [
  { id: 1, name: "Complete Blood Count (CBC)", type: "Lab", price: 0 },
  { id: 2, name: "ESR", type: "Lab", price: 0 },
  { id: 3, name: "Peripheral Blood Film", type: "Lab", price: 0 },
  { id: 4, name: "Reticulocyte Count", type: "Lab", price: 0 },
  { id: 5, name: "Coagulation Profile (PT/APTT)", type: "Lab", price: 0 },
  { id: 6, name: "Fasting Blood Sugar", type: "Lab", price: 0 },
  { id: 7, name: "HbA1c", type: "Lab", price: 0 },
  { id: 8, name: "Lipid Profile", type: "Lab", price: 0 },
  { id: 9, name: "Liver Function Tests", type: "Lab", price: 0 },
  { id: 10, name: "Kidney Function Tests", type: "Lab", price: 0 },
  { id: 11, name: "TSH", type: "Lab", price: 0 },
  { id: 12, name: "Uric Acid", type: "Lab", price: 0 },
  { id: 13, name: "Consultation", type: "Consultation", price: 2000 },
  { id: 14, name: "Follow-up Visit", type: "Consultation", price: 1000 },
  { id: 15, name: "Tele-consultation", type: "Consultation", price: 1500 },
  { id: 16, name: "Spirometry", type: "Procedure", price: 0 },
  { id: 17, name: "Peak Flow Measurement", type: "Procedure", price: 0 },
  { id: 18, name: "Skin Testing", type: "Procedure", price: 0 },
  { id: 19, name: "Wound Dressing (Simple)", type: "Procedure", price: 0 },
  { id: 20, name: "Panadol 500mg (Paracetamol)", type: "Formulary", price: 0 },
  { id: 21, name: "Brufen 200mg (Ibuprofen)", type: "Formulary", price: 0 },
  { id: 22, name: "Gauze Swabs 4×4", type: "Consumables", price: 0 },
  { id: 23, name: "Cotton Roll", type: "Consumables", price: 0 },
  { id: 24, name: "X-Ray - Chest - Single View", type: "Imaging", price: 0 },
  { id: 25, name: "X-Ray - Chest - PA View", type: "Imaging", price: 0 },
  { id: 26, name: "BCG", type: "Vaccine", price: 0 },
  { id: 27, name: "Hepatitis B", type: "Vaccine", price: 0 },
];

const PACKAGES = [
  {
    id: 1, name: "Executive Health Check-up",
    desc: "Comprehensive annual screening for corporate executives — includes CBC, lipid, liver, kidney panels and ECG.",
    services: 8, price: 8500, type: "Fixed", active: true, created: "01-Mar-2024",
  },
  {
    id: 2, name: "Diabetes Care Bundle",
    desc: "Quarterly monitoring for diabetic patients — labs, consultation and HbA1c tracking.",
    services: 4, price: 0, type: "Recurring", active: true, created: "15-Apr-2024",
  },
  {
    id: 3, name: "Maternity Screening Package",
    desc: "Pre-natal ultrasound, CBC, and thyroid screening for expectant mothers.",
    services: 4, price: 0, type: "Fixed", active: false, created: "10-May-2024",
  },
];

export { SERVICE_TYPES, SERVICES, PACKAGES };