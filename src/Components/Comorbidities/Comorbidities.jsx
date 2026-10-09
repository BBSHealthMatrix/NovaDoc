 import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Search, Plus, Heart, Pencil, Trash2, X } from "lucide-react";
import { CATEGORIES, SEED } from "./ComorbiditiesData.js";
import styles from "./Comorbidities.module.css";

const cx = createClassNames(styles);

const EMPTY = { name: "", code: "", cat: CATEGORIES[0] };

const Comorbidities = () => {
  const [items, setItems] = useState(SEED);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(null); // null | { id?, name, code, cat }

  // filter pills = categories that are in use, A–Z
  const cats = [...new Set(items.map((i) => i.cat))].sort();
  const active = cats.includes(filter) ? filter : "All";
  const term = q.trim().toLowerCase();
  const list = items.filter((i) =>
    (active === "All" || i.cat === active) && `${i.name} ${i.code}`.toLowerCase().includes(term));

  const set = (patch) => setForm((p) => ({ ...p, ...patch }));

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = { name, code: form.code.trim().toUpperCase(), cat: form.cat };
    setItems((p) => (form.id
      ? p.map((i) => (i.id === form.id ? { ...i, ...item } : i))
      : [...p, { id: Date.now(), ...item }]));
    setForm(null);
  };

  const del = (id) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (form?.id === id) setForm(null);
  };

  return (
    <div className={cx("cmb-page")}>
      <div className={cx("cmb-header")}>
        <h1 className={cx("cmb-title")}>Comorbidities</h1>
        <p className={cx("cmb-desc")}>Manage the comorbidity list used when documenting patient conditions.</p>
      </div>

      <div className={cx("cmb-bar")}>
        <div className={cx("cmb-search")}>
          <Search size={12} />
          <input placeholder="Search comorbidities..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className={cx("cmb-pills")}>
          {["All", ...cats].map((c) => (
            <button type="button" key={c} className={cx(`cmb-pill ${active === c ? "cmb-pill-on" : ""}`)} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <button type="button" className={cx("cmb-add")} onClick={() => setForm({ ...EMPTY })}><Plus size={12} /> Add</button>
      </div>

      <div className={cx("cmb-body")}>
        {form && (
          <div className={cx("cmb-form")}>
            <input
              className={cx("cmb-in cmb-in-name")}
              autoFocus
              placeholder="Condition name"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setForm(null); }}
            />
            <input
              className={cx("cmb-in cmb-in-code")}
              placeholder="ICD-10"
              value={form.code}
              onChange={(e) => set({ code: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") save(); }}
            />
            <select className={cx("cmb-in cmb-in-cat")} value={form.cat} onChange={(e) => set({ cat: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button type="button" className={cx("cmb-form-btn")} onClick={save}>{form.id ? "Save" : "Add"}</button>
            <button type="button" className={cx("cmb-form-x")} onClick={() => setForm(null)} aria-label="Close"><X size={14} /></button>
          </div>
        )}

        {list.map((i) => (
          <div className={cx("cmb-row")} key={i.id}>
            <Heart size={13} className={cx("cmb-heart")} />
            <span className={cx("cmb-name")}>{i.name}</span>
            {i.code && <span className={cx("cmb-code")}>{i.code}</span>}
            <span className={cx("cmb-cat")}>{i.cat}</span>
            <span className={cx("cmb-acts")}>
              <button type="button" onClick={() => setForm({ ...i })} aria-label={`Edit ${i.name}`}><Pencil size={12} /></button>
              <button type="button" onClick={() => del(i.id)} aria-label={`Delete ${i.name}`}><Trash2 size={12} /></button>
            </span>
          </div>
        ))}

        {list.length === 0 && <p className={cx("cmb-empty")}>No comorbidities found.</p>}
      </div>
    </div>
  );
};

export default Comorbidities;