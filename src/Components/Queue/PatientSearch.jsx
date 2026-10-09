import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Search, UserRound, UserPlus, X, UserX } from "lucide-react";

import { PATIENTS, initials } from "./QueueData.js";

import styles from "./PatientSearch.module.css";

const cx = createClassNames(styles);

const PatientSearch = ({ walkIn, setWalkIn, patient, setPatient }) => {
  const [q, setQ] = useState('')

  if (!setPatient) {
    return (
      <div className={cx("q-block")}>
        <div className={cx("row-between")}>
          <p className={cx("label")}>Patient</p>
          <div className={cx("row")}>
            <button className={cx(`pill ${walkIn ? 'on' : ''}`)} onClick={() => setWalkIn?.(!walkIn)}>
              <UserRound size={10} /> Walk-in
            </button>
            <button className={cx("link-btn")}><UserPlus size={12} /> Add New</button>
          </div>
        </div>
        <label className={cx("search")}>
          <Search size={14} />
          <input placeholder="Search name, MRN, or phone..." />
        </label>
      </div>
    )
  }

  const term = q.trim().toLowerCase()
  const list = term
    ? PATIENTS.filter((p) => `${p.name} ${p.mrn} ${p.phone}`.toLowerCase().includes(term))
    : []

  const toggleWalk = () => {
    setWalkIn(!walkIn)
    setPatient(null)
    setQ('')
  }

  return (
    <div className={cx("q-block")}>
      <div className={cx("row-between")}>
        <p className={cx("label")}>Patient</p>
        <div className={cx("row")}>
          <button className={cx(`pill ${walkIn ? 'walk' : ''}`)} onClick={toggleWalk}>
            <UserRound size={10} /> Walk-in
          </button>
          {!walkIn && <button className={cx("link-btn")}><UserPlus size={12} /> Add New</button>}
        </div>
      </div>

      {walkIn ? (
        <div className={cx("pt-walk")}>
          <span className={cx("pt-walk-ic")}><UserX size={13} /></span>
          <div><b>Walk-in / Anonymous</b><small>No patient info required</small></div>
          <button onClick={() => setWalkIn(false)}><X size={12} /></button>
        </div>
      ) : patient ? (
        <div className={cx("pt-card")}>
          <span className={cx("pt-av")}>{initials(patient.name)}</span>
          <div><b>{patient.name}</b><small>{patient.mrn} · {patient.phone}</small></div>
          <button onClick={() => setPatient(null)}><X size={12} /></button>
        </div>
      ) : (
        <div className={cx("pt-wrap")}>
          <label className={cx("search")}>
            <Search size={14} />
            <input placeholder="Search name, MRN, or phone..." value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          {term && (
            <div className={cx("pt-drop")}>
              {list.length === 0 && <p className={cx("pt-none")}>No patients found</p>}
              {list.map((p) => (
                <button key={p.mrn} onClick={() => { setPatient(p); setQ('') }}>
                  <span className={cx("pt-av")}>{initials(p.name)}</span>
                  <span><b>{p.name}</b><small>{p.mrn} · {p.phone}</small></span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default PatientSearch;
