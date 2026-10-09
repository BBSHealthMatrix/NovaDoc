import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings, ChevronRight, ChevronDown, Trash2, BookOpen, Layers,
  Users, FileText, AlertCircle, Stethoscope, FlaskConical, Tag,
  Pill, ScanLine, GitBranch, Building2, ClipboardList, Heart,
  Ticket, Receipt, Syringe, Package, Shield, CreditCard, Activity,
  Workflow, LayoutGrid, Lock, Monitor, Zap, Clipboard, Building,
  List, Store, User, Sparkles, Banknote, Globe, Truck,
  HeartHandshake, SlidersVertical, Bell, Scissors, Target, MapPin,
} from "lucide-react";
import StylingSidebar from "./sidebar.module.css";
import ResetModal from "../Resetmodal/Resetmodal";

const it = (label, icon, key) => ({
  label,
  icon,
  key:
    key ||
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, ""),
});

const MENU = [
  {
    label: "Branches",
    icon: GitBranch,
    items: [it("Branch List", Building)],
  },
  {
    label: "Care Structure",
    icon: Building2,
    items: [
      it("Departments & Sub", LayoutGrid),
      it("Specialties", Sparkles),
    ],
  },
  {
    label: "Doctors",
    icon: Stethoscope,
    items: [
      it("Doctor Profiles", User),
      it("Fees & Shares", Banknote),
    ],
  },
  {
    label: "Patient Intake",
    icon: ClipboardList,
    items: [
      it("Basic Info", User),
      it("Patient Types", Users),
      it("Demographics", Globe),
      it("Custom Sections", Layers),
      it("Workflow Builder", Workflow),
      it("Quick Registration", Zap),
    ],
  },
  {
    label: "Nursing",
    icon: Heart,
    items: [
      it("Triage", AlertCircle),
      it("History", ClipboardList),
      it("Vital Signs", SlidersVertical),
    ],
  },
  {
    label: "Soap Note",
    icon: ClipboardList,
    items: [
      it("Note Structure", FileText),
      it("Chief Complaints", Activity),
      it("HPI Templates", ClipboardList),
      it("Allergies", Bell),
      it("Comorbidities", Heart),
      it("Surgical Procedures", Scissors),
      it("Family History", Users),
      it("Social History", User),
      it("ROS Config", ClipboardList),
      it("PE Builder", Stethoscope),
      it("POC Tests", FlaskConical),
      it("ICD-10 Codes", FileText),
      it("Patient Goals", Target),
      it("Referral Destinations", MapPin),
      it("Template Manager", FileText),
      it("Health Ed Library", BookOpen),
    ],
  },
  {
    label: "Speciality Notes",
    icon: Layers,
    items: [it("Specialty Forms", BookOpen)],
  },
  {
    label: "Queue Setup",
    icon: Ticket,
    items: [
      it("Visit Types", Activity),
      it("Workflow Config", Workflow),
      it("Counter Types", Layers),
      it("Counters", LayoutGrid),
      it("Token Settings", Tag),
      it("Queue Behavior", Settings),
      it("Locking", Lock),
      it("Display", Monitor),
      it("Doctor / Partition", Stethoscope),
      it("Routing Rules", Zap),
    ],
  },
  {
    label: "Billing & Pricing",
    icon: Receipt,
    items: [
      it("Service Types", Tag),
      it("Service Pricing", Receipt),
      it("Packages / Bundles", Package),
    ],
  },
  {
    label: "Lab",
    icon: FlaskConical,
    items: [
      it("Lab Test Master List", FileText),
      it("Lab Providers", FlaskConical),
      it("Result Templates", FileText),
      it("Lab Order Sets", Layers),
    ],
  },
  {
    label: "Procedure",
    icon: Stethoscope,
    items: [
      it("Procedure Master List", FileText),
      it("Procedure Partners", Stethoscope),
      it("Templates", Clipboard),
    ],
  },
  {
    label: "Imaging",
    icon: ScanLine,
    items: [
      it("Imaging Test List", ScanLine),
      it("Reason Templates", FileText),
      it("Imaging Partners", Building),
      it("Imaging Order Sets", Layers),
    ],
  },
  {
    label: "Vaccine",
    icon: Syringe,
    items: [
      it("Vaccine Master List", FileText),
      it("Vaccine Partners", Syringe),
    ],
  },
  {
    label: "Formulary",
    icon: Pill,
    items: [
      it("Medicine Catalogue", Pill),
      it("Prescription Defaults", Tag),
      it("Bundles", BookOpen),
      it("Drug Interactions", Zap),
      it("Pedi Dosing Guidelines", List),
      it("Non-Formulary", FileText),
      it("Pharmacy Partners", Store),
    ],
  },
  {
    label: "Consumables",
    icon: Package,
    items: [
      it("Consumable Items", Package),
      it("Consumable Providers", Truck),
    ],
  },
  {
    label: "Insurance",
    icon: Shield,
    items: [it("Pricing", Receipt, "insurance-pricing")],
  },
  {
    label: "Corporate",
    icon: CreditCard,
    items: [it("Pricing", Receipt, "corporate-pricing")],
  },
  {
    label: "Welfare",
    icon: Heart,
    items: [it("Welfare Schemes", HeartHandshake)],
  },
  {
    label: "Users",
    icon: Users,
    items: [
      it("Users & Counters", User),
      it("Security", Shield),
    ],
  },
];

export const Sidebar = () => {
  const [open, setOpen] = useState({});
  const [showReset, setShowReset] = useState(false);
  const { pathname } = useLocation();

  const toggle = (label) => {
    setOpen((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  };

  return (
    <>
      <aside className={StylingSidebar["adm-side"]}>
        <div className={StylingSidebar["adm-side-head"]}>
          <Settings size={14} />
          <span>Admin Settings</span>
        </div>

        <div className={StylingSidebar["adm-side-list"]}>
          {MENU.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = Boolean(open[group.label]);

            return (
              <div key={group.label}>
                <button
                  type="button"
                  className={StylingSidebar["adm-grp"]}
                  onClick={() => toggle(group.label)}
                  aria-expanded={isOpen}
                >
                  <GroupIcon size={15} />
                  <span>{group.label}</span>

                  {isOpen ? (
                    <ChevronDown
                      size={13}
                      className={StylingSidebar["adm-chev"]}
                    />
                  ) : (
                    <ChevronRight
                      size={13}
                      className={StylingSidebar["adm-chev"]}
                    />
                  )}
                </button>

                {isOpen && (
                  <div className={StylingSidebar["adm-subs"]}>
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const to = `/admin/${item.key}`;

                    return (
                      <Link
                        key={item.key}
                        to={to}
                        className={`${StylingSidebar["adm-sub"]} ${
                          pathname === to
                            ? StylingSidebar["adm-sub-on"]
                            : ""
                        }`}
                      >
                        <ItemIcon size={13} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={StylingSidebar["adm-danger"]}>
          <p>Danger Zone</p>

          <button
            type="button"
            onClick={() => setShowReset(true)}
          >
            <Trash2 size={12} />
            <span>Reset All App Data</span>
          </button>
        </div>
      </aside>

      {showReset && (
        <ResetModal
          onCancel={() => setShowReset(false)}
          onConfirm={() => window.location.reload()}
        />
      )}
    </>
  );
};