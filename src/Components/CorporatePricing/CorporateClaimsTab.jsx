import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleAlert, CircleCheck, Clock, CreditCard, Search } from "lucide-react";
import Select from "../Shared/Select";
import { pendingOf, rs, statusOf } from "./CorporatePricingData.js";
import styles from "./CorporateClaimsTab.module.css";

const cx = createClassNames(styles);

const STATUSES = ["All Status", "Unpaid", "Partial", "Paid"];
const ICON = { Unpaid: CircleAlert, Partial: Clock, Paid: CircleCheck };

const CorporateClaimsTab = ({ claims }) => {
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
    <div className={cx("crc-wrap")}>
      <div className={cx("crc-tools")}>
        <div className={cx("crc-search")}>
          <Search size={13} />
          <input placeholder="Search patient, MRN..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={cx("crc-status")}>
          <Select value={status} options={STATUSES} onChange={setStatus} label="Filter by status" />
        </div>
        {selected.length > 0 && (
          <button type="button" className={cx("crc-process")}><CreditCard size={14} /> Process Payment ({selected.length} selected)</button>
        )}
      </div>

      <div className={cx("crc-chips")}>
        {summary.map(({ st, count, pending }) => {
          const Ico = ICON[st];
          return (
            <button
              type="button"
              key={st}
              className={cx(`crc-chip ${status === st ? "crc-chip-on" : ""}`)}
              onClick={() => setStatus(status === st ? "All Status" : st)}
            >
              <span className={cx(`crc-badge crc-${st.toLowerCase()}`)}><Ico size={10} /> {st}</span>
              <b>{count}</b>
              {st !== "Paid" && <span className={cx("crc-cpend")}>· {rs(pending)} pending</span>}
            </button>
          );
        })}
      </div>

      <div className={cx("crc-tbl")}>
        <div className={cx("crc-row crc-head")}>
          <span className={cx("crc-c-chk")}><input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="Select all" /></span>
          <span className={cx("crc-c-pat")}>Patient</span>
          <span className={cx("crc-c-mrn")}>MRN</span>
          <span className={cx("crc-c-svc")}>Services</span>
          <span className={cx("crc-c-date")}>Claim Date</span>
          <span className={cx("crc-c-tot")}>Total</span>
          <span className={cx("crc-c-paid")}>Paid</span>
          <span className={cx("crc-c-pend")}>Pending</span>
          <span className={cx("crc-c-tax")}>Tax</span>
          <span className={cx("crc-c-st")}>Status</span>
        </div>

        {rows.map((c) => {
          const st = statusOf(c);
          const pend = pendingOf(c);
          const on = selected.includes(c.id);
          return (
            <div key={c.id} className={cx(`crc-row ${on ? "crc-row-on" : ""}`)}>
              <span className={cx("crc-c-chk")}><input type="checkbox" checked={on} onChange={() => toggle(c.id)} aria-label={`Select ${c.name}`} /></span>
              <span className={cx("crc-c-pat")}>
                <span className={cx("crc-name")}>{c.name}</span>
                <span className={cx("crc-visit")}>{c.visit}</span>
              </span>
              <span className={cx("crc-c-mrn crc-mrn")}>{c.mrn}</span>
              <span className={cx("crc-c-svc crc-svc")}>{c.services}</span>
              <span className={cx("crc-c-date crc-date")}>{c.claimDate}</span>
              <span className={cx("crc-c-tot crc-tot")}>{rs(c.total)}</span>
              <span className={cx("crc-c-paid crc-paidamt")}>{rs(c.paid)}</span>
              <span className={cx(`crc-c-pend crc-pend ${pend > 0 ? "" : "crc-pend-0"}`)}>{rs(Math.max(pend, 0))}</span>
              <span className={cx("crc-c-tax crc-tax")}>{c.tax ? rs(c.tax) : "—"}</span>
              <span className={cx("crc-c-st")}><span className={cx(`crc-pill crc-${st.toLowerCase()}`)}>{st}</span></span>
            </div>
          );
        })}
        {rows.length === 0 && <p className={cx("crc-none")}>No claims match your filter.</p>}
      </div>
    </div>
  );
};

export default CorporateClaimsTab;