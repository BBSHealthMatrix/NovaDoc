import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import {
  Building, ChevronRight, CircleAlert, CircleArrowDown, CircleCheck, CirclePlus, ClipboardList, Clock, CreditCard,
  FileText, Pencil, Plus, Search, Trash2, TrendingDown, TrendingUp,
} from "lucide-react";
import ClaimsTab from "./ClaimsTab";
import PricingRulesTab from "./PricingRulesTab";
import ServicePricesTab from "./ServicePricesTab";
import AdvancePaymentModal from "./AdvancePaymentModal";
import InsuranceModal from "./InsuranceModal";
import { INSURANCES, defaultRules, fmtDate, ledgerView, pendingOf, rs, statusOf } from "./InsurancePricingData.js";
import styles from "./InsurancePricing.module.css";

const cx = createClassNames(styles);

const TABS = ["Overview", "Ledger", "Claims", "Info & Credit", "Pricing Rules", "Service Prices"];
const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const STATUS_ICON = { Unpaid: CircleAlert, Partial: Clock, Paid: CircleCheck };
const TYPE_ICON = { "Claim Debit": FileText, Advance: CirclePlus };

const InsurancePricing = () => {
  const [list, setList] = useState(INSURANCES);
  const [selId, setSelId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Overview");
  const [payOpen, setPayOpen] = useState(false);
  const [insModal, setInsModal] = useState(null); // null | { insurance } (insurance = null for Add)

  const ins = list.find((x) => x.id === selId);
  const patch = (fn) => setList((p) => p.map((x) => (x.id === selId ? fn(x) : x)));
  const pendingCount = (x) => x.claims.filter((cl) => pendingOf(cl) > 0).length;

  const q = search.trim().toLowerCase();
  const visible = list.filter((x) => !q || x.name.toLowerCase().includes(q) || x.email.toLowerCase().includes(q));

  const select = (id) => { setSelId(id); setTab("Overview"); };
  const remove = () => { setList((p) => p.filter((x) => x.id !== selId)); setSelId(null); };

  const saveInsurance = (data) => {
    if (insModal.insurance) {
      patch((x) => ({ ...x, ...data }));
    } else {
      const id = Date.now();
      setList((p) => [...p, {
        id, code: `C${p.length + 2}`, ledger: [], claims: [], rules: defaultRules(), overrides: {}, ...data,
      }]);
      select(id);
    }
    setInsModal(null);
  };

  const addPayment = ({ amount, date, remarks }) => {
    patch((x) => {
      const n = x.ledger.filter((e) => e.type === "Advance").length + 1;
      return {
        ...x,
        ledger: [...x.ledger, {
          id: Date.now(), date: fmtDate(date), type: "Advance", amount, tax: 0,
          ref: `ADV-${x.code}-${String(n).padStart(3, "0")}`, remarks: remarks.trim(),
        }],
      };
    });
    setPayOpen(false);
  };

  /* ── overview ── */
  const renderOverview = () => {
    const ledger = ledgerView(ins.ledger);
    const advance = ledger[0]?.balance ?? 0;
    const totalPaid = ins.ledger.filter((e) => e.type === "Advance").reduce((s, e) => s + e.amount, 0);
    const unclaimed = ins.claims.reduce((s, cl) => s + Math.max(pendingOf(cl), 0), 0);
    const covered = Math.min(unclaimed, Math.max(advance, 0));
    const receivable = unclaimed - covered;
    const consumed = ins.claims.reduce((s, cl) => s + cl.total, 0);
    const pct = ins.creditLimit ? Math.round((consumed / ins.creditLimit) * 100) : 0;

    const stats = [
      { label: "Credit Limit", value: rs(ins.creditLimit), icon: CreditCard, tone: "ip-blue" },
      { label: "Advance Balance", value: rs(advance), sub: `Total paid: ${rs(totalPaid)}`, icon: CircleArrowDown, tone: "ip-green" },
      { label: "Unclaimed (Invoices)", value: rs(unclaimed), sub: covered > 0 ? `${rs(covered)} covered by advance` : "No advance applied", icon: TrendingUp, tone: "ip-orange" },
      { label: "Pending Receivable", value: rs(receivable), sub: receivable === 0 ? "Fully covered by advance" : "Not covered by advance", icon: TrendingDown, tone: "ip-green" },
    ];

    return (
      <>
        <div className={cx("ip-stats")}>
          {stats.map((s) => (
            <div key={s.label} className={cx("ip-stat")}>
              <div className={cx("ip-shead")}>
                <span>{s.label}</span>
                <i className={cx(`ip-sico ${s.tone}`)}><s.icon size={14} /></i>
              </div>
              <div className={cx("ip-sval")}>{s.value}</div>
              {s.sub && <div className={cx("ip-ssub")}>{s.sub}</div>}
            </div>
          ))}
        </div>

        <div className={cx("ip-util")}>
          <div className={cx("ip-uhead")}>
            <span>Credit Utilization</span>
            <em>{pct}% used</em>
          </div>
          <div className={cx("ip-bar")}><i style={{ width: `${Math.min(pct, 100)}%` }} /></div>
          <div className={cx("ip-umeta")}>
            <span>{rs(consumed)} consumed</span>
            <span>Limit: {rs(ins.creditLimit)}</span>
          </div>
        </div>

        <div className={cx("ip-pps")}>
          <div className={cx("ip-ppshead")}>
            <span>Patient Pending Summary</span>
            <em>{ins.claims.length} patients</em>
          </div>
          <div className={cx("ip-prow ip-phead")}>
            <span>Patient</span><span>Services</span><span>Total Amount</span><span>Pending</span><span>Status</span>
          </div>
          {ins.claims.map((cl) => {
            const st = statusOf(cl);
            const Ico = STATUS_ICON[st];
            const pend = pendingOf(cl);
            return (
              <div key={cl.id} className={cx("ip-prow")}>
                <div>
                  <div className={cx("ip-pname")}>{cl.name}</div>
                  <div className={cx("ip-pmrn")}>{cl.mrn}</div>
                </div>
                <span className={cx("ip-psvc")}>1 invoice</span>
                <span className={cx("ip-ptot")}>{rs(cl.total)}</span>
                <span className={cx(`ip-ppend ${pend > 0 ? "" : "ip-ppend-0"}`)}>{rs(pend)}</span>
                <span><span className={cx(`ip-pill ip-${st.toLowerCase()}`)}><Ico size={10} /> {st}</span></span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── ledger ── */
  const renderLedger = () => {
    const rows = ledgerView(ins.ledger);
    return (
      <>
        <div className={cx("ip-lhead")}>
          <div>
            <h2 className={cx("ip-ltitle")}>Financial Ledger</h2>
            <p className={cx("ip-ldesc")}>Running balance of all transactions for this insurance.</p>
          </div>
          <button type="button" className={cx("ip-ladd")} onClick={() => setPayOpen(true)}><Plus size={14} /> Add Advance Payment</button>
        </div>

        {rows.length > 0 && (
          <div className={cx("ip-bal")}>
            <span>Current Balance:</span>
            <strong>{rs(rows[0].balance)}</strong>
          </div>
        )}

        <div className={cx("ip-ltbl")}>
          <div className={cx("ip-lrow ip-lthead")}>
            <span>Date</span><span>Type</span><span>Amount</span><span>Tax Deducted</span><span>Balance</span><span>Reference</span><span>Remarks</span>
          </div>
          {rows.length === 0 ? (
            <div className={cx("ip-lempty")}>
              <ClipboardList size={26} strokeWidth={1.5} />
              <h4>No transactions yet</h4>
              <p>Add an advance payment or process a claim to create ledger entries.</p>
            </div>
          ) : rows.map((e) => {
            const Ico = TYPE_ICON[e.type];
            const plus = e.type !== "Claim Debit";
            return (
              <div key={e.id} className={cx("ip-lrow")}>
                <span className={cx("ip-ldate")}>{e.date}</span>
                <span>
                  <span className={cx(`ip-ltype ${e.type === "Advance" ? "ip-t-adv" : e.type === "Claim Debit" ? "ip-t-debit" : "ip-t-tax"}`)}>
                    {Ico && <Ico size={9} />} {e.type}
                  </span>
                </span>
                <span className={cx(`ip-lamt ${plus ? "ip-plus" : "ip-minus"}`)}>{plus ? "+" : ""}{rs(e.amount)}</span>
                <span className={cx("ip-ltax")}>{e.tax ? rs(e.tax) : "—"}</span>
                <span className={cx("ip-lbal")}>{rs(e.balance)}</span>
                <span className={cx("ip-lref")}>{e.ref}</span>
                <span className={cx("ip-lrem")} title={e.remarks}>{e.remarks}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── info & credit ── */
  const renderInfo = () => (
    <div className={cx("ip-info")}>
      <div className={cx("ip-igrid")}>
        <div><div className={cx("ip-ilbl")}>Contact Person</div><div className={cx("ip-ival")}>{ins.person || "—"}</div></div>
        <div><div className={cx("ip-ilbl")}>Phone</div><div className={cx("ip-ival")}>{ins.phone || "—"}</div></div>
        <div><div className={cx("ip-ilbl")}>Email</div><div className={cx("ip-ival")}>{ins.email || "—"}</div></div>
        <div><div className={cx("ip-ilbl")}>MOU Document</div><div className={cx("ip-ival")}>{ins.mou || "Not uploaded"}</div></div>
      </div>

      <div className={cx("ip-credit")}>
        <h3 className={cx("ip-ctitle")}>Credit Settings</h3>
        <div className={cx("ip-crow")}>
          <span>Credit Allowance</span>
          <span className={cx(`ip-cpill ${ins.creditEnabled ? "" : "ip-cpill-off"}`)}>{ins.creditEnabled ? "Enabled" : "Disabled"}</span>
        </div>
        {ins.creditEnabled && (
          <div className={cx("ip-crow")}>
            <span>Credit Limit</span>
            <strong>{rs(ins.creditLimit)}</strong>
          </div>
        )}
        <div className={cx("ip-crow")}>
          <span>New services pricing</span>
          <b>{ins.newPricing}</b>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cx("ip-wrap")}>
      {/* ── left: insurance list ── */}
      <aside className={cx("ip-side")}>
        <div className={cx("ip-stop")}>
          <button type="button" className={cx("ip-add")} onClick={() => setInsModal({ insurance: null })}><Plus size={15} /> Add Insurance</button>
          <div className={cx("ip-search")}>
            <Search size={13} />
            <input placeholder="Search insurances..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={cx("ip-list")}>
          {visible.map((x) => {
            const on = x.id === selId;
            const n = pendingCount(x);
            return (
              <button type="button" key={x.id} className={cx(`ip-item ${on ? "ip-item-on" : ""}`)} onClick={() => select(x.id)}>
                <span className={cx("ip-av")}>{initials(x.name)}</span>
                <span className={cx("ip-itxt")}>
                  <span className={cx("ip-iname")}>{x.name}</span>
                  <span className={cx("ip-imeta")}>
                    {x.email}
                    {n > 0 && <span className={cx("ip-pend")}>{n} pending</span>}
                  </span>
                </span>
                {on && <ChevronRight size={14} className={cx("ip-ichev")} />}
              </button>
            );
          })}
        </div>

        <div className={cx("ip-foot")}>{list.length} insurances</div>
      </aside>

      {/* ── right: detail ── */}
      <main className={cx("ip-main")}>
        {!ins ? (
          <div className={cx("ip-empty")}>
            <div>
              <Building size={36} strokeWidth={1.5} />
              <h3>Select a insurance</h3>
              <p>Choose from the list to view and configure pricing.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={cx("ip-dhead")}>
              <div className={cx("ip-dtop")}>
                <span className={cx("ip-dav")}>{initials(ins.name)}</span>
                <div>
                  <h1 className={cx("ip-dname")}>{ins.name}</h1>
                  <p className={cx("ip-demail")}>{ins.email}</p>
                </div>
                <div className={cx("ip-dacts")}>
                  <button type="button" className={cx("ip-hbtn ip-edit")} onClick={() => setInsModal({ insurance: ins })}><Pencil size={13} /> Edit</button>
                  <button type="button" className={cx("ip-hbtn ip-delete")} onClick={remove}><Trash2 size={13} /> Delete</button>
                </div>
              </div>

              <nav className={cx("ip-tabs")}>
                {TABS.map((t) => (
                  <button type="button" key={t} className={cx(`ip-tab ${tab === t ? "ip-tab-on" : ""}`)} onClick={() => setTab(t)}>
                    {t === "Claims" ? `Claims (${pendingCount(ins)})` : t}
                  </button>
                ))}
              </nav>
            </div>

            <div className={cx(`ip-body ${tab === "Claims" ? "ip-body-fill" : ""}`)}>
              {tab === "Overview" && renderOverview()}
              {tab === "Ledger" && renderLedger()}
              {tab === "Claims" && <ClaimsTab key={ins.id} claims={ins.claims} />}
              {tab === "Info & Credit" && renderInfo()}
              {tab === "Pricing Rules" && (
                <PricingRulesTab key={ins.id} rules={ins.rules} onSave={(rules) => patch((x) => ({ ...x, rules }))} />
              )}
              {tab === "Service Prices" && (
                <ServicePricesTab
                  rules={ins.rules}
                  overrides={ins.overrides}
                  onOverrides={(fn) => patch((x) => ({ ...x, overrides: fn(x.overrides) }))}
                />
              )}
            </div>
          </>
        )}
      </main>

      {payOpen && ins && <AdvancePaymentModal onClose={() => setPayOpen(false)} onSave={addPayment} />}
      {insModal && <InsuranceModal insurance={insModal.insurance} onClose={() => setInsModal(null)} onSave={saveInsurance} />}
    </div>
  );
};

export default InsurancePricing;