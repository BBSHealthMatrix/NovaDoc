import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import Select from "../Shared/Select";
import { RENEWALS, SERVICE_TYPES } from "./WelfareSchemesData.js";
import styles from "./WelfareLimitsTab.module.css";

const cx = createClassNames(styles);

const FIELDS = [
  ["creditLimit", "Annual Credit Limit (Rs.)", "Set 0 for unlimited"],
  ["maxOpd", "Max OPD Visits / Year", "Set 0 for unlimited"],
  ["maxInpatient", "Max Inpatient Days / Year", "Set 0 for not applicable"],
  ["grace", "Grace Period (days)", "After renewal expiry"],
];

// co-pay pill: 0 → green, under 50 → blue, 50+ → amber
const copayPill = (v) => {
  const n = Number(v) || 0;
  if (n <= 0) return { label: "No co-pay", tone: "none" };
  return { label: `${n}% co-pay`, tone: n >= 50 ? "high" : "low" };
};

const WelfareLimitsTab = ({ limits, copay, onSave }) => {
  const [lim, setLim] = useState(limits);
  const [cp, setCp] = useState(copay);
  const [saved, setSaved] = useState(false);

  const setL = (patch) => { setLim((p) => ({ ...p, ...patch })); setSaved(false); };
  const setC = (type, v) => { setCp((p) => ({ ...p, [type]: v })); setSaved(false); };
  const save = () => { onSave(lim, cp); setSaved(true); };

  return (
    <div className={cx("wsl-wrap")}>
      <div className={cx("wsl-card")}>
        <h3 className={cx("wsl-title")}>Financial Limits</h3>
        <div className={cx("wsl-grid")}>
          {FIELDS.map(([key, label, help]) => (
            <label key={key}>
              <span className={cx("wsl-lbl")}>{label}</span>
              <span className={cx("wsl-help")}>{help}</span>
              <input type="number" min="0" className={cx("wsl-in")} value={lim[key]} onChange={(e) => setL({ [key]: e.target.value })} />
            </label>
          ))}
        </div>
        <span className={cx("wsl-lbl wsl-rlbl")}>Renewal Period</span>
        <div className={cx("wsl-sel")}>
          <Select value={lim.renewal} options={RENEWALS} onChange={(v) => setL({ renewal: v })} label="Renewal Period" />
        </div>
      </div>

      <div className={cx("wsl-card wsl-copay")}>
        <div className={cx("wsl-chead")}>
          <h3 className={cx("wsl-title")}>Co-pay % by Service Type</h3>
          <p>The portion of cost the patient pays out-of-pocket. Independent from the coverage % set on the Coverage tab.</p>
        </div>
        {SERVICE_TYPES.map((t) => {
          const pill = copayPill(cp[t]);
          return (
            <div key={t} className={cx("wsl-row")}>
              <i className={cx("wsl-dot")} />
              <span className={cx("wsl-name")}>{t}</span>
              <input type="number" min="0" max="100" className={cx("wsl-pin")} value={cp[t]} onChange={(e) => setC(t, e.target.value)} />
              <span className={cx("wsl-pct")}>%</span>
              <em className={cx(`wsl-pill wsl-${pill.tone}`)}>{pill.label}</em>
            </div>
          );
        })}
      </div>

      <div className={cx("wsl-save")}>
        <button type="button" className={cx("wsl-btn")} onClick={save}>Save Limits &amp; Co-pay</button>
        {saved && <span className={cx("wsl-saved")}><CircleCheck size={13} /> Saved</span>}
      </div>
    </div>
  );
};

export default WelfareLimitsTab;