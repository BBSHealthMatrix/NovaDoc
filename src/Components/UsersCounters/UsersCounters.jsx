import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import UserModal from "./UserModal";
import { AVATAR_COLORS, FILTERS, ROLE_KEY, USERS, initials, todayLabel } from "./UsersCountersData.js";
import styles from "./UsersCounters.module.css";

const cx = createClassNames(styles);

const STATS = [
  { role: "Admin", label: "Admins", icon: "🛡️", key: "admin" },
  { role: "Front Desk", label: "Front Desks", icon: "📱", key: "desk" },
  { role: "Doctor", label: "Doctors", icon: "🩺", key: "doc" },
];

const UsersCounters = () => {
  const [users, setUsers] = useState(USERS);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | { user } (user = null for Add)

  const rows = filter === "All" ? users : users.filter((u) => u.role === filter);
  const patch = (id, p) => setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...p } : u)));
  const remove = (id) => setUsers((list) => list.filter((u) => u.id !== id));

  const save = (data) => {
    if (modal.user) {
      patch(modal.user.id, data);
    } else {
      setUsers((list) => [...list, {
        id: Date.now(), joined: todayLabel(), color: AVATAR_COLORS[list.length % AVATAR_COLORS.length], ...data,
      }]);
    }
    setModal(null);
  };

  return (
    <div className={cx("uc-wrap")}>
      <div className={cx("uc-inner")}>
        {/* ── header ── */}
        <div className={cx("uc-head")}>
          <div>
            <h1 className={cx("uc-title")}>Users &amp; Counter Mapping</h1>
            <p className={cx("uc-desc")}>Manage system users, roles, login credentials, and counter assignments.</p>
          </div>
          <button type="button" className={cx("uc-add")} onClick={() => setModal({ user: null })}><Plus size={15} /> Add User</button>
        </div>

        {/* ── role filter ── */}
        <div className={cx("uc-bar")}>
          <div className={cx("uc-seg")}>
            {FILTERS.map((f) => (
              <button type="button" key={f} className={cx(`uc-segb ${filter === f ? "uc-segb-on" : ""}`)} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <span className={cx("uc-count")}>{rows.length} {rows.length === 1 ? "user" : "users"}</span>
        </div>

        {/* ── stats ── */}
        <div className={cx("uc-stats")}>
          {STATS.map((s) => {
            const list = users.filter((u) => u.role === s.role);
            return (
              <div key={s.role} className={cx(`uc-stat uc-stat-${s.key}`)}>
                <div className={cx("uc-slbl")}><span className={cx("uc-sico")}>{s.icon}</span> {s.label}</div>
                <div className={cx("uc-sval")}>{list.length}</div>
                <div className={cx("uc-ssub")}>{list.filter((u) => u.active).length} active</div>
              </div>
            );
          })}
        </div>

        {/* ── table ── */}
        <div className={cx("uc-tbl")}>
          <div className={cx("uc-row uc-thead")}>
            <span>User</span><span>Role</span><span>Login ID</span><span>Assigned Counter</span><span>Status</span><span>Joined</span>
          </div>
          {rows.map((u) => (
            <div key={u.id} className={cx("uc-row")}>
              <span className={cx("uc-user")}>
                <i className={cx("uc-av")} style={{ background: u.color }}>{initials(u.name)}</i>
                <b>{u.name}</b>
              </span>
              <span><em className={cx(`uc-role uc-role-${ROLE_KEY[u.role]}`)}>{u.role}</em></span>
              <span className={cx("uc-login")}>{u.loginId}</span>
              <span className={cx(`uc-counter ${u.counter === "None" ? "uc-dash" : ""}`)}>{u.counter === "None" ? "—" : u.counter}</span>
              <span className={cx("uc-status")}>
                <Toggle on={u.active} onChange={() => patch(u.id, { active: !u.active })} size="small" color="green" label={`${u.name} active`} />
                <span className={cx(u.active ? "uc-on" : "uc-off")}>{u.active ? "Active" : "Off"}</span>
              </span>
              <span className={cx("uc-joined")}>
                <span className={cx("uc-date")}>{u.joined}</span>
                <span className={cx("uc-acts")}>
                  <button type="button" className={cx("uc-ibtn uc-edit")} onClick={() => setModal({ user: u })} aria-label={`Edit ${u.name}`}><Pencil size={13} /></button>
                  <button type="button" className={cx("uc-ibtn uc-del")} onClick={() => remove(u.id)} aria-label={`Delete ${u.name}`}><Trash2 size={13} /></button>
                </span>
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className={cx("uc-none")}>No users found.</p>}
        </div>
      </div>

      {modal && <UserModal user={modal.user} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default UsersCounters;