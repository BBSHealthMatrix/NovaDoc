import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Check, ChevronRight, FlaskConical, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SECTIONS, PROVIDERS, BLANK_PROVIDER } from "./LabProvidersData.js";
import styles from "./LabProviders.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/lab-test-master-list", label: "Lab Test Master List" },
  { to: "/admin/lab-providers", label: "Lab Providers" },
];

const ALL_TESTS = SECTIONS.flatMap((s) => s.tests.map((t) => ({ ...t, section: s.name })));

const LabProviders = () => {
  const { pathname } = useLocation();
  const [providers, setProviders] = useState(PROVIDERS);
  const [modal, setModal] = useState(null); // { id, step, name, contact, prices }

  const counts = (prices) => {
    const ids = Object.keys(prices).filter((k) => prices[k] !== undefined && prices[k] !== "");
    return { tests: ids.length, priced: ids.filter((k) => Number(prices[k]) > 0).length };
  };

  const toggleActive = (id) => setProviders((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id) => setProviders((p) => p.filter((x) => x.id !== id));

  const openNew = () => setModal({ id: null, step: 1, ...BLANK_PROVIDER, prices: {} });
  const openEdit = (prov) => setModal({ id: prov.id, step: 1, name: prov.name, contact: prov.contact, prices: { ...prov.prices } });
  const close = () => setModal(null);

  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));
  const toggleTest = (id) => setModal((p) => {
    const prices = { ...p.prices };
    if (prices[id] !== undefined) delete prices[id];
    else prices[id] = "";
    return { ...p, prices };
  });
  const setPrice = (id, v) => setModal((p) => ({ ...p, prices: { ...p.prices, [id]: v.replace(/[^\d]/g, "") } }));
  const selectAll = () => setModal((p) => ({ ...p, prices: Object.fromEntries(ALL_TESTS.map((t) => [t.id, p.prices[t.id] ?? ""])) }));
  const clearAll = () => setModal((p) => ({ ...p, prices: {} }));

  const selectedCount = modal ? Object.keys(modal.prices).length : 0;

  const save = () => {
    const prices = Object.fromEntries(Object.entries(modal.prices).map(([k, v]) => [k, Number(v) || 0]));
    if (modal.id) {
      setProviders((p) => p.map((x) => (x.id === modal.id ? { ...x, name: modal.name, contact: modal.contact, prices } : x)));
    } else {
      setProviders((p) => [...p, { id: Date.now(), name: modal.name, contact: modal.contact, active: true, prices }]);
    }
    close();
  };

  let sectionCursor = "";

  return (
    <div className={cx("lp-wrap")}>
      <div className={cx("lp-tabs")}>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className={cx(`lp-tab ${pathname === t.to ? "lp-tab-on" : ""}`)}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className={cx("lp-page")}>
        <div className={cx("lp-phead")}>
          <div>
            <h1 className={cx("lp-title")}>Lab Providers</h1>
            <p className={cx("lp-desc")}>Add providers, select their tests, and set per-test pricing.</p>
          </div>
          <button type="button" className={cx("lp-newprov")} onClick={openNew}><Plus size={14} /> New Provider</button>
        </div>

        <div className={cx("lp-provlist")}>
          {providers.map((p) => {
            const c = counts(p.prices);
            return (
              <div className={cx("lp-provcard")} key={p.id}>
                <span className={cx("lp-picon")}><FlaskConical size={15} /></span>
                <div className={cx("lp-pinfo")}>
                  <p className={cx("lp-pname")}>{p.name}</p>
                  <p className={cx("lp-psub")}>{p.contact} · {c.tests} tests · {c.priced} priced</p>
                </div>
                <Toggle size="medium" color="softBlue" className={cx("lp-tg")} on={p.active} onChange={() => toggleActive(p.id)} label={`${p.name} status`} />
                <button type="button" onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`}><Pencil size={13} /></button>
                <button type="button" onClick={() => remove(p.id)} aria-label={`Delete ${p.name}`}><Trash2 size={13} /></button>
                <ChevronRight size={15} className={cx("lp-pchev")} />
              </div>
            );
          })}
        </div>

        {modal && (
          <div className={cx("lp-overlay")} onClick={close}>
            <div className={cx("lp-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <div className={cx("lp-mhead")}>
                <h2 className={cx("lp-mtitle")}>{modal.id ? "Edit Provider" : "New Lab Provider"}</h2>
                <div className={cx("lp-mright")}>
                  <span className={cx("lp-mstep")}>Step {modal.step} of 2</span>
                  <button type="button" className={cx("lp-mclose")} onClick={close} aria-label="Close"><X size={14} /></button>
                </div>
              </div>

              <div className={cx("lp-mstepper")}>
                <div className={cx("lp-msi")}>
                  <span className={cx(`lp-msn ${modal.step >= 1 ? "lp-msn-on" : ""}`)}>1</span>
                  <span className={cx(`lp-msl ${modal.step === 1 ? "lp-msl-active" : "lp-msl-done"}`)}>Provider Details</span>
                </div>
                <i className={cx(`lp-msline ${modal.step >= 2 ? "lp-msline-on" : ""}`)} />
                <div className={cx("lp-msi")}>
                  <span className={cx(`lp-msn ${modal.step >= 2 ? "lp-msn-on" : ""}`)}>2</span>
                  <span className={cx(`lp-msl ${modal.step === 2 ? "lp-msl-active" : ""}`)}>Test Selection &amp; Pricing</span>
                </div>
              </div>

              {modal.step === 1 ? (
                <div className={cx("lp-mbody")}>
                  <label className={cx("lp-mlabel")}>Provider Name <b>*</b></label>
                  <input className={cx("lp-minput")} placeholder="e.g. Hashmani Laboratories" value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />
                  <label className={cx("lp-mlabel lp-mt")}>Contact Info</label>
                  <input className={cx("lp-minput")} placeholder="Phone / email" value={modal.contact} onChange={(e) => setField({ contact: e.target.value })} />
                </div>
              ) : (
                <div className={cx("lp-mbody lp-mbody-tests")}>
                  <div className={cx("lp-mselhead")}>
                    <span>{selectedCount} of {ALL_TESTS.length} tests selected</span>
                    <span className={cx("lp-mselactions")}>
                      <button type="button" onClick={selectAll}>Select All</button>
                      <button type="button" onClick={clearAll}>Clear</button>
                    </span>
                  </div>
                  <div className={cx("lp-mtestlist")}>
                    {ALL_TESTS.map((t) => {
                      const showHeader = t.section !== sectionCursor;
                      sectionCursor = t.section;
                      const checked = modal.prices[t.id] !== undefined;
                      return (
                        <div key={t.id}>
                          {showHeader && <p className={cx("lp-mshead")}>{t.section.toUpperCase()}</p>}
                          <div className={cx("lp-mtrow")}>
                            <label className={cx("lp-mcheck")}>
                              <input type="checkbox" checked={checked} onChange={() => toggleTest(t.id)} />
                              <span className={cx("lp-mbox")}>{checked && <Check size={10} />}</span>
                              <span>{t.name}</span>
                            </label>
                            {checked && (
                              <div className={cx("lp-mprice")}>
                                <span>PKR</span>
                                <input value={modal.prices[t.id]} onChange={(e) => setPrice(t.id, e.target.value)} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={cx("lp-mfoot")}>
                {modal.step === 2 && <button type="button" className={cx("lp-mback")} onClick={() => setField({ step: 1 })}>← Back</button>}
                <span className={cx("lp-mspacer")} />
                <button type="button" className={cx("lp-mcancel")} onClick={close}>Cancel</button>
                {modal.step === 1 ? (
                  <button type="button" className={cx("lp-mnext")} disabled={!modal.name.trim()} onClick={() => setField({ step: 2 })}>Next →</button>
                ) : (
                  <button type="button" className={cx("lp-mnext")} onClick={save}><Save size={12} /> Save Provider</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabProviders;