import { createClassNames } from "../../utils/classNames.js";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import styles from "./InsuranceModal.module.css";

const cx = createClassNames(styles);

const InsuranceModal = ({ insurance, onClose, onSave }) => {
  const isEdit = Boolean(insurance);
  const fileRef = useRef(null);
  const [f, setF] = useState({
    name: insurance?.name ?? "",
    person: insurance?.person ?? "",
    phone: insurance?.phone ?? "",
    email: insurance?.email ?? "",
    mou: insurance?.mou ?? "",
    creditEnabled: insurance?.creditEnabled ?? false,
    creditLimit: insurance?.creditLimit ? String(insurance.creditLimit) : "",
    newPricing: insurance?.newPricing ?? "Use Adjusted Price",
  });
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) set({ mou: file.name });
  };

  const save = () => onSave({
    name: f.name.trim(), person: f.person.trim(), phone: f.phone.trim(), email: f.email.trim(), mou: f.mou,
    creditEnabled: f.creditEnabled, creditLimit: f.creditEnabled ? Number(f.creditLimit) || 0 : 0, newPricing: f.newPricing,
  });

  return (
    <div className={cx("ipi-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("ipi-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("ipi-close")} onClick={onClose} aria-label="Close"><X size={14} /></button>
        <h2 className={cx("ipi-title")}>{isEdit ? "Edit Insurance" : "Add Insurance"}</h2>

        <div className={cx("ipi-body")}>
          <div className={cx("ipi-sec")}>Insurance Information</div>

          <label className={cx("ipi-lbl ipi-first")} htmlFor="ipi-name">Insurance Name <em>*</em></label>
          <input id="ipi-name" className={cx("ipi-input")} placeholder="Insurance name..." autoFocus value={f.name} onChange={(e) => set({ name: e.target.value })} />

          <div className={cx("ipi-grid")}>
            <div>
              <label className={cx("ipi-lbl")} htmlFor="ipi-person">Contact Person</label>
              <input id="ipi-person" className={cx("ipi-input")} placeholder="Full name" value={f.person} onChange={(e) => set({ person: e.target.value })} />
            </div>
            <div>
              <label className={cx("ipi-lbl")} htmlFor="ipi-phone">Phone</label>
              <input id="ipi-phone" className={cx("ipi-input")} placeholder="+92 300..." value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
          </div>

          <label className={cx("ipi-lbl")} htmlFor="ipi-email">Official Email</label>
          <input id="ipi-email" type="email" className={cx("ipi-input")} placeholder="contact@company.com" value={f.email} onChange={(e) => set({ email: e.target.value })} />

          <label className={cx("ipi-lbl")}>Upload MOU (PDF)</label>
          <div className={cx("ipi-upload")}>
            <button type="button" className={cx("ipi-file")} onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> {f.mou || "Choose PDF file..."}
            </button>
            {f.mou && (
              <button type="button" className={cx("ipi-fx")} onClick={() => set({ mou: "" })} aria-label="Remove file"><X size={14} /></button>
            )}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" hidden onChange={pickFile} />
          </div>

          <div className={cx("ipi-card ipi-credit")}>
            <div className={cx("ipi-crow")}>
              <span className={cx("ipi-ctitle")}>Credit Allowance</span>
              <Toggle
                on={f.creditEnabled}
                onChange={() => set({ creditEnabled: !f.creditEnabled })}
                size="large"
                color="softBlue"
                className={cx("ipi-tg")}
                label="Credit Allowance"
              />
            </div>
            {f.creditEnabled && (
              <>
                <label className={cx("ipi-lbl ipi-climit")} htmlFor="ipi-limit">Credit Limit (Rs.)</label>
                <div className={cx("ipi-amount")}>
                  <span>Rs.</span>
                  <input id="ipi-limit" type="number" min="0" step="any" placeholder="0" value={f.creditLimit} onChange={(e) => set({ creditLimit: e.target.value })} />
                </div>
              </>
            )}
          </div>

          <div className={cx("ipi-card ipi-pricing")}>
            <div>
              <div className={cx("ipi-ptitle")}>New services pricing</div>
              <div className={cx("ipi-psub")}>When new services are added to the system</div>
            </div>
            <span className={cx("ipi-seg")}>
              <button type="button" className={cx(f.newPricing === "Use Base Price" ? "ipi-seg-on" : "")} onClick={() => set({ newPricing: "Use Base Price" })}>Base</button>
              <button type="button" className={cx(f.newPricing === "Use Adjusted Price" ? "ipi-seg-on" : "")} onClick={() => set({ newPricing: "Use Adjusted Price" })}>Adjusted</button>
            </span>
          </div>

          <div className={cx("ipi-foot")}>
            <button type="button" className={cx("ipi-btn ipi-ghost")} onClick={onClose}>Cancel</button>
            <button type="button" className={cx("ipi-btn ipi-primary")} disabled={!f.name.trim()} onClick={save}>
              {isEdit ? "Save Changes" : "Add Insurance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceModal;