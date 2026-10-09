import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, List, Pill, Tag, Zap } from "lucide-react";
import NfCatalogue from "./NfCatalogue";
import NfSettings from "./NfSettings";
import { JUSTIFICATION_REASONS, NF_DRUGS, NF_SETTINGS } from "./NonFormularyData.js";
import styles from "./NonFormulary.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

const SUBTABS = [
  { key: "catalogue", label: "NF Drug Catalogue" },
  { key: "settings", label: "Settings & Justifications" },
];

const NonFormulary = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [tab, setTab] = useState("catalogue");
  // data lives here so switching inner tabs keeps changes
  const [drugs, setDrugs] = useState(NF_DRUGS);
  const [settings, setSettings] = useState(NF_SETTINGS);
  const [reasons, setReasons] = useState(JUSTIFICATION_REASONS);

  return (
    <div className={cx("nf-fm-wrap")}>
      <div className={cx("nf-fm-header")}>
        <h1 className={cx("nf-fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("nf-fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("nf-fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`nf-fm-tab ${active.to === t.to ? "nf-fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("nf-wrap")}>
        <div className={cx("nf-subtabs")}>
          {SUBTABS.map((t) => (
            <button
              type="button"
              key={t.key}
              className={cx(`nf-subtab ${tab === t.key ? "nf-subtab-on" : ""}`)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "catalogue"
          ? <NfCatalogue drugs={drugs} setDrugs={setDrugs} />
          : <NfSettings settings={settings} setSettings={setSettings} reasons={reasons} setReasons={setReasons} />}
      </div>
    </div>
  );
};

export default NonFormulary;