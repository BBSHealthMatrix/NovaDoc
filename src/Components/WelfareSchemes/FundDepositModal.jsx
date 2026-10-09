import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { X } from "lucide-react";
import { todayIso } from "./WelfareSchemesData.js";
import styles from "./FundDepositModal.module.css";

const cx = createClassNames(styles);

const FundDepositModal = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");

  const value = parseFloat(amount);
  const valid = value > 0 && Boolean(date);

  return (
    <div className={cx("wsd-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("wsd-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("wsd-close")} onClick={onClose} aria-label="Close"><X size={15} /></button>
        <h2 className={cx("wsd-title")}>Add Fund Deposit</h2>

        <label className={cx("wsd-lbl")} htmlFor="wsd-amount">Amount (Rs.) *</label>
        <input id="wsd-amount" type="number" min="0" step="any" className={cx("wsd-input")} placeholder="0" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label className={cx("wsd-lbl")} htmlFor="wsd-date">Date</label>
        <input id="wsd-date" type="date" className={cx("wsd-input")} value={date} onChange={(e) => setDate(e.target.value)} />

        <label className={cx("wsd-lbl")} htmlFor="wsd-ref">Reference</label>
        <input id="wsd-ref" className={cx("wsd-input")} placeholder="e.g. PHI-Q1-2025" value={ref} onChange={(e) => setRef(e.target.value)} />

        <label className={cx("wsd-lbl")} htmlFor="wsd-notes">Notes</label>
        <input id="wsd-notes" className={cx("wsd-input")} placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className={cx("wsd-foot")}>
          <button type="button" className={cx("wsd-btn wsd-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("wsd-btn wsd-primary")} disabled={!valid} onClick={() => onSave({ amount: value, date, ref, notes })}>Add Deposit</button>
        </div>
      </div>
    </div>
  );
};

export default FundDepositModal;