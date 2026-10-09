import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { QUEUE_MODES, PARTITIONS, MODE_HINTS, COLORS, VISIT_TYPES, BLANK } from "./VisitTypesData.js";
import styles from "./VisitTypes.module.css";

const cx = createClassNames(styles);

const VisitTypes = () => {
  const [types, setTypes] = useState(VISIT_TYPES);
  const [form, setForm] = useState(null); // null | { id?, name, code, prefix, color, mode, partition, active }

  // Escape closes the modal
  useEffect(() => {
    if (!form) return;
    const onKey = (e) => { if (e.key === "Escape") setForm(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [form]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const update = (id, patch) => setTypes((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const save = () => {
    const item = { ...form, name: form.name.trim(), code: form.code.trim().toUpperCase(), prefix: form.prefix.trim().toUpperCase() };
    if (!item.name || !item.code || !item.prefix) return;
    setTypes((p) => (form.id ? p.map((t) => (t.id === form.id ? item : t)) : [...p, { ...item, id: Date.now() }]));
    setForm(null);
  };

  return (
    <div className={cx("vt-wrap")}>
      <div className={cx("vt-head")}>
        <div>
          <h1 className={cx("vt-title")}>Visit Type Management</h1>
          <p className={cx("vt-desc")}>Define visit types, token prefixes, and queue partitioning rules.</p>
        </div>
        <button type="button" className={cx("vt-add")} onClick={() => setForm({ ...BLANK })}>
          <Plus size={14} /> Add Visit Type
        </button>
      </div>

      <div className={cx("vt-grid")}>
        {types.map((t) => (
          <div className={cx("vt-card")} key={t.id}>
            <div className={cx("vt-top")}>
              <span className={cx("vt-av")} style={{ background: t.color }}>{t.prefix}</span>
              <div className={cx("vt-names")}>
                <p className={cx("vt-name")}>{t.name}</p>
                <p className={cx("vt-code")}>{t.code}</p>
              </div>
              <span className={cx(`vt-status ${t.active ? "vt-on" : ""}`)}>{t.active ? "active" : "inactive"}</span>
            </div>
            <p className={cx("vt-queue")}>Queue: <b>{t.mode}</b></p>
            {MODE_HINTS[t.mode] && <p className={cx("vt-hint")}>{MODE_HINTS[t.mode]}</p>}
            <div className={cx("vt-foot")}>
              <Toggle size="small" color="green" on={t.active} onChange={() => update(t.id, { active: !t.active })} label={`${t.name} active`} />
              <div className={cx("vt-acts")}>
                <button type="button" onClick={() => setForm({ ...t })} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
                <button type="button" className={cx("vt-del")} onClick={() => setTypes((p) => p.filter((x) => x.id !== t.id))} aria-label={`Delete ${t.name}`}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className={cx("vt-overlay")} onMouseDown={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
          <div className={cx("vt-modal")} role="dialog" aria-modal="true" aria-label={form.id ? "Edit Visit Type" : "Add Visit Type"}>
            <h2 className={cx("vt-mtitle")}>{form.id ? "Edit Visit Type" : "Add Visit Type"}</h2>
            <button type="button" className={cx("vt-close")} onClick={() => setForm(null)} aria-label="Close"><X size={13} /></button>

            <label className={cx("vt-field")}>
              <span>Visit Type Name *</span>
              <input className={cx("vt-in")} placeholder="e.g. Normal Consultation" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </label>

            <div className={cx("vt-row")}>
              <label className={cx("vt-field")}>
                <span>Code *</span>
                <input className={cx("vt-in vt-mono")} placeholder="NORM" maxLength={6} value={form.code} onChange={(e) => set({ code: e.target.value })} />
              </label>
              <label className={cx("vt-field")}>
                <span>Token Prefix *</span>
                <input className={cx("vt-in vt-mono")} placeholder="C" maxLength={3} value={form.prefix} onChange={(e) => set({ prefix: e.target.value })} />
              </label>
            </div>

            <div className={cx("vt-row")}>
              <div className={cx("vt-field")}>
                <span>Color</span>
                <div className={cx("vt-colors")}>
                  {COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={cx(`vt-swatch ${form.color === c ? "vt-swatch-on" : ""}`)}
                      style={{ background: c }}
                      onClick={() => set({ color: c })}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div className={cx("vt-field")}>
                <span>Queue Mode</span>
                <Select value={form.mode} options={QUEUE_MODES} onChange={(v) => set({ mode: v })} label="Queue Mode" />
              </div>
            </div>

            {form.mode === "Partitioned Queue" && (
              <div className={cx("vt-row")}>
                <div className={cx("vt-field")}>
                  <span>Partition By</span>
                  <Select value={form.partition} options={PARTITIONS} onChange={(v) => set({ partition: v })} label="Partition By" />
                </div>
              </div>
            )}

            <label className={cx("vt-active")}>
              <Toggle size="medium" color="green" on={form.active} onChange={() => set({ active: !form.active })} label="Active" />
              Active
            </label>

            <div className={cx("vt-mfoot")}>
              <button type="button" className={cx("vt-cancel")} onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className={cx("vt-save")} onClick={save}><Check size={13} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitTypes;