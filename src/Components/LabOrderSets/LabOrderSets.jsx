import { createClassNames } from "../../utils/classNames.js";
import { useMemo, useState } from "react";
import { Check, ChevronRight, Copy, FileDown, FlaskConical, Layers, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { SECTIONS, ALL_TESTS, CATEGORIES, CATEGORY_COLOR, ORDER_SETS, BLANK_ORDER_SET } from "./LabOrderSetsData.js";
import styles from "./LabOrderSets.module.css";

const cx = createClassNames(styles);

const testInfo = (id) => ALL_TESTS.find((t) => t.id === id);
const subtext = (t) => [t.sample, t.fasting && "Fasting", t.desc].filter(Boolean).join(" · ");

const LabOrderSets = () => {
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

  const openNew = () => { setModal({ id: null, ...BLANK_ORDER_SET, items: [] }); setCatSearch(""); };
  const openEdit = (s) => { setModal({ id: s.id, name: s.name, category: s.category, desc: s.desc, items: [...s.items] }); setCatSearch(""); };
  const closeModal = () => setModal(null);

  const setField = (patch) => setModal((p) => ({ ...p, ...patch }));
  const toggleItem = (id) => setModal((p) => ({ ...p, items: p.items.includes(id) ? p.items.filter((x) => x !== id) : [...p.items, id] }));

  const save = () => {
    const name = modal.name.trim();
    if (!name) return;
    if (modal.id) {
      setSets((p) => p.map((s) => (s.id === modal.id ? { ...s, name, category: modal.category, desc: modal.desc, items: modal.items } : s)));
    } else {
      setSets((p) => [...p, { id: Date.now(), name, category: modal.category, desc: modal.desc, items: modal.items, active: true, created: new Date().toISOString().slice(0, 10) }]);
    }
    closeModal();
  };

  const matchesSearch = (t) => !catSearch || t.name.toLowerCase().includes(catSearch.toLowerCase());

  return (
    <div className={cx("ls-wrap")}>
      <div className={cx("ls-head")}>
        <div>
          <h1 className={cx("ls-title")}>Lab Order Sets</h1>
          <p className={cx("ls-desc")}>Design reusable bundles of lab test orders for the doctor panel.</p>
        </div>
        <div className={cx("ls-hbtns")}>
          <button type="button" className={cx("ls-export")}><FileDown size={13} /> Export CSV</button>
          <button type="button" className={cx("ls-newbtn")} onClick={openNew}><Plus size={14} /> New Order Set</button>
        </div>
      </div>

      <div className={cx("ls-bar")}>
        <div className={cx("ls-search")}>
          <Search size={12} />
          <input placeholder="Search order sets..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={cx("ls-filters")}>
          <button type="button" className={cx(`ls-filter ${filter === "All" ? "ls-filter-on" : ""}`)} onClick={() => setFilter("All")}>All</button>
          {usedCategories.map((c) => (
            <button type="button" key={c} className={cx(`ls-filter ${filter === c ? "ls-filter-on" : ""}`)} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <em className={cx("ls-count")}>{filtered.length} set{filtered.length !== 1 ? "s" : ""}</em>
      </div>

      <div className={cx("ls-grid")}>
        {filtered.map((s) => (
          <div className={cx(`ls-card ${!s.active ? "ls-card-off" : ""}`)} key={s.id}>
            <div className={cx("ls-ctop")}>
              <span className={cx("ls-icon")}><Layers size={15} /></span>
              <div className={cx("ls-cinfo")}>
                <p className={cx("ls-cname")}>
                  {s.name} <span className={cx(`ls-cbadge ${CATEGORY_COLOR[s.category] || "ls-c-gray"}`)}>{s.category}</span>
                </p>
                <p className={cx("ls-csub")}>{s.desc}</p>
              </div>
            </div>
            <div className={cx("ls-cmid")}>
              <span className={cx("ls-items")}><FlaskConical size={10} /> {s.items.length} Lab</span>
              <button type="button" className={cx("ls-view")} onClick={() => toggleExpanded(s.id)}>
                {expanded.has(s.id) ? "Hide" : "View"}
                <ChevronRight size={11} className={cx(expanded.has(s.id) ? "ls-view-open" : "")} />
              </button>
            </div>

            {expanded.has(s.id) && (
              <div className={cx("ls-exlist")}>
                {s.items.map((id) => {
                  const t = testInfo(id);
                  if (!t) return null;
                  return (
                    <div className={cx("ls-exrow")} key={id}>
                      <span className={cx("ls-exname")}><FlaskConical size={11} /> {t.name}</span>
                      <span className={cx("ls-exbadge")}>Lab</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={cx("ls-cfoot")}>
              <div className={cx("ls-status")}>
                <Toggle size="medium" color="softBlue" className={cx("ls-tg")} on={s.active} onChange={() => toggleActive(s.id)} label={`${s.name} status`} />
                <span className={cx(s.active ? "ls-aon" : "ls-aoff")}>{s.active ? "Active" : "Inactive"}</span>
              </div>
              <span className={cx("ls-date")}>{s.created}</span>
              <div className={cx("ls-cactions")}>
                <button type="button" onClick={() => duplicate(s)} aria-label={`Duplicate ${s.name}`}><Copy size={12} /></button>
                <button type="button" onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`}><Pencil size={12} /></button>
                <button type="button" onClick={() => remove(s.id)} aria-label={`Delete ${s.name}`}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className={cx("ls-overlay")} onClick={closeModal}>
          <div className={cx("ls-modal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={cx("ls-mhead")}>
              <h2 className={cx("ls-mtitle")}>{modal.id ? "Edit Order Set" : "New Order Set"}</h2>
              <button type="button" className={cx("ls-mclose")} onClick={closeModal} aria-label="Close"><X size={15} /></button>
            </div>

            <div className={cx("ls-mbody")}>
              <div className={cx("ls-mleft")}>
                <label className={cx("ls-mlabel")}>Name <b>*</b></label>
                <input className={cx("ls-minput")} placeholder="e.g. Cardiac Panel..." value={modal.name} onChange={(e) => setField({ name: e.target.value })} autoFocus />

                <label className={cx("ls-mlabel ls-mt")}>Category</label>
                <div className={cx("ls-msel")}>
                  <Select value={modal.category} options={CATEGORIES} onChange={(v) => setField({ category: v })} label="Category" />
                </div>

                <label className={cx("ls-mlabel ls-mt")}>Description</label>
                <textarea className={cx("ls-mtextarea")} placeholder="Brief description..." value={modal.desc} onChange={(e) => setField({ desc: e.target.value })} />

                <p className={cx("ls-mitemshead")}>ITEMS ADDED <b>{modal.items.length}</b></p>
                {modal.items.length === 0 ? (
                  <p className={cx("ls-mnoitems")}>Select items from the catalogue on the right.</p>
                ) : (
                  <div className={cx("ls-mitems")}>
                    <p className={cx("ls-mgroup")}>LAB</p>
                    {modal.items.map((id) => {
                      const t = testInfo(id);
                      if (!t) return null;
                      return (
                        <div className={cx("ls-mitem")} key={id}>
                          <FlaskConical size={11} /> {t.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={cx("ls-mright")}>
                <div className={cx("ls-mrhead")}>
                  <FlaskConical size={13} /> <b>Lab Catalogue</b>
                  <span className={cx("ls-mcount")}>{modal.items.length}</span>
                </div>
                <div className={cx("ls-msearch")}>
                  <Search size={12} />
                  <input placeholder="Search lab tests..." value={catSearch} onChange={(e) => setCatSearch(e.target.value)} />
                </div>
                <div className={cx("ls-mlist")}>
                  {SECTIONS.map((section) => {
                    const visible = section.tests.filter(matchesSearch);
                    if (visible.length === 0) return null;
                    return (
                      <div key={section.name}>
                        <p className={cx("ls-mshead")}>{section.name.toUpperCase()}</p>
                        {visible.map((t) => {
                          const checked = modal.items.includes(t.id);
                          return (
                            <label className={cx(`ls-mtrow ${checked ? "ls-mtrow-on" : ""}`)} key={t.id}>
                              <input type="checkbox" checked={checked} onChange={() => toggleItem(t.id)} />
                              <span className={cx("ls-mbox")}>{checked && <Check size={10} />}</span>
                              <div>
                                <p className={cx("ls-mtname")}>{t.name}</p>
                                <p className={cx("ls-mtsub")}>{subtext(t)}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={cx("ls-mfoot")}>
              <button type="button" className={cx("ls-mcancel")} onClick={closeModal}>Cancel</button>
              <button type="button" className={cx("ls-msave")} disabled={!modal.name.trim()} onClick={save}>{modal.id ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabOrderSets;