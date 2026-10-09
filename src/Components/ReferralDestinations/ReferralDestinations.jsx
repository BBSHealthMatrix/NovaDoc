import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Search, Plus, MapPin, Pencil, Trash2, X, Save } from "lucide-react";
import { CATEGORIES, DESTINATIONS, BLANK } from "./ReferralDestinationsData.js";
import styles from "./ReferralDestinations.module.css";

const cx = createClassNames(styles);

const ReferralDestinations = () => {
  const [items, setItems] = useState(DESTINATIONS);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null); // null | { id?, name, category, services[], active }
  const [service, setService] = useState("");

  const term = q.trim().toLowerCase();
  const list = items.filter((d) => [d.name, d.category, ...d.services].some((t) => t.toLowerCase().includes(term)));

  const openForm = (d) => {
    setForm(d ? { ...d, services: [...d.services] } : { ...BLANK });
    setService("");
  };

  const addService = () => {
    const s = service.trim();
    if (s && !form.services.includes(s)) setForm({ ...form, services: [...form.services, s] });
    setService("");
  };

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const item = { ...form, name };
    setItems((p) => (form.id ? p.map((d) => (d.id === form.id ? item : d)) : [...p, { ...item, id: Date.now() }]));
    setForm(null);
  };

  const del = (id) => {
    setItems((p) => p.filter((d) => d.id !== id));
    if (form?.id === id) setForm(null);
  };

  return (
    <div className={cx("ref-page")}>
      <div className={cx("ref-header")}>
        <h1 className={cx("ref-title")}>Referral Destinations</h1>
        <p className={cx("ref-desc")}>Manage the list of referral destinations available in the SOAP note.</p>
      </div>

      <div className={cx("ref-body")}>
        <div className={cx("ref-main")}>
          <div className={cx("ref-bar")}>
            <div className={cx("ref-search")}>
              <Search size={12} />
              <input autoFocus placeholder="Search destinations..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <button type="button" className={cx("ref-add")} onClick={() => openForm(null)}>
              <Plus size={12} /> Add Destination
            </button>
          </div>

          <div className={cx("ref-list")}>
            {list.map((d) => (
              <div className={cx(`ref-card ${d.active ? "" : "ref-off"}`)} key={d.id}>
                <MapPin size={15} className={cx("ref-pin")} />
                <div className={cx("ref-info")}>
                  <div className={cx("ref-top")}>
                    <span className={cx("ref-name")}>{d.name}</span>
                    <span className={cx("ref-cat")}>{d.category}</span>
                  </div>
                  <div className={cx("ref-tags")}>
                    {d.services.map((s) => <span className={cx("ref-tag")} key={s}>{s}</span>)}
                  </div>
                </div>
                <button type="button" className={cx("ref-ic")} onClick={() => openForm(d)} aria-label={`Edit ${d.name}`}><Pencil size={12} /></button>
                <button type="button" className={cx("ref-ic ref-del")} onClick={() => del(d.id)} aria-label={`Delete ${d.name}`}><Trash2 size={13} /></button>
              </div>
            ))}
            {list.length === 0 && <p className={cx("ref-empty")}>No destinations found.</p>}
          </div>
        </div>

        {form && (
          <aside className={cx("ref-panel")}>
            <div className={cx("ref-phead")}>
              <h2>{form.id ? "Edit Destination" : "Add Destination"}</h2>
              <button type="button" className={cx("ref-close")} onClick={() => setForm(null)} aria-label="Close"><X size={13} /></button>
            </div>

            <div className={cx("ref-pbody")} key={form.id || "new"}>
              <label className={cx("ref-field")}>
                <span>Facility Name *</span>
                <input className={cx("ref-in")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className={cx("ref-field")}>
                <span>Category</span>
                <select autoFocus className={cx("ref-select")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <div className={cx("ref-field")}>
                <span>Services Offered</span>
                {form.services.length > 0 && (
                  <div className={cx("ref-chips")}>
                    {form.services.map((s) => (
                      <span className={cx("ref-chip")} key={s}>
                        {s}
                        <button type="button" onClick={() => setForm({ ...form, services: form.services.filter((x) => x !== s) })} aria-label={`Remove ${s}`}><X size={8} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className={cx("ref-svc")}>
                  <input
                    className={cx("ref-in ref-svc-in")}
                    placeholder="Add service..."
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addService(); }}
                  />
                  <button type="button" className={cx("ref-svc-btn")} onClick={addService}>Add</button>
                </div>
              </div>
              <label className={cx("ref-check")}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active
              </label>
            </div>

            <div className={cx("ref-pfoot")}>
              <button type="button" className={cx("ref-save")} onClick={save}><Save size={12} /> Save Changes</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ReferralDestinations;