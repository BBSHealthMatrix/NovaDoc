import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Save, X } from "lucide-react";
import { NEW_CATEGORY } from "./MedicineCatalogueData.js";
import styles from "./GenericEditor.module.css";

const cx = createClassNames(styles);

// Right-hand drawer used for both "Add Generic" and "Edit Generic"
const GenericEditor = ({ editor, setEditor, categories, onClose, onSave }) => {
  const [keyword, setKeyword] = useState("");

  const set = (patch) => setEditor((p) => ({ ...p, ...patch }));

  const addKeyword = () => {
    const k = keyword.trim();
    if (!k || editor.allergy.includes(k)) return;
    set({ allergy: [...editor.allergy, k] });
    setKeyword("");
  };
  const removeKeyword = (k) => set({ allergy: editor.allergy.filter((x) => x !== k) });

  const isNewCat = editor.category === NEW_CATEGORY;
  const canSave = editor.name.trim() && (!isNewCat || editor.newCat.trim());

  return (
    <aside className={cx("ge-drawer")}>
      <div className={cx("ge-dhead")}>
        <h2>{editor.id ? "Edit Generic" : "Add Generic"}</h2>
        <button type="button" className={cx("ge-dclose")} onClick={onClose} aria-label="Close"><X size={15} /></button>
      </div>

      <div className={cx("ge-dbody")}>
        <label className={cx("ge-dlabel")}>Generic / INN Name *</label>
        <input autoFocus className={cx("ge-dinput")} placeholder="e.g. Paracetamol" value={editor.name} onChange={(e) => set({ name: e.target.value })} />

        <label className={cx("ge-dlabel ge-dmt")}>Category *</label>
        <select className={cx("ge-dselect")} value={editor.category} onChange={(e) => set({ category: e.target.value })}>
          {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          <option value={NEW_CATEGORY}>+ New category...</option>
        </select>
        {isNewCat && (
          <input className={cx("ge-dinput ge-dnewcat")} placeholder="Category name" value={editor.newCat} onChange={(e) => set({ newCat: e.target.value })} />
        )}

        <label className={cx("ge-dlabel ge-dmt")}>Allergy Keywords</label>
        <p className={cx("ge-dhelp")}>Used to warn doctors when a patient is allergic.</p>
        {editor.allergy.length > 0 && (
          <div className={cx("ge-dchips")}>
            {editor.allergy.map((k) => (
              <span key={k} className={cx("ge-dchip")}>
                {k}
                <button type="button" onClick={() => removeKeyword(k)} aria-label={`Remove ${k}`}><X size={9} /></button>
              </span>
            ))}
          </div>
        )}
        <div className={cx("ge-dkwrow")}>
          <input className={cx("ge-dinput")} placeholder="Add keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKeyword()} />
          <button type="button" className={cx("ge-dkwadd")} onClick={addKeyword}>Add</button>
        </div>
      </div>

      <div className={cx("ge-dfoot")}>
        <button type="button" className={cx("ge-dsave")} disabled={!canSave} onClick={onSave}>
          <Save size={13} /> {editor.id ? "Save Changes" : "Add Generic"}
        </button>
      </div>
    </aside>
  );
};

export default GenericEditor;