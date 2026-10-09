import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Check, ChevronRight, FileText, GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { SECTIONS, BLANK_PROCEDURE } from "./ProcedureMasterListData.js";
import styles from "./ProcedureMasterList.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/procedure-master-list", label: "Procedure Master List" },
  { to: "/admin/procedure-partners", label: "Procedure Partners" },
];

const autoCode = () => String(Date.now()).slice(-5);

const ProcedureMasterList = () => {
  const { pathname } = useLocation();
  const [sections, setSections] = useState(SECTIONS);
  const [open, setOpen] = useState(() => new Set());
  const [search, setSearch] = useState("");
  const [newSection, setNewSection] = useState("");
  const [addingTo, setAddingTo] = useState(null);
  const [draft, setDraft] = useState(BLANK_PROCEDURE);
  const [renaming, setRenaming] = useState(null); // { id, name }
  const [editing, setEditing] = useState(null); // { sectionId, procId, name, cpt, auto }

  const forceOpen = (id) => setOpen((p) => new Set(p).add(id));
  const toggleOpen = (id) => setOpen((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* ── sections ── */
  const addSection = () => {
    const name = newSection.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-") + Date.now();
    setSections((p) => [...p, { id, name, procedures: [] }]);
    forceOpen(id);
    setNewSection("");
  };
  const removeSection = (id) => setSections((p) => p.filter((s) => s.id !== id));

  const startRename = (s) => { setRenaming({ id: s.id, name: s.name }); setAddingTo(null); setEditing(null); };
  const saveRename = () => {
    const name = renaming.name.trim();
    if (!name) return;
    setSections((p) => p.map((s) => (s.id === renaming.id ? { ...s, name } : s)));
    setRenaming(null);
  };

  /* ── add procedure ── */
  const startAdd = (id) => { forceOpen(id); setAddingTo(id); setDraft(BLANK_PROCEDURE); setRenaming(null); setEditing(null); };
  const cancelAdd = () => setAddingTo(null);
  const addProcedure = (sectionId) => {
    const name = draft.name.trim();
    if (!name) return;
    const cpt = draft.auto ? autoCode() : draft.cpt.trim();
    setSections((p) => p.map((s) => s.id === sectionId
      ? { ...s, procedures: [...s.procedures, { id: Date.now(), name, cpt, desc: "" }] }
      : s));
    cancelAdd();
  };
  const removeProcedure = (sectionId, procId) =>
    setSections((p) => p.map((s) => s.id === sectionId ? { ...s, procedures: s.procedures.filter((x) => x.id !== procId) } : s));

  /* ── edit procedure ── */
  const startEdit = (sectionId, pr) => {
    setEditing({ sectionId, procId: pr.id, name: pr.name, cpt: pr.cpt, auto: false });
    setAddingTo(null);
    setRenaming(null);
  };
  const saveEdit = () => {
    const name = editing.name.trim();
    if (!name) return;
    const cpt = editing.auto ? autoCode() : editing.cpt.trim();
    setSections((p) => p.map((s) => s.id !== editing.sectionId ? s : {
      ...s,
      procedures: s.procedures.map((x) => x.id !== editing.procId ? x : { ...x, name, cpt }),
    }));
    setEditing(null);
  };

  const q = search.trim().toLowerCase();
  const matches = (pr) => !q || pr.name.toLowerCase().includes(q) || pr.cpt.toLowerCase().includes(q);

  return (
    <div className={cx("pm-wrap")}>
      <div className={cx("pm-tabs")}>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className={cx(`pm-tab ${pathname === t.to ? "pm-tab-on" : ""}`)}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className={cx("pm-page")}>
        <h1 className={cx("pm-title")}>Procedure Master List</h1>
        <p className={cx("pm-desc")}>Manage sections, procedures, and CPT codes.</p>

        <div className={cx("pm-toolbar")}>
          <div className={cx("pm-search")}>
            <Search size={12} />
            <input placeholder="Search procedures / CPT..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" className={cx("pm-export")}><FileText size={13} /> Export CSV</button>
        </div>

        <div className={cx("pm-newsection")}>
          <input placeholder="New section name..." value={newSection} onChange={(e) => setNewSection(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSection()} />
          <button type="button" onClick={addSection}><Plus size={14} /> Add Section</button>
        </div>

        <div className={cx("pm-sections")}>
          {sections.map((s) => {
            const visible = s.procedures.filter(matches);
            if (q && visible.length === 0) return null;
            const isOpen = open.has(s.id) || Boolean(q);
            const isRenaming = renaming?.id === s.id;
            return (
              <div className={cx("pm-section")} key={s.id}>
                <div className={cx("pm-shead")}>
                  <button type="button" className={cx("pm-grip")} aria-label="Reorder section"><GripVertical size={12} /></button>
                  <button type="button" className={cx("pm-chev")} onClick={() => toggleOpen(s.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                    <ChevronRight size={13} className={cx(isOpen ? "pm-chev-open" : "")} />
                  </button>

                  {isRenaming ? (
                    <div className={cx("pm-rename")}>
                      <input
                        className={cx("pm-ainput pm-rinput")}
                        value={renaming.name}
                        autoFocus
                        onChange={(e) => setRenaming((p) => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(null); }}
                      />
                      <button type="button" className={cx("pm-rok")} onClick={saveRename} aria-label="Save section name"><Check size={12} /></button>
                      <button type="button" className={cx("pm-rx")} onClick={() => setRenaming(null)} aria-label="Cancel rename"><X size={12} /></button>
                    </div>
                  ) : (
                    <>
                      <span className={cx("pm-sname")}>{s.name}</span>
                      <span className={cx("pm-scount")}>{s.procedures.length} procedures</span>
                    </>
                  )}

                  <div className={cx("pm-sactions")}>
                    <button type="button" className={cx("pm-addproc")} onClick={() => startAdd(s.id)}><Plus size={10} /> Procedure</button>
                    <button type="button" onClick={() => startRename(s)} aria-label="Rename section"><Pencil size={11} /></button>
                    <button type="button" onClick={() => removeSection(s.id)} aria-label="Delete section"><Trash2 size={11} /></button>
                  </div>
                </div>

                {isOpen && (
                  <div className={cx("pm-body")}>
                    {addingTo === s.id && (
                      <div className={cx("pm-addform")}>
                        <input className={cx("pm-ainput pm-aname")} placeholder="Procedure name..." value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addProcedure(s.id)} autoFocus />
                        <input className={cx("pm-ainput pm-acpt")} placeholder="CPT  code" value={draft.auto ? "" : draft.cpt} disabled={draft.auto} onChange={(e) => setDraft((p) => ({ ...p, cpt: e.target.value }))} />
                        <label className={cx("pm-auto")}>
                          <input type="checkbox" checked={draft.auto} onChange={() => setDraft((p) => ({ ...p, auto: !p.auto }))} /> Auto
                        </label>
                        <button type="button" className={cx("pm-add")} onClick={() => addProcedure(s.id)}>Add</button>
                        <button type="button" className={cx("pm-cancel")} onClick={cancelAdd}>Cancel</button>
                      </div>
                    )}

                    {visible.map((pr) => {
                      const isEditing = editing?.sectionId === s.id && editing?.procId === pr.id;
                      if (isEditing) {
                        return (
                          <div className={cx("pm-erow")} key={pr.id}>
                            <button type="button" className={cx("pm-grip")} aria-label="Reorder procedure"><GripVertical size={11} /></button>
                            <input className={cx("pm-einput pm-ename")} value={editing.name} autoFocus onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }} />
                            <input className={cx("pm-einput pm-ecpt")} value={editing.auto ? "" : editing.cpt} disabled={editing.auto} onChange={(e) => setEditing((p) => ({ ...p, cpt: e.target.value }))} />
                            <label className={cx("pm-auto")}>
                              <input type="checkbox" checked={editing.auto} onChange={() => setEditing((p) => ({ ...p, auto: !p.auto }))} /> Auto
                            </label>
                            <button type="button" className={cx("pm-esave")} onClick={saveEdit}>Save</button>
                            <button type="button" className={cx("pm-ex")} onClick={() => setEditing(null)} aria-label="Cancel edit">×</button>
                          </div>
                        );
                      }
                      return (
                        <div className={cx("pm-prow")} key={pr.id}>
                          <button type="button" className={cx("pm-grip")} aria-label="Reorder procedure"><GripVertical size={11} /></button>
                          <span className={cx("pm-pname")}>{pr.name}</span>
                          <div className={cx("pm-pmeta")}>
                            {pr.cpt && <span className={cx("pm-code")}>{pr.cpt}</span>}
                            {pr.desc && <span className={cx("pm-pdesc")}>{pr.desc}</span>}
                          </div>
                          <div className={cx("pm-pactions")}>
                            <button type="button" onClick={() => startEdit(s.id, pr)} aria-label={`Edit ${pr.name}`}><Pencil size={11} /></button>
                            <button type="button" onClick={() => removeProcedure(s.id, pr.id)} aria-label={`Delete ${pr.name}`}><Trash2 size={11} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcedureMasterList;