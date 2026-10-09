import { createClassNames } from "../../utils/classNames.js";
import { useMemo, useState } from "react";
import { ChevronRight, CircleCheck, Copy, FileText, Layers, Pencil, Plus, ScanLine, Search, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { CATALOGUE, labelOf, CATEGORIES, CATEGORY_COLOR, ORDER_SETS, BLANK_ORDER_SET } from "./ImagingOrderSetsData.js";
import styles from "./ImagingOrderSets.module.css";

const cx = createClassNames(styles);

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

const ImagingOrderSets = () => {
  const [sets, setSets] = useState(ORDER_SETS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null); // { id, name, category, desc, items } or null
  const [catSearch, setCatSearch] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());

  const toggleExpanded = (id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const usedCategories = useMemo(() => [...new Set(sets.map((s) => s.category))], [sets]);

  const filtered = sets.filter((s) => {
    if (filter !== "All" && s.category !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleActive = (id) => setSets((p) => p.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  const remove = (id) => setSets((p) => p.filter((s) => s.id !== id));
  const duplicate = (s) => setSets((p) => [...p, { ...s, id: Date.now(), name: `${s.name} (Copy)`, active: false, created: new Date().toISOString().slice(0, 10) }]);

  const exportCsv = () => {
    const rows = [["Name", "Category", "Description", "Active", "Created", "Imaging"]];
    sets.forEach((s) => rows.push([s.name, s.category, s.desc, s.active ? "Yes" : "No", s.created, s.items.map(labelOf).join("; ")]));
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "imaging-order-sets.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openNew = () => { setModal({ id: null, ...BLANK_ORDER_SET, items: [] }); setCatSearch(""); };
  const openEdit = (s) => { setModal({ id: s.id, name: s.name, category: s.category, desc: s.desc, items: [...s.items] }); setCatSearch(""); };
  const closeModal = () => setModal(null);

  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));
  const toggleItem = (key) => setModal((p) => ({ ...p, items: p.items.includes(key) ? p.items.filter((x) => x !== key) : [...p.items, key] }));

  const save = () => {
    const name = modal.name.trim();
    if (!name) return;
    const data = { name, category: modal.category, desc: modal.desc, items: modal.items };
    if (modal.id) setSets((p) => p.map((s) => (s.id === modal.id ? { ...s, ...data } : s)));
    else setSets((p) => [...p, { id: Date.now(), ...data, active: true, created: new Date().toISOString().slice(0, 10) }]);
    closeModal();
  };

  const q = catSearch.trim().toLowerCase();
  const visibleCatalogue = useMemo(() => CATALOGUE.map((m) => ({
    ...m,
    parts: m.parts.map((b) => ({
      ...b,
      shown: b.protocols.filter((p) => !q || p.key.toLowerCase().includes(q)),
    })).filter((b) => b.shown.length),
  })).filter((m) => m.parts.length), [q]);

  return (
    <div className={cx("io-wrap")}>
      <div className={cx("io-head")}>
        <div>
          <h1 className={cx("io-title")}>Imaging Order Sets</h1>
          <p className={cx("io-desc")}>Design reusable bundles of imaging orders for the doctor panel.</p>
        </div>
        <div className={cx("io-hbtns")}>
          <button type="button" className={cx("io-export")} onClick={exportCsv}><FileText size={13} /> Export CSV</button>
          <button type="button" className={cx("io-newbtn")} onClick={openNew}><Plus size={14} /> New Order Set</button>
        </div>
      </div>

      <div className={cx("io-bar")}>
        <div className={cx("io-search")}>
          <Search size={13} />
          <input placeholder="Search order sets..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={cx("io-filters")}>
          <button type="button" className={cx(`io-filter ${filter === "All" ? "io-filter-on" : ""}`)} onClick={() => setFilter("All")}>All</button>
          {usedCategories.map((c) => (
            <button type="button" key={c} className={cx(`io-filter ${filter === c ? "io-filter-on" : ""}`)} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <em className={cx("io-count")}>{filtered.length} set{filtered.length !== 1 ? "s" : ""}</em>
      </div>

      <div className={cx("io-grid")}>
        {filtered.map((s) => {
          const isOpen = expanded.has(s.id);
          return (
            <div className={cx(`io-card ${!s.active ? "io-card-off" : ""}`)} key={s.id}>
              <div className={cx("io-cbody")}>
                <div className={cx("io-ctop")}>
                  <span className={cx("io-icon")}><Layers size={15} /></span>
                  <div className={cx("io-cinfo")}>
                    <p className={cx("io-cname")}>
                      {s.name} <span className={cx(`io-cbadge ${CATEGORY_COLOR[s.category] || "io-c-gray"}`)}>{s.category}</span>
                    </p>
                    <p className={cx("io-csub")}>{s.desc}</p>
                  </div>
                </div>
                <div className={cx("io-cmid")}>
                  <span className={cx("io-items")}><ScanLine size={10} /> {s.items.length} Imaging</span>
                  <button type="button" className={cx("io-view")} onClick={() => toggleExpanded(s.id)}>
                    <ChevronRight size={11} className={cx(isOpen ? "io-view-open" : "")} />
                    {isOpen ? "Hide" : "View"}
                  </button>
                </div>

                {isOpen && s.items.length > 0 && (
                  <div className={cx("io-exlist")}>
                    {s.items.map((key) => (
                      <div className={cx("io-exrow")} key={key}>
                        <span className={cx("io-exname")}><ScanLine size={11} /> {labelOf(key)}</span>
                        <span className={cx("io-exbadge")}>Imaging</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={cx("io-cfoot")}>
                <div className={cx("io-status")}>
                  <Toggle size="medium" color="softBlue" className={cx("io-tg")} on={s.active} onChange={() => toggleActive(s.id)} label={`${s.name} status`} />
                  <span className={cx(s.active ? "io-aon" : "io-aoff")}>{s.active ? "Active" : "Inactive"}</span>
                </div>
                <span className={cx("io-date")}>{s.created}</span>
                <div className={cx("io-cactions")}>
                  <button type="button" onClick={() => duplicate(s)} aria-label={`Duplicate ${s.name}`}><Copy size={12} /></button>
                  <button type="button" onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`}><Pencil size={12} /></button>
                  <button type="button" onClick={() => remove(s.id)} aria-label={`Delete ${s.name}`}><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className={cx("io-overlay")} onClick={closeModal}>
          <div className={cx("io-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={cx("io-mhead")}>
              <h2 className={cx("io-mtitle")}>{modal.id ? "Edit Order Set" : "New Order Set"}</h2>
              <button type="button" className={cx("io-mclose")} onClick={closeModal} aria-label="Close"><X size={15} /></button>
            </div>

            <div className={cx("io-mbody")}>
              {/* left: details + items added + footer buttons */}
              <div className={cx("io-mleft")}>
                <div className={cx("io-mfields")}>
                  <label className={cx("io-mlabel")}>Name <b>*</b></label>
                  <input className={cx("io-minput")} placeholder="e.g. Cardiac Panel..." value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />

                  <label className={cx("io-mlabel io-mt")}>Category</label>
                  <select className={cx("io-msel")} value={modal.category} onChange={(e) => setField({ category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <label className={cx("io-mlabel io-mt")}>Description</label>
                  <textarea className={cx("io-mtextarea")} placeholder="Brief description..." value={modal.desc} onChange={(e) => setField({ desc: e.target.value })} />
                </div>

                <div className={cx("io-mitemshead")}>
                  <span>Items Added</span>
                  <b>{modal.items.length}</b>
                </div>
                <div className={cx("io-mitems")}>
                  {modal.items.length === 0 ? (
                    <p className={cx("io-mnoitems")}>Select items from the catalogue on the right</p>
                  ) : (
                    <>
                      <p className={cx("io-mgroup")}>Imaging</p>
                      {modal.items.map((key) => (
                        <div className={cx("io-mitem")} key={key}>
                          <ScanLine size={11} />
                          <span>{labelOf(key)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className={cx("io-mfoot")}>
                  <button type="button" className={cx("io-mcancel")} onClick={closeModal}>Cancel</button>
                  <button type="button" className={cx("io-msave")} disabled={!modal.name.trim()} onClick={save}>{modal.id ? "Save Changes" : "Create"}</button>
                </div>
              </div>

              {/* right: imaging catalogue */}
              <div className={cx("io-mright")}>
                <div className={cx("io-mrhead")}>
                  <ScanLine size={12} /> <b>Imaging Catalogue</b>
                  {modal.items.length > 0 && <span className={cx("io-mcount")}>{modal.items.length}</span>}
                </div>
                <div className={cx("io-msearch")}>
                  <Search size={13} />
                  <input placeholder="Search imaging tests..." value={catSearch} onChange={(e) => setCatSearch(e.target.value)} />
                </div>
                <div className={cx("io-mlist")}>
                  {visibleCatalogue.map((m) => (
                    <div key={m.name}>
                      <p className={cx("io-mmod")}>{m.name}</p>
                      {m.parts.map((b) => (
                        <div key={b.name} className={cx("io-mpart")}>
                          <p className={cx("io-mshead")}>{b.name}</p>
                          {b.shown.map((p) => {
                            const checked = modal.items.includes(p.key);
                            return (
                              <label className={cx(`io-mtrow ${checked ? "io-mtrow-on" : ""}`)} key={p.key}>
                                <input type="checkbox" checked={checked} onChange={() => toggleItem(p.key)} />
                                <span className={cx("io-mbox")}>{checked && <CircleCheck size={11} />}</span>
                                <span className={cx("io-mtname")}>{p.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                  {visibleCatalogue.length === 0 && <p className={cx("io-mnone")}>No imaging tests match your search.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagingOrderSets;