import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import styles from "./NonFormulary.module.css";

const cx = createClassNames(styles);

const NfSettings = ({ settings, setSettings, reasons, setReasons }) => {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(null); // { id, text }

  const flip = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setReasons((p) => [...p, { id: Date.now(), text }]);
    setDraft("");
  };
  const saveEdit = () => {
    const text = editing.text.trim();
    if (text) setReasons((p) => p.map((r) => (r.id === editing.id ? { ...r, text } : r)));
    setEditing(null);
  };

  return (
    <div className={cx("nf-settings")}>
      <div className={cx("nf-card nf-scard")}>
        <h3 className={cx("nf-stitle")}>Prescribing Settings</h3>

        <div className={cx("nf-srow nf-srow-line")}>
          <div className={cx("nf-stext")}>
            <div className={cx("nf-sname")}>Allow non-formulary prescriptions</div>
            <div className={cx("nf-sdesc")}>Clinicians can prescribe drugs outside the formulary catalogue</div>
          </div>
          <Toggle on={settings.allowNF} onChange={() => flip("allowNF")} size="large" color="softBlue" className={cx("nf-tg")} label="Allow non-formulary prescriptions" />
        </div>

        {settings.allowNF && (
          <div className={cx("nf-srow")}>
            <div className={cx("nf-stext")}>
              <div className={cx("nf-sname")}>Require justification</div>
              <div className={cx("nf-sdesc")}>A reason must be entered before adding an NF prescription</div>
            </div>
            <Toggle on={settings.requireJustification} onChange={() => flip("requireJustification")} size="large" color="softBlue" className={cx("nf-tg")} label="Require justification" />
          </div>
        )}
      </div>

      {settings.allowNF && (
        <div className={cx("nf-card nf-scard nf-mt")}>
          <h3 className={cx("nf-stitle")}>Preset Justification Reasons</h3>
          <p className={cx("nf-sdesc2")}>Clinicians can pick from these options (or type freely) when adding a justification.</p>

          {reasons.map((r) => (editing?.id === r.id ? (
            <div key={r.id} className={cx("nf-brow")}>
              <input
                autoFocus
                className={cx("nf-field nf-field-edit nf-grow")}
                value={editing.text}
                onChange={(e) => setEditing((p) => ({ ...p, text: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
              />
              <div className={cx("nf-icos")}>
                <button type="button" className={cx("nf-ico nf-ico-save")} onClick={saveEdit} aria-label="Save"><Save size={12} /></button>
                <button type="button" className={cx("nf-ico")} onClick={() => setEditing(null)} aria-label="Cancel"><X size={12} /></button>
              </div>
            </div>
          ) : (
            <div key={r.id} className={cx("nf-brow")}>
              <input className={cx("nf-field nf-grow")} value={r.text} readOnly tabIndex={-1} />
              <div className={cx("nf-icos")}>
                <button type="button" className={cx("nf-ico")} onClick={() => setEditing({ ...r })} aria-label="Edit reason"><Pencil size={12} /></button>
                <button type="button" className={cx("nf-ico nf-ico-del")} onClick={() => setReasons((p) => p.filter((x) => x.id !== r.id))} aria-label="Delete reason"><Trash2 size={12} /></button>
              </div>
            </div>
          )))}

          <div className={cx("nf-addrow nf-addrow-lg")}>
            <input
              className={cx("nf-input nf-grow")}
              placeholder="Add a preset reason..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <button type="button" className={cx("nf-addbtn")} disabled={!draft.trim()} onClick={add}><Plus size={12} /> Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NfSettings;