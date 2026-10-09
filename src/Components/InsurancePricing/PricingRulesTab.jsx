import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Info } from "lucide-react";
import { SERVICE_TYPES } from "./InsurancePricingData.js";
import styles from "./PricingRulesTab.module.css";

const cx = createClassNames(styles);

const PricingRulesTab = ({ rules, onSave }) => {
  const [draft, setDraft] = useState(rules);
  const set = (type, patch) => setDraft((p) => ({ ...p, [type]: { ...p[type], ...patch } }));

  return (
    <div className={cx("ipr-wrap")}>
      <div className={cx("ipr-info")}>
        <Info size={13} />
        Set pricing adjustments per service type. Save rules to update all non-overridden service prices.
      </div>

      <div className={cx("ipr-card")}>
        <div className={cx("ipr-row ipr-head")}>
          <span>Service Type</span><span>Adjustment</span><span>Amount</span>
        </div>
        {SERVICE_TYPES.map((t) => {
          const r = draft[t];
          return (
            <div key={t} className={cx("ipr-row")}>
              <span className={cx("ipr-name")}>{t}</span>
              <span className={cx("ipr-seg")}>
                <button type="button" className={cx(r.mode === "%" ? "ipr-seg-on" : "")} onClick={() => set(t, { mode: "%" })}>%</button>
                <button type="button" className={cx(r.mode === "Rs." ? "ipr-seg-on" : "")} onClick={() => set(t, { mode: "Rs." })}>Rs.</button>
              </span>
              <input
                type="number" step="any" className={cx("ipr-in")}
                placeholder={r.mode === "%" ? "e.g. 10" : "e.g. 500"}
                value={r.amount}
                onChange={(e) => set(t, { amount: e.target.value })}
              />
            </div>
          );
        })}
      </div>

      <button type="button" className={cx("ipr-save")} onClick={() => onSave(draft)}>Save Pricing Rules &amp; Recalculate</button>
    </div>
  );
};

export default PricingRulesTab;