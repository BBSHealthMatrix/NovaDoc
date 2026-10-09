import { createClassNames } from '../../utils/classNames.js';
import { useEffect, useRef, useState } from "react";

import { ChevronUp, ChevronDown, Info, CheckCircle2 } from "lucide-react";

import { STEPS } from "./WorkflowBuilderData.js";

import styles from "./WorkflowBuilder.module.css";

const cx = createClassNames(styles);

const WorkflowBuilder = () => {
  const [steps, setSteps] = useState(STEPS);
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

   
  const flashSaved = () => {
    setSaved(false);
    clearTimeout(timer.current);
    requestAnimationFrame(() => setSaved(true));
    timer.current = setTimeout(() => setSaved(false), 1800);
  };

  const toggle = (id) => {
    setSteps((ss) => ss.map((s) => (s.id === id ? { ...s, on: !s.on } : s)));
    flashSaved();
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    setSteps((ss) => {
      const n = [...ss];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    flashSaved();
  };

  return (
    <div className={cx("wfb-page")}>
      <h1 className={cx("wfb-title")}>Workflow Builder</h1>
      <p className={cx("wfb-sub")}>Define the order in which sections appear during patient registration.</p>

      
      <div className={cx("wfb-card")}>
        <div className={cx("wfb-grid wfb-thead")}>
          <span>Step</span>
          <span>Section</span>
          <span>Type</span>
          <span>Active</span>
          <span>Reorder</span>
        </div>

        {steps.map((s, i) => (
          <div key={s.id} className={cx("wfb-grid wfb-row" + (s.on ? "" : " wfb-row-off"))}>
            <span className={cx("wfb-step")}>{i + 1}</span>

            <div className={cx("wfb-info")}>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </div>

            <span>
              <em className={cx("wfb-type")}>{s.id}</em>
            </span>

            <span>
              <button className={cx("wfb-sw" + (s.on ? " wfb-sw-on" : ""))} onClick={() => toggle(s.id)} />
            </span>

            <span className={cx("wfb-reorder")}>
              <button disabled={i === 0} onClick={() => move(i, -1)} title="Move up">
                <ChevronUp size={13} />
              </button>
              <button disabled={i === steps.length - 1} onClick={() => move(i, 1)} title="Move down">
                <ChevronDown size={13} />
              </button>
            </span>
          </div>
        ))}
      </div>

      
      <div className={cx("wfb-note")}>
        <Info size={13} />
        <div>
          <h4>How workflow order works</h4>
          <p>
            Sections are presented top-to-bottom in the registration drawer. Built-in sections (Basic Info,
            Demographics) can be reordered but not deleted. Disabled sections are hidden from the form entirely.
          </p>
        </div>
      </div>

      <div className={cx("wfb-toast" + (saved ? " wfb-toast-show" : ""))}>
        <CheckCircle2 size={13} /> Saved
      </div>
    </div>
  );
};

export default WorkflowBuilder;
