import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronDown, Plus, Save } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import HpiField from "./HpiField";
import HpiPreview from "./HpiPreview";
import { COMPLAINTS } from "../../data/complaints.js";
import { CHOICE, blankField } from "./HpiTemplatesData.js";
import styles from "./HpiEditor.module.css";

const cx = createClassNames(styles);

const HpiEditor = ({ template, onCancel, onSave }) => {
  const [complaint, setComplaint] = useState(template?.complaint || "");
  const [name, setName] = useState(template?.name || "");
  const [active, setActive] = useState(template ? template.active : true);
    const [fields, setFields] = useState(template ? template.fields.map((fl) => ({ ...fl, opts: [...fl.opts] })) : [blankField()]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tried, setTried] = useState(false);
  const pickRef = useRef(null);
  const dragFrom = useRef(null);

  // close complaint dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!pickRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const options = COMPLAINTS.filter((c) => c.active && c.name.toLowerCase().includes(search.trim().toLowerCase()));

  const pick = (c) => {
    setComplaint(c);
    setOpen(false);
    setSearch("");
  };

  const update = (id, patch) => setFields((p) => p.map((fl) => (fl.id === id ? { ...fl, ...patch } : fl)));

  const remove = (id) => setFields((p) => p
    .filter((fl) => fl.id !== id)
    .map((fl) => (fl.cond?.field === id ? { ...fl, cond: null } : fl)));

  const dragOver = (e, index) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === index) return;
    setFields((p) => {
      const next = [...p];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragFrom.current = index;
  };

  const save = () => {
    if (!complaint || !name.trim()) {
      setTried(true);
      return;
    }
    onSave({
      id: template?.id ?? Date.now(),
      name: name.trim(),
      complaint,
      active,
      fields: fields.filter((fl) => fl.label.trim()),
    });
  };

  return (
    <div className={cx("hpi-ed")}>
      <button type="button" className={cx("hpi-back")} onClick={onCancel}><ChevronLeft size={11} /> Back to templates</button>
            <h1 className={cx("hpi-ed-title")}>{template ? "Edit Template" : "New HPI Template"}</h1>

      <div className={cx("hpi-ed-grid")}>
        <div>
          <div className={cx("hpi-row2")}>
            <div className={cx("hpi-pick")} ref={pickRef}>
              <span className={cx("hpi-lbl")}>Chief Complaint <b>*</b></span>
              <button
                type="button"
                className={cx(`hpi-pick-btn ${!complaint ? "hpi-ph" : ""} ${open ? "hpi-pick-open" : ""} ${tried && !complaint ? "hpi-err" : ""}`)}
                onClick={() => setOpen((o) => !o)}
              >
                <span>{complaint || "Select complaint..."}</span>
                <ChevronDown size={12} />
              </button>
              {open && (
                <div className={cx("hpi-pick-menu")}>
                  <input
                    className={cx("hpi-pick-search")}
                    autoFocus
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
                  />
                  <div className={cx("hpi-pick-list")}>
                    {options.map((c) => (
                      <button type="button" key={c.id} className={cx(`hpi-pick-opt ${complaint === c.name ? "hpi-pick-on" : ""}`)} onClick={() => pick(c.name)}>
                        {c.name}
                      </button>
                    ))}
                    {options.length === 0 && <p className={cx("hpi-pick-none")}>No complaints found.</p>}
                  </div>
                </div>
              )}
            </div>

            <label>
              <span className={cx("hpi-lbl")}>Template Name <b>*</b></span>
              <input
                className={cx(`hpi-name-input ${tried && !name.trim() ? "hpi-err" : ""}`)}
                placeholder="e.g. Chest Pain Assessment"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>

          <div className={cx("hpi-active")}>
            <Toggle size="large" color="softBlue" on={active} onChange={() => setActive((a) => !a)} label="Active" />
            <span>Active</span>
          </div>

          <span className={cx("hpi-lbl")}>Fields</span>
          <div className={cx("hpi-fields")}>
            {fields.map((fl, i) => (
              <HpiField
                key={fl.id}
                field={fl}
                                sources={fields.filter((o) => o.id !== fl.id && CHOICE.includes(o.type) && o.label.trim() && o.opts.length)}
                onChange={(patch) => update(fl.id, patch)}
                onRemove={() => remove(fl.id)}
                onDragStart={() => { dragFrom.current = i; }}
                onDragOver={(e) => dragOver(e, i)}
                onDragEnd={() => { dragFrom.current = null; }}
              />
            ))}
          </div>
          <button type="button" className={cx("hpi-addf")} onClick={() => setFields((p) => [...p, blankField()])}>
            <Plus size={11} /> Add Field
          </button>

          <div className={cx("hpi-ed-foot")}>
            <button type="button" className={cx("hpi-cancel")} onClick={onCancel}>Cancel</button>
            <button type="button" className={cx("hpi-save")} onClick={save}><Save size={13} /> Save Template</button>
          </div>
        </div>

        <HpiPreview complaint={complaint} name={name} fields={fields} />
      </div>
    </div>
  );
};

export default HpiEditor;