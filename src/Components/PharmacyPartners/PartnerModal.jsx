import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { ChevronDown, ChevronRight, Save, Search, X } from "lucide-react";
import { ALL_GENERICS, CATALOGUE, PARTNER_TYPES } from "./PharmacyPartnersData.js";
import styles from "./PartnerModal.module.css";

const cx = createClassNames(styles);

const TOTAL = ALL_GENERICS.length;

const PartnerModal = ({ partner, onClose, onSave }) => {
  const isEdit = Boolean(partner);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: partner?.name ?? "", type: partner?.type ?? PARTNER_TYPES[0], contact: partner?.contact ?? "",
  });
  const [selected, setSelected] = useState(partner?.selected ?? []);
  const [prices, setPrices] = useState(partner?.prices ?? {});
  const [open, setOpen] = useState(() => new Set(partner?.selected ?? []));
  const [search, setSearch] = useState("");

  const set = (patch) => setForm((p) => ({ ...p, ...patch }));

  /* ── step 2 helpers ── */
  const q = search.trim().toLowerCase();
  const groups = CATALOGUE
    .map((c) => ({
      ...c,
      generics: c.generics.filter((g) => !q || g.name.toLowerCase().includes(q) || g.brands.some((b) => b.name.toLowerCase().includes(q))),
    }))
    .filter((c) => c.generics.length);

  const toggleGeneric = (id) => {
    const on = selected.includes(id);
    setSelected((p) => (on ? p.filter((x) => x !== id) : [...p, id]));
    setOpen((p) => {
      const n = new Set(p);
      if (on) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleOpen = (id) => setOpen((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const selectAll = () => { const ids = ALL_GENERICS.map((g) => g.id); setSelected(ids); setOpen(new Set(ids)); };
  const clear = () => { setSelected([]); setOpen(new Set()); };

  const val = (bid, field) => prices[bid]?.[field] ?? "0.00";
  const setVal = (bid, field, v) => setPrices((p) => ({ ...p, [bid]: { price: "0.00", fee: "0.00", ...p[bid], [field]: v } }));
  const tidy = (bid, field) => {
    const n = parseFloat(val(bid, field));
    setVal(bid, field, Number.isNaN(n) ? "0.00" : n.toFixed(2));
  };

  const save = () => {
    const keep = {};
    ALL_GENERICS.filter((g) => selected.includes(g.id)).forEach((g) => g.brands.forEach((b) => {
      keep[b.id] = { price: val(b.id, "price"), fee: val(b.id, "fee") };
    }));
    onSave({ name: form.name.trim(), type: form.type, contact: form.contact.trim(), selected, prices: keep });
  };

  return (
    <div className={cx("pm-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("pm-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("pm-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>

        <div className={cx("pm-head")}>
          <h2 className={cx("pm-title")}>{isEdit ? "Edit Formulary Partner" : "New Formulary Partner"}</h2>
          <span className={cx("pm-stepno")}>Step {step} of 2</span>
        </div>

        <div className={cx("pm-steps")}>
          <div className={cx(`pm-step ${step === 1 ? "pm-step-on" : ""}`)}>
            <span className={cx("pm-num pm-num-on")}>1</span> Partner Details
          </div>
          <div className={cx("pm-line")} />
          <div className={cx(`pm-step ${step === 2 ? "pm-step-on" : ""}`)}>
            <span className={cx(`pm-num ${step === 2 ? "pm-num-on" : ""}`)}>2</span> Generics &amp; Brand Pricing
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className={cx("pm-grid")}>
              <div>
                <label className={cx("pm-lbl")} htmlFor="pm-name">Partner Name <em>*</em></label>
                <input id="pm-name" className={cx("pm-input")} value={form.name} onChange={(e) => set({ name: e.target.value })} autoFocus />
              </div>
              <div>
                <label className={cx("pm-lbl")} htmlFor="pm-type">Type</label>
                <select id="pm-type" className={cx("pm-select")} value={form.type} onChange={(e) => set({ type: e.target.value })}>
                  {PARTNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <label className={cx("pm-lbl pm-mt")} htmlFor="pm-contact">Contact Info</label>
            <input
              id="pm-contact"
              className={cx("pm-input")}
              placeholder="Phone / email / contract ref"
              value={form.contact}
              onChange={(e) => set({ contact: e.target.value })}
            />

            <div className={cx("pm-foot pm-foot-1")}>
              <button type="button" className={cx("pm-btn pm-ghost")} onClick={onClose}>Cancel</button>
              <button type="button" className={cx("pm-btn pm-primary")} disabled={!form.name.trim()} onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        ) : (
          <>
            <div className={cx("pm-tools")}>
              <div className={cx("pm-search")}>
                <Search size={13} />
                <input placeholder="Search generics or brands..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <span className={cx("pm-count")}>{selected.length} of {TOTAL} selected</span>
              <button type="button" className={cx("pm-link")} onClick={selectAll}>Select All</button>
              <button type="button" className={cx("pm-link pm-link-muted")} onClick={clear}>Clear</button>
            </div>

            <div className={cx("pm-list")}>
              {groups.map((c) => (
                <div key={c.category}>
                  <div className={cx("pm-cat")}>{c.category}</div>
                  {c.generics.map((g) => {
                    const on = selected.includes(g.id);
                    const isOpen = on && open.has(g.id);
                    return (
                      <div key={g.id} className={cx(isOpen ? "pm-gblock-open" : "")}>
                        <div className={cx("pm-grow")}>
                          <label className={cx("pm-gname")}>
                            <input type="checkbox" checked={on} onChange={() => toggleGeneric(g.id)} />
                            {g.name} <em>{g.brands.length} brands</em>
                          </label>
                          {on && (
                            <button type="button" className={cx(`pm-chev ${isOpen ? "pm-chev-on" : ""}`)} onClick={() => toggleOpen(g.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </button>
                          )}
                        </div>

                        {isOpen && (
                          <div className={cx("pm-tbl")}>
                            <div className={cx("pm-trow pm-thead")}>
                              <span>Brand</span><span>Strength</span><span>Selling Price (PKR)</span><span>Dispensing Fee</span>
                            </div>
                            {g.brands.map((b) => (
                              <div key={b.id} className={cx("pm-trow")}>
                                <span className={cx("pm-tbrand")}>{b.name}</span>
                                <span className={cx("pm-tstr")}>{b.strength}</span>
                                <input
                                  type="number" min="0" step="0.01" className={cx("pm-num-in")}
                                  value={val(b.id, "price")}
                                  onChange={(e) => setVal(b.id, "price", e.target.value)}
                                  onBlur={() => tidy(b.id, "price")}
                                />
                                <input
                                  type="number" min="0" step="0.01" className={cx("pm-num-in")}
                                  value={val(b.id, "fee")}
                                  onChange={(e) => setVal(b.id, "fee", e.target.value)}
                                  onBlur={() => tidy(b.id, "fee")}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {groups.length === 0 && <p className={cx("pm-none")}>No generics match your search.</p>}
            </div>

            <div className={cx("pm-foot")}>
              <button type="button" className={cx("pm-btn pm-ghost")} onClick={() => setStep(1)}>← Back</button>
              <div className={cx("pm-foot-r")}>
                <button type="button" className={cx("pm-btn pm-ghost")} onClick={onClose}>Cancel</button>
                <button type="button" className={cx("pm-btn pm-primary")} onClick={save}><Save size={13} /> Save Partner</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerModal;