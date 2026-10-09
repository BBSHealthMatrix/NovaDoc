import { Check, Plus } from "lucide-react";
import styles from "./FormBuilderPalette.module.css";

const FormBuilderPalette = ({ components, selected, onToggle }) => (
  <>
    <div className={[styles.caption, styles.top].join(" ")}>System Components</div>
    <p className={styles.description}>Enable standard clinical components and arrange them anywhere between this form's custom sections.</p>
    <div className={styles.caption}>All Components</div>
    <div className={styles.grid}>
      {components.map((component) => {
        const Icon = component.icon;
        const enabled = selected.includes(component.id);
        return (
          <button
            type="button"
            className={[styles.component, enabled && styles.enabled].filter(Boolean).join(" ")}
            key={component.id}
            onClick={() => onToggle(component.id)}
            aria-pressed={enabled}
          >
            <span className={styles.icon} style={{ background: component.color + "1a", color: component.color }}><Icon size={11} /></span>
            <span className={styles.text}>{component.label}</span>
            {enabled ? <Check size={12} className={styles.mark} /> : <Plus size={11} className={styles.mark} />}
          </button>
        );
      })}
    </div>
    <p className={styles.note}>Enabled components appear in the sidebar on the left — reorder them there alongside your sections.</p>
  </>
);

export default FormBuilderPalette;
