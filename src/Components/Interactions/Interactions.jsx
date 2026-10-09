import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, List, Pencil, Pill, Plus, Tag, Trash2, Zap } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import InteractionEditor from "./InteractionEditor";
import { INTERACTIONS, SEVERITIES } from "./InteractionsData.js";
import styles from "./Interactions.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

const CHIPS = [{ key: "all", label: "All" }, ...SEVERITIES];
const labelOf = (key) => SEVERITIES.find((s) => s.key === key)?.label ?? key;

const Interactions = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [rules, setRules] = useState(INTERACTIONS);
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState(null); // { id, severity, a, b, note }

  const patch = (id, fn) => setRules((p) => p.map((x) => (x.id === id ? fn(x) : x)));
  const openNew = () => setEditor({ id: null, severity: "moderate", a: "", b: "", note: "" });
  const openEdit = (x) => setEditor({ id: x.id, severity: x.severity, a: x.a, b: x.b, note: x.note });

  const save = () => {
    const note = editor.note.trim();
    if (!editor.a || !editor.b || editor.a === editor.b || !note) return;
    const data = { severity: editor.severity, a: editor.a, b: editor.b, note };
    if (editor.id) patch(editor.id, (x) => ({ ...x, ...data }));
    else setRules((p) => [...p, { id: Date.now(), active: true, ...data }]);
    setEditor(null);
  };

  const remove = (id) => {
    setRules((p) => p.filter((x) => x.id !== id));
    if (editor?.id === id) setEditor(null);
  };

  const count = (key) => (key === "all" ? rules.length : rules.filter((x) => x.severity === key).length);
  const visible = filter === "all" ? rules : rules.filter((x) => x.severity === filter);

  return (
    <div className={cx("ix-fm-wrap")}>
      <div className={cx("ix-fm-header")}>
        <h1 className={cx("ix-fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("ix-fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("ix-fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`ix-fm-tab ${active.to === t.to ? "ix-fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("ix-wrap")}>
        <div className={cx(`ix-side ${editor ? "ix-side-narrow" : ""}`)}>
          <div className={cx("ix-bar")}>
            <div className={cx("ix-chips")}>
              {CHIPS.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={cx(`ix-chip ix-chip-${c.key} ${filter === c.key ? "ix-chip-on" : ""}`)}
                  onClick={() => setFilter(c.key)}
                >
                  {c.label} <em>{count(c.key)}</em>
                </button>
              ))}
            </div>
            <button type="button" className={cx("ix-btn")} onClick={openNew}><Plus size={14} /> New Rule</button>
          </div>

          <div className={cx("ix-list")}>
            {visible.map((x) => (
              <div key={x.id} className={cx(`ix-row ${editor?.id === x.id ? "ix-row-on" : ""} ${x.active ? "" : "ix-row-off"}`)}>
                <Toggle
                  on={x.active}
                  onChange={() => patch(x.id, (y) => ({ ...y, active: !y.active }))}
                  size="large"
                  color="softBlue"
                  className={cx("ix-tg")}
                  label={`Toggle ${x.a} + ${x.b}`}
                />
                <div className={cx("ix-info")}>
                  <div className={cx("ix-pair")}>
                    <span className={cx("ix-med")}>{x.a}</span>
                    <Zap size={11} className={cx("ix-zap")} />
                    <span className={cx("ix-med")}>{x.b}</span>
                    <span className={cx(`ix-badge ix-${x.severity}`)}>{labelOf(x.severity)}</span>
                  </div>
                  <div className={cx("ix-note")}>{x.note}</div>
                </div>
                <div className={cx("ix-acts")}>
                  <button type="button" onClick={() => openEdit(x)} aria-label="Edit rule"><Pencil size={13} /></button>
                  <button type="button" className={cx("ix-del")} onClick={() => remove(x.id)} aria-label="Delete rule"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {visible.length === 0 && <p className={cx("ix-empty")}>No interaction rules.</p>}
          </div>
        </div>

        {editor && <InteractionEditor editor={editor} setEditor={setEditor} onClose={() => setEditor(null)} onSave={save} />}
      </div>
    </div>
  );
};

export default Interactions;