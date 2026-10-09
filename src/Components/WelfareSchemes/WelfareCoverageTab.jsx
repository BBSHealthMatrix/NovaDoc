import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SERVICE_TYPES, coverageStatus } from "./WelfareSchemesData.js";
import styles from "./WelfareCoverageTab.module.css";

const cx = createClassNames(styles);

const WelfareCoverageTab = ({ coverage, onSave }) => {
  const [d, setD] = useState(coverage);
  const [saved, setSaved] = useState(false);

  const set = (type, patch) => { setD((p) => ({ ...p, [type]: { ...p[type], ...patch } })); setSaved(false); };
  const save = () => { onSave(d); setSaved(true); };

  return (
    <div className={cx("wsc-wrap")}>
      <div className={cx("wsc-card")}>
        <div className={cx("wsc-row wsc-head")}>
          <span>Service Type</span><span>Covered</span><span>Coverage %</span><span>Status</span>
        </div>
        {SERVICE_TYPES.map((t) => {
          const c = d[t];
          const st = coverageStatus(c);
          return (
            <div key={t} className={cx("wsc-row")}>
              <span className={cx("wsc-name")}>{t}</span>
              <span>
                <Toggle on={c.covered} onChange={() => set(t, { covered: !c.covered })} size="large" color="softBlue" className={cx("wsc-tg")} label={`${t} covered`} />
              </span>
              <span>
                <input
                  type="number" min="0" max="100" className={cx("wsc-in")} disabled={!c.covered}
                  value={c.pct} onChange={(e) => set(t, { pct: e.target.value })}
                />
              </span>
              <span><em className={cx(`wsc-pill wsc-${st.tone}`)}>{st.label}</em></span>
            </div>
          );
        })}
      </div>

      <div className={cx("wsc-save")}>
        <button type="button" className={cx("wsc-btn")} onClick={save}>Save Coverage</button>
        {saved && <span className={cx("wsc-saved")}><CircleCheck size={13} /> Saved</span>}
      </div>
    </div>
  );
};

export default WelfareCoverageTab;