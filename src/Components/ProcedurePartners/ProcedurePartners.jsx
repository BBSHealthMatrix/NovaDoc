import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Save, Stethoscope, Trash2, Upload, X } from "lucide-react";
import Toggle from "../Toggle/Toggle.jsx";
import { SECTIONS, PARTNER_TYPES, PARTNERS, BLANK_PARTNER } from "./ProcedurePartnersData.js";
import styles from "./ProcedurePartners.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/procedure-master-list", label: "Procedure Master List" },
  { to: "/admin/procedure-partners", label: "Procedure Partners" },
];

const ALL_PROCEDURES = SECTIONS.flatMap((s) => s.procedures.map((pr) => ({ ...pr, section: s.name })));

const ProcedurePartners = () => {
  const { pathname } = useLocation();
  const [partners, setPartners] = useState(PARTNERS);
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { id, step, name, type, contact, prices }

  const toggleExpanded = (id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleActive = (id) => setPartners((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id) => setPartners((p) => p.filter((x) => x.id !== id));
  const setCardPrice = (partnerId, procId, v) =>
    setPartners((p) => p.map((x) => x.id !== partnerId ? x : { ...x, prices: { ...x.prices, [procId]: v.replace(/[^\d]/g, "") } }));

  const openNew = () => setModal({ id: null, step: 1, ...BLANK_PARTNER, prices: {} });
  const openEdit = (pt) => setModal({ id: pt.id, step: 1, name: pt.name, type: pt.type, contact: pt.contact, prices: { ...pt.prices } });
  const close = () => setModal(null);

  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));
  const toggleProc = (id) => setModal((p) => {
    const prices = { ...p.prices };
    if (prices[id] !== undefined) delete prices[id];
    else prices[id] = "";
    return { ...p, prices };
  });
  const setPrice = (id, v) => setModal((p) => ({ ...p, prices: { ...p.prices, [id]: v.replace(/[^\d]/g, "") } }));
  const selectAll = () => setModal((p) => ({ ...p, prices: Object.fromEntries(ALL_PROCEDURES.map((pr) => [pr.id, p.prices[pr.id] ?? ""])) }));
  const clearAll = () => setModal((p) => ({ ...p, prices: {} }));

  const canNext = modal && modal.name.trim() && (modal.type === "Internal Clinic" || modal.contact.trim());
  const selectedCount = modal ? Object.keys(modal.prices).length : 0;

  const save = () => {
    const prices = Object.fromEntries(Object.entries(modal.prices).map(([k, v]) => [k, Number(v) || 0]));
    const data = { name: modal.name.trim(), type: modal.type, contact: modal.contact.trim(), prices };
    if (modal.id) setPartners((p) => p.map((x) => (x.id === modal.id ? { ...x, ...data } : x)));
    else setPartners((p) => [...p, { id: Date.now(), active: true, ...data }]);
    close();
  };

  let sectionCursor = "";

  return (
    <div className={cx("pp-wrap")}>
      <div className={cx("pp-tabs")}>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className={cx(`pp-tab ${pathname === t.to ? "pp-tab-on" : ""}`)}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className={cx("pp-page")}>
        <h1 className={cx("pp-title")}>Procedure Partners</h1>
        <p className={cx("pp-desc")}>Add partners, assign procedures, and configure pricing.</p>

        <div className={cx("pp-newrow")}>
          <button type="button" className={cx("pp-newpartner")} onClick={openNew}><Plus size={14} /> New Partner</button>
        </div>

        <div className={cx("pp-partnerlist")}>
          {partners.map((pt) => {
            const procIds = Object.keys(pt.prices);
            const isOpen = expanded.has(pt.id);
            const isInternal = pt.type === "Internal Clinic";
            return (
              <div className={cx("pp-pcard")} key={pt.id}>
                <div className={cx("pp-pchead")}>
                  <span className={cx("pp-picon")}><Stethoscope size={14} /></span>
                  <div className={cx("pp-pinfo")}>
                    <p className={cx("pp-ptname")}>
                      {pt.name}
                      <span className={cx(`pp-ptype ${isInternal ? "pp-ptype-int" : "pp-ptype-ext"}`)}>{pt.type}</span>
                    </p>
                    <p className={cx("pp-ptsub")}>{pt.contact || "No contact"} · {procIds.length} procedures</p>
                  </div>
                  <Toggle size="large" color="softBlue" className={cx("pp-tg")} on={pt.active} onChange={() => toggleActive(pt.id)} label={`${pt.name} status`} />
                  <button type="button" onClick={() => openEdit(pt)} aria-label={`Edit ${pt.name}`}><Pencil size={13} /></button>
                  <button type="button" className={cx("pp-pdel")} onClick={() => remove(pt.id)} aria-label={`Delete ${pt.name}`}><Trash2 size={13} /></button>
                  <button type="button" className={cx("pp-pchev")} onClick={() => toggleExpanded(pt.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                </div>

                {isOpen && (
                  <div className={cx("pp-pricing")}>
                    <div className={cx("pp-prbar")}>
                      <span>Procedure Pricing</span>
                      <button type="button" className={cx("pp-import")}><Upload size={11} /> Import Pricing</button>
                    </div>
                    <div className={cx("pp-prthead")}>
                      <span>Procedure</span>
                      <span>Price (PKR)</span>
                    </div>
                    <div className={cx("pp-prtbody")}>
                      {ALL_PROCEDURES.filter((pr) => pt.prices[pr.id] !== undefined).map((pr) => (
                        <div className={cx("pp-prrow")} key={pr.id}>
                          <span>{pr.name}</span>
                          <input value={pt.prices[pr.id]} onChange={(e) => setCardPrice(pt.id, pr.id, e.target.value)} aria-label={`${pr.name} price`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {modal && (
          <div className={cx("pp-overlay")} onClick={close}>
            <div className={cx("pp-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <button type="button" className={cx("pp-mclose")} onClick={close} aria-label="Close"><X size={13} /></button>
              <div className={cx("pp-mhead")}>
                <h2 className={cx("pp-mtitle")}>{modal.id ? "Edit Partner" : "New Procedure Partner"}</h2>
                <span className={cx("pp-mstep")}>Step {modal.step} of 2</span>
              </div>

              <div className={cx("pp-mstepper")}>
                <div className={cx("pp-msi")}>
                  <span className={cx("pp-msn pp-msn-on")}>1</span>
                  <span className={cx(`pp-msl ${modal.step === 1 ? "pp-msl-on" : ""}`)}>Partner Details</span>
                </div>
                <i className={cx("pp-msline")} />
                <div className={cx("pp-msi")}>
                  <span className={cx(`pp-msn ${modal.step === 2 ? "pp-msn-on" : ""}`)}>2</span>
                  <span className={cx(`pp-msl ${modal.step === 2 ? "pp-msl-on" : ""}`)}>Procedure Selection &amp; Pricing</span>
                </div>
              </div>

              {modal.step === 1 ? (
                <div className={cx("pp-mbody")}>
                  <div className={cx("pp-mgrid")}>
                    <div>
                      <label className={cx("pp-mlabel")}>Partner Name <b>*</b></label>
                      <input className={cx("pp-minput")} value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />
                    </div>
                    <div>
                      <label className={cx("pp-mlabel")}>Type</label>
                      <select className={cx("pp-msel")} value={modal.type} onChange={(e) => setField({ type: e.target.value })}>
                        {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <label className={cx("pp-mlabel pp-mt")}>Contact Info <em>(required for external)</em></label>
                  <input className={cx("pp-minput")} value={modal.contact} onChange={(e) => setField({ contact: e.target.value })} />
                </div>
              ) : (
                <div className={cx("pp-mbody pp-mbody-procs")}>
                  <div className={cx("pp-mselhead")}>
                    <span>{selectedCount} of {ALL_PROCEDURES.length} procedures selected</span>
                    <span className={cx("pp-mselactions")}>
                      <button type="button" onClick={selectAll}>Select All</button>
                      <button type="button" className={cx("pp-mclear")} onClick={clearAll}>Clear</button>
                    </span>
                  </div>
                  <div className={cx("pp-mlist")}>
                    {ALL_PROCEDURES.map((pr) => {
                      const showHeader = pr.section !== sectionCursor;
                      sectionCursor = pr.section;
                      const checked = modal.prices[pr.id] !== undefined;
                      return (
                        <Fragment key={pr.id}>
                          {showHeader && <p className={cx("pp-mshead")}>{pr.section}</p>}
                          <div className={cx("pp-mrow")}>
                            <label className={cx("pp-mcheck")}>
                              <input type="checkbox" checked={checked} onChange={() => toggleProc(pr.id)} />
                              <span>{pr.name}</span>
                            </label>
                            <span className={cx("pp-mcode")}>{pr.cpt}</span>
                            {checked && (
                              <div className={cx("pp-mprice")}>
                                <span>PKR</span>
                                <input value={modal.prices[pr.id]} onChange={(e) => setPrice(pr.id, e.target.value)} aria-label={`${pr.name} price`} />
                              </div>
                            )}
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={cx("pp-mfoot")}>
                {modal.step === 2 && <button type="button" className={cx("pp-mback")} onClick={() => setField({ step: 1 })}>← Back</button>}
                <span className={cx("pp-mspacer")} />
                <button type="button" className={cx("pp-mcancel")} onClick={close}>Cancel</button>
                {modal.step === 1 ? (
                  <button type="button" className={cx("pp-mnext")} disabled={!canNext} onClick={() => setField({ step: 2 })}>Next →</button>
                ) : (
                  <button type="button" className={cx("pp-mnext")} onClick={save}><Save size={13} /> Save Partner</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcedurePartners;