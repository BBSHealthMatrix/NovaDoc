import {
  BookOpen, Users, FileText, AlertCircle, ListChecks, Stethoscope, FlaskConical,
  Tag, Pill, ScanLine, ClipboardCheck, CheckSquare,
} from "lucide-react";

export const DOCTORS = [
  { name: "Dr. Emily Wong", spec: "Interventional Cardiology, Electrophysiology", active: true },
  { name: "Dr. James Wilson", spec: "Joint Replacement", active: true },
  { name: "Dr. Asif Imam", spec: "General Immunology", active: true },
  { name: "Dr. Sarah Connor", spec: "Stroke & Cerebrovascular", active: false },
];

export const COMPONENTS = [
  { id: "cc", label: "Chief Complaint", icon: FileText, color: "#3b6fd4" },
  { id: "hpi", label: "History of Present Illness", icon: BookOpen, color: "#8b5cf6" },
  { id: "all", label: "Allergies", icon: AlertCircle, color: "#ef4444" },
  { id: "msf", label: "Medical, Surgical & Family History", icon: Users, color: "#10b981" },
  { id: "ros", label: "Review of Systems", icon: ListChecks, color: "#06b6d4" },
  { id: "pe", label: "Physical Examination", icon: Stethoscope, color: "#06b6d4" },
  { id: "poc", label: "Point of Care Labs", icon: FlaskConical, color: "#f59e0b" },
  { id: "dx", label: "Diagnosis", icon: Tag, color: "#8b5cf6" },
  { id: "lab", label: "Lab Orders", icon: FlaskConical, color: "#f59e0b" },
  { id: "rx", label: "Prescriptions / Formulary", icon: Pill, color: "#a855f7" },
  { id: "img", label: "Imaging", icon: ScanLine, color: "#06b6d4" },
  { id: "cp", label: "Care Plan", icon: ClipboardCheck, color: "#10b981" },
  { id: "ref", label: "Referrals", icon: Users, color: "#8b5cf6" },
  { id: "goal", label: "Patient Goals", icon: CheckSquare, color: "#ec4899" },
];


