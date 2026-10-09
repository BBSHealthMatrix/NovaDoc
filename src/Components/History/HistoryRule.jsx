import { createClassNames } from "../../utils/classNames.js";
import { X } from "lucide-react";
import Select from "../Shared/Select";
import styles from "./HistoryRule.module.css";

const cx = createClassNames(styles);

const HistoryRule = ({ rule, fields, onChange, onRemove }) => {
  const others = fields.filter((f) => f.id !== rule.trigger);

  const toggleShow = (id) =>
    onChange({ show: rule.show.includes(id) ? rule.show.filter((x) => x !== id) : [...rule.show, id] });

  return (
    <div className={cx("hist-rule")}>
      <div className={cx("hist-rule-head")}>
        <span>When field value matches...</span>
        <button title="Remove rule" onClick={onRemove}><X size={12} /></button>
      </div>

      <div className={cx("hist-rule-grid")}>
        <div>
          <div className={cx("hist-rule-label")}>Trigger Field</div>
          <Select
            label="Trigger field"
            placeholder="Select field..."
            value={rule.trigger || null}
            options={fields.map((f) => ({ value: f.id, label: f.label }))}
            onChange={(id) => onChange({ trigger: id, show: rule.show.filter((x) => x !== id) })}
          />
        </div>
        <div>
          <div className={cx("hist-rule-label")}>Trigger Value(s)</div>
          <input
            className={cx("hist-rule-inp")}
            placeholder="val1, val2..."
            value={rule.values}
            onChange={(e) => onChange({ values: e.target.value })}
          />
        </div>
      </div>

      <div className={cx("hist-rule-label hist-rule-label-show")}>Then Show These Fields</div>
      {others.length === 0 ? (
        <p className={cx("hist-rule-none")}>Add other fields first.</p>
      ) : (
        <div className={cx("hist-rule-chips")}>
          {others.map((f) => (
            <button
              key={f.id}
              className={cx(`hist-rule-chip ${rule.show.includes(f.id) ? "hist-rule-chip-on" : ""}`)}
              onClick={() => toggleShow(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryRule;