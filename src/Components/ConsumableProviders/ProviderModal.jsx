import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Save, Search, X } from "lucide-react";
import { CATEGORIES, ITEMS, PROVIDER_TYPES } from "./ConsumableProvidersData.js";
import styles from "./ProviderModal.module.css";

const cx = createClassNames(styles);

const ProviderModal = ({ provider, onClose, onSave }) => {
  const isEdit = Boolean(provider);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: provider?.name ?? "", type: provider?.type ?? PROVIDER_TYPES[0], contact: provider?.contact ?? "",
  });
  const [selected, setSelected] = useState(provider?.items ?? []);
  const [prices, setPrices] = useState(provider?.prices ?? {});
  const [search, setSearch] = useState("");

  const set = (patch) => setForm((p) => ({ ...p, ...patch }));

  /* ── step 2 helpers ── */
  const q = search.trim().toLowerCase();
  const groups = CATEGORIES
    .map((c) => ({ ...c, items: ITEMS.filter((it) => it.category === c.name && (!q || it.name.toLowerCase().includes(q))) }))
    .filter((c) => c.items.length);

  const toggleItem = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const selectAll = () => setSelected(ITEMS.map((it) => it.id));
  const clear = () => setSelected([]);

  const val = (id, field) => prices[id]?.[field] ?? "";
  const setVal = (id, field, v) => setPrices((p) => ({ ...p, [id]: { cost: "", sell: "", ...p[id], [field]: v } }));

  const save = () => {
    const items = ITEMS.filter((it) => selected.includes(it.id)).map((it) => it.id);
    const keep = {};
    items.forEach((id) => { keep[id] = { cost: val(id, "cost"), sell: val(id, "sell") }; });
    onSave({ name: form.name.trim(), type: form.type, contact: form.contact.trim(), items, prices: keep });
  };

  return (
    <div className={cx("cpm-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("cpm-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("cpm-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>

        <div className={cx("cpm-head")}>
          <h2 className={cx("cpm-title")}>{isEdit ? "Edit Provider" : "New Consumable Provider"}</h2>
          <span className={cx("cpm-stepno")}>Step {step} of 2</span>
        </div>

        <div className={cx("cpm-steps")}>
          <div className={cx(`cpm-step ${step === 1 ? "cpm-step-on" : ""}`)}>
            <span className={cx("cpm-num cpm-num-on")}>1</span> Provider Details
          </div>
          <div className={cx("cpm-line")} />
          <div className={cx(`cpm-step ${step === 2 ? "cpm-step-on" : ""}`)}>
            <span className={cx(`cpm-num ${step === 2 ? "cpm-num-on" : ""}`)}>2</span> Item Selection &amp; Pricing
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className={cx("cpm-grid")}>
              <div>
                <label className={cx("cpm-lbl")} htmlFor="cpm-name">Provider Name <em>*</em></label>
                <input
                  id="cpm-name" className={cx("cpm-input")} placeholder="e.g. Central Store" autoFocus
                  value={form.name} onChange={(e) => set({ name: e.target.value })}
                />
              </div>
              <div>
                <label className={cx("cpm-lbl")} htmlFor="cpm-type">Type</label>
                <select id="cpm-type" className={cx("cpm-select")} value={form.type} onChange={(e) => set({ type: e.target.value })}>
                  {PROVIDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <label className={cx("cpm-lbl cpm-mt")} htmlFor="cpm-contact">Contact Info</label>
            <input
              id="cpm-contact" className={cx("cpm-input")} placeholder="Phone / email / contract ref"
              value={form.contact} onChange={(e) => set({ contact: e.target.value })}
            />

            <div className={cx("cpm-foot cpm-foot-1")}>
              <button type="button" className={cx("cpm-btn cpm-ghost")} onClick={onClose}>Cancel</button>
              <button type="button" className={cx("cpm-btn cpm-primary")} disabled={!form.name.trim()} onClick={() => setStep(2)}>Next →</button>
            </div>
          </>
        ) : (
          <>
            <div className={cx("cpm-tools")}>
              <div className={cx("cpm-search")}>
                <Search size={13} />
                <input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <span className={cx("cpm-count")}>{selected.length} of {ITEMS.length} selected</span>
              <button type="button" className={cx("cpm-link")} onClick={selectAll}>Select All</button>
              <button type="button" className={cx("cpm-link cpm-link-muted")} onClick={clear}>Clear</button>
            </div>

            <div className={cx("cpm-list")}>
              {groups.map((c) => (
                <div key={c.name}>
                  <div className={cx("cpm-cat")}>
                    <i className={cx("cpm-dot")} style={{ background: c.color }} />
                    {c.name}
                  </div>
                  {c.items.map((it) => {
                    const on = selected.includes(it.id);
                    return (
                      <div key={it.id} className={cx(`cpm-row ${on ? "cpm-row-on" : ""}`)}>
                        <label className={cx("cpm-iname")}>
                          <input type="checkbox" checked={on} onChange={() => toggleItem(it.id)} />
                          {it.name}
                        </label>
                        <span className={cx("cpm-unit")}>{it.unit}</span>
                        {on && (
                          <>
                            <span className={cx("cpm-price cpm-cost")}>
                              <em>Cost</em>
                              <input
                                type="number" min="0" step="any" placeholder="0.00" className={cx("cpm-in")}
                                value={val(it.id, "cost")} onChange={(e) => setVal(it.id, "cost", e.target.value)}
                              />
                            </span>
                            <span className={cx("cpm-price")}>
                              <em>Sell</em>
                              <input
                                type="number" min="0" step="any" placeholder="0.00" className={cx("cpm-in")}
                                value={val(it.id, "sell")} onChange={(e) => setVal(it.id, "sell", e.target.value)}
                              />
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {groups.length === 0 && <p className={cx("cpm-none")}>No items match your search.</p>}
            </div>

            <div className={cx("cpm-foot")}>
              <button type="button" className={cx("cpm-btn cpm-ghost")} onClick={() => setStep(1)}>← Back</button>
              <div className={cx("cpm-foot-r")}>
                <button type="button" className={cx("cpm-btn cpm-ghost")} onClick={onClose}>Cancel</button>
                <button type="button" className={cx("cpm-btn cpm-primary")} onClick={save}><Save size={13} /> Save Provider</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderModal;