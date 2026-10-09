import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Pencil, Tag, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SERVICE_TYPES } from "./ServiceTypesData.js";
import styles from "./ServiceTypes.module.css";

const cx = createClassNames(styles);

const ServiceTypes = () => {
  const [types, setTypes] = useState(SERVICE_TYPES);
  const [editing, setEditing] = useState(null); // { id, name } while the modal is open

  const activeCount = types.filter((t) => t.active).length;
  const stats = [
    { label: "Total Types", value: types.length, tone: "st-n-total" },
    { label: "Active", value: activeCount, tone: "st-n-active" },
    { label: "Inactive", value: types.length - activeCount, tone: "st-n-inactive" },
  ];

  const toggle = (id) => setTypes((p) => p.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  const remove = (id) => setTypes((p) => p.filter((t) => t.id !== id));

  const save = () => {
    const name = editing.name.trim();
    if (!name) return;
    setTypes((p) => p.map((t) => (t.id === editing.id ? { ...t, name } : t)));
    setEditing(null);
  };

  return (
    <div className={cx("st-wrap")}>
      <h1 className={cx("st-title")}>Service Types</h1>
      <p className={cx("st-desc")}>Manage service categories used across pricing and billing modules.</p>

      <div className={cx("st-stats")}>
        {stats.map((s) => (
          <div className={cx("st-stat")} key={s.label}>
            <p className={cx(`st-num ${s.tone}`)}>{s.value}</p>
            <p className={cx("st-slabel")}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={cx("st-card")}>
        <div className={cx("st-row st-th")}>
          <span>Service Type</span>
          <span>Created</span>
          <span>Status</span>
          <span className={cx("st-right")}>Actions</span>
        </div>
        {types.map((t) => (
          <div className={cx("st-row st-tr")} key={t.id}>
            <div className={cx("st-name")}>
              <span className={cx("st-icon")}><Tag size={13} /></span>
              {t.name}
            </div>
            <span className={cx("st-date")}>{t.created}</span>
            <div className={cx("st-status")}>
              <Toggle size="medium" color="softBlue" className={cx("st-tg")} on={t.active} onChange={() => toggle(t.id)} label={`${t.name} status`} />
              <span className={cx(`st-badge ${t.active ? "st-b-on" : "st-b-off"}`)}>{t.active ? "Active" : "Inactive"}</span>
            </div>
            <div className={cx("st-actions")}>
              <button type="button" onClick={() => setEditing({ id: t.id, name: t.name })} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
              <button type="button" onClick={() => remove(t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className={cx("st-overlay")} onClick={() => setEditing(null)}>
          <div className={cx("st-modal")} role="dialog" aria-modal="true" aria-labelledby="st-modal-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={cx("st-close")} onClick={() => setEditing(null)} aria-label="Close"><X size={13} /></button>
            <h2 id="st-modal-title" className={cx("st-mtitle")}>Edit Service Type</h2>
            <label className={cx("st-mlabel")} htmlFor="st-name-input">Service Type Name <b>*</b></label>
            <input
              id="st-name-input"
              className={cx("st-input")}
              value={editing.name}
              autoFocus
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(null);
              }}
            />
            <div className={cx("st-mfoot")}>
              <button type="button" className={cx("st-cancel")} onClick={() => setEditing(null)}>Cancel</button>
              <button type="button" className={cx("st-save")} onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTypes;