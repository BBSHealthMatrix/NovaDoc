import { useRef, useState } from "react";
import {
  Bell, Building2, CalendarDays, Check, CircleCheck, Eye, EyeOff, Info, Lock, LogOut, Mail,
  Monitor, Save, ShieldCheck, SlidersHorizontal, Smartphone, Trash2, Upload, UserRound,
} from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import styles from "./ProfileSettings.module.css";
import { createClassNames } from "../../utils/classNames.js";
import {
  PROFILE, DEPARTMENTS, PASSWORD_RULES, SESSIONS, NOTIFICATIONS,
  LANGUAGES, TIMEZONES, DATE_FORMATS, TIME_FORMATS, LANDING_PAGES, PREFERENCES,
  STORAGE_KEY, PROFILE_UPDATED_EVENT, MAX_PHOTO_MB,
} from "./ProfileSettingsData.js";

const cx = createClassNames(styles);

const TABS = [
  { id: "personal", label: "Personal Info", icon: UserRound },
  { id: "security", label: "Password & Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

const BAR_NOTE = {
  personal: "Your name and contact details are visible to other staff in NovaDoc.",
  security: "Use a strong password and sign out of devices you no longer use.",
  notifications: "Choose how you want to be notified for each type of activity.",
  preferences: "These settings only apply to your account on this device and others.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// read what was saved last time (empty object if nothing saved or storage blocked)
const loadSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const ProfileSettings = () => {
  const [stored] = useState(loadSaved);
  const [tab, setTab] = useState("personal");
  const [profile, setProfile] = useState({ ...PROFILE, ...stored.profile });
  const [photo, setPhoto] = useState(stored.photo ?? null);
  const [photoErr, setPhotoErr] = useState("");
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdChangedAt, setPwdChangedAt] = useState(stored.pwdChangedAt ?? null);
  const [twoFactor, setTwoFactor] = useState(stored.twoFactor ?? true);
  const [sessions, setSessions] = useState(stored.sessions ?? SESSIONS);
  const [notifs, setNotifs] = useState(
    NOTIFICATIONS.map((n) => ({ ...n, ...stored.notifs?.find((s) => s.id === n.id) }))
  );
  const [prefs, setPrefs] = useState({ ...PREFERENCES, ...stored.prefs });
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const initials = `${profile.firstName.trim()[0] ?? ""}${profile.lastName.trim()[0] ?? ""}`.toUpperCase();
  const setField = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));
  const setPwdField = (key) => (e) => { setPwdMsg(null); setPwd((p) => ({ ...p, [key]: e.target.value })); };
  const flip = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));
  const setPref = (key) => (value) => setPrefs((p) => ({ ...p, [key]: value }));
  const flipNotif = (id, key) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, [key]: !n[key] } : n)));
  const signOut = (id) => setSessions((prev) => prev.filter((s) => s.id !== id));
  const signOutOthers = () => setSessions((prev) => prev.filter((s) => s.current));

  const mismatch = pwd.confirm !== "" && pwd.confirm !== pwd.next;

  // required-field errors (only shown after a failed Save)
  const errors = {
    firstName: !profile.firstName.trim(),
    lastName: !profile.lastName.trim(),
    email: !EMAIL_RE.test(profile.email.trim()),
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const bad = (key) => (showErrors && errors[key] ? "ps-input-bad" : "");

  // photo: read the picked image as a data URL so it can be stored
  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoErr("Please choose an image file (JPG or PNG)."); return; }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) { setPhotoErr(`Image must be smaller than ${MAX_PHOTO_MB} MB.`); return; }
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result); setPhotoErr(""); };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => { setPhoto(null); setPhotoErr(""); };

  // password: checked here only — the current password can only be verified by a server
  const updatePassword = () => {
    if (!pwd.current) return setPwdMsg({ type: "err", text: "Enter your current password." });
    if (!PASSWORD_RULES.every((r) => r.test(pwd.next))) return setPwdMsg({ type: "err", text: "New password does not meet all the rules." });
    if (pwd.next === pwd.current) return setPwdMsg({ type: "err", text: "New password must be different from the current one." });
    if (pwd.next !== pwd.confirm) return setPwdMsg({ type: "err", text: "Passwords do not match." });
    const now = new Date().toISOString();
    setPwdChangedAt(now);
    setPwd({ current: "", next: "", confirm: "" });
    setShow({ current: false, next: false, confirm: false });
    setPwdMsg({ type: "ok", text: "Password updated." });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadSaved(), pwdChangedAt: now }));
    } catch { /* storage blocked — the message still shows */ }
  };

  const save = () => {
    if (hasErrors) {
      setShowErrors(true);
      setTab("personal");
      setStatus({ type: "err", text: "Please fill in the required fields marked in red." });
      return;
    }
    const clean = { ...profile, firstName: profile.firstName.trim(), lastName: profile.lastName.trim(), email: profile.email.trim() };
    const data = {
      profile: clean,
      photo,
      pwdChangedAt,
      twoFactor,
      sessions,
      notifs: notifs.map(({ id, email, app }) => ({ id, email, app })),
      prefs,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      setStatus({ type: "err", text: "Could not save — your browser storage is full or blocked. Try a smaller photo." });
      return;
    }
    setProfile(clean);
    setShowErrors(false);
    setStatus({ type: "ok", text: "Your changes have been saved." });
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT)); // navbar avatar + menu update
    setSaved(true);
    setTimeout(() => { setSaved(false); setStatus(null); }, 2500);
  };

  const changeTab = (id) => { setTab(id); setStatus(null); };

  return (
    <div className={cx("ps-page")}>
      {/* Header */}
      <div className={cx("ps-header")}>
        <div className={cx("ps-title-row")}>
          <UserRound size={18} className={cx("ps-title-icon")} />
          <h1 className={cx("ps-title")}>Profile Settings</h1>
        </div>
        <p className={cx("ps-desc")}>Manage your personal details, password, notifications and preferences</p>
      </div>

      {/* Tabs */}
      <div className={cx("ps-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              className={cx(`ps-tab ${tab === t.id ? "ps-tab-active" : ""}`)}
              onClick={() => changeTab(t.id)}
            >
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Info + save bar */}
      <div className={cx("ps-bar")}>
        <div className={cx(`ps-info ${status ? `ps-info-${status.type}` : ""}`)}>
          {status?.type === "ok" ? <CircleCheck size={13} /> : <Info size={13} />}
          <span>{status ? status.text : BAR_NOTE[tab]}</span>
        </div>
        <button type="button" className={cx("ps-save")} onClick={save}>
          {saved ? <CircleCheck size={14} /> : <Save size={14} />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className={cx("ps-body")}>
        <div className={cx("ps-inner")}>
          {/* ── Personal Info ── */}
          {tab === "personal" && (
            <>
              <div className={cx("ps-card ps-hero")}>
                {photo ? (
                  <img className={cx("ps-avatar")} src={photo} alt="Profile" />
                ) : (
                  <div className={cx("ps-avatar")}>{initials}</div>
                )}
                <div className={cx("ps-hero-text")}>
                  <div className={cx("ps-hero-name")}>{profile.firstName} {profile.lastName}</div>
                  <div className={cx("ps-hero-role")}>{profile.role}</div>
                  <div className={cx("ps-hero-meta")}>
                    <span><Mail size={11} /> {profile.email}</span>
                    <span><Building2 size={11} /> {profile.branch}</span>
                    <span><CalendarDays size={11} /> Joined {profile.joined}</span>
                  </div>
                  {photoErr && <div className={cx("ps-err ps-photo-err")}>{photoErr}</div>}
                </div>
                <div className={cx("ps-hero-acts")}>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
                  <button type="button" className={cx("ps-btn")} onClick={() => fileRef.current?.click()}>
                    <Upload size={13} /> {photo ? "Change Photo" : "Upload Photo"}
                  </button>
                  <button type="button" className={cx("ps-btn ps-btn-danger")} onClick={removePhoto} disabled={!photo}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>

              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Personal Details</h3>
                  <span>Fields marked * are required</span>
                </div>
                <div className={cx("ps-grid")}>
                  <label className={cx("ps-field")}>
                    <span className={cx("ps-label")}>First Name *</span>
                    <input className={cx(`ps-input ${bad("firstName")}`)} value={profile.firstName} onChange={setField("firstName")} />
                    {bad("firstName") && <span className={cx("ps-err")}>First name is required</span>}
                  </label>
                  <label className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Last Name *</span>
                    <input className={cx(`ps-input ${bad("lastName")}`)} value={profile.lastName} onChange={setField("lastName")} />
                    {bad("lastName") && <span className={cx("ps-err")}>Last name is required</span>}
                  </label>
                  <label className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Email Address *</span>
                    <input type="email" className={cx(`ps-input ${bad("email")}`)} value={profile.email} onChange={setField("email")} />
                    {bad("email") && <span className={cx("ps-err")}>Enter a valid email address</span>}
                  </label>
                  <label className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Phone Number</span>
                    <input className={cx("ps-input")} value={profile.phone} onChange={setField("phone")} />
                  </label>
                  <label className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Designation</span>
                    <input className={cx("ps-input")} value={profile.designation} onChange={setField("designation")} />
                  </label>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Department</span>
                    <Select
                      value={profile.department}
                      options={DEPARTMENTS}
                      label="Department"
                      onChange={(v) => setProfile((p) => ({ ...p, department: v }))}
                    />
                  </div>
                  <label className={cx("ps-field ps-full")}>
                    <span className={cx("ps-label")}>Short Bio</span>
                    <textarea
                      className={cx("ps-input ps-textarea")}
                      rows={3}
                      placeholder="A line or two about your role…"
                      value={profile.bio}
                      onChange={setField("bio")}
                    />
                  </label>
                </div>
              </div>

              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Account Details</h3>
                  <span>Managed by your administrator</span>
                </div>
                <div className={cx("ps-grid")}>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Employee ID</span>
                    <div className={cx("ps-input ps-readonly")}>{profile.employeeId}</div>
                  </div>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Role</span>
                    <div className={cx("ps-input ps-readonly")}>{profile.role}</div>
                  </div>
                  <div className={cx("ps-field ps-full")}>
                    <span className={cx("ps-label")}>Branch</span>
                    <div className={cx("ps-input ps-readonly")}>{profile.branch}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Password & Security ── */}
          {tab === "security" && (
            <>
              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Change Password</h3>
                  <span>{pwdChangedAt ? `Last changed on ${formatDate(pwdChangedAt)}` : "Last changed 3 months ago"}</span>
                </div>
                <div className={cx("ps-pwd")}>
                  <div className={cx("ps-pwd-fields")}>
                    {[
                      { key: "current", label: "Current Password" },
                      { key: "next", label: "New Password" },
                      { key: "confirm", label: "Confirm New Password" },
                    ].map((f) => (
                      <label key={f.key} className={cx("ps-field")}>
                        <span className={cx("ps-label")}>{f.label}</span>
                        <span className={cx(`ps-pwd-wrap ${f.key === "confirm" && mismatch ? "ps-pwd-bad" : ""}`)}>
                          <input
                            type={show[f.key] ? "text" : "password"}
                            className={cx("ps-input")}
                            placeholder="••••••••"
                            value={pwd[f.key]}
                            onChange={setPwdField(f.key)}
                          />
                          <button type="button" className={cx("ps-eye")} onClick={() => flip(f.key)} aria-label="Show password">
                            {show[f.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </span>
                        {f.key === "confirm" && mismatch && <span className={cx("ps-err")}>Passwords do not match</span>}
                      </label>
                    ))}
                  </div>

                  <div className={cx("ps-rules")}>
                    <div className={cx("ps-rules-title")}>Password must have</div>
                    {PASSWORD_RULES.map((r) => {
                      const ok = r.test(pwd.next);
                      return (
                        <div key={r.id} className={cx(`ps-rule ${ok ? "ps-rule-ok" : ""}`)}>
                          <span className={cx("ps-rule-dot")}>{ok && <Check size={9} strokeWidth={3} />}</span>
                          {r.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={cx("ps-card-foot")}>
                  {pwdMsg && (
                    <span className={cx(`ps-msg ps-msg-${pwdMsg.type}`)}>
                      {pwdMsg.type === "ok" ? <CircleCheck size={13} /> : <Info size={13} />} {pwdMsg.text}
                    </span>
                  )}
                  <button type="button" className={cx("ps-btn ps-btn-primary")} onClick={updatePassword}>
                    <Lock size={13} /> Update Password
                  </button>
                </div>
              </div>

              <div className={cx("ps-card")}>
                <div className={cx("ps-box")}>
                  <div className={cx("ps-box-icon")}><ShieldCheck size={16} /></div>
                  <div className={cx("ps-box-text")}>
                    <div className={cx("ps-box-title")}>
                      Two-Factor Authentication
                      <span className={cx(`ps-badge ${twoFactor ? "ps-badge-on" : ""}`)}>{twoFactor ? "Enabled" : "Off"}</span>
                    </div>
                    <div className={cx("ps-box-sub")}>Ask for a one-time code sent to {profile.phone} when signing in on a new device</div>
                  </div>
                  <Toggle on={twoFactor} onChange={() => setTwoFactor((v) => !v)} size="medium" color="softBlue" label="Two-factor authentication" />
                </div>
              </div>

              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Active Sessions</h3>
                  {sessions.length > 1 && (
                    <button type="button" className={cx("ps-link-danger")} onClick={signOutOthers}>
                      Sign out all other sessions
                    </button>
                  )}
                </div>
                <div className={cx("ps-sessions")}>
                  {sessions.map((s) => {
                    const Icon = s.type === "mobile" ? Smartphone : Monitor;
                    return (
                      <div key={s.id} className={cx("ps-session")}>
                        <div className={cx("ps-session-icon")}><Icon size={15} /></div>
                        <div className={cx("ps-session-text")}>
                          <div className={cx("ps-session-name")}>
                            {s.device}
                            {s.current && <span className={cx("ps-badge ps-badge-on")}>This device</span>}
                          </div>
                          <div className={cx("ps-session-sub")}>{s.location} · {s.lastActive}</div>
                        </div>
                        {!s.current && (
                          <button type="button" className={cx("ps-btn")} onClick={() => signOut(s.id)}>
                            <LogOut size={13} /> Sign out
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Notifications ── */}
          {tab === "notifications" && (
            <div className={cx("ps-card ps-card-flush")}>
              <table className={cx("ps-table")}>
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Email</th>
                    <th>In-app</th>
                  </tr>
                </thead>
                <tbody>
                  {notifs.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <div className={cx("ps-n-title")}>{n.label}</div>
                        <div className={cx("ps-n-sub")}>{n.desc}</div>
                      </td>
                      <td>
                        <Toggle on={n.email} onChange={() => flipNotif(n.id, "email")} size="small" color="softBlue" label={`${n.label} email`} />
                      </td>
                      <td>
                        <Toggle on={n.app} onChange={() => flipNotif(n.id, "app")} size="small" color="softBlue" label={`${n.label} in-app`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Preferences ── */}
          {tab === "preferences" && (
            <>
              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Language & Region</h3>
                </div>
                <div className={cx("ps-grid")}>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Language</span>
                    <Select value={prefs.language} options={LANGUAGES} label="Language" onChange={setPref("language")} />
                  </div>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Time Zone</span>
                    <Select value={prefs.timezone} options={TIMEZONES} label="Time zone" onChange={setPref("timezone")} />
                  </div>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Date Format</span>
                    <Select value={prefs.dateFormat} options={DATE_FORMATS} label="Date format" onChange={setPref("dateFormat")} />
                  </div>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Time Format</span>
                    <Select value={prefs.timeFormat} options={TIME_FORMATS} label="Time format" onChange={setPref("timeFormat")} />
                  </div>
                </div>
              </div>

              <div className={cx("ps-card")}>
                <div className={cx("ps-card-head")}>
                  <h3>Workspace</h3>
                </div>
                <div className={cx("ps-grid")}>
                  <div className={cx("ps-field")}>
                    <span className={cx("ps-label")}>Default Landing Page</span>
                    <Select value={prefs.landing} options={LANDING_PAGES} label="Default landing page" onChange={setPref("landing")} />
                  </div>
                </div>
                <div className={cx("ps-opts")}>
                  <div className={cx("ps-opt")}>
                    <div>
                      <div className={cx("ps-box-title")}>Compact Mode</div>
                      <div className={cx("ps-box-sub")}>Show more rows on lists and tables</div>
                    </div>
                    <Toggle on={prefs.compact} onChange={() => setPref("compact")(!prefs.compact)} size="small" color="softBlue" label="Compact mode" />
                  </div>
                  <div className={cx("ps-opt")}>
                    <div>
                      <div className={cx("ps-box-title")}>Notification Sound</div>
                      <div className={cx("ps-box-sub")}>Play a sound for new in-app alerts</div>
                    </div>
                    <Toggle on={prefs.sound} onChange={() => setPref("sound")(!prefs.sound)} size="small" color="softBlue" label="Notification sound" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;