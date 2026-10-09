import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleAlert } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { RULES, SETTINGS, WARNING } from "./LockingData.js";
import styles from "./Locking.module.css";

const cx = createClassNames(styles);

const Locking = () => {
  const [settings, setSettings] = useState(SETTINGS);
  const set = (key, value) => setSettings((p) => ({ ...p, [key]: value }));

  return (
    <div className={cx("lk-wrap")}>
      <h1 className={cx("lk-title")}>Locking Settings</h1>
      <p className={cx("lk-desc")}>Prevent simultaneous editing conflicts on tokens and counters.</p>

      <div className={cx("lk-card")}>
        {RULES.map((r) => (
          <div className={cx("lk-row")} key={r.key}>
            <div className={cx("lk-info")}>
              <p className={cx("lk-name")}>{r.title}</p>
              <p className={cx("lk-text")}>{r.desc}</p>
            </div>
            {r.type === "toggle" ? (
              <div className={cx("lk-switch")}>
                <Toggle size="medium" color="softBlue" className={cx("lk-tg")} on={settings[r.key]} onChange={() => set(r.key, !settings[r.key])} label={r.title} />
                <span className={cx("lk-state")}>{settings[r.key] ? "On" : "Off"}</span>
              </div>
            ) : (
              <input
                className={cx("lk-num")}
                inputMode="numeric"
                value={settings[r.key]}
                onChange={(e) => set(r.key, e.target.value.replace(/\D/g, ""))}
                aria-label={r.title}
              />
            )}
          </div>
        ))}
      </div>

      <div className={cx("lk-warn")}>
        <CircleAlert size={14} />
        <p>{WARNING}</p>
      </div>
    </div>
  );
};

export default Locking;