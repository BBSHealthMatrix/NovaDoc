import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, ChevronRight, FileText, GripVertical, Pencil, Plus, Search, Syringe, Trash2, X } from "lucide-react";
import { ROUTES, SECTIONS, PARTNERS, BLANK_VACCINE } from "./VaccineMasterListData.js";
import styles from "./VaccineMasterList.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/vaccine-master-list", label: "Vaccine Master List" },
  { to: "/admin/vaccine-partners", label: "Vaccine Partners" },
];

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const VaccineMasterList = () => {
  const { pathname } = useLocation();
  const isPartners = pathname === "/admin/vaccine-partners";
  const [sections, setSections] = useState(SECTIONS);
  const [open, setOpen] = useState(() => new Set([sections[0]?.id]));
  const [search, setSearch] = useState("");
  const [newSection, setNewSection] = useState("");
  const [addingTo, setAddingTo] = useState(null);
  const [draft, setDraft] = useState(BLANK_VACCINE);
  const [renaming, setRenaming] = useState(null); // { id, name }
  const [editing, setEditing] = useState(null); // { sectionId, id, name, desc, route, schedule }

  const forceOpen = (id) => setOpen((p) => new Set(p).add(id));
  const toggleOpen = (id) => setOpen((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const patchSection = (id, fn) => setSections((p) => p.map((s) => (s.id === id ? fn(s) : s)));

  /* ── sections ── */
  const addSection = () => {
    const name = newSection.trim();
    if (!name) return;
    const id = `s${Date.now()}`;
    setSections((p) => [...p, { id, name, vaccines: [] }]);
    forceOpen(id);
    setNewSection("");
  };
  const saveRename = () => {
    const name = renaming.name.trim();
    if (!name) return;
    patchSection(renaming.id, (s) => ({ ...s, name }));
    setRenaming(null);
  };

  /* ── add vaccine ── */
  const startAdd = (id) => { forceOpen(id); setAddingTo(id); setDraft(BLANK_VACCINE); setEditing(null); setRenaming(null); };
  const addVaccine = (sectionId) => {
    const name = draft.name.trim();
    if (!name) return;
    patchSection(sectionId, (s) => ({
      ...s,
      vaccines: [...s.vaccines, { id: Date.now(), name, desc: draft.desc.trim(), route: draft.route, schedule: draft.schedule.trim() }],
    }));
    setAddingTo(null);
  };

  /* ── edit vaccine ── */
  const startEdit = (sectionId, v) => { setEditing({ sectionId, ...v }); setAddingTo(null); setRenaming(null); };
  const setEdit = (patch) => setEditing((p) => ({ ...p, ...patch }));
  const saveEdit = () => {
    const name = editing.name.trim();
    if (!name) return;
    patchSection(editing.sectionId, (s) => ({
      ...s,
      vaccines: s.vaccines.map((v) => (v.id === editing.id
        ? { ...v, name, desc: editing.desc.trim(), route: editing.route, schedule: editing.schedule.trim() }
        : v)),
    }));
    setEditing(null);
  };
  const removeVaccine = (sectionId, id) => patchSection(sectionId, (s) => ({ ...s, vaccines: s.vaccines.filter((v) => v.id !== id) }));

  const exportCsv = () => {
    const rows = [["Section", "Vaccine", "Route", "Schedule", "Description"]];
    sections.forEach((s) => s.vaccines.forEach((v) => rows.push([s.name, v.name, v.route, v.schedule, v.desc])));
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vaccine-master-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const q = search.trim().toLowerCase();
  const matches = (v) => !q || [v.name, v.desc, v.route, v.schedule].some((x) => x.toLowerCase().includes(q));

  const total = sections.reduce((n, s) => n + s.vaccines.length, 0);

  return (
    <div className={cx("vm-wrap")}>
      <div className={cx("vm-head")}>
        <div>
          <h1 className={cx("vm-title")}><Syringe size={16} /> Vaccine Catalog</h1>
          <p className={cx("vm-sub")}>
            {total} vaccines across {sections.length} sections · {PARTNERS.length} partners
          </p>
        </div>
        <div className={cx("vm-tabs")}>
          {TABS.map((t) => {
            const on = isPartners ? t.to === "/admin/vaccine-partners" : t.to === "/admin/vaccine-master-list";
            return (
              <Link key={t.to} to={t.to} className={cx(`vm-tab ${on ? "vm-tab-on" : ""}`)}>{t.label}</Link>
            );
          })}
        </div>
      </div>

      <>
        <div className={cx("vm-toolbar")}>
          <div className={cx("vm-search")}>
            <Search size={13} />
            <input placeholder="Search vaccines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" className={cx("vm-export")} onClick={exportCsv}><FileText size={13} /> Export CSV</button>
        </div>

        <div className={cx("vm-newsection")}>
          <input
            placeholder="New section name (e.g. Immunocompromised)..."
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSection()}
          />
          <button type="button" className={cx("vm-btn")} onClick={addSection}><Plus size={14} /> Add Section</button>
        </div>

        <div className={cx("vm-sections")}>
          {sections.map((s) => {
            const visible = s.vaccines.filter(matches);
            if (q && visible.length === 0) return null;
            const isOpen = open.has(s.id) || Boolean(q);
            return (
              <div className={cx("vm-section")} key={s.id}>
                <div className={cx(`vm-shead ${isOpen ? "vm-shead-open" : ""}`)}>
                  <GripVertical size={12} className={cx("vm-grip")} />
                  <button type="button" className={cx("vm-chev")} onClick={() => toggleOpen(s.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                    <ChevronRight size={13} className={cx(isOpen ? "vm-chev-open" : "")} />
                  </button>

                  {renaming?.id === s.id ? (
                    <div className={cx("vm-rename")}>
                      <input
                        autoFocus
                        className={cx("vm-input")}
                        value={renaming.name}
                        onChange={(e) => setRenaming((p) => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(null); }}
                      />
                      <button type="button" className={cx("vm-rok")} onClick={saveRename} aria-label="Save section name"><Check size={12} /></button>
                      <button type="button" className={cx("vm-rx")} onClick={() => setRenaming(null)} aria-label="Cancel rename"><X size={12} /></button>
                    </div>
                  ) : (
                    <>
                      <span className={cx("vm-sname")}>{s.name}</span>
                      <span className={cx("vm-scount")}>{s.vaccines.length} vaccines</span>
                    </>
                  )}

                  <div className={cx("vm-sactions")}>
                    <button type="button" className={cx("vm-addv")} onClick={() => startAdd(s.id)}><Plus size={10} /> Vaccine</button>
                    <button type="button" onClick={() => { setRenaming({ id: s.id, name: s.name }); setAddingTo(null); setEditing(null); }} aria-label="Rename section"><Pencil size={11} /></button>
                    <button type="button" className={cx("vm-del")} onClick={() => setSections((p) => p.filter((x) => x.id !== s.id))} aria-label="Delete section"><Trash2 size={11} /></button>
                  </div>
                </div>

                {isOpen && (
                  <div className={cx("vm-body")}>
                    {addingTo === s.id && (
                      <div className={cx("vm-form vm-form-add")}>
                        <div className={cx("vm-fline")}>
                          <input autoFocus className={cx("vm-input")} placeholder="Vaccine name..." value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
                          <input className={cx("vm-input")} placeholder="Description (optional)..." value={draft.desc} onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value }))} />
                        </div>
                        <div className={cx("vm-fline")}>
                          <select className={cx("vm-select")} value={draft.route} onChange={(e) => setDraft((p) => ({ ...p, route: e.target.value }))}>
                            <option value="">Route of administration...</option>
                            {ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <input
                            className={cx("vm-input vm-grow")}
                            placeholder="Dose schedule (e.g. 2 doses: 0, 6 months)..."
                            value={draft.schedule}
                            onChange={(e) => setDraft((p) => ({ ...p, schedule: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && addVaccine(s.id)}
                          />
                          <button type="button" className={cx("vm-fbtn vm-fbtn-blue")} onClick={() => addVaccine(s.id)}>Add</button>
                          <button type="button" className={cx("vm-fbtn")} onClick={() => setAddingTo(null)}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {visible.map((v) => (
                      editing?.id === v.id ? (
                        <div className={cx("vm-erow")} key={v.id}>
                          <GripVertical size={11} className={cx("vm-grip")} />
                          <div className={cx("vm-form")}>
                            <div className={cx("vm-fline")}>
                              <input autoFocus className={cx("vm-input")} value={editing.name} onChange={(e) => setEdit({ name: e.target.value })} />
                              <input className={cx("vm-input")} placeholder="Description (optional)..." value={editing.desc} onChange={(e) => setEdit({ desc: e.target.value })} />
                            </div>
                            <div className={cx("vm-fline")}>
                              <select className={cx("vm-select")} value={editing.route} onChange={(e) => setEdit({ route: e.target.value })}>
                                <option value="">Route...</option>
                                {ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                              </select>
                              <input
                                className={cx("vm-input vm-grow")}
                                placeholder="Dose schedule..."
                                value={editing.schedule}
                                onChange={(e) => setEdit({ schedule: e.target.value })}
                                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                              />
                              <button type="button" className={cx("vm-save")} onClick={saveEdit}>Save</button>
                              <button type="button" className={cx("vm-x")} onClick={() => setEditing(null)} aria-label="Cancel edit">×</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={cx("vm-vrow")} key={v.id}>
                          <GripVertical size={11} className={cx("vm-grip")} />
                          <div className={cx("vm-vinfo")}>
                            <p className={cx("vm-vname")}>
                              {v.name}
                              {v.route && <span className={cx("vm-route")}>{v.route}</span>}
                              {v.schedule && <span className={cx("vm-sched")}>{v.schedule}</span>}
                            </p>
                            {v.desc && <p className={cx("vm-vdesc")}>{v.desc}</p>}
                          </div>
                          <div className={cx("vm-vacts")}>
                            <button type="button" onClick={() => startEdit(s.id, v)} aria-label={`Edit ${v.name}`}><Pencil size={11} /></button>
                            <button type="button" className={cx("vm-del")} onClick={() => removeVaccine(s.id, v.id)} aria-label={`Delete ${v.name}`}><Trash2 size={11} /></button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default VaccineMasterList;