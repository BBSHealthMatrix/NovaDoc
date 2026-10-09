import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { X } from "lucide-react";
import { todayIso } from "./CorporatePricingData.js";
import styles from "./CorporatePaymentModal.module.css";

const cx = createClassNames(styles);

const CorporatePaymentModal = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);
  const [remarks, setRemarks] = useState("");

  const value = parseFloat(amount);
  const valid = value > 0 && Boolean(date);

  return (
    <div className={cx("cra-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("cra-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("cra-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("cra-title")}>Add Advance Payment</h2>

        <label className={cx("cra-lbl")} htmlFor="cra-amount">Amount (Rs.) <em>*</em></label>
        <div className={cx("cra-amount")}>
          <span>Rs.</span>
          <input id="cra-amount" type="number" min="0" step="any" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <label className={cx("cra-lbl")} htmlFor="cra-date">Date</label>
        <input id="cra-date" type="date" className={cx("cra-input")} value={date} onChange={(e) => setDate(e.target.value)} />

        <label className={cx("cra-lbl")} htmlFor="cra-rem">Remarks / Notes</label>
        <input
          id="cra-rem" className={cx("cra-input")} placeholder="e.g. Cheque #1234, Monthly advance..." autoFocus
          value={remarks} onChange={(e) => setRemarks(e.target.value)}
        />

        <div className={cx("cra-foot")}>
          <button type="button" className={cx("cra-btn cra-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("cra-btn cra-primary")} disabled={!valid} onClick={() => onSave({ amount: value, date, remarks })}>Add Payment</button>
        </div>
      </div>
    </div>
  );
};

export default CorporatePaymentModal;