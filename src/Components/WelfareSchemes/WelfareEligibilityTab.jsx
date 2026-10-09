import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { AGE_GROUPS, DOCUMENTS } from "./WelfareSchemesData.js";
import styles from "./WelfareEligibilityTab.module.css";

const cx = createClassNames(styles);

const WelfareEligibilityTab = ({ eligibility, onSave }) => {
  const [d, setD] = useState(eligibility);
  const [saved, setSaved] = useState(false);

  const set = (patch) => { setD((p) => ({ ...p, ...patch })); setSaved(false); };
  const toggleIn = (key, value) => set({ [key]: d[key].includes(value) ? d[key].filter((x) => x !== value) : [...d[key], value] });
  const save = () => { onSave(d); setSaved(true); };

  return (
    <div className={cx("wse-wrap")}>
      <div className={cx("wse-card")}>
        <h3 className={cx("wse-title")}>Income &amp; Household</h3>
        <div className={cx("wse-grid")}>
          <label>
            <span className={cx("wse-lbl")}>Max Monthly Income (Rs.)</span>
            <span className={cx("wse-help")}>Set 0 for no income restriction</span>
            <input type="number" min="0" className={cx("wse-in")} value={d.maxIncome} onChange={(e) => set({ maxIncome: e.target.value })} />
          </label>
          <label>
            <span className={cx("wse-lbl")}>Max Household Members</span>
            <span className={cx("wse-help")}>Set 0 for no restriction</span>
            <input type="number" min="0" className={cx("wse-in")} value={d.maxHousehold} onChange={(e) => set({ maxHousehold: e.target.value })} />
          </label>
        </div>
      </div>

      <div className={cx("wse-card")}>
        <h3 className={cx("wse-title")}>Required Documents</h3>
        <div className={cx("wse-docs")}>
          {DOCUMENTS.map((doc) => (
            <label key={doc} className={cx("wse-tile")}>
              <input type="checkbox" checked={d.documents.includes(doc)} onChange={() => toggleIn("documents", doc)} />
              {doc}
            </label>
          ))}
        </div>
      </div>

      <div className={cx("wse-card")}>
        <h3 className={cx("wse-title")}>Age Groups &amp; Inclusion</h3>
        <div className={cx("wse-ages")}>
          {AGE_GROUPS.map((g) => (
            <label key={g} className={cx("wse-tile")}>
              <input type="checkbox" checked={d.ageGroups.includes(g)} onChange={() => toggleIn("ageGroups", g)} />
              {g}
            </label>
          ))}
        </div>
        <div className={cx("wse-pwd")}>
          <Toggle on={d.pwd} onChange={() => set({ pwd: !d.pwd })} size="large" color="softBlue" className={cx("wse-tg")} label="Include persons with disability" />
          Include persons with disability (PWD)
        </div>
      </div>

      <div className={cx("wse-card")}>
        <h3 className={cx("wse-title")}>Additional Notes</h3>
        <textarea className={cx("wse-notes")} value={d.notes} onChange={(e) => set({ notes: e.target.value })} />
      </div>

      <div className={cx("wse-save")}>
        <button type="button" className={cx("wse-btn")} onClick={save}>Save Eligibility</button>
        {saved && <span className={cx("wse-saved")}><CircleCheck size={13} /> Saved</span>}
      </div>
    </div>
  );
};

export default WelfareEligibilityTab;