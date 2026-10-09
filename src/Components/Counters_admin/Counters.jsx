import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { SEED as BRANCH_SEED } from "../../data/branches.js";
import { COUNTER_TYPES, COUNTERS } from "./CountersData.js";
import styles from "./Counters.module.css";

const cx = createClassNames(styles);

// only active branches can host counters
const BRANCHES = BRANCH_SEED.filter((b) => b.active).map((b) => b.name);

const Counters = () => {
  const [counters, setCounters] = useState(COUNTERS);
  const [form, setForm] = useState(null); // null | { id?, name, type, branch, multi, active }

  // Escape closes the modal
  useEffect(() => {
    if (!form) return;
    const onKey = (e) => { if (e.key === "Escape") setForm(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [form]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const update = (id, patch) => setCounters((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const openNew = () => setForm({ name: "", type: COUNTER_TYPES[0], branch: BRANCHES[0], multi: false, active: true });

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = { ...form, name };
    setCounters((p) => (form.id ? p.map((c) => (c.id === form.id ? item : c)) : [...p, { ...item, id: Date.now() }]));
    setForm(null);
  };

  return (
    <div className={cx("cn-wrap")}>
      <div className={cx("cn-head")}>
        <div>
          <h1 className={cx("cn-title")}>Counters (Stations)</h1>
          <p className={cx("cn-desc")}>Physical or virtual service stations where patients are attended.</p>
        </div>
        <button type="button" className={cx("cn-add")} onClick={openNew}><Plus size={14} /> Add Counter</button>
      </div>

      <div className={cx("cn-card")}>
        <div className={cx("cn-row cn-th")}>
          <span>Counter Name</span>
          <span>Type</span>
          <span>Branch</span>
          <span>Multi-User</span>
          <span>Status</span>
          <span />
        </div>
        {counters.map((c) => (
          <div className={cx("cn-row cn-tr")} key={c.id}>
            <span className={cx("cn-name")}>{c.name}</span>
            <span className={cx("cn-type")}>{c.type}</span>
            <span className={cx("cn-branch")}>{c.branch}</span>
            <span className={cx(`cn-multi ${c.multi ? "cn-yes" : ""}`)}>{c.multi ? "Yes" : "No"}</span>
            <span className={cx("cn-status")}>
              <Toggle size="small" color="green" className={cx("cn-tg-green")} on={c.active} onChange={() => update(c.id, { active: !c.active })} label={`${c.name} active`} />
              <span className={cx(c.active ? "cn-on" : "cn-off")}>{c.active ? "Active" : "Inactive"}</span>
            </span>
            <span className={cx("cn-acts")}>
              <button type="button" onClick={() => setForm({ ...c })} aria-label={`Edit ${c.name}`}><Pencil size={12} /></button>
              <button type="button" className={cx("cn-del")} onClick={() => setCounters((p) => p.filter((x) => x.id !== c.id))} aria-label={`Delete ${c.name}`}><Trash2 size={12} /></button>
            </span>
          </div>
        ))}
        {counters.length === 0 && <p className={cx("cn-empty")}>No counters yet.</p>}
      </div>

      {form && (
        <div className={cx("cn-overlay")} onMouseDown={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
          <div className={cx("cn-modal")} role="dialog" aria-modal="true" aria-label={form.id ? "Edit Counter" : "Add Counter"}>
            <h2 className={cx("cn-mtitle")}>{form.id ? "Edit Counter" : "Add Counter"}</h2>
            <button type="button" className={cx("cn-close")} onClick={() => setForm(null)} aria-label="Close"><X size={13} /></button>

            <label className={cx("cn-field")}>
              <span>Counter Name *</span>
              <input className={cx("cn-in")} autoFocus placeholder="e.g. Dr. Room A" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </label>

            <div className={cx("cn-frow")}>
              <div className={cx("cn-field")}>
                <span>Counter Type *</span>
                <Select value={form.type} options={COUNTER_TYPES} onChange={(v) => set({ type: v })} label="Counter Type" />
              </div>
              <div className={cx("cn-field")}>
                <span>Branch *</span>
                <Select value={form.branch} options={BRANCHES} onChange={(v) => set({ branch: v })} label="Branch" />
              </div>
            </div>

            <div className={cx("cn-toggles")}>
              <label className={cx("cn-check")}>
                <Toggle size="medium" color="green" className={cx("cn-tg-purple")} on={form.multi} onChange={() => set({ multi: !form.multi })} label="Allow Multi-User" />
                Allow Multi-User
              </label>
              <label className={cx("cn-check")}>
                <Toggle size="medium" color="green" className={cx("cn-tg-green")} on={form.active} onChange={() => set({ active: !form.active })} label="Active" />
                Active
              </label>
            </div>

            <div className={cx("cn-mfoot")}>
              <button type="button" className={cx("cn-cancel")} onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className={cx("cn-save")} onClick={save}><Check size={13} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counters;