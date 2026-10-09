import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Package, Pencil, Plus, Trash2, Truck, Upload } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import ProviderModal from "./ProviderModal";
import { CATEGORIES, ITEMS, PROVIDERS } from "./ConsumableProvidersData.js";
import styles from "./ConsumableProviders.module.css";

const cx = createClassNames(styles);

const ConsumableProviders = () => {
  const [providers, setProviders] = useState(PROVIDERS);
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // null | { provider } (provider = null for New)
  const [csv, setCsv] = useState(null); // null | { id, text }

  const patch = (id, fn) => setProviders((p) => p.map((x) => (x.id === id ? fn(x) : x)));
  const toggleOpen = (id) => setExpanded((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const save = (data) => {
    if (modal.provider) patch(modal.provider.id, (x) => ({ ...x, ...data }));
    else setProviders((p) => [...p, { id: Date.now(), active: true, ...data }]);
    setModal(null);
  };
  const remove = (id) => setProviders((p) => p.filter((x) => x.id !== id));

  const setPrice = (pid, iid, field, v) => patch(pid, (x) => ({
    ...x, prices: { ...x.prices, [iid]: { cost: "", sell: "", ...x.prices[iid], [field]: v } },
  }));

  /* ── Import CSV: Item Name, Cost Price, Selling Price (one per line) ── */
  const toggleCsv = (id) => setCsv((c) => (c?.id === id ? null : { id, text: "" }));
  const applyCsv = () => {
    const rows = csv.text
      .split(/\r?\n/)
      .map((line) => line.split(",").map((s) => s.trim().replace(/^"|"$/g, "")))
      .filter((cols) => cols.length >= 3 && cols[0]);
    patch(csv.id, (x) => {
      const items = new Set(x.items);
      const prices = { ...x.prices };
      rows.forEach(([name, cost, sell]) => {
        const hit = ITEMS.find((it) => it.name.toLowerCase() === name.toLowerCase());
        if (!hit || Number.isNaN(parseFloat(cost))) return;
        items.add(hit.id);
        prices[hit.id] = { cost: String(parseFloat(cost)), sell: String(parseFloat(sell) || 0) };
      });
      return { ...x, items: ITEMS.filter((it) => items.has(it.id)).map((it) => it.id), prices };
    });
    setCsv(null);
  };

  return (
    <div className={cx("cp-wrap")}>
      {/* ── header + tabs ── */}
      <div className={cx("cp-header")}>
        <div className={cx("cp-top")}>
          <div className={cx("cp-hico")}><Package size={14} /></div>
          <div>
            <h1 className={cx("cp-title")}>Consumables</h1>
            <p className={cx("cp-desc")}>Manage consumable items, categories, and supplier pricing</p>
          </div>
        </div>

        <nav className={cx("cp-tabs")}>
          <Link to="/admin/consumable-items" className={cx("cp-tab")}><Package size={12} /> Consumable Items</Link>
          <Link to="/admin/consumable-providers" className={cx("cp-tab cp-tab-on")}><Truck size={12} /> Consumable Providers</Link>
        </nav>
      </div>

      {/* ── bar ── */}
      <div className={cx("cp-bar")}>
        <p className={cx("cp-bdesc")}>Manage internal stores and external suppliers — configure cost and selling price per item.</p>
        <button type="button" className={cx("cp-new")} onClick={() => setModal({ provider: null })}>
          <Plus size={14} /> New Provider
        </button>
      </div>

      {/* ── providers ── */}
      <div className={cx("cp-list")}>
        {providers.map((p) => {
          const open = expanded.has(p.id);
          const groups = CATEGORIES
            .map((c) => ({ ...c, items: ITEMS.filter((it) => it.category === c.name && p.items.includes(it.id)) }))
            .filter((c) => c.items.length);
          const csvOpen = csv?.id === p.id;
          return (
            <div key={p.id} className={cx("cp-card")}>
              <div className={cx("cp-head")}>
                <div className={cx("cp-ico")}><Truck size={14} /></div>
                <div className={cx("cp-info")}>
                  <div className={cx("cp-ntop")}>
                    <span className={cx("cp-name")}>{p.name}</span>
                    <span className={cx(`cp-badge ${p.type === "External Supplier" ? "cp-ext" : "cp-int"}`)}>{p.type}</span>
                    {!p.active && <span className={cx("cp-badge cp-off")}>Inactive</span>}
                  </div>
                  <div className={cx("cp-sub")}>{p.contact || "No contact"} · {p.items.length} items</div>
                </div>
                <div className={cx("cp-acts")}>
                  <Toggle
                    on={p.active}
                    onChange={() => patch(p.id, (x) => ({ ...x, active: !x.active }))}
                    size="large"
                    color="softBlue"
                    className={cx("cp-tg")}
                    label={`Toggle ${p.name}`}
                  />
                  <button type="button" className={cx("cp-btn")} onClick={() => setModal({ provider: p })} aria-label="Edit provider"><Pencil size={13} /></button>
                  <button type="button" className={cx("cp-btn cp-del")} onClick={() => remove(p.id)} aria-label="Delete provider"><Trash2 size={13} /></button>
                  <button type="button" className={cx("cp-btn")} onClick={() => toggleOpen(p.id)} aria-label={open ? "Collapse" : "Expand"}>
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                </div>
              </div>

              {open && (
                <div className={cx("cp-body")}>
                  <div className={cx("cp-bbar")}>
                    <span className={cx("cp-blabel")}>Item Pricing</span>
                    <button type="button" className={cx("cp-import")} onClick={() => toggleCsv(p.id)}><Upload size={11} /> Import CSV</button>
                  </div>

                  {csvOpen && (
                    <div className={cx("cp-csv")}>
                      <p className={cx("cp-csvlbl")}>
                        Paste CSV: <code>Item Name, Cost Price (PKR), Selling Price (PKR)</code> (one per line)
                      </p>
                      <textarea
                        autoFocus
                        className={cx("cp-csvta")}
                        value={csv.text}
                        onChange={(e) => setCsv((c) => ({ ...c, text: e.target.value }))}
                      />
                      <div className={cx("cp-csvbtns")}>
                        <button type="button" className={cx("cp-cbtn cp-apply")} onClick={applyCsv}>Apply</button>
                        <button type="button" className={cx("cp-cbtn cp-cancel")} onClick={() => setCsv(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {groups.length === 0 ? (
                    <p className={cx("cp-none")}>No items selected for this provider</p>
                  ) : (
                    <div className={cx("cp-scroll")}>
                      {groups.map((c) => (
                        <div key={c.name}>
                          <div className={cx("cp-cat")}>
                            <i className={cx("cp-dot")} style={{ background: c.color }} />
                            {c.name}
                          </div>
                          <div className={cx("cp-row cp-thead")}>
                            <span>Item</span><span>Unit</span><span>Cost Price (PKR)</span><span>Selling Price (PKR)</span>
                          </div>
                          {c.items.map((it) => (
                            <div key={it.id} className={cx("cp-row")}>
                              <span className={cx("cp-iname")}>{it.name}</span>
                              <span className={cx("cp-unit")}>{it.unit}</span>
                              <input
                                type="number" min="0" step="any" placeholder="0.00" className={cx("cp-in")}
                                value={p.prices[it.id]?.cost ?? ""}
                                onChange={(e) => setPrice(p.id, it.id, "cost", e.target.value)}
                              />
                              <input
                                type="number" min="0" step="any" placeholder="0.00" className={cx("cp-in")}
                                value={p.prices[it.id]?.sell ?? ""}
                                onChange={(e) => setPrice(p.id, it.id, "sell", e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {providers.length === 0 && <p className={cx("cp-empty")}>No providers yet.</p>}
      </div>

      {modal && <ProviderModal provider={modal.provider} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default ConsumableProviders;