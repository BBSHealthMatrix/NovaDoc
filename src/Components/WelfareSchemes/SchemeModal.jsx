import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { X } from "lucide-react";
import Select from "../Shared/Select";
import { SCHEME_TYPES } from "./WelfareSchemesData.js";
import styles from "./SchemeModal.module.css";

const cx = createClassNames(styles);

const SchemeModal = ({ scheme, onClose, onSave }) => {
  const isEdit = Boolean(scheme);
  const [f, setF] = useState({
    name: scheme?.name ?? "",
    type: scheme?.type ?? SCHEME_TYPES[0],
    sponsor: scheme?.sponsor ?? "",
    description: scheme?.description ?? "",
  });
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const save = () => onSave({ name: f.name.trim(), type: f.type, sponsor: f.sponsor.trim(), description: f.description.trim() });

  return (
    <div className={cx("wsm-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("wsm-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("wsm-close")} onClick={onClose} aria-label="Close"><X size={15} /></button>
        <h2 className={cx("wsm-title")}>{isEdit ? "Edit Scheme" : "Add Welfare Scheme"}</h2>

        <label className={cx("wsm-lbl")} htmlFor="wsm-name">Scheme Name *</label>
        <input id="wsm-name" className={cx("wsm-input")} placeholder="e.g. Sehat Sahulat Programme" autoFocus={!isEdit} value={f.name} onChange={(e) => set({ name: e.target.value })} />

        <label className={cx("wsm-lbl")}>Scheme Type</label>
        <div className={cx("wsm-sel")}>
          <Select value={f.type} options={SCHEME_TYPES} onChange={(v) => set({ type: v })} label="Scheme Type" />
        </div>

        <label className={cx("wsm-lbl")} htmlFor="wsm-sponsor">Sponsor / Administrator</label>
        <input id="wsm-sponsor" className={cx("wsm-input")} placeholder="e.g. Government of Punjab" value={f.sponsor} onChange={(e) => set({ sponsor: e.target.value })} />

        <label className={cx("wsm-lbl")} htmlFor="wsm-desc">Description</label>
        <textarea id="wsm-desc" className={cx("wsm-text")} placeholder="Brief description of the scheme's purpose and scope..." value={f.description} onChange={(e) => set({ description: e.target.value })} />

        <div className={cx("wsm-foot")}>
          <button type="button" className={cx("wsm-btn wsm-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("wsm-btn wsm-primary")} disabled={!f.name.trim()} onClick={save}>
            {isEdit ? "Save Changes" : "Create Scheme"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeModal;