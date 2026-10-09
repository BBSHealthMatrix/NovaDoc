import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Check, ChevronRight, FileText, GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { ROUTES, BLANK_VACCINE } from "./VaccineCatalogData.js";
import styles from "./VaccineCatalog.module.css";

const cx = createClassNames(styles);

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const VaccineMasterList = ({ sections, setSections }) => {
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

  return (
    <>
      <div className={cx("vc-toolbar")}>
        <div className={cx("vc-search")}>
          <Search size={13} />
          <input placeholder="Search vaccines..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button type="button" className={cx("vc-export")} onClick={exportCsv}><FileText size={13} /> Export CSV</button>
      </div>

      <div className={cx("vc-newsection")}>
        <input
          placeholder="New section name (e.g. Immunocompromised)..."
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSection()}
        />
        <button type="button" className={cx("vc-btn")} onClick={addSection}><Plus size={14} /> Add Section</button>
      </div>

      <div className={cx("vc-sections")}>
        {sections.map((s) => {
          const visible = s.vaccines.filter(matches);
          if (q && visible.length === 0) return null;
          const isOpen = open.has(s.id) || Boolean(q);
          return (
            <div className={cx("vc-section")} key={s.id}>
              <div className={cx(`vc-shead ${isOpen ? "vc-shead-open" : ""}`)}>
                <GripVertical size={12} className={cx("vc-grip")} />
                <button type="button" className={cx("vc-chev")} onClick={() => toggleOpen(s.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                  <ChevronRight size={13} className={cx(isOpen ? "vc-chev-open" : "")} />
                </button>

                {renaming?.id === s.id ? (
                  <div className={cx("vc-rename")}>
                    <input
                      autoFocus
                      className={cx("vc-input")}
                      value={renaming.name}
                      onChange={(e) => setRenaming((p) => ({ ...p, name: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(null); }}
                    />
                    <button type="button" className={cx("vc-rok")} onClick={saveRename} aria-label="Save section name"><Check size={12} /></button>
                    <button type="button" className={cx("vc-rx")} onClick={() => setRenaming(null)} aria-label="Cancel rename"><X size={12} /></button>
                  </div>
                ) : (
                  <>
                    <span className={cx("vc-sname")}>{s.name}</span>
                    <span className={cx("vc-scount")}>{s.vaccines.length} vaccines</span>
                  </>
                )}

                <div className={cx("vc-sactions")}>
                  <button type="button" className={cx("vc-addv")} onClick={() => startAdd(s.id)}><Plus size={10} /> Vaccine</button>
                  <button type="button" onClick={() => { setRenaming({ id: s.id, name: s.name }); setAddingTo(null); setEditing(null); }} aria-label="Rename section"><Pencil size={11} /></button>
                  <button type="button" className={cx("vc-del")} onClick={() => setSections((p) => p.filter((x) => x.id !== s.id))} aria-label="Delete section"><Trash2 size={11} /></button>
                </div>
              </div>

              {isOpen && (
                <div className={cx("vc-body")}>
                  {addingTo === s.id && (
                    <div className={cx("vc-form vc-form-add")}>
                      <div className={cx("vc-fline")}>
                        <input autoFocus className={cx("vc-input")} placeholder="Vaccine name..." value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
                        <input className={cx("vc-input")} placeholder="Description (optional)..." value={draft.desc} onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value }))} />
                      </div>
                      <div className={cx("vc-fline")}>
                        <select className={cx("vc-select")} value={draft.route} onChange={(e) => setDraft((p) => ({ ...p, route: e.target.value }))}>
                          <option value="">Route of administration...</option>
                          {ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input
                          className={cx("vc-input vc-grow")}
                          placeholder="Dose schedule (e.g. 2 doses: 0, 6 months)..."
                          value={draft.schedule}
                          onChange={(e) => setDraft((p) => ({ ...p, schedule: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && addVaccine(s.id)}
                        />
                        <button type="button" className={cx("vc-fbtn vc-fbtn-blue")} onClick={() => addVaccine(s.id)}>Add</button>
                        <button type="button" className={cx("vc-fbtn")} onClick={() => setAddingTo(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {visible.map((v) => (
                    editing?.id === v.id ? (
                      <div className={cx("vc-erow")} key={v.id}>
                        <GripVertical size={11} className={cx("vc-grip")} />
                        <div className={cx("vc-form")}>
                          <div className={cx("vc-fline")}>
                            <input autoFocus className={cx("vc-input")} value={editing.name} onChange={(e) => setEdit({ name: e.target.value })} />
                            <input className={cx("vc-input")} placeholder="Description (optional)..." value={editing.desc} onChange={(e) => setEdit({ desc: e.target.value })} />
                          </div>
                          <div className={cx("vc-fline")}>
                            <select className={cx("vc-select")} value={editing.route} onChange={(e) => setEdit({ route: e.target.value })}>
                              <option value="">Route...</option>
                              {ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <input
                              className={cx("vc-input vc-grow")}
                              placeholder="Dose schedule..."
                              value={editing.schedule}
                              onChange={(e) => setEdit({ schedule: e.target.value })}
                              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                            />
                            <button type="button" className={cx("vc-save")} onClick={saveEdit}>Save</button>
                            <button type="button" className={cx("vc-x")} onClick={() => setEditing(null)} aria-label="Cancel edit">×</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={cx("vc-vrow")} key={v.id}>
                        <GripVertical size={11} className={cx("vc-grip")} />
                        <div className={cx("vc-vinfo")}>
                          <p className={cx("vc-vname")}>
                            {v.name}
                            {v.route && <span className={cx("vc-route")}>{v.route}</span>}
                            {v.schedule && <span className={cx("vc-sched")}>{v.schedule}</span>}
                          </p>
                          {v.desc && <p className={cx("vc-vdesc")}>{v.desc}</p>}
                        </div>
                        <div className={cx("vc-vacts")}>
                          <button type="button" onClick={() => startEdit(s.id, v)} aria-label={`Edit ${v.name}`}><Pencil size={11} /></button>
                          <button type="button" className={cx("vc-del")} onClick={() => removeVaccine(s.id, v.id)} aria-label={`Delete ${v.name}`}><Trash2 size={11} /></button>
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
  );
};

export default VaccineMasterList;