import { createClassNames } from '../../utils/classNames.js';
import styles from "./Badge.module.css";

const cx = createClassNames(styles);

const Badge = ({ active }) => {
  return <em className={cx(`spc-bdg ${active ? "" : "spc-bdg-off"}`)}>{active ? "Active" : "Inactive"}</em>;
};

export default Badge;
