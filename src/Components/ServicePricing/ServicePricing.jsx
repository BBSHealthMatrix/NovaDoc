import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Banknote, Columns2, FileText, Info, LayoutGrid, Pencil, Printer, Search, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { SERVICES, TABS, DESCRIPTIONS, CONSULT_FEES, DEPARTMENTS } from "./ServicePricingData.js";
import styles from "./ServicePricing.module.css";

const cx = createClassNames(styles);

const TAB_ICON = { all: LayoutGrid, consult: Banknote };
const consultCount = CONSULT_FEES.reduce((n, d) => n + d.rows.length, 0);

const ServicePricing = () => {
  const [services, setServices] = useState(SERVICES);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [prices, setPrices] = useState({}); // { [serviceId]: { [provider]: amount } }
  const [cell, setCell] = useState(null); // { id, provider, value } while editing a price inline
  const [editing, setEditing] = useState(null); // service copy while the modal is open

  const current = TABS.find((t) => t.key === tab);
  const isConsult = tab === "consult";
  const isType = Boolean(current.providers);
  const q = query.trim().toLowerCase();

  const counts = { all: services.length, consult: consultCount };
  services.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });

  const rows = services.filter((s) => (tab === "all" || s.type === tab) && (!q || s.name.toLowerCase().includes(q)));
  const doctors = CONSULT_FEES
    .map((d) => ({ ...d, rows: d.name.toLowerCase().includes(q) ? d.rows : d.rows.filter((r) => `${r.dept} ${r.sub}`.toLowerCase().includes(q)) }))
    .filter((d) => d.rows.length > 0);

  const toggleActive = (id) => setServices((p) => p.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  const switchTab = (key) => {
    setTab(key);
    setQuery("");
    setCell(null);
  };

  const saveCell = () => {
    const value = cell.value.replace(/\D/g, "");
    setPrices((p) => ({ ...p, [cell.id]: { ...p[cell.id], [cell.provider]: value } }));
    setCell(null);
  };

  const saveService = () => {
    if (!editing.name.trim()) return;
    setServices((p) => p.map((s) => (s.id === editing.id ? { ...editing, name: editing.name.trim() } : s)));
    setEditing(null);
  };

  const exportCsv = () => {
    const providers = current.providers ?? [];
    const head = ["Service Name", "Service Type", "Dept / Sub-Dept", "Taxable", "Status", "Created", ...providers];
    const body = rows.map((s) => [
      s.name, s.type, s.dept ? `${s.dept} / ${s.sub}` : "", s.taxable ? "Yes" : "No", s.active ? "Active" : "Inactive", s.created,
      ...providers.map((p) => prices[s.id]?.[p] ?? ""),
    ]);
    const csv = [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `service-pricing-${tab.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const statusCell = (s) => (
    <div className={cx("sp-status")}>
      <Toggle size="medium" color="softBlue" className={cx("sp-tg")} on={s.active} onChange={() => toggleActive(s.id)} label={`${s.name} status`} />
      <span className={cx(`sp-badge ${s.active ? "sp-b-on" : "sp-b-off"}`)}>{s.active ? "Active" : "Inactive"}</span>
    </div>
  );

  const taxCell = (s) => <span className={cx(`sp-tax ${s.taxable ? "sp-tax-yes" : ""}`)}>{s.taxable ? "Yes" : "No"}</span>;

  const editBtn = (s) => (
    <button type="button" className={cx("sp-edit")} onClick={() => setEditing({ ...s })} aria-label={`Edit ${s.name}`}>
      <Pencil size={12} />
    </button>
  );

  return (
    <div className={cx("sp-wrap")}>
      {/* ── fixed header ── */}
      <div className={cx("sp-top")}>
        <div className={cx("sp-head")}>
          <div>
            <h1 className={cx("sp-title")}>Service Pricing</h1>
            <p className={cx("sp-desc")}>{isConsult ? DESCRIPTIONS.consult : isType ? DESCRIPTIONS.type : DESCRIPTIONS.all}</p>
          </div>
          {!isConsult && (
            <div className={cx("sp-head-btns")}>
              <button type="button" className={cx("sp-ghost")} onClick={() => window.print()}><Printer size={12} /> Print</button>
              <button type="button" className={cx("sp-ghost")} onClick={exportCsv}><FileText size={12} /> Export CSV</button>
            </div>
          )}
        </div>

        <div className={cx("sp-bar")}>
          <div className={cx("sp-tabs")} role="tablist">
            {TABS.map((t) => {
              const Icon = TAB_ICON[t.key] ?? Columns2;
              return (
                <button type="button" role="tab" aria-selected={tab === t.key} key={t.key} className={cx(`sp-tab ${tab === t.key ? "sp-tab-on" : ""}`)} onClick={() => switchTab(t.key)}>
                  <Icon size={10} />
                  {t.label}
                  <span className={cx("sp-count")}>{counts[t.key] ?? 0}</span>
                </button>
              );
            })}
          </div>
          <label className={cx("sp-search")}>
            <Search size={13} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isConsult ? "Search doctor, dept..." : "Search services..."} />
          </label>
        </div>
      </div>

      {/* ── scrolling body ── */}
      <div className={cx("sp-body")}>
        {isConsult && (
          <div className={cx("sp-card")}>
            <div className={cx("sp-note")}>
              <Info size={11} />
              <p>Read-only view. Fee amounts are configured in <b>Admin Settings → Doctor Fees &amp; Shares</b>.</p>
            </div>
            <table className={cx("sp-ctable")}>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department / Sub-Dept</th>
                  <th>Service Type</th>
                  <th className={cx("sp-r")}>Fee Amount</th>
                  <th className={cx("sp-r")}>Doctor's Share</th>
                  <th className={cx("sp-c")}>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) =>
                  d.rows.map((r, i) => (
                    <tr key={`${d.id}-${i}`} className={cx(i === 0 ? "sp-cfirst" : "")}>
                      {i === 0 && (
                        <td rowSpan={d.rows.length} className={cx("sp-doc")}>
                          <div>
                            <span className={cx("sp-avatar")}>{d.initials}</span>
                            {d.name}
                          </div>
                        </td>
                      )}
                      <td className={cx("sp-dept")}>{r.dept} <i>/</i> <span>{r.sub}</span></td>
                      <td><span className={cx(`sp-ctype ${r.type === "Tele-consultation" ? "sp-ctype-tele" : ""}`)}>{r.type}</span></td>
                      <td className={cx("sp-r sp-mono")}>Rs. {r.fee}</td>
                      <td className={cx(`sp-r ${r.fixed ? "sp-mono" : "sp-share"}`)}>{r.share}</td>
                      <td className={cx("sp-c")}><span className={cx("sp-conf")}>Configured</span></td>
                    </tr>
                  )))}
              </tbody>
            </table>
            {doctors.length === 0 && <p className={cx("sp-empty")}>No doctors match your search.</p>}
          </div>
        )}

        {tab === "all" && (
          <div className={cx("sp-card")}>
            <div className={cx("sp-row sp-all sp-th")}>
              <span>Service Name</span>
              <span>Service Type</span>
              <span>Dept / Sub-Dept</span>
              <span>Taxable</span>
              <span>Status</span>
              <span>Created</span>
              <span />
            </div>
            {rows.map((s) => (
              <div className={cx("sp-row sp-all sp-tr")} key={s.id}>
                <span className={cx("sp-name-lg")}>{s.name}</span>
                <span><span className={cx("sp-type")}>{s.type}</span></span>
                <span className={cx("sp-dash")}>{s.dept ? `${s.dept} / ${s.sub || "—"}` : "—"}</span>
                <span>{taxCell(s)}</span>
                {statusCell(s)}
                <span className={cx("sp-date")}>{s.created}</span>
                {editBtn(s)}
              </div>
            ))}
            {rows.length === 0 && <p className={cx("sp-empty")}>No services found.</p>}
          </div>
        )}

        {isType && (
          <div className={cx("sp-card")}>
            <div className={cx("sp-row sp-typed sp-th")}>
              <span>Service Name</span>
              <span>Taxable</span>
              <span>Status</span>
              {current.providers.map((p) => <span className={cx("sp-r sp-prov")} key={p}>{p}</span>)}
              <span className={cx("sp-r")}>Actions</span>
            </div>
            {rows.map((s) => (
              <div className={cx("sp-row sp-typed sp-tr sp-tr-typed")} key={s.id}>
                <div>
                  <p className={cx("sp-name")}>{s.name}</p>
                  <p className={cx("sp-sub")}>{s.type}</p>
                </div>
                <span>{taxCell(s)}</span>
                {statusCell(s)}
                {current.providers.map((p) => {
                  const value = prices[s.id]?.[p];
                  const open = cell && cell.id === s.id && cell.provider === p;
                  return (
                    <div className={cx("sp-r")} key={p}>
                      {open ? (
                        <input
                          className={cx("sp-price-input")}
                          autoFocus
                          inputMode="numeric"
                          value={cell.value}
                          onChange={(e) => setCell((c) => ({ ...c, value: e.target.value }))}
                          onBlur={saveCell}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCell();
                            if (e.key === "Escape") setCell(null);
                          }}
                          aria-label={`${p} price for ${s.name}`}
                        />
                      ) : (
                        <button type="button" className={cx(`sp-price ${value ? "sp-price-set" : ""}`)} onClick={() => setCell({ id: s.id, provider: p, value: value ?? "" })}>
                          {value ? `Rs. ${value}` : "— set price"}
                        </button>
                      )}
                    </div>
                  );
                })}
                <div className={cx("sp-r")}>{editBtn(s)}</div>
              </div>
            ))}
            {rows.length === 0 && <p className={cx("sp-empty")}>No services found.</p>}
          </div>
        )}
      </div>

      {/* ── edit modal ── */}
      {editing && (
        <div className={cx("sp-overlay")} onClick={() => setEditing(null)}>
          <div className={cx("sp-modal")} role="dialog" aria-modal="true" aria-labelledby="sp-modal-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={cx("sp-close")} onClick={() => setEditing(null)} aria-label="Close"><X size={13} /></button>
            <h2 id="sp-modal-title" className={cx("sp-mtitle")}>Edit Service</h2>

            <label className={cx("sp-mlabel")} htmlFor="sp-name-input">Service Name</label>
            <input id="sp-name-input" className={cx("sp-input")} value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} />

            <label className={cx("sp-mlabel")} htmlFor="sp-type-input">Service Type</label>
            <input id="sp-type-input" className={cx("sp-input sp-input-ro")} value={editing.type} readOnly />

            <div className={cx("sp-mgrid")}>
              <div>
                <p className={cx("sp-mlabel")}>Department</p>
                <div className={cx("sp-sel")}>
                  <Select value={editing.dept} options={Object.keys(DEPARTMENTS)} placeholder="Select dept..."
                    onChange={(v) => setEditing((p) => ({ ...p, dept: v, sub: "" }))} label="Department" />
                </div>
              </div>
              <div>
                <p className={cx("sp-mlabel")}>Sub-Department</p>
                <div className={cx(`sp-sel ${editing.dept ? "" : "sp-sel-off"}`)}>
                  <Select value={editing.sub} options={DEPARTMENTS[editing.dept] ?? []} placeholder="Select sub-dept..."
                    onChange={(v) => setEditing((p) => ({ ...p, sub: v }))} label="Sub-department" />
                </div>
              </div>
              <div className={cx("sp-switch")}>
                <span>Active</span>
                <Toggle size="large" color="softBlue" className={cx("sp-tg")} on={editing.active} onChange={() => setEditing((p) => ({ ...p, active: !p.active }))} label="Active" />
              </div>
              <div className={cx("sp-switch")}>
                <span>Taxable</span>
                <Toggle size="large" color="softBlue" className={cx("sp-tg")} on={editing.taxable} onChange={() => setEditing((p) => ({ ...p, taxable: !p.taxable }))} label="Taxable" />
              </div>
            </div>

            <div className={cx("sp-mfoot")}>
              <button type="button" className={cx("sp-cancel")} onClick={() => setEditing(null)}>Cancel</button>
              <button type="button" className={cx("sp-save")} onClick={saveService}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePricing;