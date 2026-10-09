import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X, Building2, LayoutGrid, Sparkles, ArrowRight } from "lucide-react";

import { DEPTS } from "./SpecialtiesData.js";

import Pick from "./Pick";

import styles from "./SpecModal.module.css";

const cx = createClassNames(styles);

const SpecModal = ({ item, preset, onClose, onSave }) => {
  const [level, setLevel] = useState(item ? (item.sub ? "sub" : "dept") : (preset && preset.level) || null);
  const [dept, setDept] = useState(item ? item.dept : (preset && preset.dept) || null);
  const [sub, setSub] = useState(item ? item.sub : null);
  const [name, setName] = useState(item ? item.name : "");
  const [desc, setDesc] = useState(item ? item.desc : "");
  const [open, setOpen] = useState(null);

  const d = DEPTS.find((x) => x.id === dept);
  const s = d && d.subs.find((x) => x.id === sub);
  const ready = level && d && (level === "dept" || s);
  const canSave = ready && name.trim();

  const chooseLevel = (l) => { setLevel(l); setSub(null); setOpen(null); };

  const save = () => {
    if (!canSave) return;
    onSave({
      id: item ? item.id : Date.now(),
      dept, sub: level === "sub" ? sub : null,
      name: name.trim(), desc: desc.trim(),
      active: item ? item.active : true,
    });
  };

  return (
    <div className={cx("spc-overlay")} onClick={onClose}>
      <div className={cx("spc-modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("spc-x")} onClick={onClose}><X size={14} /></button>
        <h3><Sparkles size={17} /> {item ? "Edit Specialty" : "Add Specialty"}</h3>

        <p className={cx("spc-cap")}>Where to add?</p>
        <div className={cx("spc-levels")}>
          <button type="button" className={cx(`spc-level ${level === "dept" ? "spc-level-on" : ""}`)} onClick={() => chooseLevel("dept")}>
            <Building2 size={22} />
            <b>Department Level</b>
            <small>Specialty belongs to the whole department</small>
          </button>
          <button type="button" className={cx(`spc-level ${level === "sub" ? "spc-level-on" : ""}`)} onClick={() => chooseLevel("sub")}>
            <LayoutGrid size={22} />
            <b>Sub-Department</b>
            <small>Specialty belongs to a specific sub-dept</small>
          </button>
        </div>

        {level && (
          <>
            <label className={cx("spc-lbl")}>Department <i>*</i></label>
            <Pick
              value={d} options={DEPTS} open={open === "dept"}
              onToggle={() => setOpen(open === "dept" ? null : "dept")}
              onPick={(id) => { setDept(id); setSub(null); setOpen(null); }}
            />

            {level === "sub" && d && (
              <>
                <p className={cx("spc-hint")}><ArrowRight size={11} /> Then select a sub-department</p>
                <label className={cx("spc-lbl")}>Sub-Department <i>*</i></label>
                <Pick
                  value={s} options={d.subs} open={open === "sub"}
                  onToggle={() => setOpen(open === "sub" ? null : "sub")}
                  onPick={(id) => { setSub(id); setOpen(null); }}
                />
              </>
            )}

            {ready && (
              <>
                <div className={cx("spc-info-box")}>
                  {level === "dept" ? <Building2 size={12} /> : <LayoutGrid size={12} />}
                  <span>
                    Adding to <b>{d.name}{level === "sub" ? ` › ${s.name}` : ""}</b> ({level === "dept" ? "department level" : "sub-department"})
                  </span>
                </div>

                <label className={cx("spc-lbl")}>Specialty Name <i>*</i></label>
                <input className={cx("spc-in")} autoFocus placeholder="e.g. Interventional Cardiology, Sports Medicine..."
                  value={name} onChange={(e) => setName(e.target.value)} />

                <label className={cx("spc-lbl")}>Brief Description</label>
                <textarea className={cx("spc-in spc-ta")} placeholder="Short description of what this specialty covers..."
                  value={desc} onChange={(e) => setDesc(e.target.value)} />
              </>
            )}
          </>
        )}

        <div className={cx("spc-m-btns")}>
          <button className={cx("spc-btn-c")} onClick={onClose}>Cancel</button>
          <button className={cx("spc-btn-b")} disabled={!canSave} onClick={save}>{item ? "Save Changes" : "Save Specialty"}</button>
        </div>
      </div>
    </div>
  );
};

export default SpecModal;
