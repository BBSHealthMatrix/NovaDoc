import { createClassNames } from '../../utils/classNames.js';
import { useEffect, useRef, useState } from "react";

import { Layers, Plus, Check, X, ChevronDown, ChevronUp, Trash2, Pencil, AlertCircle, CheckCircle2 } from "lucide-react";

import { newId, slug, FIELD_TYPES } from "./CustomSectionsData.js";

import RuleCard from "./RuleCard";

import FieldModal from "../Shared/FieldEditorModal";

import styles from "./CustomSections.module.css";

const cx = createClassNames(styles);

const CustomSections = () => {
  const [sections, setSections] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState({});               
  const [fieldModal, setFieldModal] = useState(null);  
  const [delSec, setDelSec] = useState(null);          
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

   
  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const updSec = (id, fn, toast = true) => {
    setSections((ss) => ss.map((s) => (s.id === id ? fn(s) : s)));
    if (toast) flashSaved();
  };
  const updFields = (id, fn) => updSec(id, (s) => ({ ...s, fields: fn(s.fields) }));
  const updRules = (id, fn, toast = true) => updSec(id, (s) => ({ ...s, rules: fn(s.rules) }), toast);

  const createSection = () => {
    const name = newName.trim();
    if (!name) return;
    setSections((ss) => [
      ...ss,
      { id: newId("s"), name, desc: "", on: true, signature: false, fields: [], rules: [] },
    ]);
    setNewName("");
    setAdding(false);
    flashSaved();
  };

  const moveField = (secId, i, dir) =>
    updFields(secId, (fs) => {
      const j = i + dir;
      if (j < 0 || j >= fs.length) return fs;
      const n = [...fs];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const patchField = (secId, fid, patch) =>
    updFields(secId, (fs) => fs.map((f) => (f.id === fid ? { ...f, ...patch } : f)));

  const saveField = (data) => {
    const { secId, field } = fieldModal;
    if (field) patchField(secId, field.id, data);
    else updFields(secId, (fs) => [...fs, { id: newId("f"), on: true, ...data }]);
    setFieldModal(null);
  };

  return (
    <div className={cx("csec-page")}>
      <div className={cx("csec-top")}>
        <div>
          <h1 className={cx("csec-title")}>Custom Sections</h1>
          <p className={cx("csec-sub")}>Add custom data-capture sections to the registration form.</p>
        </div>
        <button className={cx("csec-new")} onClick={() => setAdding(true)}>
          <Plus size={13} /> New Section
        </button>
      </div>

      <div className={cx("csec-list")}>
        {sections.map((s) => {
          const isOpen = !!open[s.id];
          const n = s.fields.length;
          return (
            <div key={s.id} className={cx("csec-card" + (s.on ? "" : " csec-card-off"))}>
              
              <div className={cx("csec-head")}>
                <span className={cx("csec-icon")}><Layers size={14} /></span>
                <div className={cx("csec-head-info")}>
                  <h3>{s.name || "Untitled section"}</h3>
                  <span>
                    {n} {n === 1 ? "field" : "fields"}
                    {s.signature && <em> · Signature required</em>}
                  </span>
                </div>

                <button
                  className={cx("csec-edit" + (isOpen ? " csec-edit-open" : ""))}
                  onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                >
                  {isOpen ? "Collapse" : "Edit"}
                  {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>

                <button
                  className={cx("csec-sw" + (s.on ? " csec-sw-on" : ""))}
                  onClick={() => updSec(s.id, (x) => ({ ...x, on: !x.on }))}
                />

                <button className={cx("csec-trash")} title="Delete section" onClick={() => setDelSec(s)}>
                  <Trash2 size={12} />
                </button>
              </div>

              
              {isOpen && (
                <div className={cx("csec-body")}>
                  <div className={cx("csec-label")}>Section Name</div>
                  <input
                    className={cx("csec-inp")}
                    value={s.name}
                    onChange={(e) => updSec(s.id, (x) => ({ ...x, name: e.target.value }), false)}
                  />

                  <div className={cx("csec-label")}>Description (Optional)</div>
                  <input
                    className={cx("csec-inp")}
                    placeholder="Brief description..."
                    value={s.desc}
                    onChange={(e) => updSec(s.id, (x) => ({ ...x, desc: e.target.value }), false)}
                  />

                  <div className={cx("csec-sig")}>
                    <div>
                      <h4>Require Signature</h4>
                      <p>Patient must sign at the end of this section.</p>
                    </div>
                    <button
                      className={cx("csec-sw" + (s.signature ? " csec-sw-on" : ""))}
                      onClick={() => updSec(s.id, (x) => ({ ...x, signature: !x.signature }))}
                    />
                  </div>

                  
                  <div className={cx("csec-label csec-label-mt")}>Fields</div>
                  {n === 0 ? (
                    <div className={cx("csec-empty-box")}>No fields yet. Click "Add Field" to get started.</div>
                  ) : (
                    s.fields.map((f, i) => (
                      <div key={f.id} className={cx("csec-row" + (f.on ? "" : " csec-row-off"))}>
                        <div className={cx("csec-move")}>
                          <button
                            className={cx(i === 0 ? "csec-hide" : "")}
                            onClick={() => moveField(s.id, i, -1)}
                            title="Move up"
                          >
                            <ChevronUp size={10} />
                          </button>
                          <button
                            className={cx(i === n - 1 ? "csec-hide" : "")}
                            onClick={() => moveField(s.id, i, 1)}
                            title="Move down"
                          >
                            <ChevronDown size={10} />
                          </button>
                        </div>

                        <div className={cx("csec-main")}>
                          <div className={cx("csec-name")}>
                            <span>{f.label}</span>
                            <em className={cx("csec-type csec-t-" + slug(f.type))}>{f.type}</em>
                          </div>
                          {f.placeholder && <small>Placeholder: {f.placeholder}</small>}
                        </div>

                        <div className={cx("csec-req" + (f.req ? " csec-req-on" : ""))}>
                          <button
                            className={cx("csec-rsw" + (f.req ? " csec-rsw-on" : ""))}
                            disabled={!f.on}
                            onClick={() => patchField(s.id, f.id, { req: !f.req })}
                          />
                          <span>Req'd</span>
                        </div>

                        <button
                          className={cx("csec-sw" + (f.on ? " csec-sw-on" : ""))}
                          onClick={() => patchField(s.id, f.id, { on: !f.on })}
                        />

                        <button
                          className={cx("csec-ic csec-ic-edit")}
                          title="Edit field"
                          onClick={() => setFieldModal({ secId: s.id, field: f })}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className={cx("csec-ic csec-ic-del")}
                          title="Delete field"
                          onClick={() => updFields(s.id, (fs) => fs.filter((x) => x.id !== f.id))}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}

                  <button className={cx("csec-add")} onClick={() => setFieldModal({ secId: s.id })}>
                    <Plus size={11} /> Add Field
                  </button>

                  
                  <div className={cx("csec-rules-head")}>
                    <div className={cx("csec-label")}>Conditional Rules</div>
                    <button
                      className={cx("csec-addrule")}
                      onClick={() =>
                        updRules(s.id, (rs) => [...rs, { id: newId("r"), trigger: "", values: "", show: [] }])
                      }
                    >
                      <Plus size={11} /> Add Rule
                    </button>
                  </div>

                  {s.rules.length === 0 ? (
                    <div className={cx("csec-empty-rules")}>No rules — all fields shown unconditionally.</div>
                  ) : (
                    s.rules.map((r) => (
                      <RuleCard
                        key={r.id}
                        rule={r}
                        fields={s.fields}
                        onChange={(patch) =>
                          updRules(s.id, (rs) => rs.map((x) => (x.id === r.id ? { ...x, ...patch } : x)), false)
                        }
                        onRemove={() => updRules(s.id, (rs) => rs.filter((x) => x.id !== r.id))}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        
        {adding && (
          <div className={cx("csec-newbox")}>
            <input
              autoFocus
              className={cx("csec-newinp")}
              placeholder="Section name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createSection();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
            />
            <button className={cx("csec-newok")} onClick={createSection}>
              <Check size={13} />
            </button>
            <button
              className={cx("csec-newx")}
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        
        {sections.length === 0 && !adding && (
          <div className={cx("csec-empty")}>
            <Layers size={26} strokeWidth={1.5} />
            <h4>No custom sections yet</h4>
            <p>Click "New Section" to add additional data blocks.</p>
          </div>
        )}
      </div>

      {fieldModal && (
        <FieldModal types={FIELD_TYPES} field={fieldModal.field} onClose={() => setFieldModal(null)} onSave={saveField} />
      )}

      {delSec && (
        <div className={cx("csec-overlay")} onMouseDown={() => setDelSec(null)}>
          <div className={cx("csec-modal")} onMouseDown={(e) => e.stopPropagation()}>
            <button className={cx("csec-x")} onClick={() => setDelSec(null)}><X size={14} /></button>
            <div className={cx("csec-del-title")}>
              <AlertCircle size={15} />
              <h3>Delete</h3>
            </div>
            <p className={cx("csec-del-text")}>
              Delete <b>{delSec.name}</b>? This cannot be undone.
            </p>
            <div className={cx("csec-del-foot")}>
              <button className={cx("csec-m-cancel")} onClick={() => setDelSec(null)}>Cancel</button>
              <button
                className={cx("csec-del-btn")}
                onClick={() => {
                  setSections((ss) => ss.filter((x) => x.id !== delSec.id));
                  setDelSec(null);
                  flashSaved();
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cx("csec-toast" + (saved ? " csec-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default CustomSections;
