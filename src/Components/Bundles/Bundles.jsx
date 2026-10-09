import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BookOpen, FileText, List, Pencil, Pill, Plus, Tag, Trash2, Zap } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import BundleEditor from "./BundleEditor";
import { BUNDLES } from "./BundlesData.js";
import styles from "./Bundles.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

const Bundles = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [bundles, setBundles] = useState(BUNDLES);
  const [editor, setEditor] = useState(null); // { id, name, desc, meds }

  const patch = (id, fn) => setBundles((p) => p.map((b) => (b.id === id ? fn(b) : b)));
  const openNew = () => setEditor({ id: null, name: "", desc: "", meds: [] });
  const openEdit = (b) => setEditor({ id: b.id, name: b.name, desc: b.desc, meds: [...b.meds] });

  const save = () => {
    const name = editor.name.trim();
    if (!name || editor.meds.length === 0) return;
    const data = { name, desc: editor.desc.trim(), meds: editor.meds };
    if (editor.id) patch(editor.id, (b) => ({ ...b, ...data }));
    else setBundles((p) => [...p, { id: Date.now(), active: true, ...data }]);
    setEditor(null);
  };

  const remove = (id) => {
    setBundles((p) => p.filter((b) => b.id !== id));
    if (editor?.id === id) setEditor(null);
  };

  return (
    <div className={cx("bn-fm-wrap")}>
      <div className={cx("bn-fm-header")}>
        <h1 className={cx("bn-fm-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("bn-fm-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("bn-fm-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`bn-fm-tab ${active.to === t.to ? "bn-fm-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("bn-wrap")}>
        <div className={cx(`bn-side ${editor ? "bn-side-narrow" : ""}`)}>
          <div className={cx("bn-bar")}>
            <span className={cx("bn-total")}>{bundles.length} {bundles.length === 1 ? "bundle" : "bundles"}</span>
            <button type="button" className={cx("bn-btn")} onClick={openNew}><Plus size={14} /> New Bundle</button>
          </div>

          <div className={cx("bn-list")}>
            {bundles.map((b) => (
              <div key={b.id} className={cx(`bn-row ${editor?.id === b.id ? "bn-row-on" : ""} ${b.active ? "" : "bn-row-off"}`)}>
                <Toggle
                  on={b.active}
                  onChange={() => patch(b.id, (x) => ({ ...x, active: !x.active }))}
                  size="large"
                  color="softBlue"
                  className={cx("bn-tg")}
                  label={`Toggle ${b.name}`}
                />
                <div className={cx("bn-info")}>
                  <div className={cx("bn-name")}>{b.name}</div>
                  {b.desc && <div className={cx("bn-desc")}>{b.desc}</div>}
                  <div className={cx("bn-count")}>{b.meds.length} {b.meds.length === 1 ? "medicine" : "medicines"}</div>
                </div>
                <div className={cx("bn-acts")}>
                  <button type="button" onClick={() => openEdit(b)} aria-label="Edit bundle"><Pencil size={13} /></button>
                  <button type="button" className={cx("bn-del")} onClick={() => remove(b.id)} aria-label="Delete bundle"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {bundles.length === 0 && <p className={cx("bn-empty")}>No bundles yet.</p>}
          </div>
        </div>

        {editor && <BundleEditor editor={editor} setEditor={setEditor} onClose={() => setEditor(null)} onSave={save} />}
      </div>
    </div>
  );
};

export default Bundles;