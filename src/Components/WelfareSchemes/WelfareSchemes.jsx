import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import {
  Banknote, Check, CircleArrowDown, CircleArrowUp, CircleCheck, ClipboardList, FileText,
  HeartHandshake, Pencil, Plus, Search, ShieldCheck, Trash2, Users, X,
} from "lucide-react";
import Toggle from "../Toggle/Toggle";
import WelfareEligibilityTab from "./WelfareEligibilityTab";
import WelfareCoverageTab from "./WelfareCoverageTab";
import WelfareLimitsTab from "./WelfareLimitsTab";
import SchemeModal from "./SchemeModal";
import FundDepositModal from "./FundDepositModal";
import {
  RENEWAL_SHORT, SCHEMES, SERVICE_TYPES, TYPE_KEY, coverageStatus, fmtDate, ledgerTotals, ledgerView, newScheme, rs,
} from "./WelfareSchemesData.js";
import styles from "./WelfareSchemes.module.css";

const cx = createClassNames(styles);

const TABS = [
  ["Overview", HeartHandshake], ["Eligibility", ShieldCheck], ["Coverage", ClipboardList],
  ["Limits & Co-pay", CircleCheck], ["Ledger", Banknote], ["Welfare Forms", FileText],
];

const WelfareSchemes = () => {
  const [list, setList] = useState(SCHEMES);
  const [selId, setSelId] = useState(SCHEMES[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState(null); // null | { scheme } (scheme = null for Add)
  const [depOpen, setDepOpen] = useState(false);
  const [formDraft, setFormDraft] = useState(null); // null | string

  const sc = list.find((x) => x.id === selId);
  const patch = (fn) => setList((p) => p.map((x) => (x.id === selId ? fn(x) : x)));

  const q = search.trim().toLowerCase();
  const visible = list.filter((x) => !q || x.name.toLowerCase().includes(q) || x.type.toLowerCase().includes(q));

  const select = (id) => { setSelId(id); setTab("Overview"); setFormDraft(null); };
  const remove = () => {
    const rest = list.filter((x) => x.id !== selId);
    setList(rest);
    setSelId(rest[0]?.id ?? null);
    setTab("Overview");
  };

  const saveScheme = (data) => {
    if (modal.scheme) {
      patch((x) => ({ ...x, ...data }));
    } else {
      const s = newScheme(data);
      setList((p) => [...p, s]);
      select(s.id);
    }
    setModal(null);
  };

  const addDeposit = ({ amount, date, ref, notes }) => {
    patch((x) => ({
      ...x,
      ledger: [...x.ledger, {
        id: Date.now(), date: fmtDate(date), type: "Deposit", amount,
        ref: ref.trim() || `DEP-${String(x.ledger.length + 1).padStart(3, "0")}`, notes: notes.trim(),
      }],
    }));
    setDepOpen(false);
  };

  const addForm = () => {
    const name = (formDraft ?? "").trim();
    if (!name) return;
    patch((x) => ({ ...x, forms: [...x.forms, { id: Date.now(), name }] }));
    setFormDraft(null);
  };

  /* ── overview ── */
  const renderOverview = () => {
    const t = ledgerTotals(sc.ledger);
    return (
      <>
        <div className={cx("ws-stats")}>
          <div className={cx("ws-stat")}>
            <div className={cx("ws-slbl")}><Users size={13} className={cx("ws-c-blue")} /> Active Beneficiaries</div>
            <div className={cx("ws-sval")}>{sc.beneficiaries}</div>
            <div className={cx("ws-ssub")}>enrolled patients</div>
          </div>
          <div className={cx("ws-stat")}>
            <div className={cx("ws-slbl")}><CircleArrowDown size={13} className={cx("ws-c-red")} /> Total Disbursed</div>
            <div className={cx("ws-sval")}>{rs(t.disbursed)}</div>
            <div className={cx("ws-ssub")}>all time</div>
          </div>
          <div className={cx("ws-stat")}>
            <div className={cx("ws-slbl")}><Banknote size={13} className={cx("ws-c-green")} /> Fund Balance</div>
            <div className={cx("ws-sval")}>{rs(t.balance)}</div>
            <div className={cx("ws-ssub")}>current</div>
          </div>
        </div>

        <div className={cx("ws-card")}>
          <div className={cx("ws-chead")}>
            <h3 className={cx("ws-ctitle")}>Scheme Details</h3>
            <button type="button" className={cx("ws-cedit")} onClick={() => setModal({ scheme: sc })}><Pencil size={13} /> Edit</button>
          </div>
          <div className={cx("ws-dgrid")}>
            <div><div className={cx("ws-dlbl")}>Scheme Type</div><div className={cx("ws-dval")}>{sc.type}</div></div>
            <div><div className={cx("ws-dlbl")}>Sponsor / Administrator</div><div className={cx("ws-dval")}>{sc.sponsor || "—"}</div></div>
            <div><div className={cx("ws-dlbl")}>Renewal Period</div><div className={cx("ws-dval")}>{RENEWAL_SHORT[sc.limits.renewal]}</div></div>
            <div><div className={cx("ws-dlbl")}>Created</div><div className={cx("ws-dval")}>{sc.created}</div></div>
            <div className={cx("ws-dfull")}>
              <div className={cx("ws-dlbl")}>Description</div>
              <div className={cx("ws-dtext")}>{sc.description || "—"}</div>
            </div>
          </div>
        </div>

        <div className={cx("ws-card")}>
          <h3 className={cx("ws-ctitle")}>Coverage Summary</h3>
          <div className={cx("ws-chips")}>
            {SERVICE_TYPES.map((t2) => {
              const st = coverageStatus(sc.coverage[t2]);
              return (
                <span key={t2} className={cx("ws-chip")}>
                  {t2} <em className={cx(`ws-cov ws-cov-${st.tone}`)}>{st.label}</em>
                </span>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  /* ── ledger ── */
  const renderLedger = () => {
    const t = ledgerTotals(sc.ledger);
    const rows = ledgerView(sc.ledger);
    return (
      <>
        <div className={cx("ws-lstats")}>
          <div className={cx("ws-lstat")}>
            <CircleArrowUp size={14} className={cx("ws-c-green")} />
            <div><div className={cx("ws-llbl")}>Total Deposits</div><div className={cx("ws-lval ws-c-green")}>{rs(t.deposits)}</div></div>
          </div>
          <div className={cx("ws-lstat")}>
            <CircleArrowDown size={14} className={cx("ws-c-red")} />
            <div><div className={cx("ws-llbl")}>Total Disbursed</div><div className={cx("ws-lval ws-c-red")}>{rs(t.disbursed)}</div></div>
          </div>
          <div className={cx("ws-lstat")}>
            <Banknote size={14} className={cx("ws-c-blue")} />
            <div><div className={cx("ws-llbl")}>Fund Balance</div><div className={cx("ws-lval")}>{rs(t.balance)}</div></div>
          </div>
        </div>

        <div className={cx("ws-lbar")}>
          <button type="button" className={cx("ws-ldep")} onClick={() => setDepOpen(true)}><Plus size={14} /> Add Fund Deposit</button>
        </div>

        <div className={cx("ws-ltbl")}>
          <div className={cx("ws-lrow ws-lthead")}>
            <span>Date</span><span>Type</span><span>Reference / Notes</span><span>Amount</span><span>Balance</span>
          </div>
          {rows.length === 0 && <p className={cx("ws-lempty")}>No transactions yet.</p>}
          {rows.map((e) => {
            const dep = e.type === "Deposit";
            return (
              <div key={e.id} className={cx("ws-lrow")}>
                <span className={cx("ws-ldate")}>{e.date}</span>
                <span>
                  <span className={cx(`ws-ltype ${dep ? "ws-lt-dep" : "ws-lt-dis"}`)}>
                    {dep ? <CircleCheck size={9} /> : <CircleArrowDown size={9} />} {e.type}
                  </span>
                </span>
                <span>
                  <span className={cx("ws-lref")}>{e.ref}</span>
                  {e.notes && <span className={cx("ws-lnote")}>{e.notes}</span>}
                </span>
                <span className={cx(`ws-lamt ${dep ? "ws-c-green" : "ws-c-red"}`)}>{dep ? "+" : "–"} {rs(e.amount)}</span>
                <span className={cx("ws-lbal")}>{rs(e.balance)}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── welfare forms ── */
  const renderForms = () => (
    <div className={cx("ws-forms")}>
      <div className={cx("ws-fhead")}>
        <p className={cx("ws-fdesc")}>
          Define custom forms for this scheme. When a patient selects this scheme during registration, all forms listed here will appear automatically so the additional data can be captured.
        </p>
        <button type="button" className={cx("ws-fadd")} onClick={() => setFormDraft("")}><Plus size={14} /> Add Form</button>
      </div>

      {formDraft !== null && (
        <div className={cx("ws-fnew")}>
          <input
            autoFocus
            placeholder="Form name, e.g. Means Test Declaration"
            value={formDraft}
            onChange={(e) => setFormDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addForm();
              if (e.key === "Escape") setFormDraft(null);
            }}
          />
          <button type="button" className={cx("ws-fok")} disabled={!formDraft.trim()} onClick={addForm} aria-label="Add form"><Check size={15} /></button>
          <button type="button" className={cx("ws-fx")} onClick={() => setFormDraft(null)} aria-label="Cancel"><X size={15} /></button>
        </div>
      )}

      {sc.forms.length > 0 && (
        <div className={cx("ws-flist")}>
          {sc.forms.map((f) => (
            <div key={f.id} className={cx("ws-frow")}>
              <FileText size={14} className={cx("ws-c-blue")} />
              <span>{f.name}</span>
              <button
                type="button" className={cx("ws-ibtn ws-ibtn-del")} aria-label={`Delete ${f.name}`}
                onClick={() => patch((x) => ({ ...x, forms: x.forms.filter((y) => y.id !== f.id) }))}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cx("ws-wrap")}>
      {/* ── left: scheme list ── */}
      <aside className={cx("ws-side")}>
        <div className={cx("ws-stop")}>
          <div className={cx("ws-shead")}>
            <h2>Welfare Schemes</h2>
            <button type="button" className={cx("ws-add")} onClick={() => setModal({ scheme: null })}><Plus size={14} /> Add</button>
          </div>
          <div className={cx("ws-search")}>
            <Search size={13} />
            <input placeholder="Search schemes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={cx("ws-list")}>
          {visible.map((x) => (
            <button type="button" key={x.id} className={cx(`ws-item ${x.id === selId ? "ws-item-on" : ""}`)} onClick={() => select(x.id)}>
              <span className={cx("ws-iname")}>{x.name}</span>
              <i className={cx(`ws-dot ${x.active ? "" : "ws-dot-off"}`)} />
              <span className={cx(`ws-badge ws-t-${TYPE_KEY[x.type]}`)}>{x.type}</span>
              <span className={cx("ws-ibal")}>Bal: <b>{rs(ledgerTotals(x.ledger).balance)}</b></span>
            </button>
          ))}
          {visible.length === 0 && <p className={cx("ws-none")}>No schemes found.</p>}
        </div>
      </aside>

      {/* ── right: detail ── */}
      <main className={cx("ws-main")}>
        {!sc ? (
          <div className={cx("ws-empty")}>
            <div>
              <HeartHandshake size={36} strokeWidth={1.5} />
              <h3>Select a scheme</h3>
              <p>Choose a welfare scheme from the list to configure it.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={cx("ws-head")}>
              <div className={cx("ws-htxt")}>
                <div className={cx("ws-htitle")}>
                  <h1>{sc.name}</h1>
                  <span className={cx(`ws-badge ws-t-${TYPE_KEY[sc.type]}`)}>{sc.type}</span>
                  {!sc.active && <span className={cx("ws-badge ws-t-off")}>Inactive</span>}
                </div>
                <p className={cx("ws-hsub")}>{sc.sponsor}</p>
              </div>
              <div className={cx("ws-hacts")}>
                <Toggle
                  on={sc.active}
                  onChange={() => patch((x) => ({ ...x, active: !x.active }))}
                  size="large"
                  color="softBlue"
                  className={cx("ws-tg")}
                  label="Scheme active"
                />
                <span className={cx("ws-hstate")}>{sc.active ? "Active" : "Inactive"}</span>
                <button type="button" className={cx("ws-ibtn")} onClick={() => setModal({ scheme: sc })} aria-label="Edit scheme"><Pencil size={14} /></button>
                <button type="button" className={cx("ws-ibtn ws-ibtn-del")} onClick={remove} aria-label="Delete scheme"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className={cx("ws-tabsbar")}>
              <nav className={cx("ws-tabs")}>
                {TABS.map(([t, Ico]) => (
                  <button type="button" key={t} className={cx(`ws-tab ${tab === t ? "ws-tab-on" : ""}`)} onClick={() => { setTab(t); setFormDraft(null); }}>
                    <Ico size={13} /> {t}
                  </button>
                ))}
              </nav>
            </div>

            <div className={cx("ws-body")}>
              {tab === "Overview" && renderOverview()}
              {tab === "Eligibility" && (
                <WelfareEligibilityTab key={sc.id} eligibility={sc.eligibility} onSave={(eligibility) => patch((x) => ({ ...x, eligibility }))} />
              )}
              {tab === "Coverage" && (
                <WelfareCoverageTab key={sc.id} coverage={sc.coverage} onSave={(coverage) => patch((x) => ({ ...x, coverage }))} />
              )}
              {tab === "Limits & Co-pay" && (
                <WelfareLimitsTab key={sc.id} limits={sc.limits} copay={sc.copay} onSave={(limits, copay) => patch((x) => ({ ...x, limits, copay }))} />
              )}
              {tab === "Ledger" && renderLedger()}
              {tab === "Welfare Forms" && renderForms()}
            </div>
          </>
        )}
      </main>

      {modal && <SchemeModal scheme={modal.scheme} onClose={() => setModal(null)} onSave={saveScheme} />}
      {depOpen && sc && <FundDepositModal onClose={() => setDepOpen(false)} onSave={addDeposit} />}
    </div>
  );
};

export default WelfareSchemes;