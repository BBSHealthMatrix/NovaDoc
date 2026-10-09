import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, FileText, List, Pill, Tag, Zap } from "lucide-react";
import styles from "./Formulary.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

// header + tab bar; the page for the current route comes in as children (set in App.jsx)
const Formulary = ({ children }) => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];

  return (
    <div className={cx("fm-wrap")}>
      <div className={cx("fm-header")}>
        <h1 className={cx("fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`fm-tab ${active.to === t.to ? "fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
};

export default Formulary;