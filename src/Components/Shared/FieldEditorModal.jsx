import { useId, useState } from "react";
import { Check, FileText, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "./Select";
import styles from "./FieldEditorModal.module.css";

const FieldEditorModal = ({ field, types = [], icon: Icon = FileText, onClose, onSave }) => {
  const [label, setLabel] = useState(field?.label || "");
  const [type, setType] = useState(field?.type || "Text");
  const [placeholder, setPlaceholder] = useState(field?.placeholder || "");
  const [required, setRequired] = useState(field?.req || false);
  const formId = useId();
  const title = field ? "Edit Field" : "Add Field";

  const save = (event) => {
    event.preventDefault();
    if (!label.trim()) return;
    onSave({ label: label.trim(), type, placeholder: placeholder.trim(), req: required });
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
        onSubmit={save}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close field editor"><X size={14} /></button>
        <div className={styles.title}>
                    <Icon size={14} />
          <h3 id={`${formId}-title`}>{title}</h3>
        </div>

        <label className={styles.label} htmlFor={`${formId}-label`}>Label *</label>
        <input
          id={`${formId}-label`}
          className={styles.input}
          autoFocus
          required
          placeholder="Field label..."
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />

        <label className={styles.label} htmlFor={`${formId}-type`}>Type</label>
        <Select id={`${formId}-type`} label="Field type" variant="field" value={type} options={types} onChange={setType} />

        <label className={styles.label} htmlFor={`${formId}-placeholder`}>Placeholder</label>
        <input
          id={`${formId}-placeholder`}
          className={styles.input}
          placeholder="Placeholder text..."
          value={placeholder}
          onChange={(event) => setPlaceholder(event.target.value)}
        />

        <div className={styles.required}>
          <Toggle size="large" color="softBlue" on={required} onChange={() => setRequired((current) => !current)} label="Required field" />
          <span>Required field</span>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.save} disabled={!label.trim()}>
            <Check size={13} /> {field ? "Save Field" : "Add Field"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FieldEditorModal;
