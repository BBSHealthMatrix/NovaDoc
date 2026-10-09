import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./Select.module.css";

// Options may be strings or objects with value (or v), label, and disabled.
const Select = ({
  value,
  options = [],
  placeholder,
  onChange,
  variant = "default",
  fallbackValue,
  label,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const items = options.map((option) => typeof option === "object" && option !== null
    ? { ...option, value: option.value ?? option.v }
    : { value: option, label: option });
  const selected = items.find((option) => option.value === value)
    ?? items.find((option) => option.value === fallbackValue);
  const selectedIndex = items.indexOf(selected);
  const enabledIndexes = items.flatMap((option, index) => option.disabled ? [] : [index]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const show = () => {
    setActiveIndex(selected && !selected.disabled ? selectedIndex : enabledIndexes[0] ?? -1);
    setOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      close();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        show();
        return;
      }
      const current = enabledIndexes.indexOf(activeIndex);
      const next = event.key === "Home" ? 0
        : event.key === "End" ? enabledIndexes.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + enabledIndexes.length) % enabledIndexes.length;
      setActiveIndex(enabledIndexes[next] ?? -1);
    }
  };

  return (
    <div ref={rootRef} className={[styles.select, styles[variant] || styles.default].join(" ")} onKeyDown={handleKeyDown}>
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className={[styles.trigger, open && styles.open, !selected && styles.placeholder].filter(Boolean).join(" ")}
        aria-label={label || placeholder || "Select an option"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => open ? close() : show()}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={variant === "doctor" ? 14 : 13} />
      </button>
      {open && (
        <div id={listId} className={styles.menu} role="listbox" aria-label={label || placeholder || "Options"}>
          {items.length === 0 && <div className={styles.empty}>No options available.</div>}
          {items.map((option, index) => (
            <button
              key={option.value}
              ref={(node) => { optionRefs.current[index] = node; }}
              type="button"
              role="option"
              aria-selected={option === selected}
              disabled={option.disabled}
              tabIndex={index === activeIndex ? 0 : -1}
              className={[styles.option, option === selected && styles.selected].filter(Boolean).join(" ")}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                onChange(option.value);
                close();
              }}
            >
              <span>{option.label}</span>
              {option === selected && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
