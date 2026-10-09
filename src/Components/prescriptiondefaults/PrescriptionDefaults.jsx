import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, List, Pill, RotateCcw, Save, Tag, Zap } from "lucide-react";
import DefaultsListCard from "./DefaultsListCard";
import { PRESCRIPTION_DEFAULTS } from "./PrescriptionDefaultsData.js";
import styles from "./PrescriptionDefaults.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

let uid = 0;
const build = () => PRESCRIPTION_DEFAULTS.map((l) => ({ ...l, items: l.items.map((text) => ({ id: ++uid, text })) }));

const PrescriptionDefaults = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [, setSaved] = useState(build);
  const [draft, setDraft] = useState(build);
  const [confirmReset, setConfirmReset] = useState(false);

  const setItems = (key) => (fn) => setDraft((p) => p.map((l) => (l.key === key ? { ...l, items: fn(l.items) } : l)));

  const reset = () => { setDraft(build()); setConfirmReset(false); };
  const save = () => setSaved(draft);

  return (
    <div className={cx("pd-fm-wrap")}>
      <div className={cx("pd-fm-header")}>
        <h1 className={cx("pd-fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("pd-fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("pd-fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`pd-fm-tab ${active.to === t.to ? "pd-fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("pd-wrap")}>
        <div className={cx("pd-bar")}>
          <p className={cx("pd-note")}>These lists power the prescription drawer dropdowns. Drag to reorder; changes take effect after Save.</p>
          {confirmReset ? (
            <>
              <span className={cx("pd-ask")}>Reset to factory defaults?</span>
              <button type="button" className={cx("pd-btn pd-yes")} onClick={reset}>Yes, Reset</button>
              <button type="button" className={cx("pd-btn pd-cancel")} onClick={() => setConfirmReset(false)}>Cancel</button>
            </>
          ) : (
            <button type="button" className={cx("pd-btn pd-reset")} onClick={() => setConfirmReset(true)}>
              <RotateCcw size={13} /> Reset Defaults
            </button>
          )}
          <button type="button" className={cx("pd-btn pd-save")} onClick={save}><Save size={13} /> Save Changes</button>
        </div>

        <div className={cx("pd-grid")}>
          {draft.map((l) => (
            <DefaultsListCard key={l.key} title={l.title} items={l.items} onChange={setItems(l.key)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDefaults;