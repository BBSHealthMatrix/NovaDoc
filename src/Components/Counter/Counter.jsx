import { createClassNames } from '../../utils/classNames.js';
import { ROLES } from "./CounterData.js";

import styles from "./Counter.module.css";

const cx = createClassNames(styles);

const Counter = ({ role }) => {
  const r = ROLES[role]
  const Icon = r.icon

  const stats = [
    ['At Counter', 'blue'],
    ['Waiting', 'amber'],
    ...(r.extra ? [r.extra] : []),
    ['Skipped', 'red'],
  ]

  return (
    <div className={cx("c-wrap")}>
      
      <div className={cx("c-bar")}>
        <span><span className={cx("dot white")} /> {r.bar} · Main Branch — Lahore</span>
        <span>{r.right[0]} <em>{r.right[1]}</em></span>
      </div>

      <div className={cx("c-body")}>
        
        <aside className={cx("c-side")}>
          <p className={cx("label")}>Queue Stats</p>
          {stats.map(([name, tone]) => (
            <div key={name} className={cx(`c-stat ${tone}`)}>
              <span>{name}</span>
              <b>0</b>
            </div>
          ))}

          <hr />

          <p className={cx("label")}>Assigned Queues</p>
          <div className={cx(`c-queue ${r.tone}`)}>
            <b>{r.queueIcon && <Icon size={12} />}{r.queue}</b>
            <small>{r.queueSub}</small>
          </div>
        </aside>

        
        <section className={cx("c-main")}>
          <p className={cx("c-waiting")}><span className={cx("dot amber")} /> Waiting in Queue · 0</p>
          <div className={cx("empty-state top")}>
            <Icon size={26} />
            <b>Queue is empty</b>
            <small>{r.empty}</small>
          </div>
        </section>
      </div>
    </div>
  )
};

export default Counter;
