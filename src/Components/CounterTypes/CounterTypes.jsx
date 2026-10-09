import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { COUNTER_TYPES, BLANK } from "./CounterTypesData.js";
import styles from "./CounterTypes.module.css";

const cx = createClassNames(styles);

const CounterTypes = () => {
  const [types, setTypes] = useState(COUNTER_TYPES);
  const [form, setForm] = useState(null); // null | { id?, name, desc, max }

  // Escape closes the modal
  useEffect(() => {
    if (!form) return;
    const onKey = (e) => { if (e.key === "Escape") setForm(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [form]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = { id: form.id || Date.now(), name, desc: form.desc.trim(), max: Math.max(1, parseInt(form.max, 10) || 1) };
    setTypes((p) => (form.id ? p.map((t) => (t.id === form.id ? item : t)) : [...p, item]));
    setForm(null);
  };

  return (
    <div className={cx("ct-wrap")}>
      <div className={cx("ct-head")}>
        <div>
          <h1 className={cx("ct-title")}>Counter Types</h1>
          <p className={cx("ct-desc")}>Define logical counter categories used in workflow steps and station configuration.</p>
        </div>
        <button type="button" className={cx("ct-add")} onClick={() => setForm({ ...BLANK })}>
          <Plus size={14} /> Add Counter Type
        </button>
      </div>

      <div className={cx("ct-card")}>
        <div className={cx("ct-row ct-th")}>
          <span>Name</span>
          <span>Description</span>
          <span>Max Parallel</span>
          <span />
        </div>
        {types.map((t) => (
          <div className={cx("ct-row ct-tr")} key={t.id}>
            <span className={cx("ct-name")}>{t.name}</span>
            <span className={cx("ct-text")}>{t.desc}</span>
            <span className={cx("ct-max")}>{t.max}</span>
            <span className={cx("ct-acts")}>
              <button type="button" className={cx("ct-edit")} onClick={() => setForm({ ...t, max: String(t.max) })} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
              <button type="button" className={cx("ct-del")} onClick={() => setTypes((p) => p.filter((x) => x.id !== t.id))} aria-label={`Delete ${t.name}`}><Trash2 size={13} /></button>
            </span>
          </div>
        ))}
        {types.length === 0 && <p className={cx("ct-empty")}>No counter types yet.</p>}
      </div>

      {form && (
        <div className={cx("ct-overlay")} onMouseDown={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
          <div className={cx("ct-modal")} role="dialog" aria-modal="true" aria-label={form.id ? "Edit Counter Type" : "Add Counter Type"}>
            <h2 className={cx("ct-mtitle")}>{form.id ? "Edit Counter Type" : "Add Counter Type"}</h2>
            <button type="button" className={cx("ct-close")} onClick={() => setForm(null)} aria-label="Close"><X size={13} /></button>

            <label className={cx("ct-field")}>
              <span>Name *</span>
              <input className={cx("ct-in")} placeholder="e.g. Doctor Room" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </label>
            <label className={cx("ct-field")}>
              <span>Description</span>
              <textarea className={cx("ct-in ct-area")} value={form.desc} onChange={(e) => set({ desc: e.target.value })} />
            </label>
            <label className={cx("ct-field ct-last")}>
              <span>Max Parallel Counters</span>
              <input className={cx("ct-in")} type="number" min="1" value={form.max} onChange={(e) => set({ max: e.target.value })} />
            </label>

            <div className={cx("ct-mfoot")}>
              <button type="button" className={cx("ct-cancel")} onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className={cx("ct-save")} onClick={save}><Check size={13} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterTypes;