import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Building2, Check, FileText, GripVertical, Layers, Pencil, Plus, Save, ScanLine, Trash2, X } from "lucide-react";
import { REASON_TEMPLATES, newId } from "./ReasonTemplatesData.js";
import styles from "./ReasonTemplates.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/imaging-test-list", label: "Catalog", icon: Layers },
  { to: "/admin/reason-templates", label: "Reason Templates", icon: FileText },
  { to: "/admin/imaging-partners", label: "Imaging Partners", icon: Building2 },
];

const ReasonTemplates = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname)?.to ?? TABS[0].to;
  const [items, setItems] = useState(REASON_TEMPLATES);
  const [dirty, setDirty] = useState(true);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(null); // { id, text }
  const [dragId, setDragId] = useState(null);

  const change = (fn) => { setItems(fn); setDirty(true); };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    change((p) => [...p, { id: newId("r"), text }]);
    setDraft("");
  };

  const saveEdit = () => {
    const text = editing.text.trim();
    if (!text) return;
    change((p) => p.map((x) => (x.id === editing.id ? { ...x, text } : x)));
    setEditing(null);
  };

  const dropOn = (targetId) => {
    if (!dragId || dragId === targetId) return;
    change((p) => {
      const from = p.findIndex((x) => x.id === dragId);
      const to = p.findIndex((x) => x.id === targetId);
      const next = [...p];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <div className={cx("rt-wrap")}>
      <div className={cx("rt-header")}>
        <div className={cx("rt-hrow")}>
          <span className={cx("rt-hicon")}><ScanLine size={15} /></span>
          <div>
            <h1 className={cx("rt-title")}>Imaging Catalog</h1>
            <p className={cx("rt-desc")}>Manage the imaging catalog, reason templates, and radiology partners</p>
          </div>
        </div>
        <div className={cx("rt-tabs")}>
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className={cx(`rt-tab ${active === t.to ? "rt-tab-on" : ""}`)}>
                <Icon size={12} /> {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <>
        <div className={cx("rt-bar")}>
          <p className={cx("rt-bartext")}>Manage indication templates available when ordering imaging tests. Drag to reorder.</p>
          <button type="button" className={cx(`rt-btn ${dirty ? "" : "rt-btn-done"}`)} disabled={!dirty} onClick={() => setDirty(false)}>
            <Save size={13} /> {dirty ? "Save" : "Up to date"}
          </button>
        </div>

        <div className={cx("rt-rtadd")}>
          <input
            placeholder="Add a new reason template..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button type="button" className={cx("rt-btn")} disabled={!draft.trim()} onClick={add}><Plus size={13} /> Add</button>
        </div>

        <div className={cx("rt-scroll")}>
          <div className={cx("rt-rtlist")}>
            {items.map((r, i) => (
              <div
                key={r.id}
                className={cx(`rt-rt ${dragId === r.id ? "rt-rt-drag" : ""}`)}
                draggable={editing?.id !== r.id}
                onDragStart={() => setDragId(r.id)}
                onDragOver={(e) => { e.preventDefault(); dropOn(r.id); }}
                onDragEnd={() => setDragId(null)}
              >
                <GripVertical size={13} className={cx("rt-rtgrip")} />
                <span className={cx("rt-rtnum")}>{i + 1}.</span>
                {editing?.id === r.id ? (
                  <>
                    <input
                      autoFocus
                      className={cx("rt-rtedit")}
                      value={editing.text}
                      onChange={(e) => setEditing((p) => ({ ...p, text: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                    />
                    <button type="button" className={cx("rt-rtok")} onClick={saveEdit} aria-label="Save"><Check size={13} /></button>
                    <button type="button" className={cx("rt-rtx")} onClick={() => setEditing(null)} aria-label="Cancel"><X size={13} /></button>
                  </>
                ) : (
                  <>
                    <span className={cx("rt-rttext")}>{r.text}</span>
                    <div className={cx("rt-rtacts")}>
                      <button type="button" onClick={() => setEditing({ id: r.id, text: r.text })} aria-label={`Edit ${r.text}`}><Pencil size={13} /></button>
                      <button type="button" className={cx("rt-ico-del")} onClick={() => change((p) => p.filter((x) => x.id !== r.id))} aria-label={`Delete ${r.text}`}><Trash2 size={13} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default ReasonTemplates;