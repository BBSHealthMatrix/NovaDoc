import { createClassNames } from "../../utils/classNames.js";
import { Layers, Pencil, ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import ProcRule from "./ProcRule";
import { newId, slug } from "./ProcedureTemplatesData.js";
import styles from "./ProcCustomComponent.module.css";

const cx = createClassNames(styles);

const ProcCustomComponent = ({ comp, open, onToggle, onChange, onRename, onRemove, onAddField, onEditField }) => {
  const n = comp.fields.length;

  const set = (patch, toast = true) => onChange((c) => ({ ...c, ...patch }), toast);
  const setFields = (fn) => onChange((c) => ({ ...c, fields: fn(c.fields) }));
  const setRules = (fn, toast = true) => onChange((c) => ({ ...c, rules: fn(c.rules) }), toast);
  const patchField = (id, patch) => setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const moveField = (i, dir) =>
    setFields((fs) => {
      const j = i + dir;
      if (j < 0 || j >= fs.length) return fs;
      const next = [...fs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className={cx("ptb-cus")}>
      <div className={cx("ptb-cus-head")}>
        <span className={cx("ptb-cus-ic")}><Layers size={13} /></span>
        <div className={cx("ptb-cus-info")}>
          <div className={cx("ptb-cus-name")}>
            <b>{comp.name}</b>
            <em className={cx("ptb-badge")}>Custom</em>
            {comp.repeat && <em className={cx("ptb-badge ptb-badge-rep")}>Repeater</em>}
            <button className={cx("ptb-pen")} title="Rename component" onClick={onRename}><Pencil size={11} /></button>
          </div>
          <small>
            {n} {n === 1 ? "field" : "fields"}
            {comp.rules.length > 0 && ` · ${comp.rules.length} ${comp.rules.length === 1 ? "rule" : "rules"}`}
          </small>
        </div>
        <button className={cx(`ptb-cfg ${open ? "ptb-cfg-open" : ""}`)} onClick={onToggle}>
          {open ? "Collapse" : "Configure"}
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
        <button className={cx("ptb-trash")} title="Remove component" onClick={onRemove}><Trash2 size={12} /></button>
      </div>

      {open && (
        <div className={cx("ptb-cus-body")}>
          <div className={cx("ptb-rep")}>
            <div>
              <h4>Repeatable Entry Group</h4>
              <p>Allow staff to add multiple records of this section (e.g. multiple procedures).</p>
            </div>
            <Toggle
              size="large"
              color="softBlue"
              label="Repeatable entry group"
              on={comp.repeat}
              onChange={() => set({ repeat: !comp.repeat })}
            />
          </div>

          {comp.repeat && (
            <div className={cx("ptb-repset")}>
              <span>Repeat limit (blank = unlimited)</span>
              <input
                className={cx("ptb-limit")}
                placeholder="Unlimited"
                value={comp.limit}
                onChange={(e) => set({ limit: e.target.value.replace(/\D/g, "") }, false)}
              />

              <span>Field layout</span>
              <div className={cx("ptb-seg")}>
                {["vertical", "horizontal"].map((l) => (
                  <button key={l} className={cx(comp.layout === l ? "ptb-seg-on" : "")} onClick={() => set({ layout: l })}>
                    {l === "vertical" ? "Vertical" : "Horizontal"}
                  </button>
                ))}
              </div>

              {comp.layout === "horizontal" && (
                <>
                  <span>Columns per row</span>
                  <div className={cx("ptb-cols")}>
                    {[1, 2, 3, 4].map((c) => (
                      <button key={c} className={cx(comp.cols === c ? "ptb-seg-on" : "")} onClick={() => set({ cols: c })}>
                        {c}
                      </button>
                    ))}
                    <small>max 4</small>
                  </div>
                </>
              )}
            </div>
          )}

          <div className={cx("ptb-label")}>Fields</div>
          {n === 0 ? (
            <div className={cx("ptb-empty-box")}>No fields yet. Click "Add Field" to get started.</div>
          ) : (
            comp.fields.map((f, i) => (
              <div key={f.id} className={cx("ptb-row" + (f.on ? "" : " ptb-row-off"))}>
                <div className={cx("ptb-move")}>
                  <button className={cx(i === 0 ? "ptb-hide" : "")} title="Move up" onClick={() => moveField(i, -1)}>
                    <ChevronUp size={10} />
                  </button>
                  <button className={cx(i === n - 1 ? "ptb-hide" : "")} title="Move down" onClick={() => moveField(i, 1)}>
                    <ChevronDown size={10} />
                  </button>
                </div>

                <div className={cx("ptb-main")}>
                  <div className={cx("ptb-name")}>
                    <span>{f.label}</span>
                    <em className={cx("ptb-type ptb-t-" + slug(f.type))}>{f.type}</em>
                  </div>
                  {f.placeholder && <small>Placeholder: {f.placeholder}</small>}
                </div>

                <div className={cx("ptb-req" + (f.req ? " ptb-req-on" : ""))}>
                  <button
                    className={cx("ptb-rsw" + (f.req ? " ptb-rsw-on" : ""))}
                    disabled={!f.on}
                    aria-label={`Required: ${f.label}`}
                    onClick={() => patchField(f.id, { req: !f.req })}
                  />
                  <span>Req'd</span>
                </div>

                <Toggle
                  size="large"
                  color="softBlue"
                  label={`Show ${f.label}`}
                  on={f.on}
                  onChange={() => patchField(f.id, { on: !f.on })}
                />

                <button className={cx("ptb-ic ptb-ic-edit")} title="Edit field" onClick={() => onEditField(f)}>
                  <Pencil size={12} />
                </button>
                <button className={cx("ptb-ic ptb-ic-del")} title="Delete field" onClick={() => setFields((fs) => fs.filter((x) => x.id !== f.id))}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}

          <button className={cx("ptb-addfield")} onClick={onAddField}>
            <Plus size={11} /> Add Field
          </button>

          <div className={cx("ptb-rules-head")}>
            <div className={cx("ptb-label")}>Conditional Rules</div>
            <button
              className={cx("ptb-addrule")}
              onClick={() => setRules((rs) => [...rs, { id: newId("r"), trigger: "", values: "", show: [] }])}
            >
              <Plus size={11} /> Add Rule
            </button>
          </div>

          {comp.rules.length === 0 ? (
            <div className={cx("ptb-empty-rules")}>No rules — all fields shown unconditionally.</div>
          ) : (
            comp.rules.map((r) => (
              <ProcRule
                key={r.id}
                rule={r}
                fields={comp.fields}
                onChange={(patch) => setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, ...patch } : x)), false)}
                onRemove={() => setRules((rs) => rs.filter((x) => x.id !== r.id))}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProcCustomComponent;