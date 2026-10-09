import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X } from "lucide-react";

import { TYPES } from "./DemographicsData.js";

import styles from "./FieldModal.module.css";

const cx = createClassNames(styles);

const FieldModal = ({ field, onClose, onSave }) => {
  const [name, setName] = useState(field ? field.name : "");
  const [type, setType] = useState(field ? field.type : "Text");

  const save = () => {
    if (!name.trim()) return;
    onSave(field
      ? { ...field, name: name.trim(), type }
      : { id: Date.now(), name: name.trim(), type, req: false, on: true, builtIn: false });
  };

  return (
    <div className={cx("dmg-overlay")} onClick={onClose}>
      <div className={cx("dmg-modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("dmg-x")} onClick={onClose}><X size={14} /></button>
        <h3>{field ? "Edit Field" : "Add Field"}</h3>

        <label className={cx("dmg-lbl")}>Field Name</label>
        <input className={cx("dmg-in")} autoFocus placeholder="e.g. Marital Status" value={name}
          onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />

        <label className={cx("dmg-lbl")}>Field Type</label>
        <select className={cx("dmg-in")} value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>

        <div className={cx("dmg-m-btns")}>
          <button className={cx("dmg-btn-c")} onClick={onClose}>Cancel</button>
          <button className={cx("dmg-btn-b")} disabled={!name.trim()} onClick={save}>{field ? "Save Changes" : "Add Field"}</button>
        </div>
      </div>
    </div>
  );
};

export default FieldModal;
