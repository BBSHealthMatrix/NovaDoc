import { createClassNames } from '../../utils/classNames.js';
import styles from "./PageHero.module.css";

const cx = createClassNames(styles);

const PageHero = ({ eyebrow, title, sub, children }) => {
  return (
    <section className={cx("hero")}>
      <div>
        <div className={cx("status")}><span className={cx("dot")} />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>

      {children && <div className={cx("hero-right")}>{children}</div>}
    </section>
  )
};

export default PageHero;
