import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { CircleCheck, GripVertical, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import styles from "./DefaultsListCard.module.css";

const cx = createClassNames(styles);

const DefaultsListCard = ({ title, items, onChange }) => {
  const [adding, setAdding] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dragId, setDragId] = useState(null);
  const noun = title.toLowerCase().slice(0, -1); // "Add route...", "Add frequencie..." (same as screenshot)

  const add = () => {
    const text = adding.trim();
    if (!text) return;
    onChange((p) => [...p, { id: Date.now(), text }]);
    setAdding("");
  };

  const startEdit = (it) => { setEditId(it.id); setEditText(it.text); };
  const saveEdit = () => {
    const text = editText.trim();
    if (text) onChange((p) => p.map((i) => (i.id === editId ? { ...i, text } : i)));
    setEditId(null);
  };

  // live reorder while dragging over another row
  const moveOnto = (targetId) => {
    if (dragId == null || dragId === targetId) return;
    onChange((p) => {
      const from = p.findIndex((i) => i.id === dragId);
      const to = p.findIndex((i) => i.id === targetId);
      const n = [...p];
      const [moved] = n.splice(from, 1);
      n.splice(to, 0, moved);
      return n;
    });
  };

  return (
    <div className={cx("pd-card")}>
      <div className={cx("pd-head")}>
        <Tag size={12} />
        <span className={cx("pd-title")}>{title}</span>
        <span className={cx("pd-count")}>{items.length} items</span>
      </div>

      <div className={cx("pd-list")}>
        {items.map((it) => {
          const editing = editId === it.id;
          return (
            <div
              key={it.id}
              className={cx(`pd-row ${editing ? "pd-row-edit" : ""} ${dragId === it.id ? "pd-row-drag" : ""}`)}
              draggable={!editing}
              onDragStart={() => setDragId(it.id)}
              onDragEnter={() => moveOnto(it.id)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => setDragId(null)}
            >
              <GripVertical size={11} className={cx("pd-grip")} />
              {editing ? (
                <>
                  <input
                    autoFocus
                    className={cx("pd-einput")}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditId(null); }}
                  />
                  <button type="button" className={cx("pd-ok")} onClick={saveEdit} aria-label="Save"><CircleCheck size={13} /></button>
                  <button type="button" className={cx("pd-x")} onClick={() => setEditId(null)} aria-label="Cancel"><X size={11} /></button>
                </>
              ) : (
                <>
                  <span className={cx("pd-text")}>{it.text}</span>
                  <div className={cx("pd-acts")}>
                    <button type="button" onClick={() => startEdit(it)} aria-label="Edit"><Pencil size={11} /></button>
                    <button type="button" className={cx("pd-del")} onClick={() => onChange((p) => p.filter((i) => i.id !== it.id))} aria-label="Delete"><Trash2 size={11} /></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={cx("pd-add")}>
        <input
          className={cx("pd-ainput")}
          placeholder={`Add ${noun}...`}
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className={cx("pd-abtn")} onClick={add} aria-label={`Add ${noun}`}><Plus size={14} /></button>
      </div>
    </div>
  );
};

export default DefaultsListCard;