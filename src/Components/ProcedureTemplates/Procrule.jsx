import { createClassNames } from "../../utils/classNames.js";
import { X } from "lucide-react";
import Select from "../Shared/Select";
import styles from "./ProcRule.module.css";

const cx = createClassNames(styles);

const ProcRule = ({ rule, fields, onChange, onRemove }) => {
  const others = fields.filter((f) => f.id !== rule.trigger);

  const toggleShow = (id) =>
    onChange({ show: rule.show.includes(id) ? rule.show.filter((x) => x !== id) : [...rule.show, id] });

  return (
    <div className={cx("ptb-rule")}>
      <div className={cx("ptb-rule-head")}>
        <span>When field value matches...</span>
        <button title="Remove rule" onClick={onRemove}><X size={12} /></button>
      </div>

      <div className={cx("ptb-rule-grid")}>
        <div>
          <div className={cx("ptb-rule-label")}>Trigger Field</div>
          <Select
            label="Trigger field"
            placeholder="Select field..."
            value={rule.trigger || null}
            options={fields.map((f) => ({ value: f.id, label: f.label }))}
            onChange={(id) => onChange({ trigger: id, show: rule.show.filter((x) => x !== id) })}
          />
        </div>
        <div>
          <div className={cx("ptb-rule-label")}>Trigger Value(s)</div>
          <input
            className={cx("ptb-rule-inp")}
            placeholder="val1, val2..."
            value={rule.values}
            onChange={(e) => onChange({ values: e.target.value })}
          />
        </div>
      </div>

      <div className={cx("ptb-rule-label ptb-rule-label-show")}>Then Show These Fields</div>
      {others.length === 0 ? (
        <p className={cx("ptb-rule-none")}>Add other fields first.</p>
      ) : (
        <div className={cx("ptb-rule-chips")}>
          {others.map((f) => (
            <button
              key={f.id}
              className={cx(`ptb-rule-chip ${rule.show.includes(f.id) ? "ptb-rule-chip-on" : ""}`)}
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

export default ProcRule;