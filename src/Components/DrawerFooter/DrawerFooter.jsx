import styles from "./DrawerFooter.module.css";

const DrawerFooter = ({ children, single = false }) => (
  <div className={[styles.footer, single && styles.single].filter(Boolean).join(" ")}>{children}</div>
);

export default DrawerFooter;
