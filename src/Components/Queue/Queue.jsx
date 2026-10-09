import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect } from "react";

import { CircleCheck } from "lucide-react";

import { MODES } from "./QueueData.js";

import TokenSlip from "./TokenSlip";

import Single from "./Single";

import Partitioned from "./Partitioned";

import MultiStep from "./MultiStep";

import styles from "./Queue.module.css";

const cx = createClassNames(styles);

const Queue = ({ mode }) => {
  const m = MODES[mode]
  const Icon = m.icon
  const [slip, setSlip] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const onGenerated = (s) => {
    setSlip(s)
    setToast(s.toast)
  }

  return (
    <div className={cx("q-wrap")}>
      <div className={cx("q-top")}>
        <span className={cx(`q-top-icon t-${m.tone}`)}><Icon size={14} /></span>
        <div>
          <b>{m.title}</b>
          <small>{m.sub}</small>
        </div>
        <span className={cx(`q-badge t-${m.tone}`)}>{m.badge}</span>
        <select className={cx("branch")}>
          <option>Main Branch — Lahore</option>
          <option>DHA Branch — Lahore</option>
        </select>
      </div>

      {mode === 'single' && <Single onGenerated={onGenerated} />}
      {mode === 'partitioned' && <Partitioned onGenerated={onGenerated} />}
      {mode === 'multistep' && <MultiStep onGenerated={onGenerated} />}

      {slip && <TokenSlip slip={slip} onClose={() => setSlip(null)} />}
      {toast && <div className={cx("tk-toast")}><CircleCheck size={14} /> {toast}</div>}
    </div>
  )
};

export default Queue;
