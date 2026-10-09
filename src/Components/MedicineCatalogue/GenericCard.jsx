import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Check, ChevronRight, Pencil, Pill, Plus, Star, Trash2, TriangleAlert, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import styles from "./GenericCard.module.css";

const cx = createClassNames(styles);

const GenericCard = ({ generic: g, open, onToggleOpen, onToggleActive, onEdit, onDelete, brand }) => {
  const [draft, setDraft] = useState({ name: "", strength: "" });
  const [editing, setEditing] = useState(null); // { id, name, strength }

  const favCount = g.brands.filter((b) => b.fav).length;

  const addBrand = () => {
    const name = draft.name.trim();
    if (!name) return;
    brand.add(name, draft.strength.trim());
    setDraft({ name: "", strength: "" });
  };

  const saveBrand = () => {
    const name = editing.name.trim();
    if (!name) return;
    brand.edit(editing.id, { name, strength: editing.strength.trim() });
    setEditing(null);
  };

  return (
    <div className={cx(`gc-gcard ${g.active ? "" : "gc-gcard-off"}`)}>
      <div className={cx("gc-ghead")}>
        <button type="button" className={cx("gc-gchev")} onClick={onToggleOpen} aria-label={open ? "Collapse" : "Expand"}>
          <ChevronRight size={14} className={cx(open ? "gc-rot" : "")} />
        </button>
        <span className={cx("gc-gname")}>{g.name}</span>
        <span className={cx("gc-gcount")}>
          {g.brands.length} brands
          {favCount > 0 && <em> · {favCount} ★</em>}
        </span>
        <Toggle size="large" color="softBlue" className={cx("gc-tg")} on={g.active} onChange={onToggleActive} label={`${g.name} active`} />
        <button type="button" className={cx("gc-gico")} onClick={onEdit} aria-label={`Edit ${g.name}`}><Pencil size={14} /></button>
        <button type="button" className={cx("gc-gico gc-gdel")} onClick={onDelete} aria-label={`Delete ${g.name}`}><Trash2 size={14} /></button>
      </div>

      {open && (
        <div className={cx("gc-gbody")}>
          {g.allergy.length > 0 && (
            <div className={cx("gc-allergy")}>
              <TriangleAlert size={10} />
              <span>Allergy keywords:</span>
              {g.allergy.map((k) => <span key={k} className={cx("gc-akw")}>{k}</span>)}
            </div>
          )}

          <div className={cx("gc-bgrid gc-bhead")}>
            <span>Brand Name</span>
            <span>Strength / Form</span>
            <span>Fav</span>
            <span />
          </div>

          {g.brands.map((b) => (
            editing?.id === b.id ? (
              <div className={cx("gc-bgrid gc-brow gc-brow-edit")} key={b.id}>
                <input
                  autoFocus
                  className={cx("gc-binput")}
                  value={editing.name}
                  onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") saveBrand(); if (e.key === "Escape") setEditing(null); }}
                />
                <input
                  className={cx("gc-binput")}
                  value={editing.strength}
                  onChange={(e) => setEditing((p) => ({ ...p, strength: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") saveBrand(); if (e.key === "Escape") setEditing(null); }}
                />
                <span />
                <span className={cx("gc-bacts gc-bacts-show")}>
                  <button type="button" className={cx("gc-bok")} onClick={saveBrand} aria-label="Save brand"><Check size={12} /></button>
                  <button type="button" className={cx("gc-bx")} onClick={() => setEditing(null)} aria-label="Cancel"><X size={12} /></button>
                </span>
              </div>
            ) : (
              <div className={cx("gc-bgrid gc-brow")} key={b.id}>
                <span className={cx("gc-bname")}><Pill size={10} /> {b.name}</span>
                <span className={cx("gc-bstr")}>{b.strength}</span>
                <button type="button" className={cx(`gc-star ${b.fav ? "gc-star-on" : ""}`)} onClick={() => brand.fav(b.id)} aria-label={`Favourite ${b.name}`}>
                  <Star size={13} fill="currentColor" />
                </button>
                <span className={cx("gc-bacts")}>
                  <button type="button" onClick={() => setEditing({ id: b.id, name: b.name, strength: b.strength })} aria-label={`Edit ${b.name}`}><Pencil size={11} /></button>
                  <button type="button" className={cx("gc-bdel")} onClick={() => brand.remove(b.id)} aria-label={`Delete ${b.name}`}><Trash2 size={11} /></button>
                </span>
              </div>
            )
          ))}

          <div className={cx("gc-bgrid gc-badd")}>
            <input className={cx("gc-binput gc-binput-name")} placeholder="Brand name" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addBrand()} />
            <span className={cx("gc-baddstr")}>
              <input className={cx("gc-binput gc-binput-str")} placeholder="e.g. 500mg" value={draft.strength} onChange={(e) => setDraft((p) => ({ ...p, strength: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addBrand()} />
              <button type="button" className={cx("gc-baddbtn")} onClick={addBrand}>Add</button>
            </span>
            <span />
            <span className={cx("gc-baddplus")}><Plus size={12} /></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCard;