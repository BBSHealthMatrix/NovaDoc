import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import {
  ArrowDown, ArrowUp, Check, ChevronDown, Copy, Eye, FlaskConical, Pencil,
  Plus, Save, Search, Trash2, Upload, X,
} from "lucide-react";
import { TEMPLATES, BLANK_TEMPLATE, BLANK_PARAM } from "./ResultTemplatesData.js";
import styles from "./ResultTemplates.module.css";

const cx = createClassNames(styles);

const today = () => new Date().toISOString().slice(0, 10);
const counts = (t) => t.reduce((n, s) => n + s.params.length, 0);

const ResultTemplates = () => {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("list"); // "list" | "edit"
  const [editing, setEditing] = useState(null); // template draft being edited
  const [preview, setPreview] = useState(null); // template to preview
  const [newSectionName, setNewSectionName] = useState("");
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [renamingSection, setRenamingSection] = useState(null); // { id, name }
  const [editingParam, setEditingParam] = useState(null); // { sectionId, paramId, ...fields }
  const [addingParamTo, setAddingParamTo] = useState(null); // sectionId

  const filtered = templates.filter((t) => {
    if (filter !== "All" && t.status !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ── list actions ── */
  const togglePublish = (t) => setTemplates((p) => p.map((x) => (x.id === t.id ? { ...x, status: x.status === "Published" ? "Draft" : "Published", updated: today() } : x)));
  const duplicate = (t) => setTemplates((p) => [...p, { ...t, id: Date.now(), name: `${t.name} (Copy)`, status: "Draft", updated: today() }]);
  const remove = (id) => setTemplates((p) => p.filter((t) => t.id !== id));

  const openEdit = (t) => { setEditing(JSON.parse(JSON.stringify(t))); setCollapsed(new Set()); setView("edit"); };
  const openNew = () => { setEditing({ ...BLANK_TEMPLATE, id: null }); setCollapsed(new Set()); setView("edit"); };
  const closeEdit = () => { setView("list"); setEditing(null); setRenamingSection(null); setEditingParam(null); setAddingParamTo(null); };

  const setField = (patch) => setEditing((p) => ({ ...p, ...patch }));

  const saveTemplate = (status) => {
    const name = editing.name.trim() || "Untitled Template";
    if (editing.id) {
      setTemplates((p) => p.map((t) => (t.id === editing.id ? { ...editing, name, status, updated: today() } : t)));
    } else {
      setTemplates((p) => [...p, { ...editing, id: Date.now(), name, status, updated: today() }]);
    }
    closeEdit();
  };

  /* ── editor: sections ── */
  const toggleCollapse = (id) => setCollapsed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addSection = () => {
    const name = newSectionName.trim();
    if (!name) return;
    setField({ sections: [...editing.sections, { id: Date.now(), name, params: [] }] });
    setNewSectionName("");
  };
  const removeSection = (id) => setField({ sections: editing.sections.filter((s) => s.id !== id) });
  const moveSection = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= editing.sections.length) return;
    const sections = [...editing.sections];
    [sections[i], sections[j]] = [sections[j], sections[i]];
    setField({ sections });
  };

  const startRenameSection = (s) => { setRenamingSection({ id: s.id, name: s.name }); setEditingParam(null); setAddingParamTo(null); };
  const saveRenameSection = () => {
    const name = renamingSection.name.trim();
    if (!name) return;
    setField({ sections: editing.sections.map((s) => (s.id === renamingSection.id ? { ...s, name } : s)) });
    setRenamingSection(null);
  };

  /* ── editor: parameters ── */
  const startAddParam = (sectionId) => { setAddingParamTo(sectionId); setEditingParam(null); setRenamingSection(null); collapsed.has(sectionId) && toggleCollapse(sectionId); };
  const [paramDraft, setParamDraft] = useState(BLANK_PARAM);
  const saveNewParam = (sectionId) => {
    const name = paramDraft.name.trim();
    if (!name) return;
    setField({
      sections: editing.sections.map((s) => s.id !== sectionId ? s : { ...s, params: [...s.params, { ...paramDraft, name, id: Date.now() }] }),
    });
    setParamDraft(BLANK_PARAM);
    setAddingParamTo(null);
  };

  const startEditParam = (sectionId, p) => { setEditingParam({ sectionId, paramId: p.id, name: p.name, unit: p.unit, range: p.range }); setAddingParamTo(null); setRenamingSection(null); };
  const saveEditParam = () => {
    const name = editingParam.name.trim();
    if (!name) return;
    setField({
      sections: editing.sections.map((s) => s.id !== editingParam.sectionId ? s : {
        ...s, params: s.params.map((p) => p.id !== editingParam.paramId ? p : { ...p, name, unit: editingParam.unit, range: editingParam.range }),
      }),
    });
    setEditingParam(null);
  };
  const removeParam = (sectionId, paramId) =>
    setField({ sections: editing.sections.map((s) => s.id !== sectionId ? s : { ...s, params: s.params.filter((p) => p.id !== paramId) }) });

  /* ───────── preview modal ───────── */
  const renderPreview = () => preview && (
    <div className={cx("rt-overlay")} onClick={() => setPreview(null)}>
      <div className={cx("rt-pmodal")} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={cx("rt-phead")}>
          <h2 className={cx("rt-ptitle")}><Eye size={14} /> Preview — {preview.name}</h2>
          <button type="button" onClick={() => setPreview(null)} aria-label="Close"><X size={15} /></button>
        </div>
        <p className={cx("rt-pdesc")}>{preview.desc}</p>
        {preview.sections.map((s) => (
          <div key={s.id} className={cx("rt-psection")}>
            <p className={cx("rt-psname")}>{s.name.toUpperCase()}</p>
            <div className={cx("rt-ptable")}>
              <div className={cx("rt-prow rt-pth")}>
                <span>Parameter</span><span>Value</span><span>Unit</span><span>Reference Range</span>
              </div>
              {s.params.map((p) => (
                <div className={cx("rt-prow")} key={p.id}>
                  <span className={cx("rt-pname2")}>{p.name}</span>
                  <input className={cx("rt-pval")} placeholder="—" disabled />
                  <span>{p.unit}</span>
                  <span>{p.range}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ───────── list view ───────── */
  if (view === "list") {
    return (
      <div className={cx("rt-wrap")}>
        <h1 className={cx("rt-title")}><FlaskConical size={18} /> Lab Result Templates</h1>
        <p className={cx("rt-desc")}>Build and manage reusable result report formats for lab tests.</p>

        <div className={cx("rt-bar")}>
          <div className={cx("rt-search")}>
            <Search size={12} />
            <input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={cx("rt-filters")}>
            {["All", "Draft", "Published"].map((f) => (
              <button type="button" key={f} className={cx(`rt-filter ${filter === f ? "rt-filter-on" : ""}`)} onClick={() => setFilter(f)}>
                {f} <em>({f === "All" ? templates.length : templates.filter((t) => t.status === f).length})</em>
              </button>
            ))}
          </div>
          <button type="button" className={cx("rt-newbtn")} onClick={openNew}><Plus size={14} /> New Template</button>
        </div>

        <div className={cx("rt-list")}>
          {filtered.map((t) => (
            <div className={cx("rt-card")} key={t.id}>
              <span className={cx("rt-icon")}><FlaskConical size={15} /></span>
              <div className={cx("rt-info")}>
                <p className={cx("rt-name")}>
                  {t.name} <span className={cx(`rt-badge ${t.status === "Published" ? "rt-badge-pub" : "rt-badge-draft"}`)}>{t.status}</span>
                </p>
                <p className={cx("rt-sub")}>{t.desc}</p>
                <p className={cx("rt-meta")}>{t.sections.length} section{t.sections.length !== 1 ? "s" : ""} · {counts(t.sections)} parameters · updated {t.updated}</p>
              </div>
              <div className={cx("rt-actions")}>
                <button type="button" className={cx("rt-abtn")} onClick={() => setPreview(t)}><Eye size={11} /> Preview</button>
                <button type="button" className={cx("rt-abtn")} onClick={() => openEdit(t)}><Pencil size={11} /> Edit</button>
                <button type="button" className={cx("rt-abtn")} onClick={() => duplicate(t)}><Copy size={11} /> Duplicate</button>
                <button type="button" className={cx(`rt-abtn ${t.status === "Published" ? "rt-abtn-amber" : "rt-abtn-green"}`)} onClick={() => togglePublish(t)}>
                  {t.status === "Published" ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className={cx("rt-trash")} onClick={() => remove(t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>

        {renderPreview()}
      </div>
    );
  }

  /* ───────── editor view ───────── */
  return (
    <div className={cx("rt-wrap")}>
      <div className={cx("rt-ehead")}>
        <button type="button" className={cx("rt-eclose")} onClick={closeEdit} aria-label="Close editor"><X size={14} /></button>
        <div className={cx("rt-etitlewrap")}>
          <p className={cx("rt-eeyebrow")}>{editing.id ? "EDIT TEMPLATE" : "NEW TEMPLATE"}</p>
          <p className={cx("rt-etitle")}>{editing.name || "Untitled Template"}</p>
        </div>
        <div className={cx("rt-ebtns")}>
          <button type="button" className={cx("rt-ebtn")} onClick={() => setPreview(editing)}><Eye size={12} /> Preview</button>
          <button type="button" className={cx("rt-ebtn")} onClick={() => saveTemplate("Draft")}><Save size={12} /> Save as Draft</button>
          <button type="button" className={cx("rt-ebtn rt-ebtn-pub")} onClick={() => saveTemplate("Published")}><Upload size={12} /> Publish</button>
        </div>
      </div>

      <div className={cx("rt-ebody")}>
        <div className={cx("rt-fieldcard")}>
          <label className={cx("rt-flabel")}>Template Name <b>*</b></label>
          <input className={cx("rt-finput")} placeholder="e.g. Complete Blood Count (CBC)" value={editing.name} onChange={(e) => setField({ name: e.target.value })} />
          <label className={cx("rt-flabel rt-mt")}>Description</label>
          <input className={cx("rt-finput")} placeholder="Brief description of what this template covers..." value={editing.desc} onChange={(e) => setField({ desc: e.target.value })} />
        </div>

        <div className={cx("rt-addsection")}>
          <input placeholder="New section name (e.g. Differential Count)..." value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSection()} />
          <button type="button" onClick={addSection}><Plus size={13} /> Add Section</button>
        </div>

        {editing.sections.length === 0 ? (
          <div className={cx("rt-empty")}>
            <FlaskConical size={34} />
            <p className={cx("rt-etext")}>No sections yet</p>
            <p className={cx("rt-esub")}>Add a section above to start building your template.</p>
          </div>
        ) : (
          editing.sections.map((s, i) => {
            const isCollapsed = collapsed.has(s.id);
            const isRenaming = renamingSection?.id === s.id;
            return (
              <div className={cx("rt-section")} key={s.id}>
                <div className={cx("rt-shead")}>
                  <button type="button" className={cx("rt-chev")} onClick={() => toggleCollapse(s.id)} aria-label={isCollapsed ? "Expand" : "Collapse"}>
                    <ChevronDown size={14} className={cx(isCollapsed ? "rt-chev-closed" : "")} />
                  </button>
                  {isRenaming ? (
                    <div className={cx("rt-rename")}>
                      <input value={renamingSection.name} autoFocus onChange={(e) => setRenamingSection((p) => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRenameSection(); if (e.key === "Escape") setRenamingSection(null); }} />
                      <button type="button" onClick={saveRenameSection} aria-label="Save"><Check size={12} /></button>
                      <button type="button" onClick={() => setRenamingSection(null)} aria-label="Cancel"><X size={12} /></button>
                    </div>
                  ) : (
                    <span className={cx("rt-sname")}>{s.name}</span>
                  )}
                  <span className={cx("rt-scount")}>{s.params.length} params</span>
                  <div className={cx("rt-sactions")}>
                    <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label="Move section up"><ArrowUp size={11} /></button>
                    <button type="button" onClick={() => moveSection(i, 1)} disabled={i === editing.sections.length - 1} aria-label="Move section down"><ArrowDown size={11} /></button>
                    <button type="button" onClick={() => startRenameSection(s)} aria-label="Rename section"><Pencil size={12} /></button>
                    <button type="button" onClick={() => removeSection(s.id)} aria-label="Delete section"><Trash2 size={12} /></button>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className={cx("rt-sbody")}>
                    <div className={cx("rt-prow rt-pth")}>
                      <span>Parameter Name</span><span>Move</span><span className={cx("rt-ival")}>Value (filled at entry)</span><span>Unit</span><span>Reference Range</span>
                    </div>
                    {s.params.map((p) => {
                      const isEditingP = editingParam?.sectionId === s.id && editingParam?.paramId === p.id;
                      if (isEditingP) {
                        return (
                          <div className={cx("rt-peditrow")} key={p.id}>
                            <input placeholder="Name" value={editingParam.name} autoFocus onChange={(e) => setEditingParam((v) => ({ ...v, name: e.target.value }))} />
                            <input placeholder="Unit" value={editingParam.unit} onChange={(e) => setEditingParam((v) => ({ ...v, unit: e.target.value }))} />
                            <input placeholder="Reference range" value={editingParam.range} onChange={(e) => setEditingParam((v) => ({ ...v, range: e.target.value }))} />
                            <button type="button" className={cx("rt-psave")} onClick={saveEditParam}>Save</button>
                            <button type="button" className={cx("rt-pcancel")} onClick={() => setEditingParam(null)}>Cancel</button>
                          </div>
                        );
                      }
                      return (
                        <div className={cx("rt-prow rt-ptr")} key={p.id}>
                          <span className={cx("rt-pname2")}>{p.name}</span>
                          <span className={cx("rt-move")}><ArrowUp size={10} /><ArrowDown size={10} /></span>
                          <span className={cx("rt-ival")}>—</span>
                          <span>{p.unit}</span>
                          <span className={cx("rt-range")}>{p.range}</span>
                          <div className={cx("rt-pactions")}>
                            <button type="button" onClick={() => startEditParam(s.id, p)} aria-label={`Edit ${p.name}`}><Pencil size={11} /></button>
                            <button type="button" onClick={() => removeParam(s.id, p.id)} aria-label={`Delete ${p.name}`}><Trash2 size={11} /></button>
                          </div>
                        </div>
                      );
                    })}

                    {addingParamTo === s.id ? (
                      <div className={cx("rt-peditrow")}>
                        <input placeholder="Name" value={paramDraft.name} autoFocus onChange={(e) => setParamDraft((v) => ({ ...v, name: e.target.value }))} />
                        <input placeholder="Unit" value={paramDraft.unit} onChange={(e) => setParamDraft((v) => ({ ...v, unit: e.target.value }))} />
                        <input placeholder="Reference range" value={paramDraft.range} onChange={(e) => setParamDraft((v) => ({ ...v, range: e.target.value }))} />
                        <button type="button" className={cx("rt-psave")} onClick={() => saveNewParam(s.id)}>Add</button>
                        <button type="button" className={cx("rt-pcancel")} onClick={() => setAddingParamTo(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button type="button" className={cx("rt-addparam")} onClick={() => startAddParam(s.id)}><Plus size={11} /> Add Parameter</button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        <p className={cx("rt-footmeta")}>{editing.sections.length} section{editing.sections.length !== 1 ? "s" : ""} · {counts(editing.sections)} parameters</p>
      </div>

      {renderPreview()}
    </div>
  );
};

export default ResultTemplates;