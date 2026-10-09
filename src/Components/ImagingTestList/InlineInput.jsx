import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleCheck, Plus, X } from "lucide-react";
import styles from "./InlineInput.module.css";

const cx = createClassNames(styles);

// "+ [input] ✓ ✕" row used for every add / rename in the imaging catalog.
// variant: "top" (add modality), "part" (add body part), "proto" (protocol), "flat" (rename in a header)
const InlineInput = ({ placeholder, initial = "", onSave, onCancel, variant = "top" }) => {
  const [value, setValue] = useState(initial);
  const save = () => { if (value.trim()) onSave(value.trim()); };

  return (
    <div className={cx(`ii-row ii-${variant}`)}>
      {variant !== "flat" && <Plus size={13} className={cx("ii-plus")} />}
      <input
        autoFocus
        className={cx("ii-input")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
      />
      <button type="button" className={cx("ii-ok")} onClick={save} aria-label="Save"><CircleCheck size={15} /></button>
      <button type="button" className={cx("ii-x")} onClick={onCancel} aria-label="Cancel"><X size={15} /></button>
    </div>
  );
};

export default InlineInput;