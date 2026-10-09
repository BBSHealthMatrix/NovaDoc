 import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import { GripVertical, ChevronDown, Save, CircleCheck } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SEED as SPECIALTIES } from "../Specialties/SpecialtiesData.js";
import { STATUSES, BADGE, DEFAULT, GENERAL } from "./NoteStructureData.js";
import styles from "./NoteStructure.module.css";

const cx = createClassNames(styles);

const NoteStructure = () => {
  const [configs, setConfigs] = useState({ general: GENERAL });
  const [target, setTarget] = useState("general");
  const [menu, setMenu] = useState(null);
  const [saved, setSaved] = useState(false);
  const dragFrom = useRef(null);

  const list = configs[target] || DEFAULT;

  // close status menu on outside click
  useEffect(() => {
    if (!menu) return;
    const close = (e) => { if (!e.target.closest("[data-ns-menu]")) setMenu(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  // hide "Configuration saved" after a moment
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  const setList = (next) => {
    setConfigs((p) => ({ ...p, [target]: next }));
    setSaved(false);
  };

  const update = (id, patch) => setList(list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const dragOver = (e, index) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === index) return;
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragFrom.current = index;
    setList(next);
  };

  return (
    <div className={cx("ns-wrap")}>
      <h1 className={cx("ns-title")}>Note Structure</h1>
      <p className={cx("ns-desc")}>Control which SOAP sections appear, their order, and visibility per specialty.</p>

      <div className={cx("ns-config")}>
        <span className={cx("ns-config-label")}>Configure For</span>
        <select className={cx("ns-select")} value={target} onChange={(e) => { setTarget(e.target.value); setMenu(null); setSaved(false); }}>
          <option value="general">General (All)</option>
          {SPECIALTIES.map((s) => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
        </select>
        <span className={cx("ns-hint")}>
          {target === "general" ? "Changes apply to all specialties unless overridden" : "Overrides the general config for this specialty"}
        </span>
      </div>

      <div className={cx("ns-legend")}>
        <span className={cx("ns-legend-drag")}><GripVertical size={9} /> Drag to reorder</span>
        <span className={cx("ns-legend-sep")} />
        {STATUSES.map((s) => <span key={s} className={cx(`ns-badge ${BADGE[s]}`)}>{s}</span>)}
      </div>

      <div className={cx("ns-list")}>
        {list.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={cx("ns-row")}
              draggable
              onDragStart={() => { dragFrom.current = i; setMenu(null); }}
              onDragOver={(e) => dragOver(e, i)}
              onDragEnd={() => { dragFrom.current = null; }}
            >
              <GripVertical size={12} className={cx("ns-grip")} />
              <span className={cx("ns-num")}>{i + 1}</span>
              <span className={cx("ns-ic")}><Icon size={12} /></span>
              <span className={cx("ns-name")}>{s.name}</span>

              <div className={cx("ns-status")} data-ns-menu>
                <button type="button" className={cx(`ns-badge ns-badge-btn ${BADGE[s.status]}`)} onClick={() => setMenu(menu === s.id ? null : s.id)}>
                  {s.status} <ChevronDown size={9} />
                </button>
                {menu === s.id && (
                  <div className={cx("ns-menu")}>
                    {STATUSES.map((st) => (
                      <button type="button" key={st} className={cx(`ns-badge ${BADGE[st]}`)} onClick={() => { update(s.id, { status: st }); setMenu(null); }}>
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Toggle size="large" color="softBlue" on={s.on} onChange={() => update(s.id, { on: !s.on })} label={`Show ${s.name}`} />
            </div>
          );
        })}
      </div>

      <div className={cx("ns-foot")}>
        {saved ? <span className={cx("ns-saved")}><CircleCheck size={12} /> Configuration saved</span> : <span />}
        <button type="button" className={cx("ns-save")} onClick={() => setSaved(true)}>
          <Save size={13} /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default NoteStructure;