import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, Globe } from "lucide-react";

import { SEED, BADGE } from "./DemographicsData.js";

import Toggle from "../Toggle/Toggle";

import FieldModal from "./FieldModal";

import styles from "./Demographics.module.css";

const cx = createClassNames(styles);

const Demographics = () => {
  const [show, setShow] = useState(true);
  const [fields, setFields] = useState(SEED);
  const [modal, setModal] = useState(null);

  const flip = (id, key) => setFields((p) => p.map((x) => (x.id === id ? { ...x, [key]: !x[key] } : x)));

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const a = [...fields];
    [a[i], a[j]] = [a[j], a[i]];
    setFields(a);
  };

  const del = (fl) => {
    if (fl.builtIn) return;
    if (window.confirm(`Delete "${fl.name}"?`)) setFields((p) => p.filter((x) => x.id !== fl.id));
  };

  const save = (fl) => {
    setFields((p) => (p.some((x) => x.id === fl.id) ? p.map((x) => (x.id === fl.id ? fl : x)) : [...p, fl]));
    setModal(null);
  };

  return (
    <div className={cx("dmg-wrap")}>
      <h1 className={cx("dmg-title")}>Demographics</h1>
      <p className={cx("dmg-desc")}>Optional social and demographic data collected during registration.</p>

      <div className={cx("dmg-card dmg-show")}>
        <div>
          <b>Show Demographics Section</b>
          <small>When enabled, the demographics block appears after basic info in the registration form.</small>
        </div>
        <Toggle size="medium" color="blue" label="Show demographics section" on={show} onChange={() => setShow(!show)} />
        <span className={cx(`dmg-onoff ${show ? "dmg-on" : ""}`)}>{show ? "On" : "Off"}</span>
      </div>

      {show ? (
        <div className={cx("dmg-card dmg-fields")}>
          <p className={cx("dmg-cap")}>Demographics Fields</p>

          {fields.map((fl, i) => (
            <div className={cx(`dmg-row ${fl.on ? "" : "dmg-row-off"}`)} key={fl.id}>
              <span className={cx("dmg-move")}>
                <button onClick={() => move(i, -1)} disabled={i === 0}><ChevronUp size={9} /></button>
                <button onClick={() => move(i, 1)} disabled={i === fields.length - 1}><ChevronDown size={9} /></button>
              </span>
              <b className={cx("dmg-name")}>{fl.name}</b>
              <span className={cx(`dmg-badge ${BADGE[fl.type]}`)}>{fl.type}</span>

              <span className={cx("dmg-req")}>
                <Toggle size="tiny" color="blue" label={`Require ${fl.name}`} on={fl.req} onChange={() => flip(fl.id, "req")} />
                <small className={cx(fl.req ? "dmg-req-on" : "")}>Req'd</small>
              </span>
              <Toggle size="medium" color="blue" label={`Show ${fl.name}`} on={fl.on} onChange={() => flip(fl.id, "on")} />
              <button className={cx("dmg-ic")} onClick={() => setModal({ field: fl })}><Pencil size={12} /></button>
              <button className={cx(`dmg-ic ${fl.builtIn ? "dmg-ic-off" : ""}`)} onClick={() => del(fl)}><Trash2 size={12} /></button>
            </div>
          ))}

          <button className={cx("dmg-add")} onClick={() => setModal({ field: null })}><Plus size={12} /> Add Field</button>
        </div>
      ) : (
        <div className={cx("dmg-off-box")}>
          <Globe size={24} />
          <p>Demographics section is currently <b>disabled</b>.</p>
          <small>Enable it above to configure its fields.</small>
        </div>
      )}

      {modal && <FieldModal field={modal.field} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default Demographics;
