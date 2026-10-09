import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

import { SEED, initials } from "./DoctorProfilesData.js";

import Toggle from "../Toggle/Toggle";

import DoctorModal from "./DoctorModal";

import styles from "./DoctorProfiles.module.css";

const cx = createClassNames(styles);

const DoctorProfiles = () => {
  const [docs, setDocs] = useState(SEED);
  const [modal, setModal] = useState(null);

  const save = (d) => {
    setDocs((p) => (p.some((x) => x.id === d.id) ? p.map((x) => (x.id === d.id ? d : x)) : [...p, d]));
    setModal(null);
  };
  const flip = (id) => setDocs((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const del = (d) => {
    if (window.confirm(`Delete ${d.name}?`)) setDocs((p) => p.filter((x) => x.id !== d.id));
  };

  return (
    <div className={cx("dp-wrap")}>
      <div className={cx("dp-top")}>
        <div>
          <h1 className={cx("dp-title")}>Doctor Management</h1>
          <p className={cx("dp-desc")}>Manage doctors, their schedules, and availability.</p>
        </div>
        <button className={cx("dp-btn-add")} onClick={() => setModal({ doctor: null })}><Plus size={15} /> Add Doctor</button>
      </div>

      <div className={cx("dp-table")}>
        <div className={cx("dp-row dp-head")}>
          <span>Doctor</span><span>Departments / Specialties</span><span>Type</span><span>Status</span><span className={cx("dp-r")}>Actions</span>
        </div>

        {docs.map((d) => (
          <div className={cx("dp-row")} key={d.id}>
            <div className={cx("dp-who")}>
              <span className={cx("dp-av")}>{initials(d.name)}</span>
              <div>
                <b>{d.name}</b>
                <small>{d.shift} Shift · {d.email}</small>
              </div>
            </div>
            <div className={cx("dp-depts")}>
              <div className={cx("dp-dchips")}>{d.depts.map((x) => <span key={x}>{x}</span>)}</div>
              {d.specs.length > 0 && <small>{d.specs.join(", ")}</small>}
              {d.form && <span className={cx("dp-form-link")}><BookOpen size={10} /> {d.form}</span>}
            </div>
            <span><em className={cx("dp-type-badge")}>{d.type}</em></span>
            <span className={cx("dp-status")}>
              <Toggle size="large" color="blue" label={`Status for ${d.name}`} on={d.active} onChange={() => flip(d.id)} />
              <em className={cx(d.active ? "dp-on" : "dp-off")}>{d.active ? "Active" : "Inactive"}</em>
            </span>
            <span className={cx("dp-act")}>
              <button onClick={() => setModal({ doctor: d })}><Pencil size={13} /></button>
              <button onClick={() => del(d)}><Trash2 size={13} /></button>
            </span>
          </div>
        ))}
      </div>

      {modal && <DoctorModal doctor={modal.doctor} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default DoctorProfiles;
