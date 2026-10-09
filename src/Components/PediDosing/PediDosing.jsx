import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, List, Pencil, Pill, Plus, Tag, Trash2, Zap } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import PediDosingEditor from "./PediDosingEditor";
import { PEDI_RULES } from "./PediDosingData.js";
import styles from "./PediDosing.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

const PediDosing = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [rules, setRules] = useState(PEDI_RULES);
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState(null); // { id, medicine, age, minAge, route, frequency, dose, max, notes }

  // filter dropdown: medicines in the order they were first added
  const names = [...new Set(rules.map((r) => r.medicine))];
  const current = names.includes(filter) ? filter : "all";
  const sorted = [...rules].sort((a, b) => a.medicine.localeCompare(b.medicine) || a.minAge - b.minAge);
  const visible = current === "all" ? sorted : sorted.filter((r) => r.medicine === current);

  const patch = (id, fn) => setRules((p) => p.map((r) => (r.id === id ? fn(r) : r)));
  const openNew = () => setEditor({ id: null, medicine: "", age: "", minAge: "0", route: "Oral", frequency: "TDS", dose: "", max: "", notes: "" });
  const openEdit = (r) => setEditor({ ...r, minAge: String(r.minAge) });

  const save = () => {
    const age = editor.age.trim();
    const dose = editor.dose.trim();
    if (!editor.medicine || !age || !dose) return;
    const data = {
      medicine: editor.medicine, age, minAge: Number(editor.minAge) || 0, route: editor.route,
      frequency: editor.frequency, dose, max: editor.max.trim(), notes: editor.notes.trim(),
    };
    if (editor.id) patch(editor.id, (r) => ({ ...r, ...data }));
    else setRules((p) => [...p, { id: Date.now(), active: true, ...data }]);
    setEditor(null);
  };

  const remove = (id) => {
    setRules((p) => p.filter((r) => r.id !== id));
    if (editor?.id === id) setEditor(null);
  };

  return (
    <div className={cx("pk-fm-wrap")}>
      <div className={cx("pk-fm-header")}>
        <h1 className={cx("pk-fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("pk-fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("pk-fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`pk-fm-tab ${active.to === t.to ? "pk-fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("pk-wrap")}>
        <div className={cx(`pk-side ${editor ? "pk-side-narrow" : ""}`)}>
          <div className={cx("pk-bar")}>
            <select className={cx("pk-filter")} value={current} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All medicines ({rules.length} rules)</option>
              {names.map((n) => (
                <option key={n} value={n}>{n} ({rules.filter((r) => r.medicine === n).length})</option>
              ))}
            </select>
            <button type="button" className={cx("pk-btn")} onClick={openNew}><Plus size={14} /> New Rule</button>
          </div>

          <div className={cx("pk-list")}>
            {visible.map((r) => (
              <div key={r.id} className={cx(`pk-row ${editor?.id === r.id ? "pk-row-on" : ""} ${r.active ? "" : "pk-row-off"}`)}>
                <Toggle
                  on={r.active}
                  onChange={() => patch(r.id, (x) => ({ ...x, active: !x.active }))}
                  size="large"
                  color="softBlue"
                  className={cx("pk-tg")}
                  label={`Toggle ${r.medicine} ${r.age}`}
                />
                <div className={cx("pk-info")}>
                  <div className={cx("pk-top")}>
                    <span className={cx("pk-age")}>{r.age}</span>
                    <span className={cx("pk-route")}>{r.route}</span>
                  </div>
                  <div className={cx("pk-med")}>{r.medicine}</div>
                  <div className={cx("pk-dose")}>
                    <b>{r.dose}</b>
                    <span className={cx("pk-freq")}>{r.frequency}</span>
                    {r.max && <span className={cx("pk-max")}>max {r.max}</span>}
                  </div>
                  {r.notes && <div className={cx("pk-notes")}>{r.notes}</div>}
                </div>
                <div className={cx("pk-acts")}>
                  <button type="button" onClick={() => openEdit(r)} aria-label="Edit rule"><Pencil size={13} /></button>
                  <button type="button" className={cx("pk-del")} onClick={() => remove(r.id)} aria-label="Delete rule"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {visible.length === 0 && <p className={cx("pk-empty")}>No dosing rules.</p>}
          </div>
        </div>

        {editor && <PediDosingEditor editor={editor} setEditor={setEditor} onClose={() => setEditor(null)} onSave={save} />}
      </div>
    </div>
  );
};

export default PediDosing;