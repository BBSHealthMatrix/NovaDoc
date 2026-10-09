import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { ChevronUp, ChevronDown, Plus, Pencil, Trash2, GripVertical, Building2 } from "lucide-react";

import { SEED, subLabel } from "./DepartmentsData.js";

import Toggle from "../Toggle/Toggle";

import SubModal from "./SubModal";

import styles from "./Departments.module.css";

const cx = createClassNames(styles);

const Departments = () => {
  const [depts, setDepts] = useState(SEED);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [modal, setModal] = useState(null);

  const upd = (id, fn) => setDepts((d) => d.map((x) => (x.id === id ? fn(x) : x)));
  const updSub = (did, sid, fn) => upd(did, (x) => ({ ...x, subs: x.subs.map((s) => (s.id === sid ? fn(s) : s)) }));

  const rename = (cur, cb) => {
    const n = window.prompt("Rename", cur);
    if (n && n.trim()) cb(n.trim());
  };

  const delDept = (d) => {
    if (window.confirm(`Delete ${d.name}?`)) setDepts((p) => p.filter((x) => x.id !== d.id));
  };

  const delSub = (d, s) => {
    if (window.confirm(`Delete ${s.name}?`)) upd(d.id, (x) => ({ ...x, subs: x.subs.filter((y) => y.id !== s.id) }));
  };

  const saveDept = () => {
    if (!newName.trim()) return;
    setDepts((d) => [...d, { id: Date.now(), name: newName.trim(), active: true, open: true, subs: [] }]);
    setNewName("");
    setAdding(false);
  };

  const addSubs = (name, ids) => {
    setDepts((d) => d.map((x) => (ids.includes(x.id)
      ? { ...x, open: true, subs: [...x.subs, { id: Date.now() + x.id, name, active: true }] }
      : x)));
    setModal(null);
  };

  return (
    <div className={cx("dep-wrap")}>
      <div className={cx("dep-top")}>
        <div>
          <h1 className={cx("dep-title")}>Departments &amp; Sub-Departments</h1>
          <p className={cx("dep-desc")}>Manage clinic departments and their active status for billing.</p>
        </div>
        <div className={cx("dep-top-btns")}>
          <button className={cx("dep-btn-o")} onClick={() => setModal([])}><Plus size={13} /> Add Sub-Department</button>
          <button className={cx("dep-btn-b")} onClick={() => setAdding(true)}><Plus size={13} /> Add Department</button>
        </div>
      </div>

      {depts.map((d) => (
        <div className={cx("dep-card")} key={d.id}>
          <div className={cx("dep-head")}>
            <button className={cx("dep-chev")} onClick={() => upd(d.id, (x) => ({ ...x, open: !x.open }))}>
              {d.open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <b className={cx("dep-name")}>{d.name}</b>
            <span className={cx(`dep-badge ${d.active ? "" : "dep-badge-off"}`)}>{d.active ? "Active" : "Inactive"}</span>
            <span className={cx("dep-count")}>{subLabel(d.subs.length)}</span>
            <span className={cx("dep-status")}>Status</span>
            <Toggle size="medium" color="blue" label={`Status for ${d.name}`} on={d.active} onChange={() => upd(d.id, (x) => ({ ...x, active: !x.active }))} />
            <span className={cx("dep-sep")} />
            <button className={cx("dep-ic")} onClick={() => rename(d.name, (n) => upd(d.id, (x) => ({ ...x, name: n })))}><Pencil size={14} /></button>
            <button className={cx("dep-ic")} onClick={() => delDept(d)}><Trash2 size={14} /></button>
          </div>

          {d.open && (
            <div className={cx("dep-body")}>
              {d.subs.length > 0 && (
                <div className={cx("dep-subs")}>
                  {d.subs.map((s) => (
                    <div className={cx("dep-sub")} key={s.id}>
                      <GripVertical size={13} className={cx("dep-grip")} />
                      <span className={cx("dep-sub-name")}>{s.name}</span>
                      <span className={cx(`dep-badge ${s.active ? "" : "dep-badge-off"}`)}>{s.active ? "Active" : "Inactive"}</span>
                      <Toggle size="small" color="blue" className={cx("dep-sub-toggle")} label={`Status for ${s.name}`} on={s.active} onChange={() => updSub(d.id, s.id, (y) => ({ ...y, active: !y.active }))} />
                      <button className={cx("dep-ic")} onClick={() => rename(s.name, (n) => updSub(d.id, s.id, (y) => ({ ...y, name: n })))}><Pencil size={13} /></button>
                      <button className={cx("dep-ic")} onClick={() => delSub(d, s)}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <button className={cx("dep-add-sub")} onClick={() => setModal([d.id])}><Plus size={12} /> Add Sub-Department</button>
            </div>
          )}
        </div>
      ))}

      {adding && (
        <div className={cx("dep-card dep-new")}>
          <Building2 size={15} className={cx("dep-new-ic")} />
          <input
            className={cx("dep-new-in")} autoFocus placeholder="New Department Name" value={newName}
            onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveDept()}
          />
          <div className={cx("dep-new-btns")}>
            <button className={cx("dep-btn-c")} onClick={() => { setAdding(false); setNewName(""); }}>Cancel</button>
            <button className={cx("dep-btn-b")} onClick={saveDept}>Save Department</button>
          </div>
        </div>
      )}

      {modal && <SubModal depts={depts} preset={modal} onClose={() => setModal(null)} onSave={addSubs} />}
    </div>
  );
};

export default Departments;
