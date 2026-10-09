import { createClassNames } from '../../utils/classNames.js';
import { Plus } from "lucide-react";

import styles from "./ListHead.module.css";

const cx = createClassNames(styles);

const ListHead = ({ title, sub, btn, onAdd }) => {
  return (
    <div className={cx("dp-list-head")}>
      <div>
        <p className={cx("dp-cap")}>{title}</p>
        <small>{sub}</small>
      </div>
      <button type="button" className={cx("dp-dash-btn")} onClick={onAdd}><Plus size={13} /> {btn}</button>
    </div>
  );
};

export default ListHead;
