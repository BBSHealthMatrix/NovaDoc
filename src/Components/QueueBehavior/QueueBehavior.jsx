import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import Toggle from "../Toggle/Toggle";
import { RULES, SETTINGS, COUNTER_TYPES, COUNTERS } from "./QueueBehaviorData.js";
import styles from "./QueueBehavior.module.css";

const cx = createClassNames(styles);

const QueueBehavior = () => {
  const [settings, setSettings] = useState(SETTINGS);
  const [counters, setCounters] = useState(COUNTERS);

  const set = (key, value) => setSettings((p) => ({ ...p, [key]: value }));
  const toggleBilling = (id) => setCounters((p) => p.map((c) => (c.id === id ? { ...c, billing: !c.billing } : c)));

  return (
    <div className={cx("qb-wrap")}>
      <h1 className={cx("qb-title")}>Queue Behavior Settings</h1>
      <p className={cx("qb-desc")}>Control how patients move through the queue workflow.</p>

      <div className={cx("qb-card")}>
        {RULES.map((r) => (
          <div className={cx("qb-row")} key={r.key}>
            <div className={cx("qb-info")}>
              <p className={cx("qb-name")}>{r.title}</p>
              <p className={cx("qb-text")}>{r.desc}</p>
            </div>
            {r.type === "toggle" ? (
              <div className={cx("qb-switch")}>
                <Toggle size="medium" color="softBlue" className={cx("qb-tg")} on={settings[r.key]} onChange={() => set(r.key, !settings[r.key])} label={r.title} />
                <span className={cx("qb-state")}>{settings[r.key] ? "On" : "Off"}</span>
              </div>
            ) : (
              <input
                className={cx("qb-num")}
                style={{ width: r.width }}
                inputMode="numeric"
                value={settings[r.key]}
                onChange={(e) => set(r.key, e.target.value.replace(/\D/g, ""))}
                aria-label={r.title}
              />
            )}
          </div>
        ))}
      </div>

      <h2 className={cx("qb-stitle")}>Billing Settings</h2>
      <p className={cx("qb-sdesc")}>Enable billing requirements per counter. When enabled, payment must be completed before a token advances to the next step.</p>

      {COUNTER_TYPES.map((type) => {
        const list = counters.filter((c) => c.type === type);
        if (list.length === 0) return null;
        return (
          <div className={cx("qb-group")} key={type}>
            <div className={cx("qb-ghead")}>
              <span>{type}</span>
              <i />
              <em>{list.length} {list.length === 1 ? "counter" : "counters"}</em>
            </div>
            <div className={cx("qb-card qb-bcard")}>
              {list.map((c) => (
                <div className={cx("qb-row qb-brow")} key={c.id}>
                  <div className={cx("qb-info")}>
                    <p className={cx("qb-name")}>
                      {c.name}
                      {c.billing && <span className={cx("qb-badge")}>Billing On</span>}
                    </p>
                    <p className={cx("qb-text")}>{c.multi ? "Multi-user" : "Single-user"} counter · ID: {c.id}</p>
                  </div>
                  <div className={cx("qb-switch qb-bswitch")}>
                    <Toggle size="medium" color="softBlue" className={cx("qb-tg")} on={c.billing} onChange={() => toggleBilling(c.id)} label={`Billing for ${c.name}`} />
                    <span className={cx("qb-state")}>{c.billing ? "On" : "Off"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QueueBehavior;