import { createClassNames } from '../../utils/classNames.js';
import { ChevronDown, Check } from "lucide-react";

import Badge from "./Badge";

import styles from "./Pick.module.css";

const cx = createClassNames(styles);

const Pick = ({ value, options, open, onToggle, onPick }) => {
  return (
    <div className={cx("spc-sel")}>
      <button type="button" className={cx(`spc-in spc-sel-btn ${open ? "spc-focus" : ""}`)} onClick={onToggle}>
        {value ? <span className={cx("spc-opt")}>{value.name} <Badge active={value.active} /></span> : <span />}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className={cx("spc-sel-list")}>
          {options.map((o) => (
            <button type="button" key={o.id} className={cx(value && value.id === o.id ? "spc-sel-on" : "")} onClick={() => onPick(o.id)}>
              <span className={cx("spc-opt")}>{o.name} <Badge active={o.active} /></span>
              {value && value.id === o.id && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pick;
