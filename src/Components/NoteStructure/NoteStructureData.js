import {
  ClipboardList, BookOpen, Heart, FileText, Clipboard, Activity, Stethoscope,
  FlaskConical, Microscope, Image, Pill, NotebookText, Users, Target,
} from "lucide-react";

const STATUSES = ["Required", "Optional", "Hidden"];

const BADGE = { Required: "ns-req", Optional: "ns-opt", Hidden: "ns-hid" };

const sec = (id, name, icon, status = "Optional", on = true) => ({ id, name, icon, status, on });

// default order for every specialty
const DEFAULT = [
  sec("cc", "Chief Complaints", ClipboardList, "Required"),
  sec("hpi", "History of Present Illness", BookOpen, "Required"),
  sec("all", "Allergies", Heart),
  sec("mh", "Medical History", FileText),
  sec("ros", "Review of Systems", Clipboard),
  sec("vit", "Vitals", Activity, "Required"),
  sec("pe", "Physical Examination", Stethoscope),
  sec("poc", "POC Labs", FlaskConical),
  sec("dx", "Diagnosis", Microscope),
  sec("lab", "Labs", FlaskConical),
  sec("img", "Imaging", Image),
  sec("rx", "Formulary", Pill),
  sec("proc", "Procedures", Stethoscope),
  sec("cp", "Care Plan", NotebookText),
  sec("ref", "Referrals", Users),
  sec("goal", "Patient Goals", Target),
  sec("he", "Health Education", BookOpen),
];

// general config: referrals + patient goals switched off
const GENERAL = DEFAULT.map((s) => (["ref", "goal"].includes(s.id) ? { ...s, on: false } : s));

export { STATUSES, BADGE, DEFAULT, GENERAL };