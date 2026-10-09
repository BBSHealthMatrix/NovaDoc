import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { X } from "lucide-react";
import { todayIso } from "./InsurancePricingData.js";
import styles from "./AdvancePaymentModal.module.css";

const cx = createClassNames(styles);

const AdvancePaymentModal = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);
  const [remarks, setRemarks] = useState("");

  const value = parseFloat(amount);
  const valid = value > 0 && Boolean(date);

  return (
    <div className={cx("ipa-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("ipa-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("ipa-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("ipa-title")}>Add Advance Payment</h2>

        <label className={cx("ipa-lbl")} htmlFor="ipa-amount">Amount (Rs.) <em>*</em></label>
        <div className={cx("ipa-amount")}>
          <span>Rs.</span>
          <input id="ipa-amount" type="number" min="0" step="any" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <label className={cx("ipa-lbl ipa-mt")} htmlFor="ipa-date">Date</label>
        <input id="ipa-date" type="date" className={cx("ipa-input")} value={date} onChange={(e) => setDate(e.target.value)} />

        <label className={cx("ipa-lbl ipa-mt")} htmlFor="ipa-rem">Remarks / Notes</label>
        <input
          id="ipa-rem" className={cx("ipa-input")} placeholder="e.g. Cheque #1234, Monthly advance..." autoFocus
          value={remarks} onChange={(e) => setRemarks(e.target.value)}
        />

        <div className={cx("ipa-foot")}>
          <button type="button" className={cx("ipa-btn ipa-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("ipa-btn ipa-primary")} disabled={!valid} onClick={() => onSave({ amount: value, date, remarks })}>Add Payment</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancePaymentModal;