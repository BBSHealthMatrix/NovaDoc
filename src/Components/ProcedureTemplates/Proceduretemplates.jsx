import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import { Plus, Check, X, CheckCircle2, Layers } from "lucide-react";
import FieldEditorModal from "../Shared/FieldEditorModal";
import ProcTemplateCard from "./ProcTemplateCard";
import { SEED, FIELD_TYPES, newId } from "./ProcedureTemplatesData.js";
import styles from "./ProcedureTemplates.module.css";

const cx = createClassNames(styles);

const ProcedureTemplates = () => {
  const [templates, setTemplates] = useState(SEED);
  const [open, setOpen] = useState({});
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

  const moveTpl = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= templates.length) return;
    setTemplates((ts) => {
      const next = [...ts];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    flashSaved();
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

  return (
    <div className={cx("ptb-page")}>
      <div className={cx("ptb-top")}>
        <div>
          <h1 className={cx("ptb-title")}>Procedure Template Builder</h1>
          <p className={cx("ptb-sub")}>Design reusable nursing procedure templates combining built-in modules (vitals, medications, consent, billing) with custom components.</p>
        </div>
        <button className={cx("ptb-new")} onClick={() => setAdding(true)}>
          <Plus size={13} /> New Template
        </button>
      </div>

      {adding && (
        <div className={cx("ptb-newbox")}>
          <input
            autoFocus
            className={cx("ptb-newinp")}
            placeholder="Template name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createTemplate();
              if (e.key === "Escape") cancelNew();
            }}
          />
          <button className={cx("ptb-newok")} onClick={createTemplate}><Check size={13} /></button>
          <button className={cx("ptb-newx")} onClick={cancelNew}><X size={14} /></button>
        </div>
      )}

      <div className={cx("ptb-list")}>
        {templates.map((t, i) => (
          <ProcTemplateCard
            key={t.id}
            tpl={t}
            open={!!open[t.id]}
            isFirst={i === 0}
            isLast={i === templates.length - 1}
            onMoveUp={() => moveTpl(i, -1)}
            onMoveDown={() => moveTpl(i, 1)}
            onToggleOpen={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}
            update={(fn, toast) => updTpl(t.id, fn, toast)}
            onRename={() => renameTemplate(t)}
            onDelete={() => deleteTemplate(t)}
            onAddField={(compId) => setFieldModal({ tplId: t.id, compId })}
            onEditField={(compId, field) => setFieldModal({ tplId: t.id, compId, field })}
          />
        ))}

        {templates.length === 0 && !adding && (
          <div className={cx("ptb-empty")}>
            <Layers size={26} strokeWidth={1.5} />
            <h4>No procedure templates yet</h4>
            <p>Click "New Template" to create one.</p>
          </div>
        )}
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

      <div className={cx("ptb-toast" + (saved ? " ptb-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default ProcedureTemplates;