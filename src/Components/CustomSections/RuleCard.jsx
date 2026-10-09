import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Check, X, ChevronDown } from "lucide-react";

import styles from "./RuleCard.module.css";

const cx = createClassNames(styles);

const RuleCard = ({ rule, fields, onChange, onRemove }) => {
  const [open, setOpen] = useState(false);
  const trig = fields.find((f) => f.id === rule.trigger);
  const others = fields.filter((f) => f.id !== rule.trigger);

  const toggleShow = (id) =>
    onChange({ show: rule.show.includes(id) ? rule.show.filter((x) => x !== id) : [...rule.show, id] });

  return (
    <div className={cx("csec-rule")}>
      <div className={cx("csec-rule-head")}>
        <span>When field value matches...</span>
        <button onClick={onRemove} title="Remove rule"><X size={12} /></button>
      </div>

      <div className={cx("csec-rule-grid")}>
        <div>
          <div className={cx("csec-label csec-label-sm")}>Trigger Field</div>
          <div className={cx("csec-sel")}>
            <button
              type="button"
              className={cx("csec-sel-btn" + (open ? " csec-sel-open" : "") + (trig ? "" : " csec-sel-ph"))}
              onClick={() => setOpen((o) => !o)}
            >
              <span>{trig ? trig.label : "Select field..."}</span>
              <ChevronDown size={13} />
            </button>
            {open && (
              <>
                <div className={cx("csec-sel-shield")} onMouseDown={() => setOpen(false)} />
                <div className={cx("csec-sel-menu")}>
                  {fields.length === 0 && <div className={cx("csec-sel-none")}>No fields yet.</div>}
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={cx("csec-sel-opt" + (f.id === rule.trigger ? " csec-sel-cur" : ""))}
                      onClick={() => {
                        onChange({ trigger: f.id, show: rule.show.filter((x) => x !== f.id) });
                        setOpen(false);
                      }}
                    >
                      <span>{f.label}</span>
                      {f.id === rule.trigger && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className={cx("csec-label csec-label-sm")}>Trigger Value(s)</div>
          <input
            className={cx("csec-inp csec-inp-rule")}
            placeholder="val1, val2..."
            value={rule.values}
            onChange={(e) => onChange({ values: e.target.value })}
          />
        </div>
      </div>

      <div className={cx("csec-label csec-label-sm csec-label-show")}>Then Show These Fields</div>
      {others.length === 0 ? (
        <p className={cx("csec-rule-none")}>Add other fields first.</p>
      ) : (
        <div className={cx("csec-rule-checks")}>
          {others.map((f) => (
            <label key={f.id}>
              <input type="checkbox" checked={rule.show.includes(f.id)} onChange={() => toggleShow(f.id)} />
              {f.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default RuleCard;
