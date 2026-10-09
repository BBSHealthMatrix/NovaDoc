import { createClassNames } from '../../utils/classNames.js';
import { outcome } from "./TriageData.js";

import styles from "./RoutePill.module.css";

const cx = createClassNames(styles);

const RoutePill = ({ prefix, v }) => {
  const o = outcome(v);
  return (
    <span className={cx("tri-route tri-r-" + v)}>
      {prefix} — <b>{o.short}</b>
    </span>
  );
};

export default RoutePill;
