import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect } from "react";

import { Route, List, LayoutGrid } from "lucide-react";

import { VISITS, PATIENTS, pad, stepName, stamp } from "./QueueData.js";

import NextToken from "./NextToken";

import PatientSearch from "./PatientSearch";

import MsCard from "./MsCard";

import styles from "./MultiStep.module.css";

const cx = createClassNames(styles);

const MultiStep = ({ onGenerated }) => {
  const [visit, setVisit] = useState(0)
  const [walkIn, setWalkIn] = useState(false)
  const [patient, setPatient] = useState(null)
  const [tokens, setTokens] = useState(() => [
    { token: 'C100', visit: 0, step: 0, status: 'waiting', patient: PATIENTS[0], at: Date.now() - 55 * 60000 },
  ])
  const [counts, setCounts] = useState(VISITS.map((v) => v.start))
  const [completed, setCompleted] = useState(0)
  const [filter, setFilter] = useState('All')
  const [, setTick] = useState(0)

   
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 10000)
    return () => clearInterval(id)
  }, [])

  const v = VISITS[visit]
  const token = v.prefix + pad(counts[visit])
  const ready = walkIn || !!patient

  const curStep = (t) => VISITS[t.visit].steps[t.step]
  const shown = filter === 'All' ? tokens : tokens.filter((t) => curStep(t) === filter)
  const inProg = shown.filter((t) => t.status === 'progress')
  const waiting = shown.filter((t) => t.status === 'waiting')

  const generate = () => {
    if (!ready) return
    const who = walkIn ? null : patient
    setTokens([...tokens, { token, visit, step: 0, status: 'waiting', patient: who, at: Date.now() }])
    setCounts(counts.map((c, i) => (i === visit ? c + 1 : c)))
    onGenerated({
      token, color: v.color, title: v.name,
      sub: `Step 1 of ${v.steps.length} · ${stepName(v, 0)}`, steps: v.steps,
      patient: who ? who.name : null, mrn: who ? who.mrn : null,
      time: stamp(), toast: `Token ${token} generated successfully`,
    })
  }

   
  const advance = (tk) => {
    const t = tokens.find((x) => x.token === tk)
    if (!t) return
    if (t.status === 'waiting') {
      setTokens(tokens.map((x) => (x.token === tk ? { ...x, status: 'progress' } : x)))
      return
    }
    if (t.step + 1 >= VISITS[t.visit].steps.length) {
      setTokens(tokens.filter((x) => x.token !== tk))
      setCompleted(completed + 1)
      return
    }
    setTokens(tokens.map((x) => (x.token === tk ? { ...x, step: x.step + 1, status: 'waiting', at: Date.now() } : x)))
  }

  return (
    <div className={cx("q-body")}>
      <aside className={cx("q-side wide")}>
        <NextToken
          token={token} title={v.name} color={v.color} subColor={v.color}
          sub={`Step 1 of ${v.steps.length} · ${stepName(v, 0)}`}
        />
        <PatientSearch walkIn={walkIn} setWalkIn={setWalkIn} patient={patient} setPatient={setPatient} />
        <div className={cx("q-block")}>
          <div className={cx("row-between")}>
            <p className={cx("label")}>Visit Type</p>
            <span className={cx("view-toggle")}>
              <span className={cx("on")}><List size={11} /></span>
              <span><LayoutGrid size={11} /></span>
            </span>
          </div>
          {VISITS.map((vt, i) => {
            const on = i === visit
            return (
              <button key={vt.name} className={cx("visit-card")} onClick={() => { setVisit(i); setFilter('All') }}
                style={on ? { borderColor: vt.color, background: vt.color + '0a' } : {}}>
                <span className={cx("radio")} style={on ? { borderColor: vt.color, background: vt.color } : {}} />
                <span>
                  <b>{vt.name}</b>
                  <span className={cx("steps")}>{vt.steps.map((s) => <em key={s}>{s.slice(0, 3)}</em>)}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className={cx("q-actions")}>
          <button className={cx("gen")} disabled={!ready} style={{ background: v.color }} onClick={generate}>
            <Route size={14} /> Generate Token
          </button>
          {!ready && <p className={cx("hint")}>Select a patient or use Walk-in mode</p>}
        </div>
      </aside>

      <section className={cx("q-main")}>
        <div className={cx("ms-bar")}>
          <span className={cx("ms-stat blue")}><b>{tokens.filter((t) => t.status === 'progress').length}</b> In Progress</span>
          <span className={cx("ms-stat amber")}><b>{tokens.filter((t) => t.status === 'waiting').length}</b> Waiting</span>
          <span className={cx("ms-stat green")}><b>{completed}</b> Completed</span>
          <span className={cx("ms-stat red")}><b>0</b> Skipped</span>
          <div className={cx("ms-filter")}>
            <small>Filter by step:</small>
            {['All', ...v.steps].map((s, i) => (
              <button key={s} className={cx(`step-pill ${filter === s ? 'on' : ''}`)} onClick={() => setFilter(s)}>
                {i === 0 ? s : `${i}. ${s}`}
              </button>
            ))}
          </div>
        </div>

        {tokens.length === 0 ? (
          <div className={cx("empty-state")}>
            <Route size={26} />
            <b>No active tokens</b>
            <small>Generate a token to get started</small>
          </div>
        ) : (
          <div className={cx("ms-list")}>
            {inProg.length > 0 && (
              <>
                <p className={cx("ms-sec blue")}><span className={cx("dot blue")} /> In Progress · {inProg.length}</p>
                {inProg.map((t) => <MsCard key={t.token} t={t} onCall={() => advance(t.token)} />)}
              </>
            )}
            {waiting.length > 0 && (
              <>
                <p className={cx("ms-sec")}><span className={cx("dot amber")} /> Waiting · {waiting.length}</p>
                {waiting.map((t) => <MsCard key={t.token} t={t} onCall={() => advance(t.token)} />)}
              </>
            )}
            {shown.length === 0 && <p className={cx("ms-none")}>No tokens at this step</p>}
          </div>
        )}
      </section>
    </div>
  )
};

export default MultiStep;
