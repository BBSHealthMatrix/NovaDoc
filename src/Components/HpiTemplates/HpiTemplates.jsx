import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { FileText, Plus, Pencil, Copy, Trash2 } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import HpiEditor from "./HpiEditor";
import { SEED } from "./HpiTemplatesData.js";
import styles from "./HpiTemplates.module.css";

const cx = createClassNames(styles);

const HpiTemplates = () => {
  const [items, setItems] = useState(SEED);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | template

  const save = (t) => {
    setItems((p) => (p.some((x) => x.id === t.id) ? p.map((x) => (x.id === t.id ? t : x)) : [...p, t]));
    setEditing(null);
  };

  const copy = (t) => setItems((p) => {
    const i = p.findIndex((x) => x.id === t.id);
    const next = [...p];
    next.splice(i + 1, 0, { ...t, id: Date.now(), name: `${t.name} (Copy)`, fields: t.fields.map((fl) => ({ ...fl })) });
    return next;
  });

  const del = (id) => {
    if (window.confirm("Delete this template?")) setItems((p) => p.filter((x) => x.id !== id));
  };

  const flip = (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  if (editing) {
    return <HpiEditor template={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={save} />;
  }

  const term = q.trim().toLowerCase();
  const list = items.filter((t) => `${t.name} ${t.complaint}`.toLowerCase().includes(term));

  return (
    <div className={cx("hpi-wrap")}>
      <div className={cx("hpi-bar")}>
        <div className={cx("hpi-search")}>
          <FileText size={12} />
          <input placeholder="Search templates..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button type="button" className={cx("hpi-new")} onClick={() => setEditing("new")}><Plus size={13} /> New Template</button>
      </div>

      <div className={cx("hpi-table")}>
        <div className={cx("hpi-head")}>
          <span>Template Name</span>
          <span>Chief Complaint</span>
          <span className={cx("hpi-c")}>Fields</span>
          <span className={cx("hpi-c")}>Status</span>
          <span className={cx("hpi-r")}>Actions</span>
        </div>

        {list.map((t) => (
          <div className={cx("hpi-row")} key={t.id}>
            <span className={cx("hpi-name")}>{t.name}</span>
            <span><span className={cx("hpi-tag")}>{t.complaint}</span></span>
            <span className={cx("hpi-c hpi-count")}>{t.fields.length}</span>
            <span className={cx("hpi-c")}>
              <Toggle size="large" color="softBlue" on={t.active} onChange={() => flip(t.id)} label={`${t.name} active`} />
            </span>
            <span className={cx("hpi-r hpi-acts")}>
              <button type="button" onClick={() => setEditing(t)} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
              <button type="button" onClick={() => copy(t)} aria-label={`Duplicate ${t.name}`}><Copy size={12} /></button>
              <button type="button" onClick={() => del(t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={12} /></button>
            </span>
          </div>
        ))}

        {list.length === 0 && <p className={cx("hpi-empty")}>No templates found.</p>}
      </div>
    </div>
  );
};

export default HpiTemplates;