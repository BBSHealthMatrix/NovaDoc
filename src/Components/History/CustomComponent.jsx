import { createClassNames } from "../../utils/classNames.js";
import { Layers, Pencil, ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import HistoryRule from "./HistoryRule";
import { newId, slug } from "./HistoryData.js";
import styles from "./CustomComponent.module.css";

const cx = createClassNames(styles);

const CustomComponent = ({ comp, open, onToggle, onChange, onRename, onRemove, onAddField, onEditField }) => {
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
    <div className={cx("hist-cus")}>
      <div className={cx("hist-cus-head")}>
        <span className={cx("hist-cus-ic")}><Layers size={13} /></span>
        <div className={cx("hist-cus-info")}>
          <div className={cx("hist-cus-name")}>
            <b>{comp.name}</b>
            <em className={cx("hist-badge")}>Custom</em>
            {comp.repeat && <em className={cx("hist-badge hist-badge-rep")}>Repeater</em>}
            <button className={cx("hist-pen")} title="Rename component" onClick={onRename}><Pencil size={11} /></button>
          </div>
          <small>{n} {n === 1 ? "field" : "fields"}</small>
        </div>
        <button className={cx(`hist-cfg ${open ? "hist-cfg-open" : ""}`)} onClick={onToggle}>
          {open ? "Collapse" : "Configure"}
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
        <button className={cx("hist-trash")} title="Remove component" onClick={onRemove}><Trash2 size={12} /></button>
      </div>

      {open && (
        <div className={cx("hist-cus-body")}>
          <div className={cx("hist-rep")}>
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
            <div className={cx("hist-repset")}>
              <span>Repeat limit (blank = unlimited)</span>
              <input
                className={cx("hist-limit")}
                placeholder="Unlimited"
                value={comp.limit}
                onChange={(e) => set({ limit: e.target.value.replace(/\D/g, "") }, false)}
              />

              <span>Field layout</span>
              <div className={cx("hist-seg")}>
                {["vertical", "horizontal"].map((l) => (
                  <button key={l} className={cx(comp.layout === l ? "hist-seg-on" : "")} onClick={() => set({ layout: l })}>
                    {l === "vertical" ? "Vertical" : "Horizontal"}
                  </button>
                ))}
              </div>

              {comp.layout === "horizontal" && (
                <>
                  <span>Columns per row</span>
                  <div className={cx("hist-cols")}>
                    {[1, 2, 3, 4].map((c) => (
                      <button key={c} className={cx(comp.cols === c ? "hist-seg-on" : "")} onClick={() => set({ cols: c })}>
                        {c}
                      </button>
                    ))}
                    <small>max 4</small>
                  </div>
                </>
              )}
            </div>
          )}

          <div className={cx("hist-label")}>Fields</div>
          {n === 0 ? (
            <div className={cx("hist-empty-box")}>No fields yet. Click "Add Field" to get started.</div>
          ) : (
            comp.fields.map((f, i) => (
              <div key={f.id} className={cx("hist-row" + (f.on ? "" : " hist-row-off"))}>
                <div className={cx("hist-move")}>
                  <button className={cx(i === 0 ? "hist-hide" : "")} title="Move up" onClick={() => moveField(i, -1)}>
                    <ChevronUp size={10} />
                  </button>
                  <button className={cx(i === n - 1 ? "hist-hide" : "")} title="Move down" onClick={() => moveField(i, 1)}>
                    <ChevronDown size={10} />
                  </button>
                </div>

                <div className={cx("hist-main")}>
                  <div className={cx("hist-name")}>
                    <span>{f.label}</span>
                    <em className={cx("hist-type hist-t-" + slug(f.type))}>{f.type}</em>
                  </div>
                  {f.placeholder && <small>Placeholder: {f.placeholder}</small>}
                </div>

                <div className={cx("hist-req" + (f.req ? " hist-req-on" : ""))}>
                  <button
                    className={cx("hist-rsw" + (f.req ? " hist-rsw-on" : ""))}
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

                <button className={cx("hist-ic hist-ic-edit")} title="Edit field" onClick={() => onEditField(f)}>
                  <Pencil size={12} />
                </button>
                <button className={cx("hist-ic hist-ic-del")} title="Delete field" onClick={() => setFields((fs) => fs.filter((x) => x.id !== f.id))}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}

          <button className={cx("hist-addfield")} onClick={onAddField}>
            <Plus size={11} /> Add Field
          </button>

          <div className={cx("hist-rules-head")}>
            <div className={cx("hist-label")}>Conditional Rules</div>
            <button
              className={cx("hist-addrule")}
              onClick={() => setRules((rs) => [...rs, { id: newId("r"), trigger: "", values: "", show: [] }])}
            >
              <Plus size={11} /> Add Rule
            </button>
          </div>

          {comp.rules.length === 0 ? (
            <div className={cx("hist-empty-rules")}>No rules — all fields shown unconditionally.</div>
          ) : (
            comp.rules.map((r) => (
              <HistoryRule
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

export default CustomComponent;