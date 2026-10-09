import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Plus, Search, Star } from "lucide-react";
import { CATEGORIES, GENERICS, NEW_MED_DEFAULTS } from "./BundlesData.js";
import styles from "./MedicinePicker.module.css";

const cx = createClassNames(styles);

let pid = 0;

const MedicinePicker = ({ onPick }) => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const s = q.trim().toLowerCase();

  // category → generic → brands (a generic-name match keeps all its brands)
  const groups = CATEGORIES.map((c) => ({
    name: c.name,
    generics: GENERICS
      .filter((g) => g.active && g.category === c.name)
      .map((g) => ({ ...g, brands: !s || g.name.toLowerCase().includes(s) ? g.brands : g.brands.filter((b) => b.name.toLowerCase().includes(s)) }))
      .filter((g) => g.brands.length),
  })).filter((c) => c.generics.length);

  const pick = (g, b) => {
    onPick({ id: `p${Date.now()}-${++pid}`, brand: b.name, strength: b.strength, generic: g.name, ...NEW_MED_DEFAULTS });
    setQ("");
    setOpen(false);
  };

  return (
    <div className={cx("mp-box")}>
      <div className={cx("mp-lbl")}><Plus size={10} /> Add Medicine</div>
      <div className={cx("mp-sw")}>
        <div className={cx("mp-search")}>
          <Search size={12} />
          <input
            placeholder="Search by brand or generic name..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </div>

        {open && (
          <div className={cx("mp-drop")} onMouseDown={(e) => e.preventDefault()}>
            {groups.map((c) => (
              <div key={c.name}>
                <div className={cx("mp-cat")}>{c.name}</div>
                {c.generics.map((g) => (
                  <div key={g.id}>
                    <div className={cx("mp-gen")}>{g.name}</div>
                    {g.brands.map((b) => (
                      <button type="button" key={b.id} className={cx("mp-brand")} onClick={() => pick(g, b)}>
                        <Star size={11} className={cx(b.fav ? "mp-star-on" : "mp-star")} fill={b.fav ? "currentColor" : "none"} />
                        <span className={cx("mp-bname")}>{b.name}</span>
                        <span className={cx("mp-bstr")}>{b.strength}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {groups.length === 0 && <p className={cx("mp-empty")}>No medicines found</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinePicker;