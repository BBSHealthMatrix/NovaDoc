import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { TABS, TYPES, ALLERGENS, LISTS } from "./AllergiesData.js";
import styles from "./Allergies.module.css";

const cx = createClassNames(styles);

const Allergies = () => {
  const [tab, setTab] = useState("allergens");
  const [allergens, setAllergens] = useState(ALLERGENS);
  const [lists, setLists] = useState(LISTS);
  const [text, setText] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [edit, setEdit] = useState(null); // { i, value } for reactions / onsets

  const current = TABS.find((t) => t.key === tab);
  const list = lists[tab] || [];

  const switchTab = (key) => {
    setTab(key);
    setText("");
    setEdit(null);
  };

  const add = () => {
    const v = text.trim();
    if (!v) return;
    if (tab === "allergens") {
      setAllergens((p) => [...p, { id: Date.now(), name: v, type }]);
    } else {
      if (list.includes(v)) return;
      setLists((p) => ({ ...p, [tab]: [...p[tab], v] }));
    }
    setText("");
  };

  const removeItem = (i) => setLists((p) => ({ ...p, [tab]: p[tab].filter((_, k) => k !== i) }));

  const saveEdit = () => {
    const v = edit.value.trim();
    if (v) setLists((p) => ({ ...p, [tab]: p[tab].map((x, k) => (k === edit.i ? v : x)) }));
    setEdit(null);
  };

  return (
    <div className={cx("alg-wrap")}>
      <h1 className={cx("alg-title")}>Allergy Management</h1>
      <p className={cx("alg-desc")}>Manage allergen names, reaction types, and onset option lists.</p>

      <div className={cx("alg-tabs")}>
        {TABS.map((t) => (
          <button type="button" key={t.key} className={cx(`alg-tab ${tab === t.key ? "alg-tab-on" : ""}`)} onClick={() => switchTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={cx("alg-add")}>
        <input
          className={cx("alg-input")}
          placeholder={current.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
        />
        {tab === "allergens" && (
          <select className={cx("alg-select")} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
        <button type="button" className={cx("alg-btn")} onClick={add}>Add</button>
      </div>

      {tab === "allergens" ? (
        <div className={cx("alg-table")}>
          <div className={cx("alg-head")}>
            <span>Name</span>
            <span>Type</span>
            <span />
          </div>
          {allergens.map((a) => (
            <div className={cx("alg-row")} key={a.id}>
              <span className={cx("alg-name")}>{a.name}</span>
              <span><span className={cx("alg-tag")}>{a.type}</span></span>
              <span className={cx("alg-acts")}>
                <button type="button" className={cx("alg-del")} onClick={() => setAllergens((p) => p.filter((x) => x.id !== a.id))} aria-label={`Delete ${a.name}`}>
                  <Trash2 size={10} />
                </button>
              </span>
            </div>
          ))}
          {allergens.length === 0 && <p className={cx("alg-empty")}>No allergens added.</p>}
        </div>
      ) : (
        <div className={cx("alg-list")}>
          {list.map((item, i) => (
            <div className={cx("alg-item")} key={item}>
              {edit?.i === i ? (
                <input
                  className={cx("alg-edit")}
                  autoFocus
                  value={edit.value}
                  onChange={(e) => setEdit({ i, value: e.target.value })}
                  onBlur={saveEdit}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEdit(null); }}
                />
              ) : (
                <span>{item}</span>
              )}
              <span className={cx("alg-acts")}>
                <button type="button" onClick={() => setEdit({ i, value: item })} aria-label={`Edit ${item}`}><Pencil size={10} /></button>
                <button type="button" onClick={() => removeItem(i)} aria-label={`Delete ${item}`}><Trash2 size={10} /></button>
              </span>
            </div>
          ))}
          {list.length === 0 && <p className={cx("alg-empty")}>Nothing added yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Allergies;