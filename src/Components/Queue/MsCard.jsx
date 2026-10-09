import { createClassNames } from '../../utils/classNames.js';
import { ChevronRight, Clock } from "lucide-react";

import { VISITS, stepName, since } from "./QueueData.js";

import styles from "./MsCard.module.css";

const cx = createClassNames(styles);

const MsCard = ({ t, onCall }) => {
  const vt = VISITS[t.visit]
  const prog = t.status === 'progress'
  return (
    <div className={cx("ms-card")}>
      <span className={cx("ms-tok")} style={{ color: vt.color, borderColor: vt.color + '55', background: vt.color + '0d' }}>{t.token}</span>
      <div className={cx("ms-pt")}>
        <b>{t.patient ? t.patient.name : 'Walk-in / Anonymous'}</b>
        {t.patient && <small>{t.patient.mrn}</small>}
        <i><Clock size={9} /> {since(t.at)}</i>
      </div>
      <div className={cx("ms-prog")}>
        <div className={cx("ms-chips")}>
          {vt.steps.map((s, i) => (
            <span key={s} className={cx(`ms-chip ${i < t.step ? 'done' : i === t.step ? 'on' : ''}`)}>{s.slice(0, 3)}</span>
          ))}
        </div>
        <small>Step {t.step + 1}/{vt.steps.length} · {stepName(vt, t.step)}</small>
      </div>
      <span className={cx(`ms-status ${prog ? 'prog' : ''}`)}>
        <span className={cx(`dot ${prog ? 'blue' : 'amber'}`)} /> {prog ? 'In Progress' : 'Waiting'}
      </span>
      <button className={cx("ms-call")} onClick={onCall}>
        {prog ? 'Next Step' : 'Call'} <ChevronRight size={12} />
      </button>
    </div>
  )
};

export default MsCard;
