import styles from "./Drawer.module.css";

const Drawer = ({ children, wide = false, onClose, label }) => (
  <>
    <div className={styles.overlay} onClick={onClose} />
    <aside
      className={[styles.drawer, wide && styles.wide].filter(Boolean).join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {children}
    </aside>
  </>
);

export default Drawer;
