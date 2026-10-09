import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Eye, EyeOff, FileText, List, Pill, Plus, Search, Tag, Zap } from "lucide-react";
import GenericCard from "./GenericCard";
import GenericEditor from "./GenericEditor";
import { CATEGORIES, GENERICS, PALETTE, NEW_CATEGORY } from "./MedicineCatalogueData.js";
import styles from "./MedicineCatalogue.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/medicine-catalogue", label: "Medicine Catalogue", icon: Pill },
  { to: "/admin/prescription-defaults", label: "Prescription Defaults", icon: Tag },
  { to: "/admin/bundles", label: "Bundles", icon: BookOpen },
  { to: "/admin/drug-interactions", label: "Interactions", icon: Zap },
  { to: "/admin/pedi-dosing-guidelines", label: "Pedi Dosing", icon: List },
  { to: "/admin/non-formulary", label: "Non-Formulary", icon: FileText },
];

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const MedicineCatalogue = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname) ?? TABS[0];
  const [generics, setGenerics] = useState(GENERICS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [editor, setEditor] = useState(null); // { id, name, category, newCat, allergy }

  const toggleIn = (setter) => (key) => setter((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleCollapsed = toggleIn(setCollapsed);
  const toggleExpanded = toggleIn(setExpanded);

  const patchGeneric = (id, fn) => setGenerics((p) => p.map((g) => (g.id === id ? fn(g) : g)));
  const colorOf = (cat) => categories.find((c) => c.name === cat)?.color || "#90a1b9";

  /* ── brand handlers (used inside each card) ── */
  const brandOps = (gid) => ({
    add: (name, strength) => patchGeneric(gid, (g) => ({ ...g, brands: [...g.brands, { id: Date.now(), name, strength, fav: false }] })),
    edit: (bid, patch) => patchGeneric(gid, (g) => ({ ...g, brands: g.brands.map((b) => (b.id === bid ? { ...b, ...patch } : b)) })),
    remove: (bid) => patchGeneric(gid, (g) => ({ ...g, brands: g.brands.filter((b) => b.id !== bid) })),
    fav: (bid) => patchGeneric(gid, (g) => ({ ...g, brands: g.brands.map((b) => (b.id === bid ? { ...b, fav: !b.fav } : b)) })),
  });

  /* ── editor drawer ── */
  const openAdd = () => setEditor({ id: null, name: "", category: filter !== "All" ? filter : categories[0].name, newCat: "", allergy: [] });
  const openEdit = (g) => setEditor({ id: g.id, name: g.name, category: g.category, newCat: "", allergy: [...g.allergy] });

  const saveEditor = () => {
    const name = editor.name.trim();
    const isNew = editor.category === NEW_CATEGORY;
    const category = isNew ? editor.newCat.trim() : editor.category;
    if (!name || !category) return;
    if (isNew && !categories.some((c) => c.name === category)) {
      setCategories((p) => [...p, { name: category, color: PALETTE[p.length % PALETTE.length] }]);
    }
    if (editor.id) patchGeneric(editor.id, (g) => ({ ...g, name, category, allergy: editor.allergy }));
    else setGenerics((p) => [...p, { id: Date.now(), name, category, active: true, allergy: editor.allergy, brands: [] }]);
    setEditor(null);
  };

  const exportCsv = () => {
    const rows = [["Category", "Generic", "Brand", "Strength / Form", "Favourite", "Active", "Allergy Keywords"]];
    generics.forEach((g) => {
      const base = [g.category, g.name];
      const tail = [g.active ? "Yes" : "No", g.allergy.join("; ")];
      if (g.brands.length === 0) rows.push([...base, "", "", "", ...tail]);
      g.brands.forEach((b) => rows.push([...base, b.name, b.strength, b.fav ? "Yes" : "No", ...tail]));
    });
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medicine-catalogue.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── filtering ── */
  const chips = useMemo(() => categories.map((c) => c.name).sort((a, b) => a.localeCompare(b)), [categories]);
  const q = search.trim().toLowerCase();
  const visible = generics.filter((g) => {
    if (!includeInactive && !g.active) return false;
    if (filter !== "All" && g.category !== filter) return false;
    if (!q) return true;
    return g.name.toLowerCase().includes(q)
      || g.category.toLowerCase().includes(q)
      || g.brands.some((b) => b.name.toLowerCase().includes(q));
  });
  const groups = categories
    .map((c) => ({ ...c, items: visible.filter((g) => g.category === c.name) }))
    .filter((c) => c.items.length);

  return (
    <div className={cx("mc-wrap")}>
      <div className={cx("mc-header")}>
        <h1 className={cx("mc-title")}><Pill size={17} /> Formulary Management</h1>
        <p className={cx("mc-desc")}>Manage the medicine catalogue, prescription defaults, and reusable bundles</p>
      </div>

      <nav className={cx("mc-tabs")}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className={cx(`mc-tab ${active.to === t.to ? "mc-tab-on" : ""}`)}>
              <Icon size={12} /> {t.label}
            </Link>
          );
        })}
      </nav>

      <div className={cx("mc-body")}>
        <div className={cx("mc-main")}>
          <div className={cx(`mc-toolbar ${editor ? "mc-toolbar-narrow" : ""}`)}>
            <div className={cx("mc-trow")}>
              <div className={cx("mc-search")}>
                <Search size={13} />
                <input placeholder="Search generic, brand, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className={cx("mc-chips")}>
                {["All", ...chips].map((c) => (
                  <button type="button" key={c} className={cx(`mc-chip ${filter === c ? "mc-chip-on" : ""}`)} onClick={() => setFilter(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className={cx("mc-tactions")}>
              <button type="button" className={cx(`mc-inactive ${includeInactive ? "mc-inactive-on" : ""}`)} onClick={() => setIncludeInactive((v) => !v)}>
                {includeInactive ? <Eye size={12} /> : <EyeOff size={12} />}
                {includeInactive ? "Hide Inactive" : "Include Inactive"}
              </button>
              <button type="button" className={cx("mc-export")} onClick={exportCsv}><FileText size={13} /> Export CSV</button>
              <button type="button" className={cx("mc-add")} onClick={openAdd}><Plus size={14} /> Add Generic</button>
            </div>
          </div>

          <div className={cx("mc-list")}>
            {groups.map((c) => {
              const isCollapsed = collapsed.has(c.name);
              return (
                <div className={cx("mc-cat")} key={c.name}>
                  <div className={cx("mc-cathead")}>
                    <i className={cx("mc-dot")} style={{ background: c.color }} />
                    <span className={cx("mc-catname")}>{c.name}</span>
                    <span className={cx("mc-catcount")}>{c.items.length} generics</span>
                    <button type="button" className={cx("mc-catchev")} onClick={() => toggleCollapsed(c.name)} aria-label={isCollapsed ? "Expand" : "Collapse"}>
                      <ChevronDown size={13} className={cx(isCollapsed ? "mc-catchev-closed" : "")} />
                    </button>
                  </div>
                  {!isCollapsed && (
                    <div className={cx("mc-catbody")} style={{ borderColor: `${c.color}55` }}>
                      {c.items.map((g) => (
                        <GenericCard
                          key={g.id}
                          generic={g}
                          open={expanded.has(g.id)}
                          onToggleOpen={() => toggleExpanded(g.id)}
                          onToggleActive={() => patchGeneric(g.id, (x) => ({ ...x, active: !x.active }))}
                          onEdit={() => openEdit(g)}
                          onDelete={() => setGenerics((p) => p.filter((x) => x.id !== g.id))}
                          brand={brandOps(g.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {groups.length === 0 && <p className={cx("mc-empty")}>No medicines match your filters.</p>}
          </div>
        </div>

        {editor && (
          <GenericEditor
            editor={editor}
            setEditor={setEditor}
            categories={categories}
            colorOf={colorOf}
            onClose={() => setEditor(null)}
            onSave={saveEditor}
          />
        )}
      </div>
    </div>
  );
};

export default MedicineCatalogue;