import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { ChevronDown, ChevronRight, FileMinus, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import styles from "./NonFormulary.module.css";

const cx = createClassNames(styles);

const EMPTY_FORM = { generic: "", category: "", brand: "", strength: "" };

const NfCatalogue = ({ drugs, setDrugs }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const [form, setForm] = useState(null);          // "Add New NF Drug" form
  const [draft, setDraft] = useState({ name: "", strength: "" }); // add-brand row
  const [editBrand, setEditBrand] = useState(null); // { id, name, strength }

  const q = search.trim().toLowerCase();
  const match = (d) => !q
    || d.generic.toLowerCase().includes(q)
    || d.category.toLowerCase().includes(q)
    || d.brands.some((b) => b.name.toLowerCase().includes(q));
  const categories = [...new Set(drugs.map((d) => d.category))];
  const groups = categories
    .map((c) => ({ name: c, items: drugs.filter((d) => d.category === c && match(d)) }))
    .filter((g) => g.items.length);
  const selected = drugs.find((d) => d.id === selectedId);

  const patchDrug = (id, fn) => setDrugs((p) => p.map((d) => (d.id === id ? fn(d) : d)));
  const setOpen = (id, open) => setExpanded((p) => {
    const n = new Set(p);
    if (open) n.add(id); else n.delete(id);
    return n;
  });

  /* ── list ── */
  const pick = (id) => {
    setForm(null);
    setEditBrand(null);
    setDraft({ name: "", strength: "" });
    if (id === selectedId) setOpen(id, !expanded.has(id));
    else { setSelectedId(id); setOpen(id, true); }
  };
  const openForm = () => { setSelectedId(null); setEditBrand(null); setForm(EMPTY_FORM); };

  /* ── brands of the selected drug ── */
  const addBrand = () => {
    const name = draft.name.trim();
    if (!name || !selected) return;
    patchDrug(selected.id, (d) => ({ ...d, brands: [...d.brands, { id: Date.now(), name, strength: draft.strength.trim() }] }));
    setDraft({ name: "", strength: "" });
  };
  const saveBrand = () => {
    const name = editBrand.name.trim();
    if (name) {
      patchDrug(selected.id, (d) => ({
        ...d, brands: d.brands.map((b) => (b.id === editBrand.id ? { ...b, name, strength: editBrand.strength.trim() } : b)),
      }));
    }
    setEditBrand(null);
  };
  const removeBrand = (id) => patchDrug(selected.id, (d) => ({ ...d, brands: d.brands.filter((b) => b.id !== id) }));
  const deleteDrug = () => { setDrugs((p) => p.filter((d) => d.id !== selected.id)); setSelectedId(null); };

  /* ── add new drug ── */
  const setF = (patch) => setForm((p) => ({ ...p, ...patch }));
  const createDrug = () => {
    const generic = form.generic.trim();
    if (!generic) return;
    const typed = form.category.trim() || "Other";
    const category = categories.find((c) => c.toLowerCase() === typed.toLowerCase()) ?? typed;
    const brand = form.brand.trim();
    const id = Date.now();
    setDrugs((p) => [...p, { id, generic, category, brands: brand ? [{ id: id + 1, name: brand, strength: form.strength.trim() }] : [] }]);
    setForm(null);
    setSelectedId(id);
    setOpen(id, true);
  };

  const n = selected?.brands.length ?? 0;

  return (
    <div className={cx("nf-cat")}>
      {/* ── left: catalogue list ── */}
      <div className={cx("nf-list")}>
        <div className={cx("nf-searchwrap")}>
          <div className={cx("nf-search")}>
            <Search size={12} />
            <input placeholder="Search NF catalogue..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={cx("nf-scroll")}>
          {groups.map((g) => (
            <div key={g.name}>
              <div className={cx("nf-cathdr")}>{g.name}</div>
              {g.items.map((d) => {
                const open = expanded.has(d.id);
                return (
                  <div key={d.id}>
                    <button type="button" className={cx(`nf-row ${d.id === selectedId ? "nf-row-on" : ""}`)} onClick={() => pick(d.id)}>
                      {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      <span className={cx("nf-rname")}>{d.generic}</span>
                      <span className={cx("nf-rcount")}>{d.brands.length}</span>
                    </button>
                    {open && d.brands.length > 0 && (
                      <div className={cx("nf-rbrands")}>
                        {d.brands.map((b) => (
                          <div key={b.id} className={cx("nf-rbrand")}>{b.name}{b.strength ? ` · ${b.strength}` : ""}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {groups.length === 0 && <p className={cx("nf-none")}>No drugs found</p>}
        </div>

        <div className={cx("nf-listfoot")}>
          <button type="button" className={cx("nf-adddrug")} onClick={openForm}><Plus size={11} /> Add Drug</button>
        </div>
      </div>

      {/* ── right: empty / detail / add form ── */}
      <div className={cx("nf-detail")}>
        {form ? (
          <div className={cx("nf-card nf-form")}>
            <h3 className={cx("nf-ftitle")}>Add New NF Drug</h3>

            <label className={cx("nf-flbl")} htmlFor="nf-generic">Generic Name <em>*</em></label>
            <input id="nf-generic" className={cx("nf-input nf-finput")} placeholder="e.g. Bevacizumab" value={form.generic} onChange={(e) => setF({ generic: e.target.value })} />

            <label className={cx("nf-flbl nf-fmt")} htmlFor="nf-category">Category</label>
            <input id="nf-category" className={cx("nf-input nf-finput")} placeholder="e.g. Oncology" value={form.category} onChange={(e) => setF({ category: e.target.value })} />

            <div className={cx("nf-fsep")} />

            <div className={cx("nf-flbl nf-fmt")}>First Brand (Optional)</div>
            <div className={cx("nf-fgrid")}>
              <input className={cx("nf-input nf-finput")} placeholder="Brand name" value={form.brand} onChange={(e) => setF({ brand: e.target.value })} />
              <input className={cx("nf-input nf-finput")} placeholder="Strength" value={form.strength} onChange={(e) => setF({ strength: e.target.value })} />
            </div>

            <div className={cx("nf-fbtns")}>
              <button type="button" className={cx("nf-fsave")} disabled={!form.generic.trim()} onClick={createDrug}><Plus size={12} /> Add Drug</button>
              <button type="button" className={cx("nf-fcancel")} onClick={() => setForm(null)}>Cancel</button>
            </div>
          </div>
        ) : selected ? (
          <>
            <div className={cx("nf-card nf-head")}>
              <div className={cx("nf-hinfo")}>
                <div className={cx("nf-htop")}>
                  <span className={cx("nf-badge")}>NF</span>
                  <span className={cx("nf-hname")}>{selected.generic}</span>
                </div>
                <div className={cx("nf-hsub")}>{selected.category} · {n} {n === 1 ? "brand" : "brands"}</div>
              </div>
              <button type="button" className={cx("nf-ico nf-ico-del nf-hdel")} onClick={deleteDrug} aria-label="Delete drug"><Trash2 size={12} /></button>
            </div>

            <div className={cx("nf-card nf-brands")}>
              <div className={cx("nf-btitle")}>Brands &amp; Strengths</div>

              {selected.brands.map((b) => (editBrand?.id === b.id ? (
                <div key={b.id} className={cx("nf-brow")}>
                  <input
                    autoFocus
                    className={cx("nf-field nf-field-edit nf-grow")}
                    value={editBrand.name}
                    onChange={(e) => setEditBrand((p) => ({ ...p, name: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") saveBrand(); if (e.key === "Escape") setEditBrand(null); }}
                  />
                  <input
                    className={cx("nf-field nf-field-edit nf-str")}
                    value={editBrand.strength}
                    onChange={(e) => setEditBrand((p) => ({ ...p, strength: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") saveBrand(); if (e.key === "Escape") setEditBrand(null); }}
                  />
                  <div className={cx("nf-icos")}>
                    <button type="button" className={cx("nf-ico nf-ico-save")} onClick={saveBrand} aria-label="Save"><Save size={12} /></button>
                    <button type="button" className={cx("nf-ico")} onClick={() => setEditBrand(null)} aria-label="Cancel"><X size={12} /></button>
                  </div>
                </div>
              ) : (
                <div key={b.id} className={cx("nf-brow")}>
                  <input className={cx("nf-field nf-grow")} value={b.name} readOnly tabIndex={-1} />
                  <input className={cx("nf-field nf-str")} value={b.strength} readOnly tabIndex={-1} />
                  <div className={cx("nf-icos")}>
                    <button type="button" className={cx("nf-ico")} onClick={() => setEditBrand({ ...b })} aria-label="Edit brand"><Pencil size={12} /></button>
                    <button type="button" className={cx("nf-ico nf-ico-del")} onClick={() => removeBrand(b.id)} aria-label="Delete brand"><Trash2 size={12} /></button>
                  </div>
                </div>
              )))}

              <div className={cx("nf-addrow")}>
                <input
                  className={cx("nf-input nf-grow")}
                  placeholder="Brand name"
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addBrand()}
                />
                <input
                  className={cx("nf-input nf-str")}
                  placeholder="Strength"
                  value={draft.strength}
                  onChange={(e) => setDraft((p) => ({ ...p, strength: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addBrand()}
                />
                <button type="button" className={cx("nf-addbtn")} disabled={!draft.name.trim()} onClick={addBrand}><Plus size={12} /> Add</button>
              </div>
            </div>
          </>
        ) : (
          <div className={cx("nf-empty")}>
            <FileMinus size={22} />
            <p>Select a drug to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NfCatalogue;