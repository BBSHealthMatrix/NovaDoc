import { createClassNames } from '../../utils/classNames.js';
import styles from "./NextToken.module.css";

const cx = createClassNames(styles);

const NextToken = ({ token, title, sub, color, subColor }) => {
  return (
    <div className={cx("q-block")}>
      <p className={cx("label")}>Next Token</p>
      <div className={cx("next")}>
        <span className={cx("token-box")} style={{ color, borderColor: color + '55', background: color + '0d' }}>{token}</span>
        <div>
          {title && <b>{title}</b>}
          <small style={subColor ? { color: subColor } : undefined}>{sub}</small>
        </div>
      </div>
    </div>
  )
};

export default NextToken;
