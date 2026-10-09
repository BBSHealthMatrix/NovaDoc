import { createClassNames } from "../../utils/classNames.js";
import { useMemo, useState } from "react";
import { Check, ChevronRight, Info, Minus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { SERVICE_TYPES, SERVICES, PACKAGES } from "./PackagesData.js";
import styles from "./Packages.module.css";

const cx = createClassNames(styles);

const TYPE_OPTIONS = [{ value: "All types", label: "All types" }, ...SERVICE_TYPES.map((t) => ({ value: t, label: t }))];

/* ── wizard steps ── */
const Step1 = ({ form, set }) => (
  <div className={cx("pk-step1")}>
    <label className={cx("pk-flabel")}>Package Name <b>*</b></label>
    <input className={cx("pk-finput")} placeholder="e.g. Executive Health Check-up" value={form.name} onChange={(e) => set({ name: e.target.value })} />

    <label className={cx("pk-flabel pk-mt")}>Description</label>
    <textarea className={cx("pk-ftextarea")} placeholder="Brief description of what this package includes..." value={form.desc} onChange={(e) => set({ desc: e.target.value })} />

    <label className={cx("pk-flabel pk-mt")}>Package Type</label>
    <div className={cx("pk-types")}>
      {["Fixed", "Recurring"].map((t) => (
        <button type="button" key={t} className={cx(`pk-type ${form.type === t ? "pk-type-on" : ""}`)} onClick={() => set({ type: t })}>
          <b>{t} Package</b>
          <span>{t === "Fixed" ? "One-time or fixed-term bundle" : "Repeatable on a schedule"}</span>
        </button>
      ))}
    </div>

    <div className={cx("pk-active")}>
      <Toggle size="medium" color="softBlue" className={cx("pk-tg")} on={form.active} onChange={() => set({ active: !form.active })} label="Active" />
      <div>
        <p className={cx("pk-aname")}>Active</p>
        <p className={cx("pk-adesc")}>Inactive packages won't be visible for billing.</p>
      </div>
    </div>
  </div>
);

const Step2 = ({ form, set }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All types");

  const available = useMemo(() => {
    let list = SERVICES;
    if (filter !== "All types") list = list.filter((s) => s.type === filter);
    if (search) { const q = search.toLowerCase(); list = list.filter((s) => s.name.toLowerCase().includes(q)); }
    return list;
  }, [search, filter]);

  const selected = form.items; // [{ id, name, type, price, qty }]
  const ids = new Set(selected.map((s) => s.id));

  const toggle = (svc) => {
    if (ids.has(svc.id)) set({ items: selected.filter((s) => s.id !== svc.id) });
    else set({ items: [...selected, { ...svc, qty: 1 }] });
  };
  const setQty = (id, d) => set({ items: selected.map((s) => s.id === id ? { ...s, qty: Math.max(1, s.qty + d) } : s) });
  const remove = (id) => set({ items: selected.filter((s) => s.id !== id) });
  const base = selected.reduce((t, s) => t + s.price * s.qty, 0);

  return (
    <div className={cx("pk-step2")}>
      <div className={cx("pk-left")}>
        <div className={cx("pk-lhead")}>
          <p className={cx("pk-lhtext")}>Available Services</p>
        </div>
        <div className={cx("pk-lbar")}>
          <div className={cx("pk-lsearch")}>
            <Search size={12} />
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={cx("pk-lsel")}>
            <Select value={filter} options={TYPE_OPTIONS} onChange={setFilter} label="Filter by type" />
          </div>
        </div>
        <div className={cx("pk-llist")}>
          {available.map((s) => (
            <button type="button" key={s.id} className={cx(`pk-litem ${ids.has(s.id) ? "pk-litem-on" : ""}`)} onClick={() => toggle(s)}>
              <span className={cx("pk-chk")}>{ids.has(s.id) && <Check size={10} />}</span>
              <div>
                <p className={cx("pk-lname")}>{s.name}</p>
                <p className={cx("pk-lsub")}>{s.type} · Rs. {s.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={cx("pk-right")}>
        <div className={cx("pk-rhead")}>
          <p className={cx("pk-lhtext")}>Selected Services</p>
          <em className={cx("pk-rcount")}>{selected.length} selected</em>
        </div>
        {selected.length === 0 ? (
          <div className={cx("pk-empty")}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="3" stroke="#cad5e2" strokeWidth="1.5" /><path d="M16 20h16M16 26h10" stroke="#cad5e2" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p>Select services from the left.</p>
          </div>
        ) : (
          <>
            <div className={cx("pk-ritems")}>
              {selected.map((s) => (
                <div className={cx("pk-ritem")} key={s.id}>
                  <div className={cx("pk-rinfo")}>
                    <p className={cx("pk-rname")}>{s.name}</p>
                    <p className={cx("pk-rprice")}>Rs. {s.price.toLocaleString()} × {s.qty} = Rs. {(s.price * s.qty).toLocaleString()}</p>
                  </div>
                  <div className={cx("pk-rqty")}>
                    <button type="button" onClick={() => setQty(s.id, -1)} aria-label="Decrease"><Minus size={10} /></button>
                    <span>{s.qty}</span>
                    <button type="button" onClick={() => setQty(s.id, 1)} aria-label="Increase"><Plus size={10} /></button>
                  </div>
                  <button type="button" className={cx("pk-rx")} onClick={() => remove(s.id)} aria-label="Remove"><X size={10} /></button>
                </div>
              ))}
            </div>
            <div className={cx("pk-rbase")}>
              <span>Base Total</span>
              <b>Rs. {base.toLocaleString()}</b>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Step3 = ({ form, set }) => {
  const base = form.items.reduce((t, s) => t + s.price * s.qty, 0);
  const discVal = Number(form.discountVal) || 0;
  const discAmt = form.pricing === "Fixed" ? 0 : form.discountMode === "%" ? Math.round(base * discVal / 100) : discVal;
  const final = form.pricing === "Fixed" ? (Number(form.fixedPrice) || 0) : Math.max(0, base - discAmt);

  return (
    <div className={cx("pk-step3")}>
      <label className={cx("pk-flabel")}>Pricing Model</label>
      <div className={cx("pk-types")}>
        {["Auto-Calculated", "Fixed"].map((t) => (
          <button type="button" key={t} className={cx(`pk-type ${form.pricing === t ? "pk-type-on" : ""}`)} onClick={() => set({ pricing: t })}>
            <b>{t === "Auto-Calculated" ? "Auto-Calculated" : "Fixed Price"}</b>
            <span>{t === "Auto-Calculated" ? "Sum of services with optional discount" : "Set the final price manually"}</span>
          </button>
        ))}
      </div>

      {form.pricing === "Auto-Calculated" ? (
        <>
          <label className={cx("pk-flabel pk-mt")}>Discount (optional)</label>
          <div className={cx("pk-disc")}>
            <div className={cx("pk-dseg")}>
              {["%", "Rs."].map((m) => (
                <button type="button" key={m} className={cx(form.discountMode === m ? "pk-dseg-on" : "")} onClick={() => set({ discountMode: m })}>{m}</button>
              ))}
            </div>
            <input className={cx("pk-finput pk-dinput")} placeholder={form.discountMode === "%" ? "e.g. 15" : "e.g. 500"} value={form.discountVal} onChange={(e) => set({ discountVal: e.target.value.replace(/[^\d.]/g, "") })} />
          </div>
        </>
      ) : (
        <>
          <label className={cx("pk-flabel pk-mt")}>Fixed Package Price (Rs.) <b>*</b></label>
          <input className={cx("pk-finput")} placeholder="e.g. 8500" value={form.fixedPrice} onChange={(e) => set({ fixedPrice: e.target.value.replace(/[^\d]/g, "") })} />
        </>
      )}

      <div className={cx("pk-breakdown")}>
        <p className={cx("pk-bhead")}>PRICE BREAKDOWN</p>
        <div className={cx("pk-brow")}><span>Total Base Price</span><span>Rs. {base.toLocaleString()}</span></div>
        <div className={cx("pk-brow")}><span>Discount</span><span>{discAmt > 0 ? `−Rs. ${discAmt.toLocaleString()}` : "—"}</span></div>
        <div className={cx("pk-brow pk-bfinal")}><span>Final Package Price</span><span>Rs. {final.toLocaleString()}</span></div>
      </div>

      <div className={cx("pk-pair")}>
        <div>
          <label className={cx("pk-flabel")}>Validity (days)</label>
          <input className={cx("pk-finput")} placeholder="Leave blank for no expiry" value={form.validity} onChange={(e) => set({ validity: e.target.value.replace(/[^\d]/g, "") })} />
        </div>
        <div>
          <label className={cx("pk-flabel")}>Usage Limit</label>
          <input className={cx("pk-finput")} placeholder="0 = unlimited" value={form.usage} onChange={(e) => set({ usage: e.target.value.replace(/[^\d]/g, "") })} />
        </div>
      </div>

      <div className={cx("pk-info")}>
        <Info size={13} />
        <p>Doctor share for each service in this package will be calculated using the <b>existing service-level share rules</b> configured under Fees &amp; Shares.</p>
      </div>
    </div>
  );
};

/* ── main component ── */
const Packages = () => {
  const [packages, setPackages] = useState(PACKAGES);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [wizard, setWizard] = useState(null); // null = list, { step, ...form }

  const filtered = useMemo(() => {
    let list = packages;
    if (tab === "Active") list = list.filter((p) => p.active);
    if (tab === "Inactive") list = list.filter((p) => !p.active);
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q)); }
    return list;
  }, [packages, tab, search]);

  const toggle = (id) => setPackages((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const remove = (id) => setPackages((p) => p.filter((x) => x.id !== id));

  const openWizard = () => setWizard({ step: 1, name: "", desc: "", type: "Fixed", active: true, items: [], pricing: "Auto-Calculated", discountMode: "%", discountVal: "", fixedPrice: "", validity: "", usage: "" });
  const setForm = (patch) => setWizard((p) => ({ ...p, ...patch }));
  const next = () => setForm({ step: wizard.step + 1 });
  const back = () => wizard.step === 1 ? setWizard(null) : setForm({ step: wizard.step - 1 });

  const create = () => {
    const base = wizard.items.reduce((t, s) => t + s.price * s.qty, 0);
    const disc = wizard.pricing === "Fixed" ? 0 : wizard.discountMode === "%" ? Math.round(base * (Number(wizard.discountVal) || 0) / 100) : (Number(wizard.discountVal) || 0);
    const price = wizard.pricing === "Fixed" ? (Number(wizard.fixedPrice) || 0) : Math.max(0, base - disc);
    const now = new Date();
    const created = `${String(now.getDate()).padStart(2, "0")}-${now.toLocaleString("en", { month: "short" })}-${now.getFullYear()}`;
    setPackages((p) => [...p, { id: Date.now(), name: wizard.name, desc: wizard.desc, services: wizard.items.length, price, type: wizard.type, active: wizard.active, created }]);
    setWizard(null);
  };

  /* ── wizard view ── */
  if (wizard) {
    const steps = ["Basic Info", "Add Services", "Pricing"];
    return (
      <div className={cx("pk-wiz")}>
        <div className={cx("pk-whead")}>
          <button type="button" className={cx("pk-wclose")} onClick={() => setWizard(null)} aria-label="Close"><X size={14} /></button>
          <h1 className={cx("pk-wtitle")}>New Package</h1>
        </div>

        <div className={cx("pk-stepper")}>
          {steps.map((s, i) => {
            const num = i + 1;
            const done = wizard.step > num;
            const active = wizard.step === num;
            return (
              <div className={cx("pk-si")} key={s} style={{ flex: i < 2 ? 1 : "none" }}>
                <div className={cx(`pk-sn ${done ? "pk-sn-done" : ""} ${active ? "pk-sn-active" : ""}`)}>
                  {done ? <Check size={12} /> : num}
                </div>
                <span className={cx(`pk-sl ${active || done ? "pk-sl-on" : ""}`)}>{s}</span>
                {i < 2 && <div className={cx(`pk-sline ${done ? "pk-sline-done" : ""}`)} />}
              </div>
            );
          })}
        </div>

        <div className={cx("pk-wbody")}>
          {wizard.step === 1 && <Step1 form={wizard} set={setForm} />}
          {wizard.step === 2 && <Step2 form={wizard} set={setForm} />}
          {wizard.step === 3 && <Step3 form={wizard} set={setForm} />}
        </div>

        <div className={cx("pk-wfoot")}>
          <button type="button" className={cx("pk-back")} onClick={back}>
            <span>‹</span> {wizard.step === 1 ? "Cancel" : "Back"}
          </button>
          {wizard.step < 3 ? (
            <button type="button" className={cx("pk-next")} onClick={next} disabled={wizard.step === 1 && !wizard.name.trim()}>
              Continue <ChevronRight size={12} />
            </button>
          ) : (
            <button type="button" className={cx("pk-next pk-create")} onClick={create} disabled={!wizard.name.trim()}>
              <Check size={12} /> Create Package
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── list view ── */
  return (
    <div className={cx("pk-wrap")}>
      <div className={cx("pk-head")}>
        <div>
          <h1 className={cx("pk-title")}>Packages &amp; Bundles</h1>
          <p className={cx("pk-desc")}>Group services into priced bundles for patients and corporates.</p>
        </div>
        <button type="button" className={cx("pk-btn")} onClick={openWizard}><Plus size={14} /> New Package</button>
      </div>

      <div className={cx("pk-bar")}>
        <div className={cx("pk-search")}>
          <Search size={12} />
          <input placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={cx("pk-tabs")}>
          {["All", "Active", "Inactive"].map((t) => (
            <button type="button" key={t} className={cx(`pk-tab ${tab === t ? "pk-tab-on" : ""}`)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <em className={cx("pk-count")}>{filtered.length} package{filtered.length !== 1 ? "s" : ""}</em>
      </div>

      <div className={cx("pk-card")}>
        <div className={cx("pk-row pk-th")}>
          <span>Package Name</span>
          <span className={cx("pk-center")}>Services</span>
          <span className={cx("pk-center")}>Final Price</span>
          <span className={cx("pk-center")}>Type</span>
          <span>Status</span>
          <span>Created</span>
        </div>
        {filtered.map((p) => (
          <div className={cx("pk-row pk-tr")} key={p.id}>
            <div className={cx("pk-pname")}>
              <p className={cx("pk-pn")}>{p.name}</p>
              <p className={cx("pk-pd")}>{p.desc.length > 50 ? p.desc.slice(0, 50) + "..." : p.desc}</p>
            </div>
            <span className={cx("pk-center pk-svcs")}>{p.services} svcs</span>
            <span className={cx("pk-center pk-price")}>Rs. {p.price.toLocaleString()}</span>
            <span className={cx("pk-center")}>
              <span className={cx(`pk-tbadge ${p.type === "Recurring" ? "pk-tbadge-rec" : ""}`)}>{p.type}</span>
            </span>
            <div className={cx("pk-status")}>
              <Toggle size="medium" color="softBlue" className={cx("pk-tg")} on={p.active} onChange={() => toggle(p.id)} label={`${p.name} status`} />
              <span className={cx(p.active ? "pk-aon" : "pk-aoff")}>{p.active ? "Active" : "Inactive"}</span>
            </div>
            <span className={cx("pk-date")}>{p.created}</span>
            <div className={cx("pk-actions")}>
              <button type="button" aria-label="Edit"><Pencil size={12} /></button>
              <button type="button" onClick={() => remove(p.id)} aria-label="Delete"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;