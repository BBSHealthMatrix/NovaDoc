import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { FileText, Plus, Search, Star, StarOff, Eye, Pencil, Copy, Trash2, X, CircleCheck, Save } from "lucide-react";
import { SPECIALTIES, DEPARTMENTS, SECTIONS, TEMPLATES, BLANK } from "./TemplateManagerData.js";
import styles from "./TemplateManager.module.css";

const cx = createClassNames(styles);

const colorOf = (name) => SECTIONS.find((s) => s.name === name)?.color;
const ordered = (list) => SECTIONS.map((s) => s.name).filter((n) => list.includes(n));
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const TemplateManager = () => {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState(SPECIALTIES[0]);
  const [panel, setPanel] = useState(null); // null | { mode: "preview" | "edit" | "new", id?, form? }

  const term = q.trim().toLowerCase();
  const list = templates.filter((t) => (spec === SPECIALTIES[0] || t.specialty === spec)
    && (t.name.toLowerCase().includes(term) || t.desc.toLowerCase().includes(term)));
  const defaults = templates.filter((t) => t.isDefault).length;

  // only one default per specialty
  const withDefault = (all, id, specialty, on) => all.map((t) => {
    if (t.id === id) return { ...t, isDefault: on };
    return on && t.specialty === specialty ? { ...t, isDefault: false } : t;
  });

  const starToggle = (t) => setTemplates((p) => withDefault(p, t.id, t.specialty, !t.isDefault));

  const duplicate = (t) => setTemplates((p) => [{ ...t, id: Date.now(), name: `${t.name} (Copy)`, system: false, isDefault: false }, ...p]);

  const remove = (id) => {
    setTemplates((p) => p.filter((t) => t.id !== id));
    if (panel?.id === id) setPanel(null);
  };

  const form = panel?.form;
  const setForm = (patch) => setPanel((p) => ({ ...p, form: { ...p.form, ...patch } }));

  const save = () => {
    const name = form.name.trim();
    if (!name) return;
    const data = { ...form, name, desc: form.desc.trim(), sections: ordered(form.sections) };
    setTemplates((p) => {
      const id = panel.mode === "new" ? Date.now() : panel.id;
      const next = panel.mode === "new"
        ? [...p, { ...data, id, system: false, isDefault: false }]
        : p.map((t) => (t.id === id ? { ...t, ...data, isDefault: false } : t));
      return withDefault(next, id, data.specialty, data.isDefault);
    });
    setPanel(null);
  };

  const shown = panel?.mode === "preview" ? templates.find((t) => t.id === panel.id) : null;

  return (
    <div className={cx("tm-page")}>
      <div className={cx("tm-main")}>
        <div className={cx("tm-header")}>
          <div>
            <h1 className={cx("tm-title")}><FileText size={18} /> Template Manager</h1>
            <p className={cx("tm-sub")}>{templates.length} templates — {defaults} set as default</p>
          </div>
          <button type="button" className={cx("tm-new")} onClick={() => setPanel({ mode: "new", form: { ...BLANK } })}>
            <Plus size={12} /> New Template
          </button>
        </div>

        <div className={cx("tm-bar")}>
          <div className={cx("tm-search")}>
            <Search size={12} />
            <input placeholder="Search templates..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className={cx("tm-pills")}>
            {SPECIALTIES.map((s) => (
              <button type="button" key={s} className={cx(`tm-pill ${spec === s ? "tm-pill-on" : ""}`)} onClick={() => setSpec(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className={cx("tm-list")}>
          {list.map((t) => (
            <div className={cx("tm-card")} key={t.id}>
              <div className={cx("tm-info")}>
                <div className={cx("tm-top")}>
                  <span className={cx("tm-name")}>{t.name}</span>
                  {t.system && <span className={cx("tm-sys")}>System</span>}
                  {t.isDefault && <span className={cx("tm-def")}>Default</span>}
                </div>
                <p className={cx("tm-desc")}>{t.desc}</p>
                <div className={cx("tm-tags")}>
                  <span className={cx("tm-spec")}>{t.specialty}</span>
                  {ordered(t.sections).map((s) => (
                    <span className={cx("tm-tag")} key={s} style={{ background: colorOf(s) }}>{s}</span>
                  ))}
                </div>
              </div>
              <div className={cx("tm-acts")}>
                <button type="button" className={cx(t.isDefault ? "tm-star" : "")} onClick={() => starToggle(t)} aria-label={t.isDefault ? "Remove default" : "Set as default"}>
                  {t.isDefault ? <Star size={14} /> : <StarOff size={14} />}
                </button>
                <button type="button" onClick={() => setPanel({ mode: "preview", id: t.id })} aria-label={`Preview ${t.name}`}><Eye size={14} /></button>
                <button type="button" onClick={() => setPanel({ mode: "edit", id: t.id, form: { ...t } })} aria-label={`Edit ${t.name}`}><Pencil size={14} /></button>
                <button type="button" onClick={() => duplicate(t)} aria-label={`Duplicate ${t.name}`}><Copy size={14} /></button>
                {!t.system && (
                  <button type="button" className={cx("tm-del")} onClick={() => remove(t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
          {list.length === 0 && <p className={cx("tm-empty")}>No templates match your search.</p>}
        </div>
      </div>

      {panel && (
        <aside className={cx("tm-panel")}>
          <div className={cx("tm-phead")}>
            <h2>{panel.mode === "preview" ? "Preview" : panel.mode === "edit" ? "Edit Template" : "New Template"}</h2>
            <button type="button" className={cx("tm-close")} onClick={() => setPanel(null)} aria-label="Close"><X size={13} /></button>
          </div>

          {shown && (
            <div className={cx("tm-pbody tm-preview")}>
              <p className={cx("tm-plabel")}>Name</p>
              <p className={cx("tm-pname")}>{shown.name}</p>
              <p className={cx("tm-plabel")}>Description</p>
              <p className={cx("tm-pdesc")}>{shown.desc || "—"}</p>
              <p className={cx("tm-plabel")}>Specialty</p>
              <span className={cx("tm-pspec")}>{shown.specialty}</span>
              <p className={cx("tm-plabel")}>Departments</p>
              <div className={cx("tm-pdepts")}>
                {(shown.departments.length ? shown.departments : ["All departments"]).map((d) => <span className={cx("tm-pdept")} key={d}>{d}</span>)}
              </div>
              <p className={cx("tm-plabel")}>Sections included <span>({shown.sections.length})</span></p>
              <div className={cx("tm-secs")}>
                {SECTIONS.map((s) => {
                  const on = shown.sections.includes(s.name);
                  return (
                    <div className={cx(`tm-sec tm-psec ${on ? "tm-sec-on" : ""}`)} key={s.name}>
                      <i style={{ background: on ? s.color : "#cad5e2" }} />
                      {s.name}
                      {on && <CircleCheck size={12} className={cx("tm-check")} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {form && (
            <>
              <div className={cx("tm-pbody")} key={panel.id || "new"}>
                <label className={cx("tm-field")}>
                  <span>Template Name *</span>
                  <input className={cx("tm-in")} placeholder="e.g. URTI Standard" value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
                </label>
                <label className={cx("tm-field")}>
                  <span>Description</span>
                  <input className={cx("tm-in")} placeholder="Brief description" value={form.desc} onChange={(e) => setForm({ desc: e.target.value })} />
                </label>
                <label className={cx("tm-field")}>
                  <span>Specialty</span>
                  <select className={cx("tm-select")} value={form.specialty} onChange={(e) => setForm({ specialty: e.target.value })}>
                    {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <div className={cx("tm-field")}>
                  <span>Assign to Departments</span>
                  <div className={cx("tm-depts")}>
                    {DEPARTMENTS.map((d) => (
                      <button type="button" key={d} className={cx(`tm-dept ${form.departments.includes(d) ? "tm-dept-on" : ""}`)} onClick={() => setForm({ departments: toggle(form.departments, d) })}>{d}</button>
                    ))}
                  </div>
                  {form.departments.length === 0 && <p className={cx("tm-hint")}>No selection = available to all departments</p>}
                </div>
                <div className={cx("tm-field")}>
                  <span>Sections</span>
                  <div className={cx("tm-secs tm-esecs")}>
                    {SECTIONS.map((s) => {
                      const on = form.sections.includes(s.name);
                      return (
                        <button type="button" className={cx(`tm-sec tm-esec ${on ? "tm-sec-on" : ""}`)} key={s.name} onClick={() => setForm({ sections: toggle(form.sections, s.name) })}>
                          <i style={{ background: s.color }} />
                          {s.name}
                          {on && <CircleCheck size={12} className={cx("tm-check")} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className={cx("tm-default")}>
                  <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ isDefault: e.target.checked })} />
                  Set as default for selected specialty
                </label>
              </div>
              <div className={cx("tm-pfoot")}>
                <button type="button" className={cx("tm-save")} disabled={!form.name.trim()} onClick={save}>
                  <Save size={12} /> {panel.mode === "new" ? "Create Template" : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
};

export default TemplateManager;