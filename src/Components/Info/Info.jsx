import { createClassNames } from '../../utils/classNames.js';
import PageHero from "../PageHero/PageHero";

import { PAGES } from "./InfoData.js";

import styles from "./Info.module.css";

const cx = createClassNames(styles);

const Info = ({ type }) => {
  const p = PAGES[type]

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} sub={p.sub} />

      <div className={cx(`info-grid ${type}`)}>
        {p.items.map(([title, desc, Icon, tone], i) => (
          <div key={title} className={cx("info-card")}>
            <span className={cx("info-num")}>{String(i + 1).padStart(2, '0')}</span>
            <span className={cx(`m-icon t-${tone}`)}><Icon size={type === 'vision' ? 20 : 17} /></span>
            <b>{title}</b>
            <small>{desc}</small>
            <span className={cx("info-line")} />
          </div>
        ))}
      </div>
    </>
  )
};

export default Info;
