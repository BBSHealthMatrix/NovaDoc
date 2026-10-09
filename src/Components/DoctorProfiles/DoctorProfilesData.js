import { CircleUserRound, GraduationCap, Wrench, Clock, CircleHelp } from "lucide-react";

const DEPTS = [
  { name: "Cardiology", subs: ["Outpatient", "Inpatient"], specs: ["Interventional Cardiology", "Electrophysiology", "Heart Failure & Transplant"] },
  { name: "Orthopedics", subs: ["Outpatient", "Inpatient"], specs: ["Joint Replacement", "Sports Medicine"] },
  { name: "Neurology", subs: ["Outpatient", "Inpatient"], specs: ["Stroke & Cerebrovascular", "Epilepsy"] },
  { name: "Immunology", subs: ["Outpatient"], specs: ["General Immunology", "Clinical Allergy"] },
];

const CONSULT = ["Consultation", "FollowUp", "Emergency", "Tele-consultation"];

const OTHER = ["Vaccinations", "Procedures", "Consumables", "Pharmacy", "Imaging", "Lab"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TABS = [
  ["bio", "Biography", CircleUserRound], ["qual", "Qualifications", GraduationCap],
  ["svc", "Services", Wrench], ["time", "Timings", Clock], ["faq", "FAQs", CircleHelp],
];

const blank = () => ({
  name: "", gender: "", phone: "", email: "", password: "", shift: "", type: "Appointment",
  depts: [], subs: {}, specs: [], statement: false, pro: {},
  quals: [], services: [], days: [], faqs: [], active: true, form: "",
});

const doc = (id, name, shift, email, depts, specs, type, active, form = "") =>
  ({ ...blank(), id, name, shift, email, depts, specs, type, active, form });

const SEED = [
  doc(1, "Dr. Emily Wong", "Morning", "emily.wong@medfinance.com", ["Cardiology", "Orthopedics"], ["Interventional Cardiology", "Electrophysiology"], "Appointment", true),
  doc(2, "Dr. James Wilson", "Afternoon", "james.wilson@medfinance.com", ["Orthopedics"], ["Joint Replacement"], "Token-Based", true),
  doc(3, "Dr. Sarah Connor", "Morning", "sarah.connor@medfinance.com", ["Neurology"], ["Stroke & Cerebrovascular"], "Appointment", false),
  doc(4, "Dr. Asif Imam", "Morning", "", ["Immunology"], ["General Immunology"], "Appointment", true, "Dr. Asif Imam — Immunology Consultation"),
];

const initials = (n) => n.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const toMin = (t) => { const [h, m] = (t || "0:0").split(":").map(Number); return h * 60 + m; };

const slotCount = (d) => {
  const n = Math.floor((toMin(d.end) - toMin(d.start)) / (Number(d.slot) || 1));
  return n > 0 ? n : 0;
};

export { DEPTS, CONSULT, OTHER, DAYS, TABS, blank, slotCount, SEED, initials };
