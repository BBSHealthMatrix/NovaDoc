import { createClassNames } from '../../utils/classNames.js';
import { Printer, Ticket, X } from "lucide-react";

import styles from "./TokenSlip.module.css";

const cx = createClassNames(styles);

const TokenSlip = ({ slip, onClose }) => {
  const c = slip.color
  return (
    <div className={cx("tk-overlay")} onClick={onClose}>
      <div className={cx("tk-card")} onClick={(e) => e.stopPropagation()} style={{ '--tk-tint': c + '33' }}>
        <button className={cx("tk-x")} onClick={onClose}><X size={12} /></button>

        <div className={cx("tk-head")} style={{ backgroundColor: c }}>
          <b><Ticket size={15} /> NovaDoc</b>
          <small>Smart Healthcare Queue System</small>
        </div>
        <div className={cx("tk-scallop")} />

        <div className={cx("tk-body")}>
          <b className={cx("tk-title")}>{slip.title}</b>
          <small className={cx("tk-sub")}>{slip.sub}</small>
          <div className={cx("tk-num")} style={{ color: c, borderColor: c + '66', background: c + '0d' }}>{slip.token}</div>

          {slip.steps && (
            <div className={cx("tk-sec")}>
              <p className={cx("tk-lbl")}>Visit Steps</p>
              <div className={cx("tk-steps")}>
                {slip.steps.map((s, i) => (
                  <span key={s}>
                    {i > 0 && <i>→</i>}
                    <em style={{ color: c, background: c + '14' }}>{s}</em>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={cx(`tk-sec ${slip.steps ? 'tk-sec-flat' : ''}`)}>
            <p className={cx("tk-lbl")}>Patient</p>
            {slip.patient
              ? <><b className={cx("tk-pname")}>{slip.patient}</b><small className={cx("tk-mrn")}>{slip.mrn}</small></>
              : <span className={cx("tk-anon")}>Walk-in / Anonymous</span>}
          </div>

          <div className={cx("tk-meta")}>
            <div><b>Main Branch — Lahore</b><small>{slip.time}</small></div>
            <div className={cx("tk-meta-r")}><b className={cx("tk-mono")}>{slip.token}</b><small>Please keep this slip</small></div>
          </div>
        </div>

        <div className={cx("tk-scallop-b")} />
        <div className={cx("tk-foot")}>
          <p><Printer size={12} /> In production this slip would be printed and handed to the patient.</p>
          <button style={{ background: c }} onClick={onClose}>Close Preview</button>
        </div>
      </div>
    </div>
  )
};

export default TokenSlip;
