import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import {
  Building, ChevronRight, CircleAlert, CircleArrowDown, CircleCheck, CirclePlus, ClipboardList, Clock, CreditCard,
  FileText, Pencil, Plus, Search, Trash2, TrendingDown, TrendingUp,
} from "lucide-react";
import CorporateClaimsTab from "./CorporateClaimsTab";
import CorporateRulesTab from "./CorporateRulesTab";
import CorporateServicesTab from "./CorporateServicesTab";
import CorporatePaymentModal from "./CorporatePaymentModal";
import CorporateModal from "./CorporateModal";
import {
  CORPORATES, DOCTORS, PROVIDER_GROUPS, defaultRules, fmtDate, ledgerView, pendingOf, rs, statusOf,
} from "./CorporatePricingData.js";
import styles from "./CorporatePricing.module.css";

const cx = createClassNames(styles);

const TABS = ["Overview", "Ledger", "Claims", "Info & Credit", "Pricing Rules", "Service Prices"];
const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const STATUS_ICON = { Unpaid: CircleAlert, Partial: Clock, Paid: CircleCheck };
const TYPE_ICON = { "Claim Debit": FileText, Advance: CirclePlus };

const CorporatePricing = () => {
  const [list, setList] = useState(CORPORATES);
  const [selId, setSelId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Overview");
  const [payOpen, setPayOpen] = useState(false);
  const [corModal, setCorModal] = useState(null); // null | { corporate } (corporate = null for Add)

  const cor = list.find((x) => x.id === selId);
  const patch = (fn) => setList((p) => p.map((x) => (x.id === selId ? fn(x) : x)));
  const pendingCount = (x) => x.claims.filter((cl) => pendingOf(cl) > 0).length;

  const q = search.trim().toLowerCase();
  const visible = list.filter((x) => !q || x.name.toLowerCase().includes(q) || x.email.toLowerCase().includes(q));

  const select = (id) => { setSelId(id); setTab("Overview"); };
  const remove = () => { setList((p) => p.filter((x) => x.id !== selId)); setSelId(null); };

  const saveCorporate = (data) => {
    if (corModal.corporate) {
      patch((x) => ({ ...x, ...data }));
    } else {
      const id = Date.now();
      setList((p) => [...p, {
        id, code: `C${p.length + 2}`, ledger: [], claims: [], rules: defaultRules(), overrides: {}, inactive: [], ...data,
      }]);
      select(id);
    }
    setCorModal(null);
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
    const ledger = ledgerView(cor.ledger);
    const advance = ledger[0]?.balance ?? 0;
    const totalPaid = cor.ledger.filter((e) => e.type === "Advance").reduce((s, e) => s + e.amount, 0);
    const unclaimed = cor.claims.reduce((s, cl) => s + Math.max(pendingOf(cl), 0), 0);
    const covered = Math.min(unclaimed, Math.max(advance, 0));
    const receivable = unclaimed - covered;
    const consumed = cor.claims.reduce((s, cl) => s + cl.total, 0);
    const pct = cor.creditLimit ? Math.round((consumed / cor.creditLimit) * 100) : 0;

    const stats = [
      { label: "Credit Limit", value: rs(cor.creditLimit), icon: CreditCard, tone: "cr-blue" },
      { label: "Advance Balance", value: rs(advance), sub: `Total paid: ${rs(totalPaid)}`, icon: CircleArrowDown, tone: "cr-green" },
      { label: "Unclaimed (Invoices)", value: rs(unclaimed), sub: covered > 0 ? `${rs(covered)} covered by advance` : "No advance applied", icon: TrendingUp, tone: "cr-orange" },
      { label: "Pending Receivable", value: rs(receivable), sub: receivable === 0 ? "Fully covered by advance" : "Not covered by advance", icon: TrendingDown, tone: "cr-green" },
    ];

    return (
      <>
        <div className={cx("cr-stats")}>
          {stats.map((s) => (
            <div key={s.label} className={cx("cr-stat")}>
              <div className={cx("cr-shead")}>
                <span>{s.label}</span>
                <i className={cx(`cr-sico ${s.tone}`)}><s.icon size={14} /></i>
              </div>
              <div className={cx("cr-sval")}>{s.value}</div>
              {s.sub && <div className={cx("cr-ssub")}>{s.sub}</div>}
            </div>
          ))}
        </div>

        <div className={cx("cr-util")}>
          <div className={cx("cr-uhead")}>
            <span>Credit Utilization</span>
            <em>{pct}% used</em>
          </div>
          <div className={cx("cr-bar")}><i style={{ width: `${Math.min(pct, 100)}%` }} /></div>
          <div className={cx("cr-umeta")}>
            <span>{rs(consumed)} consumed</span>
            <span>Limit: {rs(cor.creditLimit)}</span>
          </div>
        </div>

        <div className={cx("cr-pps")}>
          <div className={cx("cr-ppshead")}>
            <span>Patient Pending Summary</span>
            <em>{cor.claims.length} patients</em>
          </div>
          <div className={cx("cr-prow cr-phead")}>
            <span>Patient</span><span>Services</span><span>Total Amount</span><span>Pending</span><span>Status</span>
          </div>
          {cor.claims.map((cl) => {
            const st = statusOf(cl);
            const Ico = STATUS_ICON[st];
            const pend = pendingOf(cl);
            return (
              <div key={cl.id} className={cx("cr-prow")}>
                <div>
                  <div className={cx("cr-pname")}>{cl.name}</div>
                  <div className={cx("cr-pmrn")}>{cl.mrn}</div>
                </div>
                <span className={cx("cr-psvc")}>1 invoice</span>
                <span className={cx("cr-ptot")}>{rs(cl.total)}</span>
                <span className={cx(`cr-ppend ${pend > 0 ? "" : "cr-ppend-0"}`)}>{rs(pend)}</span>
                <span><span className={cx(`cr-pill cr-${st.toLowerCase()}`)}><Ico size={10} /> {st}</span></span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── ledger ── */
  const renderLedger = () => {
    const rows = ledgerView(cor.ledger);
    return (
      <>
        <div className={cx("cr-lhead")}>
          <div>
            <h2 className={cx("cr-ltitle")}>Financial Ledger</h2>
            <p className={cx("cr-ldesc")}>Running balance of all transactions for this corporate.</p>
          </div>
          <button type="button" className={cx("cr-ladd")} onClick={() => setPayOpen(true)}><Plus size={14} /> Add Advance Payment</button>
        </div>

        {rows.length > 0 && (
          <div className={cx("cr-bal")}>
            <span>Current Balance:</span>
            <strong>{rs(rows[0].balance)}</strong>
          </div>
        )}

        <div className={cx("cr-ltbl")}>
          <div className={cx("cr-lrow cr-lthead")}>
            <span>Date</span><span>Type</span><span>Amount</span><span>Tax Deducted</span><span>Balance</span><span>Reference</span><span>Remarks</span>
          </div>
          {rows.length === 0 ? (
            <div className={cx("cr-lempty")}>
              <ClipboardList size={26} strokeWidth={1.5} />
              <h4>No transactions yet</h4>
              <p>Add an advance payment or process a claim to create ledger entries.</p>
            </div>
          ) : rows.map((e) => {
            const Ico = TYPE_ICON[e.type];
            const plus = e.type !== "Claim Debit";
            return (
              <div key={e.id} className={cx("cr-lrow")}>
                <span className={cx("cr-ldate")}>{e.date}</span>
                <span>
                  <span className={cx(`cr-ltype ${e.type === "Advance" ? "cr-t-adv" : e.type === "Claim Debit" ? "cr-t-debit" : "cr-t-tax"}`)}>
                    {Ico && <Ico size={9} />} {e.type}
                  </span>
                </span>
                <span className={cx(`cr-lamt ${plus ? "cr-plus" : "cr-minus"}`)}>{plus ? "+" : ""}{rs(e.amount)}</span>
                <span className={cx("cr-ltax")}>{e.tax ? rs(e.tax) : "—"}</span>
                <span className={cx("cr-lbal")}>{rs(e.balance)}</span>
                <span className={cx("cr-lref")}>{e.ref}</span>
                <span className={cx("cr-lrem")} title={e.remarks}>{e.remarks}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── info & credit (+ rate list) ── */
  const renderInfo = () => {
    const docs = DOCTORS.filter((d) => cor.doctors.includes(d.id));
    return (
      <div className={cx("cr-info")}>
        <div className={cx("cr-igrid")}>
          <div><div className={cx("cr-ilbl")}>Contact Person</div><div className={cx("cr-ival")}>{cor.person || "—"}</div></div>
          <div><div className={cx("cr-ilbl")}>Phone</div><div className={cx("cr-ival")}>{cor.phone || "—"}</div></div>
          <div><div className={cx("cr-ilbl")}>Email</div><div className={cx("cr-ival")}>{cor.email || "—"}</div></div>
          <div><div className={cx("cr-ilbl")}>MOU Document</div><div className={cx("cr-ival")}>{cor.mou || "Not uploaded"}</div></div>
        </div>

        <div className={cx("cr-credit")}>
          <h3 className={cx("cr-ctitle")}>Credit Settings</h3>
          <div className={cx("cr-crow")}>
            <span>Credit Allowance</span>
            <span className={cx(`cr-cpill ${cor.creditEnabled ? "" : "cr-cpill-off"}`)}>{cor.creditEnabled ? "Enabled" : "Disabled"}</span>
          </div>
          {cor.creditEnabled && (
            <div className={cx("cr-crow")}>
              <span>Credit Limit</span>
              <strong>{rs(cor.creditLimit)}</strong>
            </div>
          )}
          <div className={cx("cr-crow")}>
            <span>New services pricing</span>
            <b>{cor.newPricing}</b>
          </div>
        </div>

        <div className={cx("cr-rate")}>
          <div className={cx("cr-rhead")}>
            <h3>Rate List</h3>
            <p>Providers &amp; doctors linked to this corporate</p>
          </div>
          <div className={cx("cr-rrow")}>
            <span className={cx("cr-rlbl")}><i style={{ background: "#4982cf" }} /> Consultants</span>
            <span className={cx("cr-rval")}>
              {docs.length ? docs.map((d) => <em key={d.id} className={cx("cr-chip")}>{d.name}</em>) : <span className={cx("cr-rnone")}>None</span>}
            </span>
          </div>
          {PROVIDER_GROUPS.map((g) => {
            const o = g.options.find((x) => x.id === cor.providers[g.key]);
            return (
              <div key={g.key} className={cx("cr-rrow")}>
                <span className={cx("cr-rlbl")}><i style={{ background: g.color }} /> {g.label}</span>
                <span className={cx("cr-rval")}>
                  {o ? (
                    <>
                      <b>{o.name}</b>
                      {o.type && <span className={cx("cr-rtype")}>· {o.type}</span>}
                    </>
                  ) : <span className={cx("cr-rnone")}>None</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cx("cr-wrap")}>
      {/* ── left: corporate list ── */}
      <aside className={cx("cr-side")}>
        <div className={cx("cr-stop")}>
          <button type="button" className={cx("cr-add")} onClick={() => setCorModal({ corporate: null })}><Plus size={15} /> Add Corporate</button>
          <div className={cx("cr-search")}>
            <Search size={13} />
            <input placeholder="Search corporates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={cx("cr-list")}>
          {visible.map((x) => {
            const on = x.id === selId;
            const n = pendingCount(x);
            return (
              <button type="button" key={x.id} className={cx(`cr-item ${on ? "cr-item-on" : ""}`)} onClick={() => select(x.id)}>
                <span className={cx("cr-av")}>{initials(x.name)}</span>
                <span className={cx("cr-itxt")}>
                  <span className={cx("cr-iname")}>{x.name}</span>
                  <span className={cx("cr-imeta")}>
                    {x.email}
                    {n > 0 && <span className={cx("cr-pend")}>{n} pending</span>}
                  </span>
                </span>
                {on && <ChevronRight size={14} className={cx("cr-ichev")} />}
              </button>
            );
          })}
        </div>

        <div className={cx("cr-foot")}>{list.length} corporates</div>
      </aside>

      {/* ── right: detail ── */}
      <main className={cx("cr-main")}>
        {!cor ? (
          <div className={cx("cr-empty")}>
            <div>
              <Building size={36} strokeWidth={1.5} />
              <h3>Select a corporate</h3>
              <p>Choose from the list to view and configure pricing.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={cx("cr-dhead")}>
              <div className={cx("cr-dtop")}>
                <span className={cx("cr-dav")}>{initials(cor.name)}</span>
                <div>
                  <h1 className={cx("cr-dname")}>{cor.name}</h1>
                  <p className={cx("cr-demail")}>{cor.email}</p>
                </div>
                <div className={cx("cr-dacts")}>
                  <button type="button" className={cx("cr-hbtn cr-edit")} onClick={() => setCorModal({ corporate: cor })}><Pencil size={13} /> Edit</button>
                  <button type="button" className={cx("cr-hbtn cr-delete")} onClick={remove}><Trash2 size={13} /> Delete</button>
                </div>
              </div>

              <nav className={cx("cr-tabs")}>
                {TABS.map((t) => (
                  <button type="button" key={t} className={cx(`cr-tab ${tab === t ? "cr-tab-on" : ""}`)} onClick={() => setTab(t)}>
                    {t === "Claims" ? `Claims (${pendingCount(cor)})` : t}
                  </button>
                ))}
              </nav>
            </div>

            <div className={cx(`cr-body ${tab === "Claims" ? "cr-body-fill" : ""}`)}>
              {tab === "Overview" && renderOverview()}
              {tab === "Ledger" && renderLedger()}
              {tab === "Claims" && <CorporateClaimsTab key={cor.id} claims={cor.claims} />}
              {tab === "Info & Credit" && renderInfo()}
              {tab === "Pricing Rules" && (
                <CorporateRulesTab key={cor.id} rules={cor.rules} onSave={(rules) => patch((x) => ({ ...x, rules }))} />
              )}
              {tab === "Service Prices" && <CorporateServicesTab corporate={cor} onPatch={patch} />}
            </div>
          </>
        )}
      </main>

      {payOpen && cor && <CorporatePaymentModal onClose={() => setPayOpen(false)} onSave={addPayment} />}
      {corModal && <CorporateModal corporate={corModal.corporate} onClose={() => setCorModal(null)} onSave={saveCorporate} />}
    </div>
  );
};

export default CorporatePricing;