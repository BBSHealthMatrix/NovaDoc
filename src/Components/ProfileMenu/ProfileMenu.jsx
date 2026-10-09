import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./ProfileMenu.module.css";

const cx = createClassNames(styles);

// same key + event the Profile Settings page saves with
const STORAGE_KEY = "novadoc-profile";
const PROFILE_UPDATED_EVENT = "novadoc-profile-updated";

const readSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.profile ? saved : null;
  } catch {
    return null;
  }
};

const ProfileMenu = ({ children, name = "Jane Doe", role = "Finance Manager" }) => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const ref = useRef(null);
  const navigate = useNavigate();

  // refresh when Profile Settings saves (same tab) or another tab changes storage
  useEffect(() => {
    const update = () => setSaved(readSaved());
    window.addEventListener(PROFILE_UPDATED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const go = (path) => { setOpen(false); navigate(path); };

  const p = saved?.profile;
  const shownName = p ? `${p.firstName} ${p.lastName}` : name;
  const shownRole = p?.role ?? role;
  const initials = p ? `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase() : "";

  // nothing saved yet → show the avatar Navbar passes in (unchanged look)
  let avatar = children;
  if (saved?.photo) avatar = <img className={cx("pm-me")} src={saved.photo} alt={shownName} />;
  else if (p) avatar = <span className={cx("pm-me")}>{initials}</span>;

  return (
    <div className={cx("pm-wrap")} ref={ref}>
      <button className={cx("pm-trigger")} onClick={() => setOpen((o) => !o)}>{avatar}</button>

      {open && (
        <div className={cx("pm-menu")}>
          <div className={cx("pm-head")}>
            <b>{shownName}</b>
            <span>{shownRole}</span>
          </div>
          <button className={cx("pm-item")} onClick={() => go("/admin")}>Admin Settings</button>
          <button className={cx("pm-item")} onClick={() => go("/profile")}>Profile Settings</button>
          <button className={cx("pm-item")} onClick={() => go("/admin-login")}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;