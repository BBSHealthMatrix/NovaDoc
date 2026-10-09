import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { COUNTERS, ROLES } from "./UsersCountersData.js";
import styles from "./UserModal.module.css";

const cx = createClassNames(styles);

const UserModal = ({ user, onClose, onSave }) => {
  const isEdit = Boolean(user);
  const [showPw, setShowPw] = useState(false);
  const [f, setF] = useState({
    name: user?.name ?? "",
    loginId: user?.loginId ?? "",
    password: user?.password ?? "",
    role: user?.role ?? "Front Desk",
    counter: user?.counter ?? "None",
    active: user?.active ?? true,
  });
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const valid = f.name.trim() && f.loginId.trim() && f.password.length >= 6;
  const save = () => {
    if (!valid) return;
    onSave({ ...f, name: f.name.trim(), loginId: f.loginId.trim() });
  };

  return (
    <div className={cx("ucm-overlay")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx("ucm-modal")} role="dialog" aria-modal="true">
        <button type="button" className={cx("ucm-close")} onClick={onClose} aria-label="Close"><X size={15} /></button>
        <h2 className={cx("ucm-title")}>{isEdit ? "Edit User" : "Add User"}</h2>

        <label className={cx("ucm-lbl ucm-first")} htmlFor="ucm-name">Full Name <em>*</em></label>
        <input id="ucm-name" className={cx("ucm-input")} placeholder="e.g. Ayesha Khan" autoFocus value={f.name} onChange={(e) => set({ name: e.target.value })} />

        <div className={cx("ucm-grid")}>
          <div>
            <label className={cx("ucm-lbl")} htmlFor="ucm-login">Login ID <em>*</em></label>
            <input id="ucm-login" className={cx("ucm-input ucm-mono")} placeholder="e.g. ayesha.k" value={f.loginId} onChange={(e) => set({ loginId: e.target.value })} />
          </div>
          <div>
            <label className={cx("ucm-lbl")} htmlFor="ucm-pw">Password {!isEdit && <em>*</em>}</label>
            <div className={cx("ucm-pw")}>
              <input
                id="ucm-pw" type={showPw ? "text" : "password"} className={cx("ucm-input")} placeholder="Min. 6 characters"
                value={f.password} onChange={(e) => set({ password: e.target.value })}
              />
              <button type="button" className={cx("ucm-eye")} onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className={cx("ucm-lbl")}>Role</label>
            <div className={cx("ucm-sel")}>
              <Select value={f.role} options={ROLES} onChange={(v) => set({ role: v })} label="Role" />
            </div>
          </div>
          <div>
            <label className={cx("ucm-lbl")}>Assigned Counter</label>
            <div className={cx("ucm-sel")}>
              <Select value={f.counter} options={COUNTERS} onChange={(v) => set({ counter: v })} label="Assigned Counter" />
            </div>
          </div>
        </div>

        <div className={cx("ucm-active")}>
          <Toggle on={f.active} onChange={() => set({ active: !f.active })} size="large" color="green" label="Active" />
          <div>
            <div className={cx("ucm-alabel")}>Active</div>
            <div className={cx("ucm-ahelp")}>Inactive users cannot log in. One active session per user is enforced.</div>
          </div>
        </div>

        <div className={cx("ucm-foot")}>
          <button type="button" className={cx("ucm-btn ucm-ghost")} onClick={onClose}>Cancel</button>
          <button type="button" className={cx("ucm-btn ucm-primary")} onClick={save}>
            <Check size={14} /> {isEdit ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;