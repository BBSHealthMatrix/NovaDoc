import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import { Plus, Check, X, RotateCcw, CheckCircle2, Layers } from "lucide-react";
import Select from "../Shared/Select";
import FieldEditorModal from "../Shared/FieldEditorModal";
import TemplateCard from "./TemplateCard";
import { SEED, VISIT_TYPES, FIELD_TYPES, newId } from "./HistoryData.js";
import styles from "./History.module.css";

const cx = createClassNames(styles);

const History = () => {
  const [templates, setTemplates] = useState(SEED);
  const [open, setOpen] = useState({});
  const [mapping, setMapping] = useState({});
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [fieldModal, setFieldModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const updTpl = (id, fn, toast = true) => {
    setTemplates((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));
    if (toast) flashSaved();
  };

  const createTemplate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = newId("t");
    setTemplates((ts) => [...ts, { id, name, on: true, comps: [] }]);
    setOpen((o) => ({ ...o, [id]: true }));
    setNewName("");
    setAdding(false);
    flashSaved();
  };

  const cancelNew = () => {
    setAdding(false);
    setNewName("");
  };

  const renameTemplate = (t) => {
    const name = window.prompt("Template name", t.name);
    if (name && name.trim()) updTpl(t.id, (x) => ({ ...x, name: name.trim() }));
  };

  const deleteTemplate = (t) => {
    if (!window.confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    setTemplates((ts) => ts.filter((x) => x.id !== t.id));
    setMapping((m) => Object.fromEntries(Object.entries(m).filter(([, v]) => v !== t.id)));
    flashSaved();
  };

  const saveField = (data) => {
    const { tplId, compId, field } = fieldModal;
    updTpl(tplId, (t) => ({
      ...t,
      comps: t.comps.map((c) => {
        if (c.id !== compId) return c;
        const fields = field
          ? c.fields.map((f) => (f.id === field.id ? { ...f, ...data } : f))
          : [...c.fields, { id: newId("f"), on: true, ...data }];
        return { ...c, fields };
      }),
    }));
    setFieldModal(null);
  };

  const mapOptions = [
    { value: "", label: "No default" },
    ...templates.map((t) => ({ value: t.id, label: t.name })),
  ];

  return (
    <div className={cx("hist-page")}>
      <div className={cx("hist-top")}>
        <div>
          <h1 className={cx("hist-title")}>History Template Builder</h1>
          <p className={cx("hist-sub")}>Design reusable nursing history templates with system and custom components.</p>
        </div>
        <button className={cx("hist-new")} onClick={() => setAdding(true)}>
          <Plus size={13} /> New Template
        </button>
      </div>

      <div className={cx("hist-list")}>
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            tpl={t}
            open={!!open[t.id]}
            onToggleOpen={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}
            update={(fn, toast) => updTpl(t.id, fn, toast)}
            onRename={() => renameTemplate(t)}
            onDelete={() => deleteTemplate(t)}
            onAddField={(compId) => setFieldModal({ tplId: t.id, compId })}
            onEditField={(compId, field) => setFieldModal({ tplId: t.id, compId, field })}
          />
        ))}

        {adding && (
          <div className={cx("hist-newbox")}>
            <input
              autoFocus
              className={cx("hist-newinp")}
              placeholder="Template name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createTemplate();
                if (e.key === "Escape") cancelNew();
              }}
            />
            <button className={cx("hist-newok")} onClick={createTemplate}><Check size={13} /></button>
            <button className={cx("hist-newx")} onClick={cancelNew}><X size={14} /></button>
          </div>
        )}

        {templates.length === 0 && !adding && (
          <div className={cx("hist-empty")}>
            <Layers size={26} strokeWidth={1.5} />
            <h4>No history templates yet</h4>
            <p>Click "New Template" to create one.</p>
          </div>
        )}
      </div>

      <div className={cx("hist-map")}>
        <div className={cx("hist-map-head")}>
          <span className={cx("hist-map-ic")}><RotateCcw size={14} /></span>
          <div>
            <h3>Visit Type → Template Mapping</h3>
            <p>Assign a default template to each visit type so it is pre-selected when the nursing drawer opens.</p>
          </div>
        </div>

        {VISIT_TYPES.map((v) => (
          <div key={v.id} className={cx("hist-map-row")}>
            <span className={cx("hist-map-badge")} style={{ background: v.color }}>{v.letter}</span>
            <div className={cx("hist-map-info")}>
              <b>{v.name}</b>
              <small>{v.sub}</small>
            </div>
            <Select
              variant="mapping"
              label={`Default template for ${v.name}`}
              placeholder="No default"
              value={mapping[v.id] ?? null}
              options={mapOptions}
              onChange={(val) => {
                setMapping((m) => ({ ...m, [v.id]: val || null }));
                flashSaved();
              }}
            />
          </div>
        ))}
      </div>

      {fieldModal && (
        <FieldEditorModal
          icon={Layers}
          types={FIELD_TYPES}
          field={fieldModal.field}
          onClose={() => setFieldModal(null)}
          onSave={saveField}
        />
      )}

      <div className={cx("hist-toast" + (saved ? " hist-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default History;