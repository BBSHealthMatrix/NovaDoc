import { Plus } from "lucide-react";
import styles from "./FormBuilderLayout.module.css";

const FormBuilderLayout = ({ items, onAddSection }) => (
  <div className={styles.layout}>
    <div className={styles.header}>
      LAYOUT
      <button type="button" onClick={onAddSection} aria-label="Add section"><Plus size={13} /></button>
    </div>
    <div className={styles.list}>
      {items.length === 0 ? (
        <p className={styles.empty}>No sections yet.<br />Click + to add one.</p>
      ) : items.map((item) => {
        const Icon = item.icon;
        return (
          <div className={styles.item} key={item.id} style={{ borderLeftColor: item.color + "55" }}>
            <Icon size={11} style={{ color: item.color }} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
    <div className={styles.footer}>
      <button type="button" className={styles.add} onClick={onAddSection}><Plus size={12} /> Add Section</button>
    </div>
  </div>
);

export default FormBuilderLayout;
