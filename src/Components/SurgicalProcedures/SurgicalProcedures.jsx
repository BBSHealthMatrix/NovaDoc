import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Search, Plus, Scissors, TriangleAlert, Pencil, Trash2, X } from "lucide-react";
import { TABS, CATEGORIES, PROCEDURES, COMPLICATIONS } from "./SurgicalProceduresData.js";
import styles from "./SurgicalProcedures.module.css";

const cx = createClassNames(styles);

const SurgicalProcedures = () => {
  const [tab, setTab] = useState("procedures");
  const [data, setData] = useState({ procedures: PROCEDURES, complications: COMPLICATIONS });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(null); // null | { id?, name, cat }

  const isProc = tab === "procedures";
  const current = TABS.find((t) => t.key === tab);
  const items = data[tab];

  // filter pills = categories in use, A–Z
  const cats = [...new Set(data.procedures.map((p) => p.cat))].sort();
  const active = cats.includes(filter) ? filter : "All";
  const term = q.trim().toLowerCase();
  const list = items.filter((i) =>
    (!isProc || active === "All" || i.cat === active) && i.name.toLowerCase().includes(term));

  const switchTab = (key) => {
    setTab(key);
    setQ("");
    setForm(null);
  };

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = isProc ? { name, cat: form.cat } : { name };
    setData((p) => ({
      ...p,
      [tab]: form.id
        ? p[tab].map((i) => (i.id === form.id ? { ...i, ...item } : i))
        : [...p[tab], { id: Date.now(), ...item }],
    }));
    setForm(null);
  };

  const del = (id) => {
    setData((p) => ({ ...p, [tab]: p[tab].filter((i) => i.id !== id) }));
    if (form?.id === id) setForm(null);
  };

  const Icon = isProc ? Scissors : TriangleAlert;

  return (
    <div className={cx("srg-page")}>
      <div className={cx("srg-header")}>
        <h1 className={cx("srg-title")}>Surgical Procedures</h1>
        <p className={cx("srg-desc")}>Manage the surgical procedure list used in patient surgical history.</p>
      </div>

      <div className={cx("srg-tabs")}>
        {TABS.map((t) => (
          <button type="button" key={t.key} className={cx(`srg-tab ${tab === t.key ? "srg-tab-on" : ""}`)} onClick={() => switchTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={cx("srg-bar")}>
        <div className={cx("srg-search")}>
          <Search size={12} />
          <input placeholder={current.search} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className={cx("srg-pills")}>
          {isProc && ["All", ...cats].map((c) => (
            <button type="button" key={c} className={cx(`srg-pill ${active === c ? "srg-pill-on" : ""}`)} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <button type="button" className={cx("srg-add")} onClick={() => setForm({ name: "", cat: CATEGORIES[0] })}>
          <Plus size={12} /> Add
        </button>
      </div>

      <div className={cx("srg-body")}>
        {form && (
          <div className={cx("srg-form")}>
            <input
              className={cx("srg-in")}
              autoFocus
              placeholder={current.placeholder}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setForm(null); }}
            />
            {isProc && (
              <select className={cx("srg-select")} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}
            <button type="button" className={cx("srg-form-btn")} onClick={save}>{form.id ? "Save" : "Add"}</button>
            <button type="button" className={cx("srg-form-x")} onClick={() => setForm(null)} aria-label="Close"><X size={14} /></button>
          </div>
        )}

        {list.map((i) => (
          <div className={cx(`srg-row ${isProc ? "" : "srg-row-sm"}`)} key={i.id}>
            <Icon size={13} className={cx(isProc ? "srg-ic" : "srg-ic-warn")} />
            <span className={cx("srg-name")}>{i.name}</span>
            {isProc && <span className={cx("srg-cat")}>{i.cat}</span>}
            <span className={cx("srg-acts")}>
              <button type="button" onClick={() => setForm({ ...i })} aria-label={`Edit ${i.name}`}><Pencil size={12} /></button>
              <button type="button" onClick={() => del(i.id)} aria-label={`Delete ${i.name}`}><Trash2 size={12} /></button>
            </span>
          </div>
        ))}

        {list.length === 0 && <p className={cx("srg-empty")}>Nothing found.</p>}
      </div>
    </div>
  );
};

export default SurgicalProcedures;