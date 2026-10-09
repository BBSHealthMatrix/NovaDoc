import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Users, ChevronRight, CircleCheck } from "lucide-react";

import { DOCTORS, pad, stamp } from "./QueueData.js";

import NextToken from "./NextToken";

import PatientSearch from "./PatientSearch";

import styles from "./Partitioned.module.css";

const cx = createClassNames(styles);

const Partitioned = ({ onGenerated }) => {
  const [docs, setDocs] = useState(DOCTORS)
  const [selected, setSelected] = useState('SC')
  const [view, setView] = useState('all')

  const sel = docs.find((d) => d.id === selected)
  const total = docs.reduce((sum, d) => sum + d.waiting.length, 0)
  const shown = view === 'all' ? docs : docs.filter((d) => d.id === view)
  const viewColor = view === 'all' ? '#3b82f6' : docs.find((d) => d.id === view).color

  const update = (id, fn) => setDocs(docs.map((d) => (d.id === id ? fn(d) : d)))

  const generate = () => {
    const t = 'C' + pad(sel.next)
    update(selected, (d) => ({ ...d, waiting: [...d.waiting, [t, '0m']], next: d.next + 1 }))
    onGenerated({
      token: t, color: sel.color, title: sel.name, sub: `${sel.spec} · ${sel.room}`,
      time: stamp(), toast: `Token ${t} generated for ${sel.name}`,
    })
  }

  const callNext = (id) =>
    update(id, (d) =>
      d.waiting.length
        ? { ...d, done: [...d.done, d.counter], counter: d.waiting[0][0], waiting: d.waiting.slice(1) }
        : d
    )

  return (
    <div className={cx("q-body")}>
      <aside className={cx("q-side")}>
        <NextToken token={'C' + pad(sel.next)} title={sel.name} sub={sel.room} color={sel.color} />
        <PatientSearch />
        <div className={cx("q-block")}>
          <p className={cx("label")}>Select Doctor</p>
          {docs.map((d) => {
            const on = d.id === selected
            return (
              <button key={d.id} className={cx("doc-card")} onClick={() => setSelected(d.id)}
                style={on ? { borderColor: d.color, background: d.color + '0a' } : {}}>
                <span className={cx("radio")} style={on ? { borderColor: d.color, background: d.color } : {}} />
                <span className={cx("doc-avatar")} style={{ background: d.color }}>{d.id}</span>
                <span className={cx("doc-info")}><b>{d.name}</b><small>{d.spec}</small></span>
                <span className={cx("doc-meta")}>
                  <span className={cx("mini-chip")}>• {d.counter}</span>
                  <small>{d.waiting.length} waiting</small>
                </span>
              </button>
            )
          })}
        </div>
        <div className={cx("q-actions")}>
          <button className={cx("gen")} style={{ background: sel.color }} onClick={generate}><Users size={14} /> Generate Token</button>
        </div>
      </aside>

      <section className={cx("q-main")}>
        <div className={cx("view-bar")}>
          <span className={cx("view-label")}>View:</span>
          {[['all', 'All Doctors'], ...docs.map((d) => [d.id, d.short])].map(([id, label]) => (
            <button key={id} className={cx("view-pill")} onClick={() => setView(id)}
              style={view === id ? { background: viewColor, color: '#fff' } : {}}>
              {label}
            </button>
          ))}
          <small className={cx("view-total")}>{total} total waiting</small>
        </div>

        <div className={cx("doc-list")}>
          {shown.map((d) => (
            <div key={d.id} className={cx("doc-panel")}>
              <div className={cx("doc-head")} style={{ background: d.color + '0d' }}>
                <span className={cx("doc-avatar")} style={{ background: d.color }}>{d.id}</span>
                <span className={cx("doc-info")}><b>{d.name}</b><small>{d.spec} · {d.room}</small></span>
                <span className={cx("at-counter")}>• At Counter: {d.counter}</span>
                <span className={cx("waiting-pill")}>{d.waiting.length} waiting</span>
                <button className={cx("call-btn")} style={{ color: d.color, borderColor: d.color + '66' }} onClick={() => callNext(d.id)}>
                  Call Next <ChevronRight size={12} />
                </button>
              </div>
              <div className={cx("token-row")}>
                <span className={cx("tok current")} style={{ color: d.color, borderColor: d.color }}>
                  • {d.counter} <em>At Counter</em>
                </span>
                {d.waiting.map(([t, time], i) => (
                  <span key={t} className={cx("tok")}><i>{i + 1}</i><b>{t}</b><i>{time}</i></span>
                ))}
              </div>
              <small className={cx("completed")}>
                <CircleCheck size={10} /> {d.done.length} completed &nbsp; {d.done.join(', ')}
              </small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
};

export default Partitioned;
