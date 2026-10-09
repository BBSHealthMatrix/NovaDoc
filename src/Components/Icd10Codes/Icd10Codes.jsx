import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Search, Plus, Star, Trash2, Pencil } from "lucide-react";
import { BUNDLES, CODES } from "./Icd10CodesData.js";
import styles from "./Icd10Codes.module.css";

const cx = createClassNames(styles);

const Icd10Codes = () => {
  const [codes, setCodes] = useState(CODES);
  const [bundles, setBundles] = useState(BUNDLES);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All Bundles");
  const [showBundles, setShowBundles] = useState(false);
  const [draft, setDraft] = useState({ code: "", desc: "", bundle: BUNDLES[0] });
  const [newBundle, setNewBundle] = useState("");
  const [rename, setRename] = useState(null); // { from, value }

  const update = (id, patch) => setCodes((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  // favourites first, otherwise keep list order
  const term = q.trim().toLowerCase();
  const list = codes
    .filter((c) => (filter === "All Bundles" || c.bundle === filter)
      && (c.code.toLowerCase().includes(term) || c.desc.toLowerCase().includes(term)))
    .sort((a, b) => Number(b.fav) - Number(a.fav));

  const addCode = () => {
    const code = draft.code.trim().toUpperCase();
    const desc = draft.desc.trim();
    if (!code || !desc) return;
    setCodes((p) => [...p, { id: Date.now(), code, desc, bundle: draft.bundle || bundles[0], fav: false }]);
    setDraft((d) => ({ ...d, code: "", desc: "" }));
  };

  const addBundle = () => {
    const name = newBundle.trim();
    if (name && !bundles.includes(name)) setBundles((p) => [...p, name]);
    setNewBundle("");
  };

  const saveRename = () => {
    const name = rename.value.trim();
    if (name && name !== rename.from && !bundles.includes(name)) {
      setBundles((p) => p.map((b) => (b === rename.from ? name : b)));
      setCodes((p) => p.map((c) => (c.bundle === rename.from ? { ...c, bundle: name } : c)));
      if (filter === rename.from) setFilter(name);
      if (draft.bundle === rename.from) setDraft((d) => ({ ...d, bundle: name }));
    }
    setRename(null);
  };

  const delBundle = (name) => {
    const rest = bundles.filter((b) => b !== name);
    setBundles(rest);
    setCodes((p) => p.map((c) => (c.bundle === name ? { ...c, bundle: rest[0] || "" } : c)));
    if (filter === name) setFilter("All Bundles");
    if (draft.bundle === name) setDraft((d) => ({ ...d, bundle: rest[0] || "" }));
  };

  return (
    <div className={cx("icd-wrap")}>
      <h1 className={cx("icd-title")}>ICD-10 Catalogue</h1>
      <p className={cx("icd-desc")}>Manage ICD-10 codes, group them into specialty bundles, and star favourites.</p>

      <div className={cx("icd-bar")}>
        <div className={cx("icd-search")}>
          <Search size={12} />
          <input placeholder="Search ICD-10..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className={cx("icd-filter")} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All Bundles</option>
          {bundles.map((b) => <option key={b}>{b}</option>)}
        </select>
        <button type="button" className={cx("icd-manage")} onClick={() => setShowBundles((s) => !s)}>Manage Bundles</button>
      </div>

      {showBundles && (
        <div className={cx("icd-bundles")}>
          <p className={cx("icd-label")}>Bundles</p>
          <div className={cx("icd-blist")}>
            {bundles.map((b) => (
              <div className={cx("icd-brow")} key={b}>
                {rename?.from === b ? (
                  <input
                    className={cx("icd-brename")}
                    autoFocus
                    value={rename.value}
                    onChange={(e) => setRename({ ...rename, value: e.target.value })}
                    onBlur={saveRename}
                    onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRename(null); }}
                  />
                ) : (
                  <span className={cx("icd-bname")}>{b}</span>
                )}
                <span className={cx("icd-bcount")}>{codes.filter((c) => c.bundle === b).length} codes</span>
                <button type="button" className={cx("icd-bic")} onClick={() => setRename({ from: b, value: b })} aria-label={`Rename ${b}`}><Pencil size={11} /></button>
                <button type="button" className={cx("icd-bic icd-bdel")} onClick={() => delBundle(b)} aria-label={`Delete ${b}`}><Trash2 size={11} /></button>
              </div>
            ))}
          </div>
          <div className={cx("icd-badd")}>
            <input
              className={cx("icd-in")}
              placeholder="New bundle name..."
              value={newBundle}
              onChange={(e) => setNewBundle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addBundle(); }}
            />
            <button type="button" className={cx("icd-btn")} onClick={addBundle}>Add</button>
          </div>
        </div>
      )}

      <div className={cx("icd-card")}>
        <div className={cx("icd-row icd-head")}>
          <span />
          <span>Code</span>
          <span>Description</span>
          <span>Bundle</span>
          <span />
        </div>

        <div className={cx("icd-row icd-new")}>
          <Plus size={12} className={cx("icd-plus")} />
          <input
            className={cx("icd-in icd-code-in")}
            placeholder="A00.0"
            value={draft.code}
            onChange={(e) => setDraft({ ...draft, code: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") addCode(); }}
          />
          <input
            className={cx("icd-in icd-desc-in")}
            placeholder="Description..."
            value={draft.desc}
            onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") addCode(); }}
          />
          <select className={cx("icd-new-sel")} value={draft.bundle} onChange={(e) => setDraft({ ...draft, bundle: e.target.value })}>
            {bundles.map((b) => <option key={b}>{b}</option>)}
          </select>
          <button type="button" className={cx("icd-add")} onClick={addCode}>Add</button>
        </div>

        {list.map((c) => (
          <div className={cx("icd-row icd-item")} key={c.id}>
            <button
              type="button"
              className={cx(`icd-star ${c.fav ? "icd-star-on" : ""}`)}
              onClick={() => update(c.id, { fav: !c.fav })}
              aria-label={c.fav ? `Unstar ${c.code}` : `Star ${c.code}`}
            >
              <Star size={12} />
            </button>
            <span className={cx("icd-code")}>{c.code}</span>
            <span className={cx("icd-text")}>{c.desc}</span>
            <span>
              <select className={cx("icd-sel")} value={c.bundle} onChange={(e) => update(c.id, { bundle: e.target.value })}>
                {bundles.map((b) => <option key={b}>{b}</option>)}
              </select>
            </span>
            <button type="button" className={cx("icd-del")} onClick={() => setCodes((p) => p.filter((x) => x.id !== c.id))} aria-label={`Delete ${c.code}`}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {list.length === 0 && <p className={cx("icd-empty")}>No codes found.</p>}
      </div>
    </div>
  );
};

export default Icd10Codes;