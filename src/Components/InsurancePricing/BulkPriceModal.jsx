import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { X } from "lucide-react";
import Select from "../Shared/Select";
import styles from "./BulkPriceModal.module.css";

const cx = createClassNames(styles);

const BulkPriceModal = ({ types, onClose, onApply }) => {
  const [type, setType] = useState("All Service Types");
  const [mode, setMode] = useState("%");
  const [amount, setAmount] = useState("");

  const valid = parseFloat(amount) > 0;

  return (
    <div className={cx("ipb-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("ipb-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("ipb-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("ipb-title")}>Bulk Price Change</h2>

        <label className={cx("ipb-lbl")}>Apply To</label>
        <div className={cx("ipb-sel")}>
          <Select value={type} options={["All Service Types", ...types]} onChange={setType} label="Apply To" />
        </div>

        <label className={cx("ipb-lbl")}>Increase By</label>
        <div className={cx("ipb-inc")}>
          <span className={cx("ipb-seg")}>
            <button type="button" className={cx(mode === "%" ? "ipb-seg-on" : "")} onClick={() => setMode("%")}>%</button>
            <button type="button" className={cx(mode === "Rs." ? "ipb-seg-on" : "")} onClick={() => setMode("Rs.")}>Rs.</button>
          </span>
          <input type="number" step="any" className={cx("ipb-in")} placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className={cx("ipb-foot")}>
          <button type="button" className={cx("ipb-btn ipb-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("ipb-btn ipb-primary")} disabled={!valid} onClick={() => onApply({ type, mode, amount })}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default BulkPriceModal;