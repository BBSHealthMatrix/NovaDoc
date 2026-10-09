import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Info } from "lucide-react";
import { SERVICE_TYPES } from "./CorporatePricingData.js";
import styles from "./CorporateRulesTab.module.css";

const cx = createClassNames(styles);

const CorporateRulesTab = ({ rules, onSave }) => {
  const [draft, setDraft] = useState(rules);
  const set = (type, patch) => setDraft((p) => ({ ...p, [type]: { ...p[type], ...patch } }));

  return (
    <div className={cx("crr-wrap")}>
      <div className={cx("crr-info")}>
        <Info size={13} />
        Set pricing adjustments per service type. Save rules to update all non-overridden service prices.
      </div>

      <div className={cx("crr-card")}>
        <div className={cx("crr-row crr-head")}>
          <span>Service Type</span><span>Adjustment</span><span>Amount</span>
        </div>
        {SERVICE_TYPES.map((t) => {
          const r = draft[t];
          return (
            <div key={t} className={cx("crr-row")}>
              <span className={cx("crr-name")}>{t}</span>
              <span className={cx("crr-seg")}>
                <button type="button" className={cx(r.mode === "%" ? "crr-seg-on" : "")} onClick={() => set(t, { mode: "%" })}>%</button>
                <button type="button" className={cx(r.mode === "Rs." ? "crr-seg-on" : "")} onClick={() => set(t, { mode: "Rs." })}>Rs.</button>
              </span>
              <input
                type="number" step="any" className={cx("crr-in")}
                placeholder={r.mode === "%" ? "e.g. 10" : "e.g. 500"}
                value={r.amount}
                onChange={(e) => set(t, { amount: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      <button type="button" className={cx("crr-save")} onClick={() => onSave(draft)}>Save Pricing Rules &amp; Recalculate</button>
    </div>
  );
};

export default CorporateRulesTab;