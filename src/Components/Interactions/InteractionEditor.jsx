import { createClassNames } from "../../utils/classNames.js";
import { Save, TriangleAlert, X } from "lucide-react";
import { GENERICS, SEVERITIES } from "./InteractionsData.js";
import styles from "./InteractionEditor.module.css";

const cx = createClassNames(styles);

const MEDICINES = GENERICS.map((g) => g.name);

const InteractionEditor = ({ editor, setEditor, onClose, onSave }) => {
  const isNew = !editor.id;
  const note = editor.note.trim();
  const canSave = editor.a && editor.b && editor.a !== editor.b && note;
  const sev = SEVERITIES.find((s) => s.key === editor.severity);

  const set = (patch) => setEditor((p) => ({ ...p, ...patch }));

  // native dropdown (same as screenshot); the medicine picked in the other field is disabled
  const medSelect = (field, other, id) => (
    <select id={id} className={cx("ie-select")} value={editor[field]} onChange={(e) => set({ [field]: e.target.value })}>
      <option value="">Select medicine...</option>
      {MEDICINES.map((name) => (
        <option key={name} value={name} disabled={name === editor[other]}>{name}</option>
      ))}
    </select>
  );

  return (
    <aside className={cx("ie-panel")}>
      <div className={cx("ie-head")}>
        <button type="button" className={cx("ie-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("ie-title")}>{isNew ? "New Interaction Rule" : "Edit Interaction Rule"}</h2>
        <button type="button" className={cx("ie-save")} disabled={!canSave} onClick={onSave}>
          <Save size={13} /> {isNew ? "Add Rule" : "Save Changes"}
        </button>
      </div>

      <div className={cx("ie-body")}>
        <div className={cx("ie-lbl")}>Severity *</div>
        <div className={cx("ie-sevs")}>
          {SEVERITIES.map((s) => (
            <button
              type="button"
              key={s.key}
              className={cx(`ie-sev ie-${s.key} ${editor.severity === s.key ? "ie-sev-on" : ""}`)}
              onClick={() => set({ severity: s.key })}
            >
              <i className={cx("ie-dot")} /> {s.label}
            </button>
          ))}
        </div>

        <label className={cx("ie-lbl ie-mt")} htmlFor="ie-a">Medicine A *</label>
        {medSelect("a", "b", "ie-a")}

        <label className={cx("ie-lbl ie-mt")} htmlFor="ie-b">Medicine B *</label>
        {medSelect("b", "a", "ie-b")}

        <label className={cx("ie-lbl ie-mt")} htmlFor="ie-note">Clinical Note *</label>
        <textarea
          id="ie-note"
          className={cx("ie-note")}
          placeholder="Describe the interaction mechanism and clinical risk..."
          value={editor.note}
          onChange={(e) => set({ note: e.target.value })}
        />

        {editor.a && editor.b && (
          <>
            <div className={cx("ie-lbl ie-mt2")}>Preview</div>
            <div className={cx(`ie-prev ie-prev-${editor.severity}`)}>
              <TriangleAlert size={13} className={cx("ie-pico")} />
              <div className={cx("ie-ptext")}>
                <div className={cx("ie-ptitle")}>{sev?.label} Interaction</div>
                <div className={cx("ie-ppair")}>{editor.a} ↔ {editor.b}</div>
                {note && <div className={cx("ie-pnote")}>{note}</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default InteractionEditor;