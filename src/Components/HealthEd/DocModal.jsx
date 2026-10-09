import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X, ChevronDown, Check } from "lucide-react";

import { CATS } from "./HealthEdData.js";

import styles from "./DocModal.module.css";

const cx = createClassNames(styles);

const DocModal = ({ mode, item, onClose, onSave }) => {
  const [f, setF] = useState(() => item || { id: Date.now(), cat: "Handout", title: "", desc: "", content: "" });
  const [open, setOpen] = useState(false);
  const view = mode === "view";
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const heading = mode === "add" ? "Add Health Education Document"
    : mode === "edit" ? "Edit Health Education Document" : f.title;

  return (
    <div className={cx("hel-overlay")} onClick={onClose}>
      <div className={cx("hel-modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("hel-x")} onClick={onClose}><X size={14} /></button>
        <h3>{heading}</h3>

        <label className={cx("hel-lbl")}>Category</label>
        <div className={cx("hel-sel")}>
          <button className={cx("hel-sel-btn")} disabled={view} onClick={() => setOpen(!open)}>
            {f.cat} <ChevronDown size={13} />
          </button>
          {open && (
            <div className={cx("hel-sel-list")}>
              {CATS.map((c) => (
                <button key={c} onClick={() => { set("cat", c); setOpen(false); }}>
                  {c} {f.cat === c && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className={cx("hel-lbl")}>Title</label>
        <input className={cx("hel-in")} disabled={view} placeholder="e.g. Understanding Your Blood Pressure"
          value={f.title} onChange={(e) => set("title", e.target.value)} />

        <label className={cx("hel-lbl")}>Brief Description</label>
        <input className={cx("hel-in")} disabled={view} placeholder="One-sentence summary shown to doctors in the picker"
          value={f.desc} onChange={(e) => set("desc", e.target.value)} />

        <label className={cx("hel-lbl")}>Document Content</label>
        <textarea className={cx("hel-ta")} disabled={view} placeholder="Full document text, instructions, or guidance..."
          value={f.content} onChange={(e) => set("content", e.target.value)} />

        <div className={cx("hel-m-btns")}>
          <button className={cx("hel-btn-c")} onClick={onClose}>{view ? "Close" : "Cancel"}</button>
          {!view && (
            <button className={cx("hel-btn-b")} disabled={!f.title.trim()} onClick={() => onSave({ ...f, title: f.title.trim() })}>
              {mode === "add" ? "Add Document" : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocModal;
