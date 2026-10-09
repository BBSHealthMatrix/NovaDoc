import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Search, ChevronRight, Info, Banknote, CreditCard, Plus, SlidersHorizontal, X } from "lucide-react";

import { FEE_TYPES, mkRow, DOCTORS, initials, num, r1, SERVICES, SVC_MAP } from "./FeesSharesData.js";

import AssignModal from "./AssignModal";

import BulkModal from "./BulkModal";

import styles from "./FeesShares.module.css";

const cx = createClassNames(styles);

const FeesShares = () => {
  const [docs, setDocs] = useState(() =>
    DOCTORS.map((d) => ({ ...d, rows: d.services.map((id) => mkRow(id, "50")) }))
  );
  const [activeId, setActiveId] = useState(1);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("fees");
  const [assignOpen, setAssignOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const doc = docs.find((d) => d.id === activeId);
  const list = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
  const deptNames = Object.keys(doc.depts);
  const configured = doc.rows.filter((r) => r.shareVal !== "").length;
  const total = doc.rows.length;

  const updDoc = (fn) => setDocs((ds) => ds.map((d) => (d.id === activeId ? fn(d) : d)));

  const setFee = (dept, key, patch) =>
    updDoc((d) => ({
      ...d,
      depts: { ...d.depts, [dept]: { ...d.depts[dept], [key]: { ...d.depts[dept][key], ...patch } } },
    }));

  const setRow = (id, patch) =>
    updDoc((d) => ({ ...d, rows: d.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const removeRow = (id) => updDoc((d) => ({ ...d, rows: d.rows.filter((r) => r.id !== id) }));
  const setRows = (rows) => updDoc((d) => ({ ...d, rows }));

  const confirmAssign = (picked) => {
    const keep = doc.rows.filter((r) => picked.has(r.id));
    const have = new Set(keep.map((r) => r.id));
    const add = SERVICES.filter((s) => picked.has(s.id) && !have.has(s.id)).map((s) => mkRow(s.id));
    setRows([...keep, ...add]);
    setAssignOpen(false);
  };

  const allSel = total > 0 && doc.rows.every((r) => r.sel);

   
  const calc = (r) => {
    const price = SVC_MAP[r.id].price;
    const eff = r.useBase ? price : num(r.adjusted);
    const dr =
      r.shareVal === ""
        ? null
        : r.shareType === "%"
        ? Math.round((eff * num(r.shareVal)) / 100)
        : num(r.shareVal);
    return { price, eff, dr, bad: dr !== null && dr > eff };
  };
  const done = doc.rows.map(calc).filter((c) => c.dr !== null);
  const drTotal = done.reduce((a, c) => a + c.dr, 0);
  const clinicTotal = done.reduce((a, c) => a + (c.eff - c.dr), 0);

  return (
    <div className={cx("fee-page")}>
      <h1 className={cx("fee-title")}>Doctor Fees &amp; Shares</h1>
      <p className={cx("fee-sub")}>
        Select a doctor to configure consultation fees and per-service pricing with revenue shares.
      </p>

      <div className={cx("fee-body")}>
        
        <aside className={cx("fee-left")}>
          <div className={cx("fee-search")}>
            <Search size={13} />
            <input
              placeholder="Search doctors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={cx("fee-list")}>
            {list.map((d) => {
              const on = d.id === activeId;
              const n = d.rows.length;
              return (
                <button
                  key={d.id}
                  className={cx("fee-doc" + (on ? " fee-doc-on" : ""))}
                  onClick={() => setActiveId(d.id)}
                >
                  <span className={cx("fee-av")}>{initials(d.name)}</span>
                  <span className={cx("fee-doc-info")}>
                    <span className={cx("fee-doc-name")}>{d.name}</span>
                    <span className={cx("fee-doc-meta")}>
                      <i className={cx("fee-dot " + (d.status === "active" ? "fee-dot-g" : "fee-dot-a"))} />
                      {d.status === "active" ? "Active" : "Inactive"}
                      <span>·</span>
                      <b>{n} {n === 1 ? "svc" : "svcs"}</b>
                    </span>
                  </span>
                  {on && <ChevronRight size={13} className={cx("fee-doc-chev")} />}
                </button>
              );
            })}
          </div>
        </aside>

        
        <section className={cx("fee-right")}>
          <div className={cx("fee-head")}>
            <span className={cx("fee-head-av")}>{initials(doc.name)}</span>
            <div className={cx("fee-head-info")}>
              <h2>{doc.name}</h2>
              <p>{deptNames.join(", ")} · {doc.shift}</p>
            </div>
            <div className={cx("fee-head-right")}>
              <span className={cx("fee-status fee-status-" + doc.status)}>{doc.status}</span>
              <span className={cx("fee-conf")}>
                <b>{configured}</b>/{total} services configured
              </span>
            </div>
          </div>

          <div className={cx("fee-tabs")}>
            <button
              className={cx("fee-tab" + (tab === "fees" ? " fee-tab-on" : ""))}
              onClick={() => setTab("fees")}
            >
              <Banknote size={12} /> Consultation Fees
              <span className={cx("fee-tab-count")}>{deptNames.length}</span>
            </button>
            <button
              className={cx("fee-tab" + (tab === "pricing" ? " fee-tab-on" : ""))}
              onClick={() => setTab("pricing")}
            >
              <CreditCard size={12} /> Service Pricing
              <span className={cx("fee-tab-count")}>{total}</span>
            </button>
          </div>

          <div className={cx("fee-scroll")}>
            {tab === "fees" ? (
              <>
                <div className={cx("fee-note")}>
                  <Info size={12} />
                  <span>
                    Set fees and doctor share per consultation type, per sub-department. Toggle{" "}
                    <b>Rs.</b> for a fixed share or <b>%</b> for a percentage.
                  </span>
                </div>

                {deptNames.map((dept) => {
                  const f = doc.depts[dept];
                  return (
                    <div className={cx("fee-dept")} key={dept}>
                      <div className={cx("fee-dept-head")}>
                        <h3>{dept}</h3>
                        <span>1 sub-dept</span>
                      </div>

                      <div className={cx("fee-subhead")}>
                        <span>Outpatient</span>
                        <span className={cx("fee-cols")}>
                          <em>Fee Amount</em>
                          <em className={cx("fee-col-share")}>Share</em>
                          <em className={cx("fee-col-amt")}>Dr. Share Amt</em>
                        </span>
                      </div>

                      {FEE_TYPES.map((t) => {
                        const v = f[t.key];
                        const helper =
                          v.mode === "%"
                            ? `= Rs. ${Math.round((num(v.fee) * num(v.share)) / 100)}`
                            : `= ${num(v.fee) ? r1((num(v.share) / num(v.fee)) * 100) : 0}%`;
                        return (
                          <div className={cx("fee-frow")} key={t.key}>
                            <div className={cx("fee-flabel fee-fl-" + t.key)}>
                              {t.label}
                              {t.tag && <span className={cx("fee-tag fee-tag-" + t.key)}>{t.tag}</span>}
                            </div>

                            <label className={cx("fee-money")}>
                              <span>Rs.</span>
                              <input
                                type="number"
                                className={cx("fee-nospin")}
                                value={v.fee}
                                onChange={(e) =>
                                  setFee(dept, t.key, { fee: e.target.value === "" ? "" : Number(e.target.value) })
                                }
                              />
                            </label>

                            <div className={cx("fee-seg")}>
                              <button
                                className={cx(v.mode === "Rs" ? "fee-seg-on" : "")}
                                onClick={() => setFee(dept, t.key, { mode: "Rs" })}
                              >
                                Rs.
                              </button>
                              <button
                                className={cx(v.mode === "%" ? "fee-seg-on" : "")}
                                onClick={() => setFee(dept, t.key, { mode: "%" })}
                              >
                                %
                              </button>
                            </div>

                            <div className={cx("fee-sharebox")}>
                              <input
                                type="number"
                                className={cx("fee-inp fee-nospin")}
                                value={v.share}
                                onChange={(e) =>
                                  setFee(dept, t.key, { share: e.target.value === "" ? "" : Number(e.target.value) })
                                }
                              />
                              <small>{helper}</small>
                            </div>
                          </div>
                        );
                      })}

                      <div className={cx("fee-fsum")}>
                        <span>Outpatient:</span>
                        {FEE_TYPES.map((t) => (
                          <b key={t.key} className={cx("fee-c-" + t.key)}>
                            {t.short} Rs.{num(f[t.key].fee)}
                          </b>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div className={cx("fee-tools")}>
                  <button className={cx("fee-btn-pri")} onClick={() => setAssignOpen(true)}>
                    <Plus size={13} /> Assign Services
                  </button>
                  <button className={cx("fee-btn-out")} onClick={() => setBulkOpen(true)}>
                    <SlidersHorizontal size={12} /> Bulk Update
                  </button>
                  <span className={cx("fee-tools-count")}>
                    {total} {total === 1 ? "service" : "services"} assigned
                  </span>
                </div>

                <div className={cx("fee-twrap" + (done.length > 0 ? " fee-twrap-foot" : ""))}>
                  <table className={cx("fee-table")}>
                    <colgroup>
                    <col style={{ width: "18%" }} />
                      <col style={{ width: "9%" }} />
                      <col style={{ width: "9%" }} />
                      <col style={{ width: "13%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "11%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "10%" }} />
                      <col />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <label className={cx("fee-th-svc")}>
                            <input
                              type="checkbox"
                              checked={allSel}
                              onChange={() => setRows(doc.rows.map((r) => ({ ...r, sel: !allSel })))}
                            />
                            Service
                          </label>
                        </th>
                        <th>Type</th>
                        <th>Base Price</th>
                        <th>Adjusted Price</th>
                        <th>Use Base</th>
                        <th>Share Type</th>
                        <th>Share Val.</th>
                        <th>Dr. Share</th>
                        <th>Clinic<br />Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.rows.map((r) => {
                        const s = SVC_MAP[r.id];
                        const { price, eff, dr, bad } = calc(r);
                        return (
                          <tr key={r.id}>
                            <td>
                              <label className={cx("fee-svc")}>
                                <input
                                  type="checkbox"
                                  checked={r.sel}
                                  onChange={() => setRow(r.id, { sel: !r.sel })}
                                />
                                <span>{s.name}</span>
                              </label>
                              <button className={cx("fee-rm")} onClick={() => removeRow(r.id)} title="Remove">
                                <X size={10} />
                              </button>
                            </td>
                            <td><span className={cx("fee-type")}>{s.type}</span></td>
                            <td className={cx("fee-base")}>Rs. {price}</td>
                            <td>
                              {r.useBase ? (
                                <b className={cx("fee-adj")}>Rs. {price}</b>
                              ) : (
                                <label className={cx("fee-adjbox")}>
                                  <span>Rs.</span>
                                  <input
                                    type="number"
                                    value={r.adjusted}
                                    onChange={(e) => setRow(r.id, { adjusted: e.target.value })}
                                  />
                                </label>
                              )}
                            </td>
                            <td>
                              <span className={cx("fee-usebase")}>
                                <button
                                  className={cx("fee-sw" + (r.useBase ? " fee-sw-on" : ""))}
                                  onClick={() =>
                                    setRow(
                                      r.id,
                                      r.useBase
                                        ? { useBase: false, adjusted: r.adjusted === "" ? String(price) : r.adjusted }
                                        : { useBase: true }
                                    )
                                  }
                                />
                                <span>{r.useBase ? "Base" : "Custom"}</span>
                              </span>
                            </td>
                            <td>
                              <div className={cx("fee-seg2")}>
                                <button
                                  className={cx(r.shareType === "%" ? "fee-seg2-on" : "")}
                                  onClick={() => setRow(r.id, { shareType: "%" })}
                                >
                                  %
                                </button>
                                <button
                                  className={cx(r.shareType === "Rs" ? "fee-seg2-on" : "")}
                                  onClick={() => setRow(r.id, { shareType: "Rs" })}
                                >
                                  Rs.
                                </button>
                              </div>
                            </td>
                            <td>
                              <input
                                type="number"
                                className={cx("fee-inp fee-sval" + (bad ? " fee-sval-bad" : ""))}
                                placeholder={r.shareType === "%" ? "%" : "Rs."}
                                value={r.shareVal}
                                onChange={(e) => setRow(r.id, { shareVal: e.target.value })}
                              />
                            </td>
                            <td className={cx("fee-dash")}>
                              {dr === null ? "—" : <b className={cx(bad ? "fee-neg" : "")}>Rs. {dr}</b>}
                            </td>
                            <td className={cx("fee-dash")}>
                              {dr === null ? "—" : <b className={cx(bad ? "fee-neg" : "")}>Rs. {eff - dr}</b>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {done.length > 0 && (
                    <div className={cx("fee-tfoot")}>
                      <span>
                        Total Dr. Share ({done.length} svcs): <b className={cx("fee-tot-dr")}>Rs. {drTotal}</b>
                      </span>
                      <span>
                        Total Clinic Share: <b className={cx("fee-tot-cl")}>Rs. {clinicTotal}</b>
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {assignOpen && (
        <AssignModal doc={doc} onClose={() => setAssignOpen(false)} onConfirm={confirmAssign} />
      )}
      {bulkOpen && (
        <BulkModal
          rows={doc.rows}
          onClose={() => setBulkOpen(false)}
          onApply={(rows) => {
            setRows(rows);
            setBulkOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default FeesShares;
