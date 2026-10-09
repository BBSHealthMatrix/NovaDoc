import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Link } from "react-router-dom";

import { LayoutGrid, ArrowUpRight } from "lucide-react";

import PageHero from "../PageHero/PageHero";

import { MODULES, today } from "./HomeData.js";

import styles from "./Home.module.css";

const cx = createClassNames(styles);

const Home = () => {
  const [allLive, setAllLive] = useState(false)
  const liveCount = MODULES.filter((m) => m[1]).length

  return (
    <>
            <PageHero
        eyebrow="All Systems Online"
        title="Healthcare Management Platform"
        sub="NovaDoc EHR · Select a module to continue"
      >
        <div>
          <small>TODAY</small>
          <b>{today()}</b>
        </div>
        <span className={cx("grid-btn")}><LayoutGrid size={16} /></span>
      </PageHero>

      <section className={cx("modules")}>
        <div className={cx("modules-head")}>
          <p className={cx("label")}>
            Available Modules &nbsp;—&nbsp;
            <span className={cx("count")}>{liveCount} active</span> · {MODULES.length - liveCount} coming soon
          </p>
          <label className={cx("toggle label")}>
            Show all as live
            <input type="checkbox" checked={allLive} onChange={(e) => setAllLive(e.target.checked)} />
            <span className={cx("track")} />
          </label>
        </div>

        <div className={cx("grid")}>
          {MODULES.map(([title, desc, Icon, tone, to]) => {
            const live = desc || allLive
            const inner = (
              <>
                {live ? <span className={cx("live-tag")}><span className={cx("dot")} />LIVE</span> : <span className={cx("soon-tag")}>Soon</span>}
                {live && <ArrowUpRight size={12} className={cx("arrow")} />}
                <span className={cx(`m-icon t-${live ? tone || 'blue' : 'gray'}`)}><Icon size={18} /></span>
                <b>{title}</b>
                {desc && <small>{desc}</small>}
              </>
            )
            return live
              ? <Link key={title} to={to || '/'} className={cx("card on")}>{inner}</Link>
              : <div key={title} className={cx("card off")}>{inner}</div>
          })}
        </div>
      </section>
    </>
  )
};

export default Home;
