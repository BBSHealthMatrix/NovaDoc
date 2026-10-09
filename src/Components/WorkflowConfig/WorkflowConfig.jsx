import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useState } from "react";
import { Plus, GripVertical, ChevronUp, ChevronDown, Pencil, Trash2, X, Check } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { VISIT_TYPES, COUNTER_TYPES, WORKFLOWS } from "./WorkflowConfigData.js";
import styles from "./WorkflowConfig.module.css";

const cx = createClassNames(styles);

const WorkflowConfig = () => {
  const [visit, setVisit] = useState(VISIT_TYPES[0]);
  const [flows, setFlows] = useState(WORKFLOWS);
  const [form, setForm] = useState(null); // null | { id?, name, order, counter, avg, mandatory, allowSkip }

  const steps = flows[visit] || [];
  const setSteps = (next) => setFlows((p) => ({ ...p, [visit]: next }));

  // Escape closes the modal
  useEffect(() => {
    if (!form) return;
    const onKey = (e) => { if (e.key === "Escape") setForm(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [form]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const move = (i, dir) => {
    const next = [...steps];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setSteps(next);
  };

  const openNew = () => setForm({
    name: "", order: String(steps.length + 1), counter: COUNTER_TYPES[0], avg: "10", mandatory: true, allowSkip: false,
  });

  const openEdit = (s, i) => setForm({ ...s, order: String(i + 1), avg: String(s.avg) });

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = {
      id: form.id || Date.now(), name, counter: form.counter, avg: Number(form.avg) || 0,
      mandatory: form.mandatory, allowSkip: form.allowSkip,
    };
    const rest = steps.filter((s) => s.id !== form.id);
    const at = Math.min(Math.max((parseInt(form.order, 10) || rest.length + 1) - 1, 0), rest.length);
    setSteps([...rest.slice(0, at), item, ...rest.slice(at)]);
    setForm(null);
  };

  const badge = (s) => (s.allowSkip ? ["Skippable", "wf-skip"] : s.mandatory ? ["Mandatory", "wf-mand"] : ["Optional", ""]);

  return (
    <div className={cx("wf-wrap")}>
      <h1 className={cx("wf-title")}>Workflow Configuration</h1>
      <p className={cx("wf-desc")}>Define the ordered steps a patient follows for each visit type.</p>

      <div className={cx("wf-bar")}>
        <span className={cx("wf-label")}>Visit Type:</span>
        <div className={cx("wf-visit")}>
          <Select value={visit} options={VISIT_TYPES} onChange={setVisit} label="Visit Type" />
        </div>
        <button type="button" className={cx("wf-add")} onClick={openNew}><Plus size={14} /> Add Step</button>
      </div>

      <div className={cx("wf-list")}>
        {steps.map((s, i) => {
          const [text, tone] = badge(s);
          return (
            <div className={cx("wf-step")} key={s.id}>
              <GripVertical size={14} className={cx("wf-grip")} />
              <span className={cx("wf-num")}>{i + 1}</span>
              <div className={cx("wf-info")}>
                <p className={cx("wf-name")}>{s.name}</p>
                <p className={cx("wf-sub")}>{s.counter} · {s.avg} min avg</p>
              </div>
              <span className={cx(`wf-badge ${tone}`)}>{text}</span>
              <div className={cx("wf-acts")}>
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ChevronUp size={12} /></button>
                <button type="button" disabled={i === steps.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ChevronDown size={12} /></button>
                <button type="button" onClick={() => openEdit(s, i)} aria-label={`Edit ${s.name}`}><Pencil size={12} /></button>
                <button type="button" className={cx("wf-del")} onClick={() => setSteps(steps.filter((x) => x.id !== s.id))} aria-label={`Delete ${s.name}`}><Trash2 size={13} /></button>
              </div>
            </div>
          );
        })}
        {steps.length === 0 && <p className={cx("wf-empty")}>No steps yet — add the first step.</p>}
      </div>

      {form && (
        <div className={cx("wf-overlay")} onMouseDown={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
          <div className={cx("wf-modal")} role="dialog" aria-modal="true" aria-label={form.id ? "Edit Workflow Step" : "Add Workflow Step"}>
            <h2 className={cx("wf-mtitle")}>{form.id ? "Edit Workflow Step" : "Add Workflow Step"}</h2>
            <button type="button" className={cx("wf-close")} onClick={() => setForm(null)} aria-label="Close"><X size={13} /></button>

            <label className={cx("wf-field")}>
              <span>Step Name *</span>
              <input className={cx("wf-in")} placeholder="e.g. Doctor Consultation" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </label>

            <div className={cx("wf-row")}>
              <label className={cx("wf-field")}>
                <span>Step Order</span>
                <input className={cx("wf-in")} type="number" min="1" value={form.order} onChange={(e) => set({ order: e.target.value })} />
              </label>
              <div className={cx("wf-field")}>
                <span>Counter Type *</span>
                <Select value={form.counter} options={COUNTER_TYPES} onChange={(v) => set({ counter: v })} label="Counter Type" />
              </div>
            </div>

            <div className={cx("wf-row")}>
              <label className={cx("wf-field")}>
                <span>Avg Service Time (min)</span>
                <input className={cx("wf-in")} type="number" min="0" value={form.avg} onChange={(e) => set({ avg: e.target.value })} />
              </label>
            </div>

            <div className={cx("wf-toggles")}>
              <label className={cx("wf-check")}>
                <Toggle size="medium" color="softBlue" on={form.mandatory} onChange={() => set({ mandatory: !form.mandatory })} label="Mandatory" />
                Mandatory
              </label>
              <label className={cx("wf-check")}>
                <Toggle size="medium" color="amber" className={cx("wf-skip-tg")} on={form.allowSkip} onChange={() => set({ allowSkip: !form.allowSkip })} label="Allow Skip" />
                Allow Skip
              </label>
            </div>

            <div className={cx("wf-mfoot")}>
              <button type="button" className={cx("wf-cancel")} onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className={cx("wf-save")} onClick={save}><Check size={13} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowConfig;