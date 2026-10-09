import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import Toggle from "../Toggle/Toggle";
import { RESET_OPTIONS, FORMATS, DEFAULTS, formatToken } from "./TokenSettingsData.js";
import styles from "./TokenSettings.module.css";

const cx = createClassNames(styles);

const TokenSettings = () => {
  const [s, setS] = useState(DEFAULTS);
  const set = (patch) => setS((p) => ({ ...p, ...patch }));

  const start = Math.max(0, parseInt(s.start, 10) || 0);
  const prefix = s.prefix || "";

  return (
    <div className={cx("tk-wrap")}>
      <h1 className={cx("tk-title")}>Token Settings</h1>
      <p className={cx("tk-desc")}>Configure how tokens are generated, formatted, and reset.</p>

      <div className={cx("tk-preview")}>
        <div>
          <p className={cx("tk-plabel")}>Live Preview</p>
          <p className={cx("tk-psub")}>How tokens will appear at the counter display</p>
        </div>
        <div className={cx("tk-pright")}>
          <span className={cx("tk-token")}>{formatToken(prefix, start, s.format)}</span>
          <span className={cx("tk-next")}>Next: {formatToken(prefix, start + 1, s.format)}</span>
        </div>
      </div>

      <div className={cx("tk-card")}>
        <div className={cx("tk-cols")}>
          <div className={cx("tk-col")}>
            <label className={cx("tk-field")}>
              <span className={cx("tk-label")}>Token Prefix</span>
              <span className={cx("tk-help")}>Letter(s) prepended to every token number (max 2).</span>
              <input
                className={cx("tk-in tk-prefix")}
                maxLength={2}
                value={s.prefix}
                onChange={(e) => set({ prefix: e.target.value.toUpperCase().replace(/[^A-Z]/g, "") })}
              />
            </label>
            <label className={cx("tk-field")}>
              <span className={cx("tk-label")}>Starting Number</span>
              <span className={cx("tk-help")}>First number issued when tokens reset.</span>
              <input
                className={cx("tk-in tk-start")}
                inputMode="numeric"
                value={s.start}
                onChange={(e) => set({ start: e.target.value.replace(/\D/g, "") })}
              />
            </label>
          </div>

          <div className={cx("tk-col tk-col-r")}>
            <div className={cx("tk-field")}>
              <span className={cx("tk-label")}>Reset Frequency</span>
              <span className={cx("tk-help")}>How often token numbering resets.</span>
              <div className={cx("tk-seg")}>
                {RESET_OPTIONS.map((r) => (
                  <button type="button" key={r} className={cx(`tk-opt ${s.reset === r ? "tk-opt-on" : ""}`)} onClick={() => set({ reset: r })}>{r}</button>
                ))}
              </div>
            </div>
            <div className={cx("tk-field")}>
              <span className={cx("tk-label")}>Display Format</span>
              <span className={cx("tk-help")}>How the number appears alongside the prefix.</span>
              <div className={cx("tk-seg")}>
                {FORMATS.map((f) => (
                  <button type="button" key={f} className={cx(`tk-fmt ${s.format === f ? "tk-fmt-on" : ""}`)} onClick={() => set({ format: f })}>
                    <span className={cx("tk-fname")}>{f}</span>
                    <span className={cx("tk-fval")}>{formatToken(prefix, 1, f)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cx("tk-manual")}>
          <div>
            <p className={cx("tk-mtitle")}>Allow Manual Token Entry</p>
            <p className={cx("tk-mdesc")}>Staff can manually type a token number at registration instead of auto-generating.</p>
          </div>
          <div className={cx("tk-switch")}>
                        <Toggle size="medium" color="green" className={cx("tk-tg")} on={s.manual} onChange={() => set({ manual: !s.manual })} label="Allow manual token entry" />
            <span className={cx(`tk-state ${s.manual ? "tk-on" : "tk-off"}`)}>{s.manual ? "On" : "Off"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSettings;