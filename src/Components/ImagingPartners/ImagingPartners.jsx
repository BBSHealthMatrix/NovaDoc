import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { Building2, ChevronDown, ChevronRight, FileText, Layers, Pencil, Plus, Save, ScanLine, Search, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { MODALITIES, PARTNER_TYPES, PARTNERS, BLANK_PARTNER } from "./ImagingPartnersData.js";
import styles from "./ImagingPartners.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/imaging-test-list", label: "Catalog", icon: Layers },
  { to: "/admin/reason-templates", label: "Reason Templates", icon: FileText },
  { to: "/admin/imaging-partners", label: "Imaging Partners", icon: Building2 },
];

const ALL_PROTOCOLS = MODALITIES.flatMap((m) => m.parts.flatMap((b) => b.protocols.map((p) => ({ ...p, part: b.name, modality: m.name }))));
const protoIds = (list) => list.map((p) => p.id);

const ImagingPartners = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname)?.to ?? TABS[0].to;
  const [partners, setPartners] = useState(PARTNERS);
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { id, step, name, type, contact, prices }
  const [search, setSearch] = useState("");
  const [closed, setClosed] = useState(() => new Set());

  const toggleSet = (setter) => (id) => setter((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleExpanded = toggleSet(setExpanded);
  const toggleClosed = toggleSet(setClosed);

  const toggleActive = (id) => setPartners((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id) => setPartners((p) => p.filter((x) => x.id !== id));
  const setCardPrice = (partnerId, protoId, v) =>
    setPartners((p) => p.map((x) => x.id !== partnerId ? x : { ...x, prices: { ...x.prices, [protoId]: v.replace(/[^\d]/g, "") } }));

  const open = (data) => { setModal(data); setSearch(""); setClosed(new Set()); };
  const openNew = () => open({ id: null, step: 1, ...BLANK_PARTNER, prices: {} });
  const openEdit = (pt) => open({ id: pt.id, step: 1, name: pt.name, type: pt.type, contact: pt.contact, prices: { ...pt.prices } });
  const close = () => setModal(null);
  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));

  const toggleProto = (id) => setModal((p) => {
    const prices = { ...p.prices };
    if (prices[id] !== undefined) delete prices[id];
    else prices[id] = "";
    return { ...p, prices };
  });
  const selectIds = (ids) => setModal((p) => {
    const allOn = ids.every((id) => p.prices[id] !== undefined);
    const prices = { ...p.prices };
    ids.forEach((id) => { if (allOn) delete prices[id]; else prices[id] = prices[id] ?? ""; });
    return { ...p, prices };
  });
  const setPrice = (id, v) => setModal((p) => ({ ...p, prices: { ...p.prices, [id]: v.replace(/[^\d]/g, "") } }));
  const selectAll = () => setModal((p) => ({ ...p, prices: Object.fromEntries(ALL_PROTOCOLS.map((x) => [x.id, p.prices[x.id] ?? ""])) }));
  const clearAll = () => setModal((p) => ({ ...p, prices: {} }));

  const q = search.trim().toLowerCase();
  const tree = useMemo(() => MODALITIES.map((m) => ({
    ...m,
    parts: m.parts.map((b) => ({
      ...b,
      shown: b.protocols.filter((p) => !q || p.name.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)),
    })).filter((b) => b.shown.length),
  })).filter((m) => m.parts.length), [q]);

  const selectedCount = modal ? Object.keys(modal.prices).length : 0;
  const countOn = (ids) => ids.filter((id) => modal.prices[id] !== undefined).length;

  const save = () => {
    const prices = Object.fromEntries(Object.entries(modal.prices).map(([k, v]) => [k, Number(v) || 0]));
    const data = { name: modal.name.trim(), type: modal.type, contact: modal.contact.trim(), prices };
    if (modal.id) setPartners((p) => p.map((x) => (x.id === modal.id ? { ...x, ...data } : x)));
    else setPartners((p) => [...p, { id: Date.now(), active: true, ...data }]);
    close();
  };

  return (
    <div className={cx("ip-wrap")}>
      <div className={cx("ip-header")}>
        <div className={cx("ip-hrow")}>
          <span className={cx("ip-hicon")}><ScanLine size={15} /></span>
          <div>
            <h1 className={cx("ip-title")}>Imaging Catalog</h1>
            <p className={cx("ip-desc")}>Manage the imaging catalog, reason templates, and radiology partners</p>
          </div>
        </div>
        <div className={cx("ip-tabs")}>
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className={cx(`ip-tab ${active === t.to ? "ip-tab-on" : ""}`)}>
                <Icon size={12} /> {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <>
        <div className={cx("ip-bar")}>
          <p className={cx("ip-bartext")}>Manage radiology centers and their per-protocol pricing.</p>
          <button type="button" className={cx("ip-btn")} onClick={openNew}><Plus size={14} /> New Partner</button>
        </div>

        <div className={cx("ip-scroll")}>
          <div className={cx("ip-plist")}>
            {partners.map((pt) => {
              const ids = Object.keys(pt.prices);
              const isOpen = expanded.has(pt.id);
              const isInternal = pt.type === "Internal Radiology";
              return (
                <div className={cx("ip-pcard")} key={pt.id}>
                  <div className={cx("ip-pchead")}>
                    <span className={cx("ip-picon")}><ScanLine size={14} /></span>
                    <div className={cx("ip-pinfo")}>
                      <p className={cx("ip-ptname")}>
                        {pt.name}
                        <span className={cx(`ip-ptype ${isInternal ? "ip-ptype-int" : "ip-ptype-ext"}`)}>{pt.type}</span>
                      </p>
                      <p className={cx("ip-ptsub")}>{pt.contact || "No contact"} · {ids.length} protocols</p>
                    </div>
                    <Toggle size="large" color="softBlue" className={cx("ip-tg")} on={pt.active} onChange={() => toggleActive(pt.id)} label={`${pt.name} status`} />
                    <button type="button" className={cx("ip-ico")} onClick={() => openEdit(pt)} aria-label={`Edit ${pt.name}`}><Pencil size={14} /></button>
                    <button type="button" className={cx("ip-ico ip-ico-del")} onClick={() => remove(pt.id)} aria-label={`Delete ${pt.name}`}><Trash2 size={14} /></button>
                    <button type="button" className={cx("ip-ico")} onClick={() => toggleExpanded(pt.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                      {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>
                  </div>

                  {isOpen && (
                    <div className={cx("ip-pricing")}>
                      <div className={cx("ip-prbar")}>Protocol Pricing</div>
                      {ids.length === 0 ? (
                        <p className={cx("ip-prempty")}>No protocols selected — click edit to add protocols</p>
                      ) : (
                        <>
                          <div className={cx("ip-prthead")}><span>Protocol</span><span>Price (PKR)</span></div>
                          <div className={cx("ip-prtbody")}>
                            {ALL_PROTOCOLS.filter((x) => pt.prices[x.id] !== undefined).map((x) => (
                              <div className={cx("ip-prrow")} key={x.id}>
                                <span>{x.modality} · {x.part} — {x.name}</span>
                                <input value={pt.prices[x.id]} onChange={(e) => setCardPrice(pt.id, x.id, e.target.value)} aria-label={`${x.name} price`} />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {modal && (
          <div className={cx("ip-overlay")} onClick={close}>
            <div className={cx("ip-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <button type="button" className={cx("ip-mclose")} onClick={close} aria-label="Close"><X size={14} /></button>
              <div className={cx("ip-mhead")}>
                <h2 className={cx("ip-mtitle")}>{modal.id ? "Edit Imaging Partner" : "New Imaging Partner"}</h2>
                <span className={cx("ip-mstep")}>Step {modal.step} of 2</span>
              </div>

              <div className={cx("ip-mstepper")}>
                <div className={cx("ip-msi")}>
                  <span className={cx("ip-msn ip-msn-on")}>1</span>
                  <span className={cx(`ip-msl ${modal.step === 1 ? "ip-msl-on" : ""}`)}>Partner Details</span>
                </div>
                <i className={cx("ip-msline")} />
                <div className={cx("ip-msi")}>
                  <span className={cx(`ip-msn ${modal.step === 2 ? "ip-msn-on" : ""}`)}>2</span>
                  <span className={cx(`ip-msl ${modal.step === 2 ? "ip-msl-on" : ""}`)}>Protocol Selection &amp; Pricing</span>
                </div>
              </div>

              {modal.step === 1 ? (
                <div className={cx("ip-mbody")}>
                  <div className={cx("ip-mgrid")}>
                    <div>
                      <label className={cx("ip-mlabel")}>Partner Name <b>*</b></label>
                      <input className={cx("ip-minput")} placeholder="e.g. City Diagnostics Centre" value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />
                    </div>
                    <div>
                      <label className={cx("ip-mlabel")}>Type</label>
                      <select className={cx("ip-msel")} value={modal.type} onChange={(e) => setField({ type: e.target.value })}>
                        {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <label className={cx("ip-mlabel ip-mt")}>Contact Info</label>
                  <input className={cx("ip-minput")} placeholder="Phone / email / contract ref" value={modal.contact} onChange={(e) => setField({ contact: e.target.value })} />
                </div>
              ) : (
                <div className={cx("ip-mbody ip-mbody-tree")}>
                  <div className={cx("ip-mselhead")}>
                    <div className={cx("ip-msearch")}>
                      <Search size={14} />
                      <input placeholder="Search protocols..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <span className={cx("ip-mcount")}>{selectedCount} of {ALL_PROTOCOLS.length}</span>
                    <button type="button" className={cx("ip-mlink")} onClick={selectAll}>Select All</button>
                    <button type="button" className={cx("ip-mlink ip-mlink-gray")} onClick={clearAll}>Clear</button>
                  </div>

                  <div className={cx("ip-tree")}>
                    {tree.map((m) => {
                      const mIds = m.parts.flatMap((b) => protoIds(b.shown));
                      const mOpen = !closed.has(m.id);
                      return (
                        <div key={m.id}>
                          <div className={cx("ip-tmod")}>
                            <button type="button" className={cx("ip-chev ip-chev-sm")} onClick={() => toggleClosed(m.id)} aria-label={mOpen ? "Collapse" : "Expand"}>
                              <ChevronDown size={12} className={cx(mOpen ? "" : "ip-chev-closed")} />
                            </button>
                            <i className={cx("ip-dot ip-dot-sm")} style={{ background: m.color }} />
                            <span className={cx("ip-tmname")}>{m.name}</span>
                            <span className={cx("ip-tcount")}>{countOn(mIds)}/{mIds.length}</span>
                            <button type="button" className={cx("ip-tall")} onClick={() => selectIds(mIds)}>All</button>
                          </div>
                          {mOpen && m.parts.map((b) => {
                            const bIds = protoIds(b.shown);
                            const bOpen = !closed.has(b.id);
                            return (
                              <div key={b.id}>
                                <div className={cx("ip-tpart")}>
                                  <button type="button" className={cx("ip-chev ip-chev-sm")} onClick={() => toggleClosed(b.id)} aria-label={bOpen ? "Collapse" : "Expand"}>
                                    <ChevronDown size={11} className={cx(bOpen ? "" : "ip-chev-closed")} />
                                  </button>
                                  <span className={cx("ip-tpname")}>{b.name}</span>
                                  <span className={cx("ip-tcount")}>{countOn(bIds)}/{bIds.length}</span>
                                  <button type="button" className={cx("ip-tall")} onClick={() => selectIds(bIds)}>All</button>
                                </div>
                                {bOpen && b.shown.map((p) => {
                                  const checked = modal.prices[p.id] !== undefined;
                                  return (
                                    <div className={cx("ip-tproto")} key={p.id}>
                                      <label>
                                        <input type="checkbox" checked={checked} onChange={() => toggleProto(p.id)} />
                                        <span>{p.name}</span>
                                      </label>
                                      {checked && (
                                        <div className={cx("ip-tprice")}>
                                          <span>PKR</span>
                                          <input value={modal.prices[p.id]} onChange={(e) => setPrice(p.id, e.target.value)} aria-label={`${p.name} price`} />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {tree.length === 0 && <p className={cx("ip-tnone")}>No protocols match your search.</p>}
                  </div>
                </div>
              )}

              <div className={cx("ip-mfoot")}>
                {modal.step === 2 && <button type="button" className={cx("ip-mback")} onClick={() => setField({ step: 1 })}>← Back</button>}
                <span className={cx("ip-mspacer")} />
                <button type="button" className={cx("ip-mcancel")} onClick={close}>Cancel</button>
                {modal.step === 1 ? (
                  <button type="button" className={cx("ip-mnext")} disabled={!modal.name.trim()} onClick={() => setField({ step: 2 })}>Next →</button>
                ) : (
                  <button type="button" className={cx("ip-mnext")} onClick={save}><Save size={13} /> Save Partner</button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default ImagingPartners;