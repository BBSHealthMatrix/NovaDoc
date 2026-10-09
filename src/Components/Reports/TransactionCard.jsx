import { createClassNames } from '../../utils/classNames.js';
import { CircleUserRound, Building2, Calendar, SquarePen, Printer, Send, Ellipsis } from "lucide-react";

import { MODE_ICON, money } from "./ReportsData.js";

import styles from "./TransactionCard.module.css";

const cx = createClassNames(styles);

const TransactionCard = ({ t }) => {
  const ModeIcon = MODE_ICON[t.mode]

  return (
    <div className={cx("rp-card rp-cols")}>
      
      <div className={cx("rp-visit")}>
        <span className={cx("rp-avatar")}>{t.name[0]}</span>
        <div className={cx("rp-person")}>
          <p><b>{t.name}</b><span className={cx("rp-mrn mono")}>{t.mrn}</span></p>
          <small><CircleUserRound size={10} /> {t.doctor}</small>
          <small className={cx("rp-proc-txt")}>Proc: {t.proc}</small>
        </div>
        <span className={cx("rp-dept")}><Building2 size={10} /> {t.dept}</span>
      </div>

      
      <div className={cx("rp-billing")}>
        <div className={cx("rp-amount")}>
          <p>
            <b>{money(t.total)}</b>
                        <span className={cx(`rp-status status-${t.status.toLowerCase()}`)}>{t.status}</span>
          </p>
          <p>
                    <span className={cx(`rp-mode mode-${t.mode.toLowerCase()}`)}>{ModeIcon && <ModeIcon size={10} />} {t.mode}</span>
            <span className={cx("rp-trx mono")}>{t.trx}</span>
          </p>
        </div>
        <div className={cx("rp-breakdown")}>
          <p><span>Subtotal:</span><b>{money(t.subtotal)}</b></p>
                    {t.discount > 0 && <p className={cx("rp-red")}><span>Discount:</span><b>-{money(t.discount)}</b></p>}
                <p className={cx("rp-blue")}><span>Co-Pay:</span><b>{money(t.copay)}</b></p>
        </div>
      </div>

      
      <div className={cx("rp-shares")}>
        <div><small>Clinic Share</small><b>{money(t.clinic)}</b></div>
        <div><small>Doctor Rev.</small><b>{money(t.doctorRev)}</b></div>
        <div><small>Date</small><b><Calendar size={10} /> {t.date}</b></div>
        <div><small>Created By</small><b>{t.by}</b></div>
      </div>

      
      <div className={cx("rp-actions")}>
        <button title="Edit"><SquarePen size={12} /></button>
        <button title="Print"><Printer size={12} /></button>
        <button title="Send"><Send size={12} /></button>
        <button title="More"><Ellipsis size={12} /></button>
      </div>
    </div>
  )
};

export default TransactionCard;
