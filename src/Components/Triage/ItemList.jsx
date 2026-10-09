import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Plus, X } from "lucide-react";

import styles from "./ItemList.module.css";

const cx = createClassNames(styles);

const ItemList = ({ items, placeholder, onChange }) => {
  const [text, setText] = useState("");
  const add = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...items, t]);
    setText("");
  };
  return (
    <>
      {items.map((it, i) => (
        <div key={i} className={cx("tri-item")}>
          <span>{it}</span>
          <button title="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <X size={11} />
          </button>
        </div>
      ))}
      <div className={cx("tri-additem")}>
        <input
          className={cx("tri-inp")}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button disabled={!text.trim()} onClick={add}>
          <Plus size={12} />
        </button>
      </div>
    </>
  );
};

export default ItemList;
