import { createClassNames } from "../../utils/classNames.js";
import { Fragment, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { DOCTORS, PROVIDER_GROUPS, VISIT_TYPES, rs } from "./CorporatePricingData.js";
import styles from "./CorporateModal.module.css";

const cx = createClassNames(styles);

const STEP_TITLES = ["Corporate Information", "Doctor Selection", "Service Selection"];
// price shown per visit type in Step 2 = highest across the doctor's specialties
const maxOf = (d, k) => Math.max(...d.specialties.map((s) => s[k]));

const CorporateModal = ({ corporate, onClose, onSave }) => {
  const isEdit = Boolean(corporate);
  const fileRef = useRef(null);
  const [step, setStep] = useState(1);
  const [f, setF] = useState({
    name: corporate?.name ?? "",
    person: corporate?.person ?? "",
    phone: corporate?.phone ?? "",
    email: corporate?.email ?? "",
    mou: corporate?.mou ?? "",
    creditEnabled: corporate?.creditEnabled ?? false,
    creditLimit: corporate?.creditLimit ? String(corporate.creditLimit) : "",
    newPricing: corporate?.newPricing ?? "Use Adjusted Price",
    doctors: corporate?.doctors ?? [],
    providers: corporate?.providers ?? Object.fromEntries(PROVIDER_GROUPS.map((g) => [g.key, null])),
  });
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) set({ mou: file.name });
  };

  const toggleDoctor = (id) => set({ doctors: f.doctors.includes(id) ? f.doctors.filter((x) => x !== id) : [...f.doctors, id] });
  const allDocs = f.doctors.length === DOCTORS.length;
  const toggleAllDocs = () => set({ doctors: allDocs ? [] : DOCTORS.map((d) => d.id) });
  const setProvider = (key, id) => set({ providers: { ...f.providers, [key]: id } });

  const save = () => onSave({
    name: f.name.trim(), person: f.person.trim(), phone: f.phone.trim(), email: f.email.trim(), mou: f.mou,
    creditEnabled: f.creditEnabled, creditLimit: f.creditEnabled ? Number(f.creditLimit) || 0 : 0, newPricing: f.newPricing,
    doctors: DOCTORS.filter((d) => f.doctors.includes(d.id)).map((d) => d.id), providers: f.providers,
  });

  return (
    <div className={cx("crm-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("crm-modal")} role="dialog" aria-modal="true">
        <h2 className={cx("crm-title")}>{isEdit ? "Edit Corporate" : "Add Corporate"}</h2>

        <div className={cx("crm-steps")}>
          {[1, 2, 3].map((n) => (
            <Fragment key={n}>
              {n > 1 && <span className={cx("crm-sline")}>—</span>}
              <span className={cx(`crm-snum ${step === n ? "crm-snum-on" : ""}`)}>{n}</span>
            </Fragment>
          ))}
        </div>
        <button type="button" className={cx("crm-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>

        <div className={cx("crm-body")}>
          <div className={cx("crm-sec")}>Step {step} — {STEP_TITLES[step - 1]}</div>

          {/* ── step 1: corporate information ── */}
          {step === 1 && (
            <>
              <label className={cx("crm-lbl crm-first")} htmlFor="crm-name">Corporate Name <em>*</em></label>
              <input id="crm-name" className={cx("crm-input")} placeholder="Corporate name..." autoFocus value={f.name} onChange={(e) => set({ name: e.target.value })} />

              <div className={cx("crm-grid")}>
                <div>
                  <label className={cx("crm-lbl")} htmlFor="crm-person">Contact Person</label>
                  <input id="crm-person" className={cx("crm-input")} placeholder="Full name" value={f.person} onChange={(e) => set({ person: e.target.value })} />
                </div>
                <div>
                  <label className={cx("crm-lbl")} htmlFor="crm-phone">Phone</label>
                  <input id="crm-phone" className={cx("crm-input")} placeholder="+92 300..." value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
                </div>
              </div>

              <label className={cx("crm-lbl")} htmlFor="crm-email">Official Email</label>
              <input id="crm-email" type="email" className={cx("crm-input")} placeholder="contact@company.com" value={f.email} onChange={(e) => set({ email: e.target.value })} />

              <label className={cx("crm-lbl")}>Upload MOU (PDF)</label>
              <div className={cx("crm-upload")}>
                <button type="button" className={cx("crm-file")} onClick={() => fileRef.current?.click()}>
                  <Upload size={14} /> {f.mou || "Choose PDF file..."}
                </button>
                {f.mou && (
                  <button type="button" className={cx("crm-fx")} onClick={() => set({ mou: "" })} aria-label="Remove file"><X size={14} /></button>
                )}
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" hidden onChange={pickFile} />
              </div>

              <div className={cx("crm-card crm-credit")}>
                <div className={cx("crm-crow")}>
                  <span className={cx("crm-ctitle")}>Credit Allowance</span>
                  <Toggle
                    on={f.creditEnabled}
                    onChange={() => set({ creditEnabled: !f.creditEnabled })}
                    size="large"
                    color="softBlue"
                    className={cx("crm-tg")}
                    label="Credit Allowance"
                  />
                </div>
                {f.creditEnabled && (
                  <>
                    <label className={cx("crm-lbl crm-climit")} htmlFor="crm-limit">Credit Limit (Rs.)</label>
                    <div className={cx("crm-amount")}>
                      <span>Rs.</span>
                      <input id="crm-limit" type="number" min="0" step="any" placeholder="0" value={f.creditLimit} onChange={(e) => set({ creditLimit: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className={cx("crm-card crm-pricing")}>
                <div>
                  <div className={cx("crm-ptitle")}>New services pricing</div>
                  <div className={cx("crm-psub")}>When new services are added to the system</div>
                </div>
                <span className={cx("crm-seg")}>
                  <button type="button" className={cx(f.newPricing === "Use Base Price" ? "crm-seg-on" : "")} onClick={() => set({ newPricing: "Use Base Price" })}>Base</button>
                  <button type="button" className={cx(f.newPricing === "Use Adjusted Price" ? "crm-seg-on" : "")} onClick={() => set({ newPricing: "Use Adjusted Price" })}>Adjusted</button>
                </span>
              </div>

              <div className={cx("crm-foot crm-foot-end")}>
                <button type="button" className={cx("crm-btn crm-ghost")} onClick={onClose}>Cancel</button>
                <button type="button" className={cx("crm-btn crm-primary")} disabled={!f.name.trim()} onClick={() => setStep(2)}>Next: Doctors →</button>
              </div>
            </>
          )}

          {/* ── step 2: doctor selection ── */}
          {step === 2 && (
            <>
              <div className={cx("crm-docs")}>
                <div className={cx("crm-dhead")}>
                  <span className={cx("crm-dtitle")}>Consultant Doctors</span>
                  <span className={cx("crm-dcount")}>{f.doctors.length}/{DOCTORS.length}</span>
                  <button type="button" className={cx("crm-link")} onClick={toggleAllDocs}>{allDocs ? "Deselect All" : "Select All"}</button>
                </div>
                <div className={cx("crm-drow crm-dthead")}>
                  <span /><span>Doctor</span>
                  {VISIT_TYPES.map(([k, label]) => <span key={k}>{label === "Tele-Consult" ? "Tele" : label === "Consultation" ? "Consult" : label}</span>)}
                </div>
                {DOCTORS.map((d) => {
                  const on = f.doctors.includes(d.id);
                  return (
                    <label key={d.id} className={cx(`crm-drow ${on ? "crm-drow-on" : "crm-drow-off"}`)}>
                      <input type="checkbox" checked={on} onChange={() => toggleDoctor(d.id)} />
                      <span>
                        <span className={cx("crm-dname")}>{d.name}</span>
                        <span className={cx("crm-dspecs")}>
                          {d.specialties.map((s) => <em key={s.name}>{s.name}</em>)}
                        </span>
                      </span>
                      {VISIT_TYPES.map(([k]) => <span key={k} className={cx("crm-dprice")}>{rs(maxOf(d, k))}</span>)}
                    </label>
                  );
                })}
              </div>

              <div className={cx("crm-foot")}>
                <button type="button" className={cx("crm-btn crm-ghost")} onClick={() => setStep(1)}>← Back</button>
                <div className={cx("crm-foot-r")}>
                  <button type="button" className={cx("crm-btn crm-ghost")} onClick={onClose}>Cancel</button>
                  <button type="button" className={cx("crm-btn crm-primary")} onClick={() => setStep(3)}>Next: Services →</button>
                </div>
              </div>
            </>
          )}

          {/* ── step 3: service (provider) selection ── */}
          {step === 3 && (
            <>
              <div className={cx("crm-sub")}>Provider Selection</div>
              {PROVIDER_GROUPS.map((g) => (
                <div key={g.key} className={cx("crm-group")}>
                  <div className={cx("crm-ghead")}>
                    <i style={{ background: g.color }} /> {g.label}
                  </div>
                  <div className={cx("crm-gbody")}>
                    {[{ id: null, name: "None", type: "" }, ...g.options].map((o) => {
                      const on = (f.providers[g.key] ?? null) === o.id;
                      return (
                        <button type="button" key={o.id ?? "none"} className={cx(`crm-opt ${on ? "crm-opt-on" : ""}`)} onClick={() => setProvider(g.key, o.id)}>
                          <i className={cx("crm-radio")} />
                          <span>{o.name}</span>
                          {o.type && <em>({o.type})</em>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className={cx("crm-foot")}>
                <button type="button" className={cx("crm-btn crm-ghost")} onClick={() => setStep(2)}>← Back</button>
                <div className={cx("crm-foot-r")}>
                  <button type="button" className={cx("crm-btn crm-ghost")} onClick={onClose}>Cancel</button>
                  <button type="button" className={cx("crm-btn crm-primary")} onClick={save}>{isEdit ? "Save Changes" : "Add Corporate"}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateModal;