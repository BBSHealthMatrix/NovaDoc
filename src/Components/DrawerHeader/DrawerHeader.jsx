import { ChevronLeft, Maximize2, Minimize2, X } from "lucide-react";
import styles from "./DrawerHeader.module.css";

const DrawerHeader = ({ title, subtitle, onBack, onClose, wide = false, onToggleWide }) => (
  <div className={styles.header}>
    <div className={styles.row}>
      {onBack && (
        <button type="button" className={styles.iconButton} onClick={onBack} aria-label="Go back">
          <ChevronLeft size={14} />
        </button>
      )}
      <div>
        <b>{title}</b>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
    <div className={styles.row}>
      {onToggleWide && (
        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleWide}
          aria-label={wide ? "Reduce drawer width" : "Expand drawer width"}
        >
          {wide ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      )}
      <button type="button" className={styles.iconButton} onClick={onClose} aria-label={"Close " + title.toLowerCase()}>
        <X size={14} />
      </button>
    </div>
  </div>
);

export default DrawerHeader;
