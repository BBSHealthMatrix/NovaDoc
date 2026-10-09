import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X } from "lucide-react";

import { subLabel } from "./DepartmentsData.js";

import styles from "./SubModal.module.css";

const cx = createClassNames(styles);

const SubModal = ({ depts, preset, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [sel, setSel] = useState(preset);
  const all = depts.length > 0 && sel.length === depts.length;
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const ok = name.trim() && sel.length > 0;

  return (
    <div className={cx("dep-overlay")} onClick={onClose}>
      <div className={cx("dep-modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("dep-x")} onClick={onClose}><X size={14} /></button>
        <h3>Add Sub-Department</h3>
        <p className={cx("dep-m-sub")}>Enter a name and select which departments to add it to.</p>

        <label className={cx("dep-lbl")}>Sub-Department Name <i>*</i></label>
        <input
          className={cx("dep-m-in")} autoFocus placeholder="e.g. Outpatient, ICU, Surgery..."
          value={name} onChange={(e) => setName(e.target.value)}
        />

        <label className={cx("dep-lbl")}>Add to Departments <i>*</i></label>
        <div className={cx("dep-list")}>
          <label className={cx("dep-opt dep-opt-all")}>
            <input type="checkbox" checked={all} onChange={() => setSel(all ? [] : depts.map((d) => d.id))} />
            Select All Departments <span>{depts.length} total</span>
          </label>
          {depts.map((d) => (
            <label className={cx("dep-opt")} key={d.id}>
              <input type="checkbox" checked={sel.includes(d.id)} onChange={() => toggle(d.id)} />
              {d.name} <span>{subLabel(d.subs.length)}</span>
            </label>
          ))}
        </div>

        <div className={cx("dep-m-btns")}>
          <button className={cx("dep-btn-c")} onClick={onClose}>Cancel</button>
          <button className={cx("dep-btn-b")} disabled={!ok} onClick={() => onSave(name.trim(), sel)}>Add to Departments</button>
        </div>
      </div>
    </div>
  );
};

export default SubModal;
