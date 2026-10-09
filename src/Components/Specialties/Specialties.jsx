import { createClassNames } from '../../utils/classNames.js';
import { useState, Fragment } from "react";

import { ChevronUp, ChevronDown, Plus, Pencil, Trash2, Building2, LayoutGrid } from "lucide-react";

import { DEPTS, SEED, plural } from "./SpecialtiesData.js";

import Toggle from "../Toggle/Toggle";

import SpecModal from "./SpecModal";

import styles from "./Specialties.module.css";

const cx = createClassNames(styles);

const Specialties = () => {
  const [items, setItems] = useState(SEED);
  const [open, setOpen] = useState(DEPTS.reduce((a, d) => ({ ...a, [d.id]: true }), {}));
  const [modal, setModal] = useState(null);

  const active = items.filter((x) => x.active).length;
  const subCount = items.filter((x) => x.sub).length;

  const flip = (id) => setItems((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  const del = (x) => {
    if (window.confirm(`Delete ${x.name}?`)) setItems((p) => p.filter((y) => y.id !== x.id));
  };

  const save = (x) => {
    setItems((p) => (p.some((y) => y.id === x.id) ? p.map((y) => (y.id === x.id ? x : y)) : [...p, x]));
    setOpen((o) => ({ ...o, [x.dept]: true }));
    setModal(null);
  };

  const row = (x) => (
    <div className={cx("spc-row")} key={x.id}>
      <span className={cx(`spc-dot ${x.active ? "spc-dot-on" : ""}`)} />
      <div className={cx("spc-info")}>
        <div className={cx("spc-name")}>{x.name} <span className={cx(`spc-tag ${x.active ? "" : "spc-tag-off"}`)}>{x.active ? "Active" : "Inactive"}</span></div>
        {x.desc && <small>{x.desc}</small>}
      </div>
      <Toggle color="blue" className={cx("spc-toggle")} label={`Status for ${x.name}`} on={x.active} onChange={() => flip(x.id)} />
      <button className={cx("spc-ic")} onClick={() => setModal({ item: x })}><Pencil size={13} /></button>
      <button className={cx("spc-ic")} onClick={() => del(x)}><Trash2 size={13} /></button>
    </div>
  );

  return (
    <div className={cx("spc-wrap")}>
      <div className={cx("spc-top")}>
        <div>
          <h1 className={cx("spc-title")}>Specialties</h1>
          <p className={cx("spc-desc")}>
            Manage medical specialties at department or sub-department level.
            <b> {active} active</b> <i>/</i> <b>{items.length} total</b>
          </p>
        </div>
        <button className={cx("spc-btn-add")} onClick={() => setModal({})}><Plus size={14} /> Add Specialty</button>
      </div>

      <div className={cx("spc-stats")}>
        <div className={cx("spc-stat")}><span>Total</span><b>{items.length}</b></div>
        <div className={cx("spc-stat")}><span>Active</span><b className={cx("spc-green")}>{active}</b></div>
        <div className={cx("spc-stat")}><span>Inactive</span><b className={cx("spc-orange")}>{items.length - active}</b></div>
        <div className={cx("spc-stat")}><span>Sub-Dept Assigned</span><b className={cx("spc-blue")}>{subCount}</b></div>
      </div>

      {DEPTS.map((d) => {
        const list = items.filter((x) => x.dept === d.id);
        const dl = list.filter((x) => !x.sub);
        const sl = list.filter((x) => x.sub);
        return (
          <div className={cx("spc-card")} key={d.id}>
            <div className={cx("spc-head")}>
              <button className={cx("spc-chev")} onClick={() => setOpen((o) => ({ ...o, [d.id]: !o[d.id] }))}>
                {open[d.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <Building2 size={14} className={cx("spc-head-ic")} />
              <b className={cx("spc-dname")}>{d.name}</b>
              <span className={cx("spc-badge")}>Active</span>
              <span className={cx("spc-count")}>
                {plural(list.length, "specialt")} · {dl.length} dept-level{sl.length ? ` · ${sl.length} sub-dept` : ""}
              </span>
              <button className={cx("spc-dash")} onClick={() => setModal({ preset: { level: "dept", dept: d.id } })}><Building2 size={12} /> Dept</button>
              <button className={cx("spc-dash")} onClick={() => setModal({ preset: { level: "sub", dept: d.id } })}><LayoutGrid size={12} /> Sub-Dept</button>
            </div>

            {open[d.id] && (
              <>
                {dl.length > 0 && (
                  <>
                    <p className={cx("spc-sec")}><Building2 size={10} /> Department Level</p>
                    {dl.map(row)}
                  </>
                )}
                {d.subs.map((sd) => {
                  const r = sl.filter((x) => x.sub === sd.id);
                  if (!r.length) return null;
                  return (
                    <Fragment key={sd.id}>
                      <p className={cx("spc-sec")}><LayoutGrid size={10} /> Sub-Department · {sd.name}</p>
                      {r.map(row)}
                    </Fragment>
                  );
                })}
                {list.length === 0 && <p className={cx("spc-empty")}>No specialties yet.</p>}
              </>
            )}
          </div>
        );
      })}

      {modal && <SpecModal item={modal.item} preset={modal.preset} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default Specialties;
