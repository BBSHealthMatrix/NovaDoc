import { createClassNames } from "../../utils/classNames.js";
import { BookOpen, Pill, Save, X } from "lucide-react";
import MedicinePicker from "./MedicinePicker";
import styles from "./BundleEditor.module.css";

const cx = createClassNames(styles);

const BundleEditor = ({ editor, setEditor, onClose, onSave }) => {
  const isNew = !editor.id;
  const n = editor.meds.length;
  const canSave = editor.name.trim() && n > 0;

  const set = (patch) => setEditor((p) => ({ ...p, ...patch }));
  const addMed = (med) => setEditor((p) => ({ ...p, meds: [...p.meds, med] }));
  const removeMed = (id) => setEditor((p) => ({ ...p, meds: p.meds.filter((m) => m.id !== id) }));

  return (
    <aside className={cx("be-panel")}>
      <div className={cx("be-head")}>
        <button type="button" className={cx("be-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("be-title")}>{isNew ? "New Bundle" : "Edit Bundle"}</h2>
        <button type="button" className={cx("be-save")} disabled={!canSave} onClick={onSave}>
          <Save size={13} /> {isNew ? "Create Bundle" : "Save Changes"}
        </button>
      </div>

      <div className={cx("be-body")}>
        <label className={cx("be-lbl")} htmlFor="be-name">Bundle Name *</label>
        <input
          id="be-name"
          className={cx("be-input")}
          placeholder="e.g. Hypertension Bundle"
          value={editor.name}
          onChange={(e) => set({ name: e.target.value })}
        />

        <label className={cx("be-lbl be-mt")} htmlFor="be-desc">Description</label>
        <input
          id="be-desc"
          className={cx("be-input")}
          placeholder="Optional — when to use this bundle"
          value={editor.desc}
          onChange={(e) => set({ desc: e.target.value })}
        />

        <div className={cx("be-lbl be-mt")}>
          Medicines ({n}) {n === 0 && <span className={cx("be-req")}>required</span>}
        </div>

        {n > 0 && (
          <div className={cx("be-meds")}>
            {editor.meds.map((m) => (
              <div key={m.id} className={cx("be-med")}>
                <Pill size={13} className={cx("be-medico")} />
                <div className={cx("be-medinfo")}>
                  <div className={cx("be-medname")}>
                    {m.brand} <span className={cx("be-badge")}>{m.strength}</span>
                  </div>
                  <div className={cx("be-medmeta")}>{m.dose} {m.unit} · {m.route} · {m.frequency} · {m.duration}</div>
                  <div className={cx("be-medgen")}>{m.generic}</div>
                </div>
                <button type="button" className={cx("be-medx")} onClick={() => removeMed(m.id)} aria-label={`Remove ${m.brand}`}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <MedicinePicker onPick={addMed} />

        {editor.name.trim() && (
          <>
            <div className={cx("be-lbl be-mt2")}><BookOpen size={11} /> Preview — what doctors will see</div>
            <div className={cx("be-prev")}>
              <div className={cx("be-pname")}>{editor.name.trim()}</div>
              {editor.desc.trim() && <div className={cx("be-pdesc")}>{editor.desc.trim()}</div>}
              <div className={cx("be-pcount")}>{n} {n === 1 ? "medicine" : "medicines"} will be applied</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default BundleEditor;