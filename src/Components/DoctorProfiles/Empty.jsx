import { createClassNames } from '../../utils/classNames.js';
import { Plus } from "lucide-react";

import styles from "./Empty.module.css";

const cx = createClassNames(styles);

const Empty = ({ icon: Icon, text, link, onAdd }) => {
  return (
    <div className={cx("dp-empty")}>
      <Icon size={26} />
      <p>{text}</p>
      <button type="button" onClick={onAdd}><Plus size={13} /> {link}</button>
    </div>
  );
};

export default Empty;
