import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Plus, Target, ChevronRight, ChevronDown, Pencil, Trash2, X, CircleCheck } from "lucide-react";
import { GOALS } from "./PatientGoalsData.js";
import styles from "./PatientGoals.module.css";

const cx = createClassNames(styles);

const PatientGoals = () => {
  const [goals, setGoals] = useState(GOALS);
  const [form, setForm] = useState(null); // null | { id?, title, actions[] }
  const [open, setOpen] = useState({});

  const setAction = (i, value) => setForm((f) => ({ ...f, actions: f.actions.map((a, k) => (k === i ? value : a)) }));

  const save = () => {
    const title = form.title.trim();
    if (!title) return;
    const actions = form.actions.map((a) => a.trim()).filter(Boolean);
    setGoals((p) => (form.id
      ? p.map((g) => (g.id === form.id ? { ...g, title, actions } : g))
      : [...p, { id: Date.now(), title, actions }]));
    setForm(null);
  };

  const del = (id) => {
    setGoals((p) => p.filter((g) => g.id !== id));
    if (form?.id === id) setForm(null);
  };

  const editor = (isNew) => (
    <div className={cx(`pg-form ${isNew ? "pg-form-new" : ""}`)}>
      <input
        className={cx("pg-in")}
        placeholder="Goal title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <p className={cx("pg-label")}>Recommended Actions</p>
      <div className={cx("pg-actions")}>
        {form.actions.map((a, i) => (
          <div className={cx("pg-act")} key={i}>
            <input
              className={cx("pg-in pg-act-in")}
              autoFocus={isNew && i === form.actions.length - 1}
              placeholder={`Action ${i + 1}`}
              value={a}
              onChange={(e) => setAction(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setForm(null); }}
            />
            {form.actions.length > 1 && (
              <button
                type="button"
                className={cx("pg-x")}
                onClick={() => setForm({ ...form, actions: form.actions.filter((_, k) => k !== i) })}
                aria-label={`Remove action ${i + 1}`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className={cx("pg-add-act")} onClick={() => setForm({ ...form, actions: [...form.actions, ""] })}>
        <Plus size={10} /> Add action
      </button>
      <div className={cx("pg-btns")}>
        <button type="button" className={cx("pg-save")} onClick={save}>
          {isNew ? "Save Goal" : <><CircleCheck size={14} /> Save</>}
        </button>
        <button type="button" className={cx("pg-cancel")} onClick={() => setForm(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div className={cx("pg-page")}>
      <div className={cx("pg-header")}>
        <h1 className={cx("pg-title")}>Patient Goals</h1>
        <p className={cx("pg-desc")}>Define goal templates and associated actions for patient care plans.</p>
      </div>

      <div className={cx("pg-bar")}>
        <span className={cx("pg-count")}>{goals.length} patient goal templates</span>
        <button type="button" className={cx("pg-new")} onClick={() => setForm({ title: "", actions: [""] })}>
          <Plus size={12} /> New Goal
        </button>
      </div>

      <div className={cx("pg-list")}>
        {form && !form.id && editor(true)}

        {goals.map((g) => (form?.id === g.id ? (
          <div key={g.id}>{editor(false)}</div>
        ) : (
          <div className={cx("pg-goal")} key={g.id}>
            <div className={cx("pg-row")}>
              <Target size={14} className={cx("pg-ic")} />
              <span className={cx("pg-name")}>{g.title}</span>
              <span className={cx("pg-count-sm")}>{g.actions.length} actions</span>
              <button type="button" className={cx("pg-b")} onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))} aria-label={open[g.id] ? "Collapse" : "Expand"}>
                {open[g.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              <button type="button" className={cx("pg-b")} onClick={() => setForm({ id: g.id, title: g.title, actions: [...g.actions] })} aria-label={`Edit ${g.title}`}>
                <Pencil size={12} />
              </button>
              <button type="button" className={cx("pg-b pg-del")} onClick={() => del(g.id)} aria-label={`Delete ${g.title}`}>
                <Trash2 size={13} />
              </button>
            </div>
            {open[g.id] && (
              <ul className={cx("pg-detail")}>
                {g.actions.map((a, i) => <li key={i}>{a}</li>)}
                {g.actions.length === 0 && <li className={cx("pg-none")}>No actions yet</li>}
              </ul>
            )}
          </div>
        )))}
      </div>
    </div>
  );
};

export default PatientGoals;