import { createClassNames } from '../../utils/classNames.js';
import useClock from "../../hooks/useClock";
import { useState } from "react";

import { Zap, Users, Printer, RefreshCw, Clock, CircleCheck } from "lucide-react";

import { pad, stamp } from "./QueueData.js";

import NextToken from "./NextToken";

import PatientSearch from "./PatientSearch";

import styles from "./Single.module.css";

const cx = createClassNames(styles);

const Single = ({ onGenerated }) => {
  const [next, setNext] = useState(10)
  const [serving, setServing] = useState(() => ({ token: 'U007', at: Date.now() - 4 * 60000 }))
  const [waiting, setWaiting] = useState(() => [
    { token: 'U008', at: Date.now() - 2 * 60000 },
    { token: 'U009', at: Date.now() - 60000 },
  ])
  const [done, setDone] = useState(['U005', 'U006'])

  const now = useClock().getTime()
  const ago = (at) => `${Math.max(0, Math.round((now - at) / 60000))}m`

  const generate = () => {
    const t = 'U' + pad(next)
    setWaiting([...waiting, { token: t, at: Date.now() }])
    setNext(next + 1)
    onGenerated({
      token: t, color: '#10b981', title: 'Single Queue', sub: 'Camp / Walk-in Mode · Zero input required',
      time: stamp(), toast: `Token ${t} generated successfully`,
    })
  }

  const call = (i = 0) => {
    if (serving) setDone([...done, serving.token])
    const t = waiting[i]
    setServing(t ? { ...t, at: Date.now() } : null)
    setWaiting(waiting.filter((_, j) => j !== i))
  }

  return (
    <div className={cx("q-body")}>
      <aside className={cx("q-side")}>
        <NextToken token={'U' + pad(next)} sub={<>Auto-increments<br />after each generation</>} color="#10b981" />
        <PatientSearch />
        <div className={cx("q-block")}>
          <div className={cx("mini-stats")}>
            <div className={cx("mini amber")}><b>{waiting.length}</b><span>Waiting</span></div>
            <div className={cx("mini blue")}><b>{serving ? 1 : 0}</b><span>At Counter</span></div>
            <div className={cx("mini gray")}><b>{done.length}</b><span>Done</span></div>
          </div>
          <p className={cx("hint")}>One queue for all — patient selection optional.<br />Fastest token generation mode.</p>
        </div>
        <div className={cx("q-actions")}>
          <button className={cx("gen")} style={{ background: '#10b981' }} onClick={generate}><Zap size={14} /> Generate Token</button>
          <button className={cx("gen-outline")} onClick={() => call()}><Users size={13} /> Call Next Token</button>
        </div>
      </aside>

      <section className={cx("q-main")}>
        <div className={cx("serving")}>
          <div>
            <p className={cx("label")}>Now Serving</p>
            <div className={cx("serving-row")}>
              <span className={cx("big-token")}>{serving ? serving.token : '—'}</span>
              {serving && (
                <div>
                  <span className={cx("counter-tag")}><span className={cx("dot blue")} /> At Counter</span>
                  <b>Single Queue — All Visitors</b>
                  <small><Clock size={10} /> Called {ago(serving.at)}</small>
                </div>
              )}
            </div>
          </div>
          <div className={cx("serving-right")}>
            <span className={cx("live-txt")}><span className={cx("dot")} /> Live</span>
            <div className={cx("row")}>
              <button className={cx("btn-outline")}><Printer size={12} /> Print</button>
              <button className={cx("btn-blue")} onClick={() => call()}>Complete & Call Next</button>
            </div>
          </div>
        </div>

        <div className={cx("wq-head")}>
          <b>Waiting Queue <span className={cx("count-pill")}>{waiting.length}</span></b>
          <button className={cx("link-btn gray")}><RefreshCw size={11} /> Refresh</button>
        </div>

        {waiting.map((w, i) => (
          <div className={cx("wq-row")} key={w.token}>
            <span className={cx("muted-num")}>{i + 1}</span>
            <span className={cx("dot amber")} />
            <b className={cx("mono")}>{w.token}</b>
            <span className={cx("wq-name")}>Walk-in Patient</span>
            <small className={cx("wq-time")}><Clock size={10} /> {ago(w.at)}</small>
            <button className={cx("link-btn")} onClick={() => call(i)}>Call Now</button>
          </div>
        ))}

        <div className={cx("q-foot")}>
          <CircleCheck size={12} /> {done.length} completed today
          {done.map((d) => <span key={d} className={cx("done-chip")}>{d}</span>)}
        </div>
      </section>
    </div>
  )
};

export default Single;
