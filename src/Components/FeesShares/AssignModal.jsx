import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Search, X } from "lucide-react";

import { SERVICES } from "./FeesSharesData.js";

import styles from "./AssignModal.module.css";

const cx = createClassNames(styles);

const AssignModal = ({ doc, onClose, onConfirm }) => {
  const [picked, setPicked] = useState(() => new Set(doc.rows.map((r) => r.id)));
  const [q, setQ] = useState("");
  const shown = SERVICES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className={cx("fee-overlay")} onMouseDown={onClose}>
      <div className={cx("fee-modal fee-modal-assign")} onMouseDown={(e) => e.stopPropagation()}>
        <button className={cx("fee-x")} onClick={onClose}><X size={14} /></button>
        <h3 className={cx("fee-m-title")}>Assign Services to {doc.name}</h3>

        <div className={cx("fee-m-search")}>
          <Search size={13} />
          <input
            autoFocus
            placeholder="Search services..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className={cx("fee-m-list")}>
          {shown.map((s) => (
            <label key={s.id} className={cx("fee-m-item")}>
              <input type="checkbox" checked={picked.has(s.id)} onChange={() => toggle(s.id)} />
              <span className={cx("fee-m-info")}>
                <b>{s.name}</b>
                <small>{s.type} · Rs. {s.price}</small>
              </span>
              <span className={cx("fee-m-badge")}>Active</span>
            </label>
          ))}
          {shown.length === 0 && <div className={cx("fee-m-empty")}>No services found.</div>}
        </div>

        <div className={cx("fee-m-foot")}>
          <span className={cx("fee-m-count")}>{picked.size} selected</span>
          <div className={cx("fee-m-btns")}>
            <button className={cx("fee-btn-cancel")} onClick={onClose}>Cancel</button>
            <button className={cx("fee-btn-confirm")} onClick={() => onConfirm(picked)}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
