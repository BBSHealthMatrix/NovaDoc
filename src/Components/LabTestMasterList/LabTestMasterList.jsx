import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Check, ChevronDown, FileDown, GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import { SAMPLE_TYPES, SECTIONS } from "./LabTestMasterListData.js";
import styles from "./LabTestMasterList.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/lab-test-master-list", label: "Lab Test Master List" },
  { to: "/admin/lab-providers", label: "Lab Providers" },
];

const BLANK_TEST = { name: "", desc: "", sample: SAMPLE_TYPES[0], fasting: false };

const LabTestMasterList = () => {
  const { pathname } = useLocation();
  const [sections, setSections] = useState(SECTIONS);
  const [open, setOpen] = useState(() => new Set(SECTIONS.map((s) => s.id)));
  const [search, setSearch] = useState("");
  const [newSection, setNewSection] = useState("");

  // add-test inline form
  const [addingTo, setAddingTo] = useState(null);
  const [draft, setDraft] = useState(BLANK_TEST);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [sampleTypes, setSampleTypes] = useState(SAMPLE_TYPES);

  // rename-section inline form
  const [renaming, setRenaming] = useState(null); // { id, name }

  // edit-test inline form
  const [editingTest, setEditingTest] = useState(null); // { sectionId, testId, ...fields }

  const forceOpen = (id) => setOpen((p) => new Set(p).add(id));
  const toggleOpen = (id) => setOpen((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addSection = () => {
    const name = newSection.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-") + Date.now();
    setSections((p) => [...p, { id, name, tests: [] }]);
    forceOpen(id);
    setNewSection("");
  };
  const removeSection = (id) => setSections((p) => p.filter((s) => s.id !== id));

  /* ── rename section ── */
  const startRename = (s) => { setRenaming({ id: s.id, name: s.name }); setAddingTo(null); setEditingTest(null); };
  const saveRename = () => {
    const name = renaming.name.trim();
    if (!name) return;
    setSections((p) => p.map((s) => (s.id === renaming.id ? { ...s, name } : s)));
    setRenaming(null);
  };

  /* ── add test ── */
  // Opening the form also force-expands the section — this is the fix: previously
  // clicking "+ Test" on a collapsed section did nothing, because the form only
  // renders inside the expanded body.
  const startAdd = (id) => {
    forceOpen(id);
    setAddingTo(id);
    setDraft(BLANK_TEST);
    setCustomOpen(false);
    setCustomName("");
    setRenaming(null);
    setEditingTest(null);
  };
  const cancelAdd = () => { setAddingTo(null); setCustomOpen(false); setCustomName(""); };

  const saveCustomType = () => {
    const name = customName.trim();
    if (!name) return;
    if (!sampleTypes.includes(name)) setSampleTypes((p) => [...p, name]);
    setDraft((p) => ({ ...p, sample: name }));
    setCustomOpen(false);
    setCustomName("");
  };

  const addTest = (sectionId) => {
    const name = draft.name.trim();
    if (!name) return;
    setSections((p) => p.map((s) => s.id === sectionId
      ? { ...s, tests: [...s.tests, { id: Date.now(), name, desc: draft.desc.trim(), sample: draft.sample, fasting: draft.fasting }] }
      : s));
    cancelAdd();
  };
  const removeTest = (sectionId, testId) =>
    setSections((p) => p.map((s) => s.id === sectionId ? { ...s, tests: s.tests.filter((t) => t.id !== testId) } : s));

  /* ── edit test ── */
  const startEditTest = (sectionId, t) => {
    forceOpen(sectionId);
    setEditingTest({ sectionId, testId: t.id, name: t.name, desc: t.desc, sample: t.sample, fasting: t.fasting });
    setAddingTo(null);
    setRenaming(null);
  };
  const cancelEditTest = () => setEditingTest(null);
  const saveEditTest = () => {
    const name = editingTest.name.trim();
    if (!name) return;
    setSections((p) => p.map((s) => s.id !== editingTest.sectionId ? s : {
      ...s,
      tests: s.tests.map((t) => t.id !== editingTest.testId ? t : { ...t, name, desc: editingTest.desc.trim(), sample: editingTest.sample, fasting: editingTest.fasting }),
    }));
    setEditingTest(null);
  };

  const matches = (t) => !search || t.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className={cx("lm-wrap")}>
      <div className={cx("lm-tabs")}>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} className={cx(`lm-tab ${pathname === t.to ? "lm-tab-on" : ""}`)}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className={cx("lm-page")}>
        <h1 className={cx("lm-title")}>Lab Test Master List</h1>
        <p className={cx("lm-desc")}>Manage sections and test names used across all providers.</p>

        <div className={cx("lm-toolbar")}>
          <div className={cx("lm-search")}>
            <Search size={12} />
            <input placeholder="Search tests..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button type="button" className={cx("lm-export")}><FileDown size={13} /> Export CSV</button>
        </div>

        <div className={cx("lm-newsection")}>
          <input placeholder="New section name (e.g. Immunology)..." value={newSection} onChange={(e) => setNewSection(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSection()} />
          <button type="button" onClick={addSection}><Plus size={13} /> Add Section</button>
        </div>

        <div className={cx("lm-sections")}>
          {sections.map((s) => {
            const isOpen = open.has(s.id);
            const visibleTests = s.tests.filter(matches);
            if (search && visibleTests.length === 0) return null;
            const isRenaming = renaming?.id === s.id;
            return (
              <div className={cx("lm-section")} key={s.id}>
                <div className={cx("lm-shead")}>
                  <button type="button" className={cx("lm-grip")} aria-label="Reorder section"><GripVertical size={13} /></button>
                  <button type="button" className={cx("lm-chev")} onClick={() => toggleOpen(s.id)} aria-label={isOpen ? "Collapse" : "Expand"}>
                    <ChevronDown size={14} className={cx(isOpen ? "lm-chev-open" : "lm-chev-closed")} />
                  </button>

                  {isRenaming ? (
                    <div className={cx("lm-rename")}>
                      <input
                        className={cx("lm-ainput lm-rinput")}
                        value={renaming.name}
                        autoFocus
                        onChange={(e) => setRenaming((p) => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(null); }}
                      />
                      <button type="button" className={cx("lm-rok")} onClick={saveRename} aria-label="Save section name"><Check size={12} /></button>
                      <button type="button" className={cx("lm-rx")} onClick={() => setRenaming(null)} aria-label="Cancel rename"><X size={12} /></button>
                    </div>
                  ) : (
                    <>
                      <span className={cx("lm-sname")}>{s.name}</span>
                      <span className={cx("lm-scount")}>{s.tests.length} tests</span>
                    </>
                  )}

                  <div className={cx("lm-sactions")}>
                    <button type="button" className={cx("lm-addtest")} onClick={() => startAdd(s.id)}><Plus size={11} /> Test</button>
                    <button type="button" onClick={() => startRename(s)} aria-label="Rename section"><Pencil size={12} /></button>
                    <button type="button" onClick={() => removeSection(s.id)} aria-label="Delete section"><Trash2 size={12} /></button>
                  </div>
                </div>

                {isOpen && (
                  <div className={cx("lm-body")}>
                    {addingTo === s.id && (
                      <div className={cx("lm-addform")}>
                        <input className={cx("lm-ainput")} placeholder="Test name..." value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} autoFocus />
                        <input className={cx("lm-ainput")} placeholder="Description (optional)..." value={draft.desc} onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value }))} />
                        <div className={cx("lm-arow")}>
                          <div className={cx("lm-asel")}>
                            <Select value={draft.sample} options={sampleTypes} onChange={(v) => setDraft((p) => ({ ...p, sample: v }))} label="Sample type" />
                          </div>
                          {!customOpen ? (
                            <button type="button" className={cx("lm-custom")} onClick={() => setCustomOpen(true)}><Plus size={11} /> Custom</button>
                          ) : (
                            <>
                              <input className={cx("lm-ainput lm-ctype")} placeholder="Type name..." value={customName} onChange={(e) => setCustomName(e.target.value)} autoFocus />
                              <button type="button" className={cx("lm-custom lm-custom-save")} onClick={saveCustomType}>Add</button>
                              <button type="button" className={cx("lm-ctypex")} onClick={() => { setCustomOpen(false); setCustomName(""); }} aria-label="Cancel custom type"><X size={11} /></button>
                            </>
                          )}
                          <div className={cx("lm-fasting")}>
                            <Toggle size="small" color="amber" className={cx("lm-tg")} on={draft.fasting} onChange={() => setDraft((p) => ({ ...p, fasting: !p.fasting }))} label="Fasting Required" />
                            <span>Fasting Required</span>
                          </div>
                          <button type="button" className={cx("lm-save")} onClick={() => addTest(s.id)}>Add</button>
                          <button type="button" className={cx("lm-cancel")} onClick={cancelAdd}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {visibleTests.map((t) => {
                      const isEditing = editingTest?.sectionId === s.id && editingTest?.testId === t.id;
                      if (isEditing) {
                        return (
                          <div className={cx("lm-addform")} key={t.id}>
                            <input className={cx("lm-ainput")} placeholder="Test name..." value={editingTest.name} onChange={(e) => setEditingTest((p) => ({ ...p, name: e.target.value }))} autoFocus />
                            <input className={cx("lm-ainput")} placeholder="Description (optional)..." value={editingTest.desc} onChange={(e) => setEditingTest((p) => ({ ...p, desc: e.target.value }))} />
                            <div className={cx("lm-arow")}>
                              <div className={cx("lm-asel")}>
                                <Select value={editingTest.sample} options={sampleTypes} onChange={(v) => setEditingTest((p) => ({ ...p, sample: v }))} label="Sample type" />
                              </div>
                              <div className={cx("lm-fasting")}>
                                <Toggle size="small" color="amber" className={cx("lm-tg")} on={editingTest.fasting} onChange={() => setEditingTest((p) => ({ ...p, fasting: !p.fasting }))} label="Fasting Required" />
                                <span>Fasting Required</span>
                              </div>
                              <button type="button" className={cx("lm-save")} onClick={saveEditTest}>Save</button>
                              <button type="button" className={cx("lm-cancel")} onClick={cancelEditTest}>Cancel</button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className={cx("lm-trow")} key={t.id}>
                          <button type="button" className={cx("lm-grip lm-grip-row")} aria-label="Reorder test"><GripVertical size={12} /></button>
                          <div className={cx("lm-tinfo")}>
                            <span className={cx("lm-tname")}>{t.name}</span>
                            <span className={cx(`lm-badge ${t.sample === "N/A" ? "lm-badge-na" : ""}`)}>{t.sample}</span>
                            {t.fasting && <span className={cx("lm-badge lm-badge-fast")}>Fasting</span>}
                            {t.desc && <p className={cx("lm-tdesc")}>{t.desc}</p>}
                          </div>
                          <div className={cx("lm-tactions")}>
                            <button type="button" onClick={() => startEditTest(s.id, t)} aria-label={`Edit ${t.name}`}><Pencil size={12} /></button>
                            <button type="button" onClick={() => removeTest(s.id, t.id)} aria-label={`Delete ${t.name}`}><Trash2 size={12} /></button>
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

export default LabTestMasterList;