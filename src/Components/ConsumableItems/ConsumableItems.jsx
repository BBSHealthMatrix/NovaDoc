import { createClassNames } from "../../utils/classNames.js";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, CircleCheck, Eye, EyeOff, FileText, Package, Pencil, Plus, Search, Trash2, Truck, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { CATEGORIES, CUSTOM, ITEMS, PALETTE, UNITS } from "./ConsumableItemsData.js";
import styles from "./ConsumableItems.module.css";

const cx = createClassNames(styles);

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const ConsumableItems = () => {
  const [items, setItems] = useState(ITEMS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [edit, setEdit] = useState(null); // { id (null = new), name, category, custom, unit }

  const colorOf = (name) => categories.find((c) => c.name === name)?.color || "#90a1b9";
  const patch = (id, fn) => setItems((p) => p.map((x) => (x.id === id ? fn(x) : x)));
  const toggleCollapsed = (name) => setCollapsed((p) => {
    const n = new Set(p);
    if (n.has(name)) n.delete(name); else n.add(name);
    return n;
  });

  /* ── add / edit ── */
  const openAdd = () => setEdit({
    id: null, name: "", custom: "", unit: "piece",
    category: filter !== "All" ? filter : categories[0].name,
  });
  const openEdit = (x) => setEdit({ id: x.id, name: x.name, category: x.category, custom: "", unit: x.unit });
  const setE = (patchObj) => setEdit((p) => ({ ...p, ...patchObj }));

  const saveEdit = () => {
    const name = edit.name.trim();
    const category = edit.category === CUSTOM ? edit.custom.trim() : edit.category;
    if (!name || !category) return;
    if (!categories.some((c) => c.name === category)) {
      setCategories((p) => [...p, { name: category, color: PALETTE[p.length % PALETTE.length] }]);
    }
    if (edit.id) patch(edit.id, (x) => ({ ...x, name, category, unit: edit.unit }));
    else setItems((p) => [{ id: Date.now(), name, category, unit: edit.unit, active: true }, ...p]);
    setEdit(null);
  };
  const keys = (e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEdit(null); };

  /* ── export ── */
  const exportCsv = () => {
    const rows = [["Category", "Item", "Unit", "Active"], ...items.map((x) => [x.category, x.name, x.unit, x.active ? "Yes" : "No"])];
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "consumables-catalogue.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── filtering ── */
  const chips = useMemo(() => [...categories].sort((a, b) => a.name.localeCompare(b.name)), [categories]);
  const q = search.trim().toLowerCase();
  const visible = items.filter((x) => {
    if (!showInactive && !x.active) return false;
    if (filter !== "All" && x.category !== filter) return false;
    if (!q) return true;
    return x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q) || x.unit.toLowerCase().includes(q);
  });
  const groups = categories
    .map((c) => ({ ...c, items: visible.filter((x) => x.category === c.name) }))
    .filter((c) => c.items.length);

  /* edit / add row (same layout for both) */
  const editorRow = (color, isAdd) => (
    <div className={cx(`ci-row ci-edit ${isAdd ? "ci-add" : ""}`)}>
      <Package size={13} className={cx("ci-ico")} style={{ color }} />
      <input autoFocus className={cx("ci-ein")} placeholder="Item name..." value={edit.name} onChange={(e) => setE({ name: e.target.value })} onKeyDown={keys} />
      {edit.category === CUSTOM ? (
        <input className={cx("ci-esel ci-ecat")} placeholder="Category name..." value={edit.custom} onChange={(e) => setE({ custom: e.target.value })} onKeyDown={keys} />
      ) : (
        <select className={cx("ci-esel ci-ecat")} value={edit.category} onChange={(e) => setE({ category: e.target.value })}>
          {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          <option value={CUSTOM}>+ Custom...</option>
        </select>
      )}
      <select className={cx("ci-esel ci-eunit")} value={edit.unit} onChange={(e) => setE({ unit: e.target.value })}>
        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
      <button type="button" className={cx("ci-ok")} onClick={saveEdit} aria-label="Save"><CircleCheck size={14} /></button>
      <button type="button" className={cx("ci-x")} onClick={() => setEdit(null)} aria-label="Cancel"><X size={13} /></button>
    </div>
  );

  return (
    <div className={cx("ci-wrap")}>
      {/* ── header + tabs ── */}
      <div className={cx("ci-header")}>
        <div className={cx("ci-top")}>
          <div className={cx("ci-hico")}><Package size={14} /></div>
          <div>
            <h1 className={cx("ci-title")}>Consumables</h1>
            <p className={cx("ci-desc")}>Manage consumable items, categories, and supplier pricing</p>
          </div>
        </div>

        <nav className={cx("ci-tabs")}>
          <Link to="/admin/consumable-items" className={cx("ci-tab ci-tab-on")}><Package size={12} /> Consumable Items</Link>
          <Link to="/admin/consumable-providers" className={cx("ci-tab")}><Truck size={12} /> Consumable Providers</Link>
        </nav>
      </div>

      {/* ── toolbar ── */}
      <div className={cx("ci-toolbar")}>
        <div className={cx("ci-trow")}>
          <div className={cx("ci-search")}>
            <Search size={13} />
            <input placeholder="Search item name, category, unit..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={cx("ci-chips")}>
            <button type="button" className={cx(`ci-chip ${filter === "All" ? "ci-chip-on" : ""}`)} style={filter === "All" ? { background: "#4982cf", borderColor: "#4982cf" } : undefined} onClick={() => setFilter("All")}>All</button>
            {chips.map((c) => (
              <button
                type="button"
                key={c.name}
                className={cx(`ci-chip ${filter === c.name ? "ci-chip-on" : ""}`)}
                style={filter === c.name ? { background: c.color, borderColor: c.color } : undefined}
                onClick={() => setFilter(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className={cx("ci-tactions")}>
          <button type="button" className={cx(`ci-inactive ${showInactive ? "ci-inactive-on" : ""}`)} onClick={() => setShowInactive((v) => !v)}>
            {showInactive ? <Eye size={11} /> : <EyeOff size={11} />}
            {showInactive ? "Hide Inactive" : "Include Inactive"}
          </button>
          <button type="button" className={cx("ci-export")} onClick={exportCsv}><FileText size={13} /> Export CSV</button>
          <button type="button" className={cx("ci-addbtn")} onClick={openAdd}><Plus size={14} /> Add Item</button>
        </div>
      </div>

      {/* ── list ── */}
      <div className={cx("ci-list")}>
        {edit && !edit.id && editorRow("#4982cf", true)}

        {groups.map((c) => {
          const isCollapsed = collapsed.has(c.name);
          return (
            <div key={c.name}>
              <div className={cx("ci-cathead")}>
                <i className={cx("ci-dot")} style={{ background: c.color }} />
                <span className={cx("ci-catname")}>{c.name}</span>
                <span className={cx("ci-catcount")}>{c.items.length} items</span>
                <button type="button" className={cx("ci-catchev")} onClick={() => toggleCollapsed(c.name)} aria-label={isCollapsed ? "Expand" : "Collapse"}>
                  <ChevronDown size={13} className={cx(isCollapsed ? "ci-closed" : "")} />
                </button>
              </div>

              {!isCollapsed && (
                <div className={cx("ci-catbody")} style={{ borderColor: `${c.color}55` }}>
                  {c.items.map((x) => (edit?.id === x.id ? (
                    <div key={x.id}>{editorRow(colorOf(x.category), false)}</div>
                  ) : (
                    <div key={x.id} className={cx(`ci-row ${x.active ? "" : "ci-row-off"}`)}>
                      <Package size={13} className={cx("ci-ico")} style={{ color: c.color }} />
                      <span className={cx("ci-name")}>{x.name}</span>
                      <span className={cx("ci-unit")}>{x.unit}</span>
                      {!x.active && <span className={cx("ci-dis")}>Disabled</span>}
                      <Toggle
                        on={x.active}
                        onChange={() => patch(x.id, (y) => ({ ...y, active: !y.active }))}
                        size="large"
                        color="softBlue"
                        className={cx("ci-tg")}
                        label={`Toggle ${x.name}`}
                      />
                      <div className={cx("ci-acts")}>
                        <button type="button" onClick={() => openEdit(x)} aria-label="Edit item"><Pencil size={12} /></button>
                        <button type="button" className={cx("ci-del")} onClick={() => setItems((p) => p.filter((y) => y.id !== x.id))} aria-label="Delete item"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  )))}
                </div>
              )}
            </div>
          );
        })}

        {groups.length === 0 && <p className={cx("ci-empty")}>No items match your filter.</p>}
      </div>
    </div>
  );
};

export default ConsumableItems;