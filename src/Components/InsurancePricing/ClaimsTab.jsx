import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleAlert, CircleCheck, Clock, CreditCard, Search } from "lucide-react";
import Select from "../Shared/Select";
import { pendingOf, rs, statusOf } from "./InsurancePricingData.js";
import styles from "./ClaimsTab.module.css";

const cx = createClassNames(styles);

const STATUSES = ["All Status", "Unpaid", "Partial", "Paid"];
const ICON = { Unpaid: CircleAlert, Partial: Clock, Paid: CircleCheck };

const ClaimsTab = ({ claims }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [selected, setSelected] = useState([]);

  const q = search.trim().toLowerCase();
  const rows = claims.filter((c) => {
    if (status !== "All Status" && statusOf(c) !== status) return false;
    return !q || c.name.toLowerCase().includes(q) || c.mrn.toLowerCase().includes(q);
  });

  const summary = ["Unpaid", "Partial", "Paid"].map((st) => {
    const list = claims.filter((c) => statusOf(c) === st);
    return { st, count: list.length, pending: list.reduce((s, c) => s + Math.max(pendingOf(c), 0), 0) };
  });

  const allOn = rows.length > 0 && rows.every((c) => selected.includes(c.id));
  const toggleAll = () => setSelected(allOn ? selected.filter((id) => !rows.some((c) => c.id === id)) : [...new Set([...selected, ...rows.map((c) => c.id)])]);
  const toggle = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className={cx("ipc-wrap")}>
      <div className={cx("ipc-tools")}>
        <div className={cx("ipc-search")}>
          <Search size={13} />
          <input placeholder="Search patient, MRN..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={cx("ipc-status")}>
          <Select value={status} options={STATUSES} onChange={setStatus} label="Filter by status" />
        </div>
        {selected.length > 0 && (
          <button type="button" className={cx("ipc-process")}><CreditCard size={14} /> Process Payment ({selected.length} selected)</button>
        )}
      </div>

      <div className={cx("ipc-chips")}>
        {summary.map(({ st, count, pending }) => {
          const Ico = ICON[st];
          return (
            <button
              type="button"
              key={st}
              className={cx(`ipc-chip ${status === st ? "ipc-chip-on" : ""}`)}
              onClick={() => setStatus(status === st ? "All Status" : st)}
            >
              <span className={cx(`ipc-badge ipc-${st.toLowerCase()}`)}><Ico size={10} /> {st}</span>
              <b>{count}</b>
              {st !== "Paid" && <span className={cx("ipc-cpend")}>· {rs(pending)} pending</span>}
            </button>
          );
        })}
      </div>

      <div className={cx("ipc-tbl")}>
        <div className={cx("ipc-row ipc-head")}>
          <span className={cx("ipc-c-chk")}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="Select all" /></span>
          <span className={cx("ipc-c-pat")}>Patient</span>
          <span className={cx("ipc-c-mrn")}>MRN</span>
          <span className={cx("ipc-c-svc")}>Services</span>
          <span className={cx("ipc-c-date")}>Claim Date</span>
          <span className={cx("ipc-c-tot")}>Total</span>
          <span className={cx("ipc-c-paid")}>Paid</span>
          <span className={cx("ipc-c-pend")}>Pending</span>
          <span className={cx("ipc-c-tax")}>Tax</span>
          <span className={cx("ipc-c-st")}>Status</span>
        </div>

        {rows.map((c) => {
          const st = statusOf(c);
          const pend = pendingOf(c);
          const on = selected.includes(c.id);
          return (
            <div key={c.id} className={cx(`ipc-row ${on ? "ipc-row-on" : ""}`)}>
              <span className={cx("ipc-c-chk")}><input type="checkbox" checked={on} onChange={() => toggle(c.id)} aria-label={`Select ${c.name}`} /></span>
              <span className={cx("ipc-c-pat")}>
                <span className={cx("ipc-name")}>{c.name}</span>
                <span className={cx("ipc-visit")}>{c.visit}</span>
              </span>
              <span className={cx("ipc-c-mrn ipc-mrn")}>{c.mrn}</span>
              <span className={cx("ipc-c-svc ipc-svc")}>{c.services}</span>
              <span className={cx("ipc-c-date ipc-date")}>{c.claimDate}</span>
              <span className={cx("ipc-c-tot ipc-tot")}>{rs(c.total)}</span>
              <span className={cx("ipc-c-paid ipc-paidamt")}>{rs(c.paid)}</span>
              <span className={cx(`ipc-c-pend ipc-pend ${pend > 0 ? "" : "ipc-pend-0"}`)}>{rs(Math.max(pend, 0))}</span>
              <span className={cx("ipc-c-tax ipc-tax")}>{c.tax ? rs(c.tax) : "—"}</span>
              <span className={cx("ipc-c-st")}><span className={cx(`ipc-pill ipc-${st.toLowerCase()}`)}>{st}</span></span>
            </div>
          );
        })}
        {rows.length === 0 && <p className={cx("ipc-none")}>No claims match your filter.</p>}
      </div>
    </div>
  );
};

export default ClaimsTab;