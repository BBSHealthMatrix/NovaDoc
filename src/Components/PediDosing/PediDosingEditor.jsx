import { createClassNames } from "../../utils/classNames.js";
import { Save, X } from "lucide-react";
import { FREQUENCIES, GENERICS, ROUTES } from "./PediDosingData.js";
import styles from "./PediDosingEditor.module.css";

const cx = createClassNames(styles);

const MEDICINES = GENERICS.map((g) => g.name);
// keep a saved value visible even if it isn't one of the standard options
const withValue = (list, value) => (!value || list.includes(value) ? list : [value, ...list]);

const PediDosingEditor = ({ editor, setEditor, onClose, onSave }) => {
  const isNew = !editor.id;
  const canSave = editor.medicine && editor.age.trim() && editor.dose.trim();
  const set = (patch) => setEditor((p) => ({ ...p, ...patch }));
  const bind = (field) => ({ value: editor[field], onChange: (e) => set({ [field]: e.target.value }) });

  const max = editor.max.trim();
  const notes = editor.notes.trim();

  return (
    <aside className={cx("pe-panel")}>
      <div className={cx("pe-head")}>
        <button type="button" className={cx("pe-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("pe-title")}>{isNew ? "New Dosing Rule" : "Edit Rule"}</h2>
        <button type="button" className={cx("pe-save")} disabled={!canSave} onClick={onSave}>
          <Save size={13} /> {isNew ? "Add Rule" : "Save Changes"}
        </button>
      </div>

      <div className={cx("pe-body")}>
        <label className={cx("pe-lbl")} htmlFor="pe-med">Medicine *</label>
        <select id="pe-med" className={cx("pe-field pe-select")} {...bind("medicine")}>
          <option value="">Select medicine...</option>
          {withValue(MEDICINES, editor.medicine).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className={cx("pe-grid")}>
          <div>
            <label className={cx("pe-lbl pe-mt")} htmlFor="pe-age">Age Group Label *</label>
            <input id="pe-age" className={cx("pe-field")} placeholder="e.g. 1–5 years" {...bind("age")} />
          </div>
          <div>
            <label className={cx("pe-lbl pe-mt")} htmlFor="pe-min">Min Age (Months)</label>
            <input id="pe-min" type="number" min="0" className={cx("pe-field")} {...bind("minAge")} />
          </div>
          <div>
            <label className={cx("pe-lbl pe-mt")} htmlFor="pe-route">Route *</label>
            <select id="pe-route" className={cx("pe-field pe-select")} {...bind("route")}>
              {withValue(ROUTES, editor.route).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={cx("pe-lbl pe-mt")} htmlFor="pe-freq">Frequency *</label>
            <select id="pe-freq" className={cx("pe-field pe-select")} {...bind("frequency")}>
              {withValue(FREQUENCIES, editor.frequency).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <label className={cx("pe-lbl pe-mt")} htmlFor="pe-dose">Dose Range *</label>
        <input id="pe-dose" className={cx("pe-field")} placeholder="e.g. 10–15 mg/kg/dose or 125–250 mg/dose" {...bind("dose")} />

        <label className={cx("pe-lbl pe-mt")} htmlFor="pe-max">Max Dose</label>
        <input id="pe-max" className={cx("pe-field")} placeholder="e.g. 1 g/dose or 40 mg/kg/day" {...bind("max")} />

        <label className={cx("pe-lbl pe-mt")} htmlFor="pe-notes">Clinical Notes</label>
        <textarea id="pe-notes" className={cx("pe-field pe-notes")} placeholder="Cautions, administration tips, special instructions..." {...bind("notes")} />

        {editor.medicine && editor.dose.trim() && (
          <>
            <div className={cx("pe-lbl pe-mt2")}>Preview</div>
            <div className={cx("pe-prev")}>
              <div className={cx("pe-page")}>{editor.age.trim()}</div>
              <div className={cx("pe-pmed")}>{editor.medicine}</div>
              <div className={cx("pe-pdose")}>
                <b>{editor.dose.trim()}</b>
                <span>{editor.frequency}</span>
                <span>{editor.route}</span>
                {max && <span className={cx("pe-pmax")}>max {max}</span>}
              </div>
              {notes && <div className={cx("pe-pnotes")}>{notes}</div>}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default PediDosingEditor;