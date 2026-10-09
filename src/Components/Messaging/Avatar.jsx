import { createClassNames } from '../../utils/classNames.js';
import styles from "./Avatar.module.css";

const cx = createClassNames(styles);

const Avatar = ({ s, dot = true }) => {
  return (
    <span className={cx("msg-avatar")} style={{ background: s.color }}>
      {s.initials}
      {dot && <i className={cx(s.online ? 'on' : '')} />}
    </span>
  )
};

export default Avatar;
