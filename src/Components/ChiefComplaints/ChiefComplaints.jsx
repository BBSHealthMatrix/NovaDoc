import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Search, Plus, Save, Pencil, Trash2 } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SPECIALTIES, COMPLAINTS as SEED } from "../../data/complaints.js";
import styles from "./ChiefComplaints.module.css";

const cx = createClassNames(styles);

const ChiefComplaints = () => {
  const [items, setItems] = useState(SEED);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // null | "add" | complaint id being edited
  const [name, setName] = useState("");
  const [specs, setSpecs] = useState(["General"]);

  const list = items.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()));

  const open = (c) => {
    setName(c ? c.name : "");
    setSpecs(c ? c.specs : ["General"]);
    setForm(c ? c.id : "add");
  };

  const pick = (s) => setSpecs((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const save = () => {
    if (!name.trim()) return;
    setItems((p) => (form === "add"
      ? [...p, { id: Date.now(), name: name.trim(), specs, active: true }]
      : p.map((c) => (c.id === form ? { ...c, name: name.trim(), specs } : c))));
    setForm(null);
  };

  const del = (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    setItems((p) => p.filter((c) => c.id !== id));
    if (form === id) setForm(null);
  };

  const flip = (id) => setItems((p) => p.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  return (
    <div className={cx("cc-wrap")}>
      <h1 className={cx("cc-title")}>Chief Complaint Library</h1>
      <p className={cx("cc-desc")}>Manage the pick-list of chief complaints doctors use in the SOAP note.</p>

      <div className={cx("cc-bar")}>
        <div className={cx("cc-search")}>
          <Search size={12} />
          <input placeholder="Search complaints..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button type="button" className={cx("cc-add")} onClick={() => open()}><Plus size={13} /> Add Complaint</button>
      </div>

      {form !== null && (
        <div className={cx("cc-form")}>
          <input
            className={cx("cc-input")}
            autoFocus
            placeholder="Complaint name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setForm(null); }}
          />
          <p className={cx("cc-form-label")}>Specialties</p>
          <div className={cx("cc-chips")}>
            {SPECIALTIES.map((s) => (
              <button type="button" key={s} className={cx(`cc-chip ${specs.includes(s) ? "cc-chip-on" : ""}`)} onClick={() => pick(s)}>{s}</button>
            ))}
          </div>
          <div className={cx("cc-form-btns")}>
            <button type="button" className={cx("cc-save")} onClick={save} disabled={!name.trim()}><Save size={12} /> Save</button>
            <button type="button" className={cx("cc-cancel")} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={cx("cc-table")}>
        <div className={cx("cc-head")}>
          <span>Complaint</span>
          <span>Specialties</span>
          <span>Active</span>
          <span />
        </div>
        {list.map((c) => (
          <div className={cx("cc-row")} key={c.id}>
            <span className={cx("cc-name")}>{c.name}</span>
            <span className={cx("cc-tags")}>
              {c.specs.map((s) => <span key={s} className={cx("cc-tag")}>{s}</span>)}
            </span>
            <span><Toggle size="large" color="softBlue" on={c.active} onChange={() => flip(c.id)} label={`${c.name} active`} /></span>
            <span className={cx("cc-acts")}>
              <button type="button" onClick={() => open(c)} aria-label={`Edit ${c.name}`}><Pencil size={11} /></button>
              <button type="button" onClick={() => del(c.id)} aria-label={`Delete ${c.name}`}><Trash2 size={11} /></button>
            </span>
          </div>
        ))}
        {list.length === 0 && <p className={cx("cc-empty")}>No complaints found.</p>}
      </div>
    </div>
  );
};

export default ChiefComplaints;