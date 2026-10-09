import { createClassNames } from '../../utils/classNames.js';
import { useEffect, useRef, useState } from "react";

import { Plus, ChevronUp, ChevronDown, Trash2, CheckCircle2 } from "lucide-react";

import { STEP_TYPES, TYPE_ORDER, newId, makeStep, SEED } from "./TriageData.js";

import RoutePill from "./RoutePill";

import StepBody from "./StepBody";

import styles from "./Triage.module.css";

const cx = createClassNames(styles);

const Triage = () => {
  const [algos, setAlgos] = useState(SEED);
  const [activeId, setActiveId] = useState("a1");
  const [open, setOpen] = useState({});           
  const [picking, setPicking] = useState(false);  
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

   
  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const algo = algos.find((a) => a.id === activeId) || algos[0];

  const updAlgo = (id, fn, toast = true) => {
    setAlgos((as) => as.map((a) => (a.id === id ? fn(a) : a)));
    if (toast) flashSaved();
  };
  const updSteps = (fn, toast = true) => updAlgo(algo.id, (a) => ({ ...a, steps: fn(a.steps) }), toast);
  const patchStep = (sid, patch, toast = true) =>
    updSteps((ss) => ss.map((s) => (s.id === sid ? { ...s, ...patch } : s)), toast);

  const moveStep = (i, dir) =>
    updSteps((ss) => {
      const j = i + dir;
      if (j < 0 || j >= ss.length) return ss;
      const n = [...ss];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const addStep = (type) => {
    const st = makeStep(type);
    updSteps((ss) => [...ss, st]);
    setOpen((o) => ({ ...o, [st.id]: true }));
    setPicking(false);
  };

  const newAlgo = () => {
    const a = {
      id: newId("a"),
      name: "New Triage Algorithm",
      complaint: "Chief Complaint",
      on: true,
      steps: [makeStep("patient"), makeStep("complaint")],
    };
    setAlgos((as) => [...as, a]);
    setActiveId(a.id);
    setPicking(false);
    flashSaved();
  };

  const has = (type) => algo.steps.some((s) => s.type === type);

  return (
    <div className={cx("tri-page")}>
      
      <aside className={cx("tri-left")}>
        <div className={cx("tri-left-head")}>
          <div>
            <h3>Triage Algorithms</h3>
            <span>{algos.length} {algos.length === 1 ? "algorithm" : "algorithms"}</span>
          </div>
          <button className={cx("tri-new")} onClick={newAlgo}>
            <Plus size={11} /> New
          </button>
        </div>

        <div className={cx("tri-algos")}>
          {algos.map((a) => (
            <div
              key={a.id}
              className={cx("tri-algo" + (a.id === algo.id ? " tri-algo-on" : ""))}
              onClick={() => {
                setActiveId(a.id);
                setPicking(false);
              }}
            >
              <div className={cx("tri-algo-top")}>
                <h4>{a.name || "Untitled"}</h4>
                <button
                  className={cx("tri-sw" + (a.on ? " tri-sw-on" : ""))}
                  onClick={(e) => {
                    e.stopPropagation();
                    updAlgo(a.id, (x) => ({ ...x, on: !x.on }));
                  }}
                />
              </div>
              <p className={cx("tri-algo-cc")}>{a.complaint}</p>
              <span className={cx("tri-algo-n")}>
                {a.steps.length} {a.steps.length === 1 ? "step" : "steps"}
              </span>
            </div>
          ))}
        </div>
      </aside>

      
      <section className={cx("tri-right")}>
        <div className={cx("tri-top")}>
          <div>
            <div className={cx("tri-label")}>Algorithm Name</div>
            <input
              className={cx("tri-top-inp tri-top-name")}
              value={algo.name}
              onChange={(e) => updAlgo(algo.id, (a) => ({ ...a, name: e.target.value }), false)}
            />
          </div>
          <div>
            <div className={cx("tri-label")}>Presenting Complaint</div>
            <input
              className={cx("tri-top-inp tri-top-cc")}
              value={algo.complaint}
              onChange={(e) => updAlgo(algo.id, (a) => ({ ...a, complaint: e.target.value }), false)}
            />
          </div>
        </div>

        <div className={cx("tri-steps")}>
          {algo.steps.map((s, i) => {
            const isOpen = !!open[s.id];
            const routed = s.type === "qgroup" || s.type === "flag";
            return (
              <div key={s.id} className={cx("tri-step" + (isOpen ? " tri-step-open" : ""))}>
                <div className={cx("tri-step-head")}>
                  <span className={cx("tri-num")}>{i + 1}</span>
                  <em className={cx("tri-badge tri-b-" + s.type)}>{STEP_TYPES[s.type].label}</em>
                  <h4>{s.title}</h4>

                  <div className={cx("tri-step-tools")}>
                    <button disabled={i === 0} onClick={() => moveStep(i, -1)} title="Move up">
                      <ChevronUp size={12} />
                    </button>
                    <button disabled={i === algo.steps.length - 1} onClick={() => moveStep(i, 1)} title="Move down">
                      <ChevronDown size={12} />
                    </button>
                    <button
                      className={cx("tri-del")}
                      title="Delete step"
                      onClick={() => updSteps((ss) => ss.filter((x) => x.id !== s.id))}
                    >
                      <Trash2 size={11} />
                    </button>
                    <button
                      className={cx("tri-config")}
                      onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                    >
                      {isOpen ? "Collapse" : "Configure"}
                      {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                {routed && !isOpen && (
                  <div className={cx("tri-routes")}>
                    <span>Routes:</span>
                    <RoutePill prefix="any YES" v={s.yes} />
                    <RoutePill prefix="all NO" v={s.no} />
                  </div>
                )}

                {isOpen && (
                  <div className={cx("tri-body")}>
                    <StepBody step={s} patch={(p, t) => patchStep(s.id, p, t)} />
                  </div>
                )}
              </div>
            );
          })}

          
          {picking ? (
            <div className={cx("tri-pick")}>
              <div className={cx("tri-label")}>Select Step Type</div>
              <div className={cx("tri-pick-grid")}>
                {TYPE_ORDER.map((t) => {
                  const T = STEP_TYPES[t];
                  const off = T.single && has(t);
                  return (
                    <button
                      key={t}
                      disabled={off}
                      className={cx("tri-tile tri-tile-" + t)}
                      onClick={() => addStep(t)}
                    >
                      <b>{T.label}</b>
                      <small>{off ? "Already added (1 per algorithm)" : T.desc}</small>
                    </button>
                  );
                })}
              </div>
              <div className={cx("tri-pick-foot")}>
                <button onClick={() => setPicking(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className={cx("tri-addstep")} onClick={() => setPicking(true)}>
              <Plus size={13} /> Add Step
            </button>
          )}
        </div>
      </section>

      <div className={cx("tri-toast" + (saved ? " tri-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default Triage;
