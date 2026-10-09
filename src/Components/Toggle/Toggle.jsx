import styles from "./Toggle.module.css";

const Toggle = ({
  on,
  onChange,
  variant = "default",
  size = variant === "modal" ? "medium" : "compact",
  color = "green",
  label = "Toggle setting",
  className,
  disabled = false,
  id,
}) => {
  const classes = [
    styles.toggle,
    styles[size],
    styles[color],
    on && styles.on,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={id}
      className={classes}
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={Boolean(on)}
      aria-label={label}
    >
      <span />
    </button>
  );
};


export default Toggle;
