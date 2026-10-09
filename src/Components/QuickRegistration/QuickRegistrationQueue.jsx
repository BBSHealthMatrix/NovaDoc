import styles from "./QuickRegistrationQueue.module.css";

const QuickRegistrationQueue = ({ queue, subtitle, dot = false, checked, onToggle }) => (
  <div className={styles.queue}>
    {dot && <i className={styles.dot} />}
    <div className={styles.info}>
      <h5>{queue.name}</h5>
      <p>{subtitle}</p>
    </div>
    <button
      type="button"
      className={[styles.switch, checked && styles.on].filter(Boolean).join(" ")}
      role="switch"
      aria-checked={checked}
      aria-label={"Assign profile to " + queue.name}
      onClick={onToggle}
    />
  </div>
);

export default QuickRegistrationQueue;
