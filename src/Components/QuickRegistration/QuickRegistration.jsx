import { createClassNames } from '../../utils/classNames.js';
import { useEffect, useRef, useState } from "react";

import { Plus, Zap, Check, X, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";

import { FIELD_TYPES, QUEUES, newId, defaultFields, BLANK_FORM } from "./QuickRegistrationData.js";

import styles from "./QuickRegistration.module.css";
import QuickRegistrationQueue from "./QuickRegistrationQueue";

const cx = createClassNames(styles);

const QuickRegistration = () => {
  const [profiles, setProfiles] = useState([
    { id: "default", name: "Default Profile", isDefault: true, fields: defaultFields() },
  ]);
  const [activeId, setActiveId] = useState("default");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [typeOpen, setTypeOpen] = useState(false);
  const [assign, setAssign] = useState({ single: null, partitioned: null, norm: null });  
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

   
  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const profile = profiles.find((p) => p.id === activeId) || profiles[0];

  const updProfile = (fn, toast = true) => {
    setProfiles((ps) => ps.map((p) => (p.id === profile.id ? fn(p) : p)));
    if (toast) flashSaved();
  };
  const patchField = (fid, patch) =>
    updProfile((p) => ({ ...p, fields: p.fields.map((f) => (f.id === fid ? { ...f, ...patch } : f)) }));

   
  const createProfile = () => {
    const name = newName.trim();
    if (!name) return;
    const id = newId("p");
    setProfiles((ps) => [...ps, { id, name, isDefault: false, fields: defaultFields() }]);
    setActiveId(id);
    setNewName("");
    setAdding(false);
    closeForm();
    flashSaved();
  };

  const deleteProfile = () => {
    if (profile.isDefault) return;
    setProfiles((ps) => ps.filter((p) => p.id !== profile.id));
    setAssign((a) =>
      Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v === profile.id ? null : v]))
    );
    setActiveId("default");
    closeForm();
    flashSaved();
  };

   
  const closeForm = () => {
    setFormOpen(false);
    setTypeOpen(false);
    setForm(BLANK_FORM);
  };

  const addCustomField = () => {
    if (!form.label.trim()) return;
    updProfile((p) => ({
      ...p,
      fields: [
        ...p.fields,
        {
          id: newId("c"),
          label: form.label.trim(),
          type: form.type,
          placeholder: form.placeholder.trim(),
          builtIn: false,
          visible: true,
          required: form.required,
        },
      ],
    }));
    closeForm();
  };

   
  const toggleQueue = (key) => {
    setAssign((a) => ({ ...a, [key]: a[key] === profile.id ? null : profile.id }));
    flashSaved();
  };

  const queueSub = (q) => {
    const owner = assign[q.key];
    if (owner === profile.id) return q.sub;
    if (!owner) return `${q.sub} · no profile assigned`;
    const p = profiles.find((x) => x.id === owner);
    return `${q.sub} · assigned to ${p ? p.name : "another profile"}`;
  };


  return (
    <div className={cx("qrg-page")}>
      <h1 className={cx("qrg-title")}>Quick Registration</h1>
      <p className={cx("qrg-sub")}>Configure abbreviated registration profiles for fast patient intake.</p>

      
      <div className={cx("qrg-card")}>
        <div className={cx("qrg-card-head")}>
          <h3>Profiles</h3>
          <button className={cx("qrg-newbtn")} onClick={() => setAdding(true)}>
            <Plus size={12} /> New Profile
          </button>
        </div>

        {adding && (
          <div className={cx("qrg-newrow")}>
            <input
              autoFocus
              className={cx("qrg-newinp")}
              placeholder="Profile name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createProfile();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
            />
            <button className={cx("qrg-newok")} onClick={createProfile}><Check size={13} /></button>
            <button
              className={cx("qrg-newx")}
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className={cx("qrg-pills")}>
          {profiles.map((p) => (
            <button
              key={p.id}
              className={cx("qrg-pill" + (p.id === profile.id ? " qrg-pill-on" : ""))}
              onClick={() => {
                setActiveId(p.id);
                closeForm();
              }}
            >
              <Zap size={10} /> {p.name || "Untitled"}
            </button>
          ))}
        </div>
      </div>

      
      <div className={cx("qrg-card")}>
        <div className={cx("qrg-card-head qrg-head-tight")}>
          <h3>Profile: {profile.name}</h3>
          {!profile.isDefault && (
            <button className={cx("qrg-trash")} title="Delete profile" onClick={deleteProfile}>
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <div className={cx("qrg-label")}>Profile Name</div>
        <input
          className={cx("qrg-inp qrg-inp-half")}
          value={profile.name}
          onChange={(e) => updProfile((p) => ({ ...p, name: e.target.value }), false)}
        />
      </div>

      
      <div className={cx("qrg-card qrg-table")}>
        <div className={cx("qrg-grid qrg-thead")}>
          <span>Field</span>
          <span>Visible</span>
          <span>Required</span>
          <span />
        </div>

        {profile.fields.map((f) => (
          <div key={f.id} className={cx("qrg-grid qrg-frow")}>
            <div className={cx("qrg-fname")}>
              <span>{f.label}</span>
              {f.builtIn ? (
                <em className={cx("qrg-built")}>Built-in</em>
              ) : (
                <em className={cx("qrg-built qrg-custom")}>{f.type}</em>
              )}
            </div>
            <span>
              <button
                className={cx("qrg-sw" + (f.visible ? " qrg-sw-on" : ""))}
                onClick={() =>
                  patchField(f.id, f.visible ? { visible: false, required: false } : { visible: true })
                }
              />
            </span>
            <span>
              <button
                className={cx("qrg-sw qrg-sw-red" + (f.required ? " qrg-sw-on" : ""))}
                disabled={!f.visible}
                onClick={() => patchField(f.id, { required: !f.required })}
              />
            </span>
            <span>
              {!f.builtIn && (
                <button
                  className={cx("qrg-trash")}
                  title="Delete field"
                  onClick={() => updProfile((p) => ({ ...p, fields: p.fields.filter((x) => x.id !== f.id) }))}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </span>
          </div>
        ))}

        {formOpen ? (
          <div className={cx("qrg-form")}>
            <div className={cx("qrg-form-grid")}>
              <div>
                <div className={cx("qrg-label qrg-label-top")}>Label *</div>
                <input
                  autoFocus
                  className={cx("qrg-inp")}
                  placeholder="e.g. Guardian Name"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>
              <div>
                <div className={cx("qrg-label qrg-label-top")}>Type</div>
                <div className={cx("qrg-sel")}>
                  <button
                    type="button"
                    className={cx("qrg-sel-btn" + (typeOpen ? " qrg-sel-open" : ""))}
                    onClick={() => setTypeOpen((o) => !o)}
                  >
                    <span>{form.type}</span>
                    <ChevronDown size={13} />
                  </button>
                  {typeOpen && (
                    <>
                      <div className={cx("qrg-sel-shield")} onMouseDown={() => setTypeOpen(false)} />
                      <div className={cx("qrg-sel-menu")}>
                        {FIELD_TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={cx("qrg-sel-opt" + (t === form.type ? " qrg-sel-cur" : ""))}
                            onClick={() => {
                              setForm({ ...form, type: t });
                              setTypeOpen(false);
                            }}
                          >
                            <span>{t}</span>
                            {t === form.type && <Check size={13} />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={cx("qrg-label")}>Placeholder</div>
            <input
              className={cx("qrg-inp")}
              placeholder="Hint text shown inside the field..."
              value={form.placeholder}
              onChange={(e) => setForm({ ...form, placeholder: e.target.value })}
            />

            <div className={cx("qrg-form-foot")}>
              <div className={cx("qrg-form-req")}>
                <button
                  className={cx("qrg-sw qrg-sw-red" + (form.required ? " qrg-sw-on" : ""))}
                  onClick={() => setForm({ ...form, required: !form.required })}
                />
                <span>Required</span>
              </div>
              <button className={cx("qrg-cancel")} onClick={closeForm}>Cancel</button>
              <button className={cx("qrg-addbtn")} disabled={!form.label.trim()} onClick={addCustomField}>
                <Check size={12} /> Add Field
              </button>
            </div>
          </div>
        ) : (
          <button className={cx("qrg-addlink")} onClick={() => setFormOpen(true)}>
            <Plus size={11} /> Add Custom Field
          </button>
        )}
      </div>

      
      <div className={cx("qrg-card")}>
        <h3 className={cx("qrg-qtitle")}>Queue Assignment</h3>
        <p className={cx("qrg-qdesc")}>
          Assign this profile to a queue or visit type. When staff add a new patient in that queue, this
          profile's fields are automatically shown.
        </p>

        <div className={cx("qrg-label qrg-label-q")}>General Queues</div>
        {QUEUES.general.map((queue) => (
          <QuickRegistrationQueue
            key={queue.key}
            queue={queue}
            subtitle={queueSub(queue)}
            checked={assign[queue.key] === profile.id}
            onToggle={() => toggleQueue(queue.key)}
          />
        ))}

        <div className={cx("qrg-label qrg-label-q")}>Multi-Step Visit Types</div>
        {QUEUES.multi.map((queue) => (
          <QuickRegistrationQueue
            key={queue.key}
            queue={queue}
            subtitle={queueSub(queue)}
            dot
            checked={assign[queue.key] === profile.id}
            onToggle={() => toggleQueue(queue.key)}
          />
        ))}
      </div>

      <div className={cx("qrg-toast" + (saved ? " qrg-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default QuickRegistration;
