import { createClassNames } from "../../utils/classNames.js";
import { useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { TYPES, CHOICE } from "./HpiTemplatesData.js";
import styles from "./HpiField.module.css";

const cx = createClassNames(styles);

const HpiField = ({ field, sources, onChange, onRemove, onDragStart, onDragOver, onDragEnd }) => {
  const [armed, setArmed] = useState(false); // drag the card only from its grip
  const [newOpt, setNewOpt] = useState("");
  const optFrom = useRef(null);
  const source = sources.find((s) => s.id === field.cond?.field);
  const choice = CHOICE.includes(field.type);

  /* options */
  const setOpt = (i, value) => onChange({ opts: field.opts.map((o, k) => (k === i ? value : o)) });
  const removeOpt = (i) => onChange({ opts: field.opts.filter((_, k) => k !== i) });
  const addOpt = () => {
    const v = newOpt.trim();
    if (!v || field.opts.includes(v)) return;
    onChange({ opts: [...field.opts, v] });
    setNewOpt("");
  };
  const optOver = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    const from = optFrom.current;
    if (from === null || from === i) return;
    const next = [...field.opts];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    optFrom.current = i;
    onChange({ opts: next });
  };

  /* show only when... */
  const toggleCond = () => onChange({ cond: field.cond ? null : { field: sources[0].id, values: [] } });
  const pickValue = (o) => {
    const values = field.cond.values.includes(o) ? field.cond.values.filter((v) => v !== o) : [...field.cond.values, o];
    onChange({ cond: { ...field.cond, values } });
  };

  return (
    <div
      className={cx("hpi-field")}
      draggable={armed}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={() => { setArmed(false); onDragEnd(); }}
    >
      <div className={cx("hpi-f-top")}>
        <span className={cx("hpi-grip")} onMouseDown={() => setArmed(true)} onMouseUp={() => setArmed(false)}>
          <GripVertical size={12} />
        </span>
        <input
          className={cx("hpi-f-label")}
          placeholder="Field label..."
          value={field.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
        <select className={cx("hpi-f-type")} value={field.type} onChange={(e) => onChange({ type: e.target.value })}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <Toggle size="small" color="softBlue" on={field.req} onChange={() => onChange({ req: !field.req })} label="Required" />
        <span className={cx("hpi-f-req")}>Req.</span>
        <button type="button" className={cx("hpi-f-x")} onClick={onRemove} aria-label="Remove field"><X size={11} /></button>
      </div>

      {choice ? (
        <div className={cx("hpi-opts")}>
          {field.opts.map((o, i) => (
            <div
              className={cx("hpi-opt")}
              key={i}
              draggable
              onDragStart={(e) => { e.stopPropagation(); optFrom.current = i; }}
              onDragOver={(e) => optOver(e, i)}
              onDragEnd={(e) => { e.stopPropagation(); optFrom.current = null; }}
            >
              <GripVertical size={10} className={cx("hpi-opt-grip")} />
              <input value={o} onChange={(e) => setOpt(i, e.target.value)} />
              <button type="button" onClick={() => removeOpt(i)} aria-label={`Remove ${o}`}><X size={10} /></button>
            </div>
          ))}
          <div className={cx("hpi-opt-add")}>
            <input
              placeholder="Add option..."
              value={newOpt}
              onChange={(e) => setNewOpt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addOpt(); }}
            />
            <button type="button" onClick={addOpt}>Add</button>
          </div>
        </div>
      ) : (
        <input
          className={cx("hpi-f-sub")}
          placeholder="Placeholder text (optional)..."
          value={field.placeholder}
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      )}

      <div className={cx("hpi-f-cond")}>
        <Toggle size="compact" color="amber" on={Boolean(field.cond)} disabled={!sources.length && !field.cond} onChange={toggleCond} label="Show only when" />
        <span className={cx(`hpi-f-cond-label ${!sources.length ? "hpi-f-off" : ""}`)}>Show only when...</span>
        {!sources.length && !field.cond && <span className={cx("hpi-f-hint")}>add a radio or multi-select field first</span>}
      </div>

      {field.cond && (
        <div className={cx("hpi-when")}>
          <div className={cx("hpi-when-row")}>
            <span className={cx("hpi-when-lbl")}>When field</span>
            <select value={field.cond.field} onChange={(e) => onChange({ cond: { field: e.target.value, values: [] } })}>
              {!source && <option value={field.cond.field}>Select field</option>}
              {sources.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <span className={cx("hpi-when-lbl")}>Has value</span>
          <div className={cx("hpi-when-vals")}>
            {(source?.opts || []).map((o) => (
              <button type="button" key={o} className={cx(`hpi-when-val ${field.cond.values.includes(o) ? "hpi-when-on" : ""}`)} onClick={() => pickValue(o)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HpiField;