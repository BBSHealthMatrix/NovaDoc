import { useState } from "react";
import * as Icons from "lucide-react";
import Toggle from "../Toggle/Toggle";
import styles from "./Security.module.css";
import { createClassNames } from "../../utils/classNames.js";
import { ROLES, PERMISSIONS, ACCESS_DATA, SIGNING_DATA } from "./SecurityData";

const cx = createClassNames(styles);

const { Shield, Lock, Users, Save, ChevronRight, ChevronDown, Info, Clock } = Icons;
const NoteIcon = Icons.FilePen || Icons.FileEdit || Icons.FilePenLine || Icons.Pencil;
const SignIcon = Icons.UserPen || Icons.UserRoundPen || Icons.UserCog || Icons.User;
const SavedIcon = Icons.CircleCheck || Icons.CheckCircle2 || Icons.CheckCircle || Icons.Check;
const CustomIcon = Icons.ToggleLeft || Icons.Settings;

const roleColor = (name) => ROLES.find((r) => r.name === name)?.color || "#4982cf";

const Security = () => {
  const [tab, setTab] = useState("access");
  const [roleFilter, setRoleFilter] = useState("All");
  const [access, setAccess] = useState(ACCESS_DATA);
  const [rules, setRules] = useState(SIGNING_DATA);
  const [openAccess, setOpenAccess] = useState(null);
  const [openRule, setOpenRule] = useState(null);
  const [savedAccess, setSavedAccess] = useState(false);
  const [savedRules, setSavedRules] = useState(false);

  const visibleRoles = roleFilter === "All" ? ROLES : ROLES.filter((r) => r.name === roleFilter);

  const togglePerm = (noteId, role, key) => {
    setAccess((prev) =>
      prev.map((n) =>
        n.id !== noteId
          ? n
          : { ...n, perms: { ...n.perms, [role]: { ...n.perms[role], [key]: !n.perms[role][key] } } }
      )
    );
  };

  const updateRule = (id, patch) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleRuleRole = (id, field, role) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const list = r[field];
        return { ...r, [field]: list.includes(role) ? list.filter((x) => x !== role) : [...list, role] };
      })
    );
  };

  const handleSaveAccess = () => {
    setSavedAccess(true);
    setTimeout(() => setSavedAccess(false), 2000);
  };

  const handleSaveRules = () => {
    setSavedRules(true);
    setTimeout(() => setSavedRules(false), 2000);
  };

  return (
    <div className={cx("sec-page")}>
      {/* Header */}
      <div className={cx("sec-header")}>
        <div className={cx("sec-title-row")}>
          <Shield size={18} className={cx("sec-title-icon")} />
          <h1 className={cx("sec-title")}>Permissions &amp; Signing Rules</h1>
        </div>
        <p className={cx("sec-desc")}>Control role-based access and note signing policies</p>
      </div>

      {/* Tabs */}
      <div className={cx("sec-tabs")}>
        <button
          className={`${cx("sec-tab")} ${tab === "access" ? cx("sec-tab-active") : ""}`}
          onClick={() => setTab("access")}
        >
          <Shield size={13} /> Role Access
        </button>
        <button
          className={`${cx("sec-tab")} ${tab === "rules" ? cx("sec-tab-active") : ""}`}
          onClick={() => setTab("rules")}
        >
          <Lock size={13} /> Signing Rules
        </button>
      </div>

      {tab === "access" ? (
        <>
          {/* Filter bar */}
          <div className={cx("sec-bar")}>
            <div className={cx("sec-filter")}>
              <Users size={14} className={cx("sec-filter-icon")} />
              <span className={cx("sec-filter-label")}>Filter by role:</span>
              {["All", ...ROLES.map((r) => r.name)].map((name) => {
                const active = roleFilter === name;
                const color = name === "All" ? "#4982cf" : roleColor(name);
                return (
                  <button
                    key={name}
                    className={`${cx("sec-chip")} ${active ? cx("sec-chip-active") : ""}`}
                    style={active ? { background: color, borderColor: color } : undefined}
                    onClick={() => setRoleFilter(name)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <button className={cx("sec-save")} onClick={handleSaveAccess}>
              {savedAccess ? <SavedIcon size={14} /> : <Save size={14} />}
              {savedAccess ? "Saved" : "Save Changes"}
            </button>
          </div>

          {/* Accordion list */}
          <div className={cx("sec-list")}>
            {access.map((note) => {
              const open = openAccess === note.id;
              return (
                <div key={note.id} className={cx("sec-card")}>
                  <button
                    className={cx("sec-card-head")}
                    onClick={() => setOpenAccess(open ? null : note.id)}
                  >
                    <NoteIcon size={15} className={cx("sec-card-icon")} />
                    <span className={cx("sec-card-title")}>{note.name}</span>
                    {open ? (
                      <ChevronDown size={14} className={cx("sec-chev")} />
                    ) : (
                      <ChevronRight size={14} className={cx("sec-chev")} />
                    )}
                  </button>

                  {open && (
                    <table className={cx("sec-table")}>
                      <thead>
                        <tr>
                          <th>Role</th>
                          {PERMISSIONS.map((perm) => (
                            <th key={perm.key}>{perm.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRoles.map((role) => (
                          <tr key={role.name}>
                            <td>
                              <span className={cx("sec-role")}>
                                <span className={cx("sec-dot")} style={{ background: role.color }} />
                                {role.name}
                              </span>
                            </td>
                            {PERMISSIONS.map((perm) => (
                              <td key={perm.key}>
                                <input
                                  type="checkbox"
                                  className={cx("sec-check")}
                                  checked={note.perms[role.name][perm.key]}
                                  onChange={() => togglePerm(note.id, role.name, perm.key)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Info bar */}
          <div className={cx("sec-bar")}>
            <div className={cx("sec-info")}>
              <Info size={13} />
              <span>Configure who can sign or co-sign each note type, and set auto-lock rules.</span>
            </div>
            <button className={cx("sec-save")} onClick={handleSaveRules}>
              {savedRules ? <SavedIcon size={14} /> : <Save size={14} />}
              {savedRules ? "Saved" : "Save Rules"}
            </button>
          </div>

          {/* Rules list */}
          <div className={`${cx("sec-list")} ${cx("sec-list-rules")}`}>
            {rules.map((rule) => {
              const open = openRule === rule.id;
              return (
                <div key={rule.id} className={cx("sec-card")}>
                  <button
                    className={cx("sec-card-head")}
                    onClick={() => setOpenRule(open ? null : rule.id)}
                  >
                    <NoteIcon size={15} className={cx("sec-card-icon")} />
                    <span className={cx("sec-card-title")}>{rule.name}</span>
                    {rule.autoLock !== "" && !rule.coSignRequired && (
                      <span className={`${cx("sec-badge")} ${cx("sec-badge-lock")}`}>
                        Auto-lock {rule.autoLock}h
                      </span>
                    )}
                    {rule.coSignRequired && (
                      <span className={`${cx("sec-badge")} ${cx("sec-badge-cosign")}`}>
                        Co-sign required
                      </span>
                    )}
                    {open ? (
                      <ChevronDown size={14} className={cx("sec-chev")} />
                    ) : (
                      <ChevronRight size={14} className={cx("sec-chev")} />
                    )}
                  </button>

                  {open && (
                    <div className={cx("sec-rule-body")}>
                      <div className={cx("sec-label")}>
                        <SignIcon size={12} /> Who can sign
                      </div>
                      <div className={cx("sec-chips")}>
                        {ROLES.map((role) => {
                          const active = rule.sign.includes(role.name);
                          return (
                            <button
                              key={role.name}
                              className={`${cx("sec-rule-chip")} ${active ? cx("sec-rule-chip-active") : ""}`}
                              style={active ? { background: role.color, borderColor: role.color } : undefined}
                              onClick={() => toggleRuleRole(rule.id, "sign", role.name)}
                            >
                              {role.name}
                            </button>
                          );
                        })}
                      </div>

                      <div className={cx("sec-label")}>
                        <Users size={12} /> Who can co-sign
                      </div>
                      <div className={`${cx("sec-chips")} ${cx("sec-chips-last")}`}>
                        {ROLES.map((role) => {
                          const active = rule.cosign.includes(role.name);
                          return (
                            <button
                              key={role.name}
                              className={`${cx("sec-rule-chip")} ${active ? cx("sec-rule-chip-active") : ""}`}
                              style={active ? { background: role.color, borderColor: role.color } : undefined}
                              onClick={() => toggleRuleRole(rule.id, "cosign", role.name)}
                            >
                              {role.name}
                            </button>
                          );
                        })}
                      </div>

                      <div className={cx("sec-grid")}>
                        <div className={cx("sec-box")}>
                          <div>
                            <div className={cx("sec-box-title")}>Co-signature Required</div>
                            <div className={cx("sec-box-sub")}>Note cannot be finalised without a co-sign</div>
                          </div>
                          <Toggle
                            on={rule.coSignRequired}
                            onChange={() => updateRule(rule.id, { coSignRequired: !rule.coSignRequired })}
                            size="small"
                            color="softBlue"
                            className={cx("sec-toggle")}
                          />
                        </div>

                        <div className={cx("sec-box")}>
                          <div>
                            <div className={cx("sec-box-title")}>Discard After Signing</div>
                            <div className={cx("sec-box-sub")}>Draft deleted once note is signed</div>
                          </div>
                          <Toggle
                            on={rule.discardAfter}
                            onChange={() => updateRule(rule.id, { discardAfter: !rule.discardAfter })}
                            size="small"
                            color="softBlue"
                            className={cx("sec-toggle")}
                          />
                        </div>

                        <div className={cx("sec-box")}>
                          <div>
                            <div className={cx("sec-box-title")}>
                              <Clock size={12} /> Auto-lock
                            </div>
                            <div className={cx("sec-box-sub")}>Lock note for editing after N hours</div>
                          </div>
                          <div className={cx("sec-lock")}>
                            <input
                              type="number"
                              className={cx("sec-lock-input")}
                              value={rule.autoLock}
                              placeholder="—"
                              onChange={(e) => updateRule(rule.id, { autoLock: e.target.value })}
                            />
                            <span>hrs</span>
                          </div>
                        </div>

                        <div className={cx("sec-box")}>
                          <div>
                            <div className={cx("sec-box-title")}>
                              <CustomIcon size={12} /> Custom Conditions
                            </div>
                            <div className={cx("sec-box-sub")}>Enable manual condition override note</div>
                          </div>
                          <Toggle
                            on={rule.custom}
                            onChange={() => updateRule(rule.id, { custom: !rule.custom })}
                            size="small"
                            color="softBlue"
                            className={cx("sec-toggle")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Security;