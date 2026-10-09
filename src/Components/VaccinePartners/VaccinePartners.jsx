import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Pencil, Plus, Search, Syringe, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SECTIONS, PARTNER_TYPES, TYPE_CLASS, PARTNERS, BLANK_PARTNER } from "./VaccinePartnersData.js";
import styles from "./VaccinePartners.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/vaccine-master-list", label: "Vaccine Master List" },
  { to: "/admin/vaccine-partners", label: "Vaccine Partners" },
];

const VaccinePartners = () => {
  const { pathname } = useLocation();
  const isPartners = pathname === "/admin/vaccine-partners";
  const sections = SECTIONS;
  const [partners, setPartners] = useState(PARTNERS);
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { id, step, name, type, contact, prices }
  const [search, setSearch] = useState("");

  const allVaccines = sections.flatMap((s) => s.vaccines);
  const vaccineById = (id) => allVaccines.find((v) => String(v.id) === String(id));

  const toggleExpanded = (id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleActive = (id) => setPartners((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id) => setPartners((p) => p.filter((x) => x.id !== id));
  const setCardPrice = (partnerId, vid, v) =>
    setPartners((p) => p.map((x) => x.id !== partnerId ? x : { ...x, prices: { ...x.prices, [vid]: v.replace(/[^\d]/g, "") } }));

  const openNew = () => { setModal({ id: null, step: 1, ...BLANK_PARTNER, prices: {} }); setSearch(""); };
  const openEdit = (pt) => { setModal({ id: pt.id, step: 1, name: pt.name, type: pt.type, contact: pt.contact, prices: { ...pt.prices } }); setSearch(""); };
  const close = () => setModal(null);
  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));

  const toggleVaccine = (id) => setModal((p) => {
    const prices = { ...p.prices };
    if (prices[id] !== undefined) delete prices[id];
    else prices[id] = "";
    return { ...p, prices };
  });
  const setPrice = (id, v) => setModal((p) => ({ ...p, prices: { ...p.prices, [id]: v.replace(/[^\d]/g, "") } }));

  const save = () => {
    const prices = Object.fromEntries(Object.entries(modal.prices).map(([k, v]) => [k, v === "" ? "" : Number(v)]));
    const data = { name: modal.name.trim(), type: modal.type, contact: modal.contact.trim(), prices };
    if (modal.id) setPartners((p) => p.map((x) => (x.id === modal.id ? { ...x, ...data } : x)));
    else setPartners((p) => [...p, { id: Date.now(), active: true, ...data }]);
    close();
  };

  const q = search.trim().toLowerCase();
  const shown = allVaccines.filter((v) => !q || v.name.toLowerCase().includes(q) || v.route.toLowerCase().includes(q));
  const selectedCount = modal ? Object.keys(modal.prices).length : 0;

  const total = sections.reduce((n, s) => n + s.vaccines.length, 0);

  return (
    <div className={cx("vp-wrap")}>
      <div className={cx("vp-head")}>
        <div>
          <h1 className={cx("vp-title")}><Syringe size={16} /> Vaccine Catalog</h1>
          <p className={cx("vp-sub")}>
            {total} vaccines across {sections.length} sections · {partners.length} partners
          </p>
        </div>
        <div className={cx("vp-tabs")}>
          {TABS.map((t) => {
            const on = isPartners ? t.to === "/admin/vaccine-partners" : t.to === "/admin/vaccine-master-list";
            return (
              <Link key={t.to} to={t.to} className={cx(`vp-tab ${on ? "vp-tab-on" : ""}`)}>{t.label}</Link>
            );
          })}
        </div>
      </div>

      <>
        <div className={cx("vp-newrow")}>
          <button type="button" className={cx("vp-btn")} onClick={openNew}><Plus size={14} /> New Partner</button>
        </div>

        <div className={cx("vp-plist")}>
          {partners.map((pt) => {
            const ids = Object.keys(pt.prices).filter((id) => vaccineById(id));
            const priced = ids.filter((id) => pt.prices[id] !== "").length;
            const isOpen = expanded.has(pt.id);
            return (
              <div className={cx("vp-pcard")} key={pt.id}>
                <div className={cx("vp-pchead")}>
                  <span className={cx("vp-picon")}><Syringe size={14} /></span>
                  <div className={cx("vp-pinfo")}>
                    <p className={cx("vp-ptname")}>{pt.name}</p>
                    <p className={cx("vp-ptsub")}>
                      {pt.type} · {pt.contact || "No contact"} · {ids.length} vaccines · {priced} priced
                    </p>
                  </div>
                  <span className={cx(`vp-ptype ${TYPE_CLASS[pt.type]}`)}>{pt.type}</span>
                  <Toggle size="large" color="softBlue" className={cx("vp-tg")} on={pt.active} onChange={() => toggleActive(pt.id)} label={`${pt.name} status`} />
                  <button type="button" className={cx("vp-ico")} onClick={() => openEdit(pt)} aria-label={`Edit ${pt.name}`}><Pencil size={14} /></button>
                  <button type="button" className={cx("vp-ico vp-del")} onClick={() => remove(pt.id)} aria-label={`Delete ${pt.name}`}><Trash2 size={14} /></button>
                  <button type="button" className={cx("vp-ico")} onClick={() => toggleExpanded(pt.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                </div>

                {isOpen && (
                  <div className={cx("vp-pbody")}>
                    {ids.length === 0 ? (
                      <p className={cx("vp-pempty")}>No vaccines selected — click edit to add vaccines</p>
                    ) : (
                      allVaccines.filter((v) => pt.prices[v.id] !== undefined).map((v) => (
                        <div className={cx("vp-prow")} key={v.id}>
                          <div>
                            <p className={cx("vp-prname")}>{v.name}</p>
                            <p className={cx("vp-prroute")}>{v.route}</p>
                          </div>
                          <div className={cx("vp-price")}>
                            <span>Rs.</span>
                            <input value={pt.prices[v.id]} onChange={(e) => setCardPrice(pt.id, v.id, e.target.value)} aria-label={`${v.name} price`} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {modal && (
          <div className={cx("vp-overlay")} onClick={close}>
            <div className={cx("vp-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <button type="button" className={cx("vp-mclose")} onClick={close} aria-label="Close"><X size={15} /></button>
              <h2 className={cx("vp-mtitle")}>
                {modal.id ? "Edit Partner" : "New Vaccine Partner"} — Step {modal.step} of 2
              </h2>

              {modal.step === 1 ? (
                <>
                  <label className={cx("vp-mlabel")}>Partner Name *</label>
                  <input className={cx("vp-minput")} placeholder="e.g. City Vaccination Centre" value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />

                  <label className={cx("vp-mlabel vp-mt")}>Type</label>
                  <div className={cx("vp-mtypes")}>
                    {PARTNER_TYPES.map((t) => (
                      <button type="button" key={t} className={cx(`vp-mtype ${modal.type === t ? "vp-mtype-on" : ""}`)} onClick={() => setField({ type: t })}>{t}</button>
                    ))}
                  </div>

                  <label className={cx("vp-mlabel vp-mt")}>Contact</label>
                  <input className={cx("vp-minput")} placeholder="Phone / email" value={modal.contact} onChange={(e) => setField({ contact: e.target.value })} />

                  <div className={cx("vp-mfoot")}>
                    <span className={cx("vp-mspacer")} />
                    <button type="button" className={cx("vp-mcancel")} onClick={close}>Cancel</button>
                    <button type="button" className={cx("vp-mnext")} disabled={!modal.name.trim()} onClick={() => setField({ step: 2 })}>Next: Select Vaccines →</button>
                  </div>
                </>
              ) : (
                <>
                  <div className={cx("vp-msearch")}>
                    <Search size={14} />
                    <input placeholder="Search vaccines..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>

                  <div className={cx("vp-mlist")}>
                    {shown.map((v) => {
                      const checked = modal.prices[v.id] !== undefined;
                      return (
                        <div className={cx("vp-mrow")} key={v.id}>
                          <label className={cx("vp-mcheck")}>
                            <input type="checkbox" checked={checked} onChange={() => toggleVaccine(v.id)} />
                            <div>
                              <p className={cx("vp-mvname")}>{v.name}</p>
                              <p className={cx("vp-mvsub")}>{[v.route, v.schedule].filter(Boolean).join(" · ")}</p>
                            </div>
                          </label>
                          {checked && (
                            <div className={cx("vp-price")}>
                              <span>Rs.</span>
                              <input value={modal.prices[v.id]} onChange={(e) => setPrice(v.id, e.target.value)} aria-label={`${v.name} price`} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {shown.length === 0 && <p className={cx("vp-pempty")}>No vaccines match your search.</p>}
                  </div>

                  <div className={cx("vp-mfoot")}>
                    <span className={cx("vp-mselected")}>{selectedCount} selected</span>
                    <span className={cx("vp-mspacer")} />
                    <button type="button" className={cx("vp-mcancel vp-mback")} onClick={() => setField({ step: 1 })}>← Back</button>
                    <button type="button" className={cx("vp-mnext vp-msave")} onClick={save}>{modal.id ? "Save Changes" : "Create Partner"}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default VaccinePartners;