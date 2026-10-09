import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import BulkPriceModal from "./BulkPriceModal";
import { SERVICE_GROUPS, rs } from "./InsurancePricingData.js";
import styles from "./ServicePricesTab.module.css";

const cx = createClassNames(styles);

// base price adjusted by the saved pricing rule for that service type
const computed = (base, rule) => {
  const a = parseFloat(rule?.amount);
  if (Number.isNaN(a)) return base;
  return rule.mode === "%" ? Math.round(base * (1 + a / 100) * 100) / 100 : base + a;
};

const ServicePricesTab = ({ rules, overrides, onOverrides }) => {
  const [bulk, setBulk] = useState(false);

  const priceOf = (s, type) => {
    const o = overrides[s.id];
    return o !== undefined && o !== "" ? Number(o) : computed(s.base, rules[type]);
  };

  const setOverride = (id, v) => onOverrides((p) => ({ ...p, [id]: v }));

  const applyBulk = ({ type, mode, amount }) => {
    const a = Number(amount);
    onOverrides((p) => {
      const n = { ...p };
      SERVICE_GROUPS.filter((g) => type === "All Service Types" || g.type === type).forEach((g) => g.services.forEach((s) => {
        const cur = priceOf(s, g.type);
        const next = mode === "%" ? cur * (1 + a / 100) : cur + a;
        n[s.id] = String(Math.round(next * 100) / 100);
      }));
      return n;
    });
    setBulk(false);
  };

  return (
    <>
      <div className={cx("ips-top")}>
        <p className={cx("ips-desc")}>Override service prices for this entity. Leave blank to use the entity's computed price from Pricing Rules.</p>
        <button type="button" className={cx("ips-bulk")} onClick={() => setBulk(true)}><TrendingUp size={13} /> Bulk Adjust</button>
      </div>

      {SERVICE_GROUPS.map((g) => (
        <div key={g.type} className={cx("ips-sec")}>
          <div className={cx("ips-shead")}>
            <span className={cx("ips-stitle")}>{g.type}</span>
            <span className={cx("ips-scount")}>{g.services.length} services</span>
          </div>
          {g.services.map((s) => (
            <div key={s.id} className={cx("ips-row")}>
              <span className={cx("ips-name")}>{s.name}</span>
              <span className={cx("ips-base")}>Base: {rs(s.base)}</span>
              <label className={cx("ips-price")}>
                <em>Rs.</em>
                <input
                  type="text" inputMode="decimal"
                  value={overrides[s.id] ?? String(priceOf(s, g.type))}
                  placeholder={String(computed(s.base, rules[g.type]))}
                  onChange={(e) => setOverride(s.id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      ))}

      {bulk && <BulkPriceModal types={SERVICE_GROUPS.map((g) => g.type)} onClose={() => setBulk(false)} onApply={applyBulk} />}
    </>
  );
};

export default ServicePricesTab;