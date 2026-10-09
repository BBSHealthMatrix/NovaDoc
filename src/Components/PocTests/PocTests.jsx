import { createClassNames } from "../../utils/classNames.js";
import { useRef, useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, Save } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { RESULT_TYPES, TESTS, BLANK } from "./PocTestsData.js";
import styles from "./PocTests.module.css";

const cx = createClassNames(styles);

const isNum = (type) => type === "Numeric";
const range = (t) => (isNum(t.type) ? `${t.unit} · ${t.min}–${t.max}` : "—");

const PocTests = () => {
  const [tests, setTests] = useState(TESTS);
  const [form, setForm] = useState(null); // null | { id?, name, type, unit, min, max }
  const [armed, setArmed] = useState(null); // row id whose grip is pressed
  const dragFrom = useRef(null);

  const set = (patch) => setForm((p) => ({ ...p, ...patch }));

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const num = isNum(form.type);
    const item = {
      name,
      type: form.type,
      unit: num ? form.unit.trim() : "",
      min: num ? form.min.trim() : "",
      max: num ? form.max.trim() : "",
    };
    setTests((p) => (form.id
      ? p.map((t) => (t.id === form.id ? { ...t, ...item } : t))
      : [...p, { id: Date.now(), ...item, active: true }]));
    setForm(null);
  };

  const del = (id) => {
    setTests((p) => p.filter((t) => t.id !== id));
    if (form?.id === id) setForm(null);
  };

  const dragOver = (e, i) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === i) return;
    const next = [...tests];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    setTests(next);
    dragFrom.current = i;
  };

  const editor = (inline) => (
    <div className={cx(`poc-form ${inline ? "poc-form-inline" : ""}`)}>
      <div className={cx("poc-grid")}>
        <label className={cx("poc-field")}>
          <span>Test Name</span>
          <input
            className={cx("poc-in")}
            autoFocus
            placeholder="e.g. Blood Glucose"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setForm(null); }}
          />
        </label>
        <label className={cx("poc-field")}>
          <span>Result Type</span>
          <select className={cx("poc-select")} value={form.type} onChange={(e) => set({ type: e.target.value })}>
            {RESULT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        {isNum(form.type) && (
          <>
            <label className={cx("poc-field")}>
              <span>Unit</span>
              <input className={cx("poc-in")} placeholder="e.g. mg/dL" value={form.unit} onChange={(e) => set({ unit: e.target.value })} />
            </label>
            <div className={cx("poc-pair")}>
              <label className={cx("poc-field")}>
                <span>Normal Min</span>
                <input className={cx("poc-in")} placeholder="70" value={form.min} onChange={(e) => set({ min: e.target.value })} />
              </label>
              <label className={cx("poc-field")}>
                <span>Normal Max</span>
                <input className={cx("poc-in")} placeholder="100" value={form.max} onChange={(e) => set({ max: e.target.value })} />
              </label>
            </div>
          </>
        )}
      </div>
      <div className={cx("poc-btns")}>
        <button type="button" className={cx("poc-save")} onClick={save}><Save size={12} /> Save</button>
        <button type="button" className={cx("poc-cancel")} onClick={() => setForm(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className={cx("poc-wrap")}>
      <h1 className={cx("poc-title")}>POC Test Configuration</h1>
      <p className={cx("poc-desc")}>Configure point-of-care tests available in the note, including result types and normal ranges.</p>

      <div className={cx("poc-bar")}>
        <button type="button" className={cx("poc-btn")} onClick={() => setForm({ ...BLANK })}>
          <Plus size={13} /> Add POC Test
        </button>
      </div>

      {form && !form.id && editor(false)}

      <div className={cx("poc-card")}>
        <div className={cx("poc-row poc-head")}>
          <span />
          <span>Test Name</span>
          <span>Result Type</span>
          <span>Unit / Range</span>
          <span>Active</span>
          <span />
        </div>

        {tests.map((t, i) => (form?.id === t.id ? (
          <div key={t.id} className={cx("poc-edit-row")}>{editor(true)}</div>
        ) : (
          <div
            key={t.id}
            className={cx("poc-row poc-item")}
            draggable={armed === t.id}
            onDragStart={() => { dragFrom.current = i; }}
            onDragOver={(e) => dragOver(e, i)}
            onDragEnd={() => { dragFrom.current = null; setArmed(null); }}
          >
            <span className={cx("poc-grip")} onMouseDown={() => setArmed(t.id)} onMouseUp={() => setArmed(null)}>
              <GripVertical size={12} />
            </span>
            <span className={cx("poc-name")}>{t.name}</span>
            <span><span className={cx(`poc-type ${isNum(t.type) ? "poc-type-num" : ""}`)}>{t.type}</span></span>
            <span className={cx("poc-range")}>{range(t)}</span>
            <span>
              <Toggle size="large" color="softBlue" className={cx("poc-toggle")} on={t.active} onChange={() => setTests((p) => p.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)))} label={`${t.name} active`} />
            </span>
            <span className={cx("poc-acts")}>
              <button type="button" onClick={() => setForm({ ...t })} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
              <button type="button" onClick={() => del(t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={12} /></button>
            </span>
          </div>
        )))}

        {tests.length === 0 && <p className={cx("poc-empty")}>No POC tests configured.</p>}
      </div>
    </div>
  );
};

export default PocTests;