import { createClassNames } from '../../utils/classNames.js';
import { useEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";

import { TYPES, slug, nextUid, FIELD_TYPES } from "./PatientTypesData.js";

import FieldModal from "../Shared/FieldEditorModal";

import styles from "./PatientTypes.module.css";

const cx = createClassNames(styles);

const PatientTypes = () => {
  const [types, setTypes] = useState(TYPES);
  const [open, setOpen] = useState({});             
  const [modal, setModal] = useState(null);         
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

   
  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const updType = (key, fn) => {
    setTypes((ts) => ts.map((t) => (t.key === key ? fn(t) : t)));
    flashSaved();
  };
  const updFields = (key, fn) => updType(key, (t) => ({ ...t, fields: fn(t.fields) }));

  const moveField = (key, i, dir) =>
    updFields(key, (fs) => {
      const j = i + dir;
      if (j < 0 || j >= fs.length) return fs;
      const n = [...fs];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const patchField = (key, id, patch) =>
    updFields(key, (fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const saveModal = (data) => {
    const { typeKey, field } = modal;
    if (field) patchField(typeKey, field.id, data);
    else updFields(typeKey, (fs) => [...fs, { id: "f" + nextUid(), on: true, ...data }]);
    setModal(null);
  };

  return (
    <div className={cx("pty-page")}>
      <h1 className={cx("pty-title")}>Patient Types</h1>
      <p className={cx("pty-sub")}>Enable or disable patient categories and configure type-specific fields.</p>

      <div className={cx("pty-list")}>
        {types.map((t) => {
          const Icon = t.icon;
          const isOpen = open[t.key] && t.on && t.configurable;
          const n = t.fields.length;
          return (
            <div key={t.key} className={cx("pty-card" + (t.on ? "" : " pty-card-off"))}>
              <div className={cx("pty-head")}>
                <span className={cx("pty-icon pty-icon-" + t.color)}>
                  <Icon size={15} />
                </span>
                <div className={cx("pty-head-info")}>
                  <h3>{t.name}</h3>
                  <span>{n} extra {n === 1 ? "field" : "fields"}</span>
                </div>

                {t.configurable && t.on && (
                  <button
                    className={cx("pty-config")}
                    onClick={() => setOpen((o) => ({ ...o, [t.key]: !o[t.key] }))}
                  >
                    Configure {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                )}

                <button
                  className={cx("pty-sw" + (t.on ? " pty-sw-on" : ""))}
                  onClick={() => updType(t.key, (x) => ({ ...x, on: !x.on }))}
                />
              </div>

              {isOpen && (
                <div className={cx("pty-body")}>
                  <div className={cx("pty-body-title")}>Type-Specific Fields</div>

                  {t.fields.map((f, i) => (
                    <div key={f.id} className={cx("pty-row" + (f.on ? "" : " pty-row-off"))}>
                      <div className={cx("pty-move")}>
                        <button
                          className={cx(i === 0 ? "pty-hide" : "")}
                          onClick={() => moveField(t.key, i, -1)}
                          title="Move up"
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button
                          className={cx(i === n - 1 ? "pty-hide" : "")}
                          onClick={() => moveField(t.key, i, 1)}
                          title="Move down"
                        >
                          <ChevronDown size={10} />
                        </button>
                      </div>

                      <div className={cx("pty-main")}>
                        <div className={cx("pty-name")}>
                          <span>{f.label}</span>
                          <em className={cx("pty-type pty-t-" + slug(f.type))}>{f.type}</em>
                        </div>
                        {f.placeholder && <small>Placeholder: {f.placeholder}</small>}
                      </div>

                      <div className={cx("pty-req" + (f.req ? " pty-req-on" : ""))}>
                        <button
                          className={cx("pty-rsw" + (f.req ? " pty-rsw-on" : ""))}
                          disabled={!f.on}
                          onClick={() => patchField(t.key, f.id, { req: !f.req })}
                        />
                        <span>Req'd</span>
                      </div>

                      <button
                        className={cx("pty-sw" + (f.on ? " pty-sw-on" : ""))}
                        onClick={() => patchField(t.key, f.id, { on: !f.on })}
                      />

                      <button
                        className={cx("pty-ic pty-ic-edit")}
                        title="Edit field"
                        onClick={() => setModal({ typeKey: t.key, field: f })}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        className={cx("pty-ic pty-ic-del")}
                        title="Delete field"
                        onClick={() => updFields(t.key, (fs) => fs.filter((x) => x.id !== f.id))}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  <button className={cx("pty-add")} onClick={() => setModal({ typeKey: t.key })}>
                    <Plus size={11} /> Add Field
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && <FieldModal types={FIELD_TYPES} field={modal.field} onClose={() => setModal(null)} onSave={saveModal} />}

      <div className={cx("pty-toast" + (saved ? " pty-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default PatientTypes;
