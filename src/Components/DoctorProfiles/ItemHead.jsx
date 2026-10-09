import { createClassNames } from '../../utils/classNames.js';
import { X } from "lucide-react";

import styles from "./ItemHead.module.css";

const cx = createClassNames(styles);

const ItemHead = ({ n, label, onRemove }) => {
  return (
    <div className={cx("dp-item-head")}>
      <span className={cx("dp-num")}>{n}</span>
      {label && <b>{label}</b>}
      <button type="button" onClick={onRemove}><X size={13} /></button>
    </div>
  );
};

export default ItemHead;
