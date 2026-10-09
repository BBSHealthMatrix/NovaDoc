import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect, useRef } from "react";

import { Link, useLocation } from "react-router-dom";

import { ChevronDown, Search, Bell } from "lucide-react";

import ProfileMenu from "../ProfileMenu/ProfileMenu";

import { NAV } from "./NavbarData.js";

import styles from "./Navbar.module.css";

const cx = createClassNames(styles);

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null)
  const ref = useRef()
  const { pathname } = useLocation()
  const open = openMenu?.pathname === pathname ? openMenu.label : null
  const setOpen = (label) => setOpenMenu(label ? { pathname, label } : null)

   
    useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className={cx("navbar")}>
      <Link to="/" className={cx("logo")}>
        <svg width="24" height="22" viewBox="0 0 24 22">
          <path d="M2 2h3v18H2z" fill="#1e4fd8" />
          <path d="M8 2h5.5C19 2 22 6 22 11s-3 9-8.5 9H8v-3.2h5.3c3.6 0 5.4-2.4 5.4-5.8s-1.8-5.8-5.4-5.8H8z" fill="#0b1f3f" />
          <path d="M8 7l5 4-5 4z" fill="#1e4fd8" />
        </svg>
        NovaDoc
      </Link>

      <nav className={cx("nav")} ref={ref}>
        {NAV.map(({ label, icon: Icon, path, menu }) => {
          
          const active = menu
            ? menu.some((s) => s.items.some((i) => i[4] === pathname)) || (path !== '/' && pathname.startsWith(path))
            : pathname.startsWith(path)
          const cls = `nav-link ${active || open === label ? 'active' : ''}`

          if (!menu) {
            return <Link key={label} to={path} className={cx(cls)}><Icon size={14} />{label}</Link>
          }

          return (
            <div key={label} className={cx("nav-item")}>
              <button className={cx(cls)} onClick={() => setOpen(open === label ? null : label)}>
                <Icon size={14} />{label}<ChevronDown size={12} className={cx("chev")} />
              </button>

              {open === label && (
                <div className={cx("dropdown")}>
                  {menu.map((sec) => (
                    <div key={sec.title}>
                      <div className={cx("dd-title")}>{sec.title}</div>
                      {sec.items.map(([name, desc, ItemIcon, tone, to]) => (
                        <Link
                          key={name}
                          to={to}
                          className={cx(`dd-item ${pathname === to ? 'current' : ''}`)}
                          onClick={() => setOpen(null)}
                        >
                          <span className={cx(`dd-icon t-${tone}`)}><ItemIcon size={13} /></span>
                          <span><b>{name}</b><small>{desc}</small></span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className={cx("nav-right")}>
        <label className={cx("nav-search")}>
          <Search size={13} />
          <input placeholder="Search MRN, Name" />
        </label>
        <Bell size={15} color="#64748b" />
                <ProfileMenu>
          <span className={cx("me")}>NU</span>
        </ProfileMenu>
      </div>
    </header>
  )
};

export default Navbar;
