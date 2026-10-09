import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import { Plus, GripVertical, ChevronRight, ChevronDown, Trash2, X, Save, CircleCheck } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SEED, blankSystem, blankSymptom } from "./RosConfigData.js";
import styles from "./RosConfig.module.css";

const cx = createClassNames(styles);

const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const RosConfig = () => {
  const [systems, setSystems] = useState(SEED);
  const [open, setOpen] = useState({});
  const [armed, setArmed] = useState(null); // system id whose grip is pressed
  const [saved, setSaved] = useState(false);
  const dragFrom = useRef(null);
  const symDrag = useRef(null); // { sysId, index }

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  const change = (fn) => {
    setSystems(fn);
    setSaved(false);
  };

  const update = (id, patch) => change((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const setSymptoms = (s, symptoms) => update(s.id, { symptoms });

  const addSystem = () => {
    const s = blankSystem();
    change((p) => [...p, s]);
    setOpen((o) => ({ ...o, [s.id]: true }));
  };

  const sysOver = (e, i) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === i) return;
    change((p) => move(p, from, i));
    dragFrom.current = i;
  };

  const symOver = (e, s, i) => {
    e.preventDefault();
    e.stopPropagation();
    const d = symDrag.current;
    if (!d || d.sysId !== s.id || d.index === i) return;
    setSymptoms(s, move(s.symptoms, d.index, i));
    symDrag.current = { sysId: s.id, index: i };
  };

  return (
    <div className={cx("ros-wrap")}>
      <h1 className={cx("ros-title")}>ROS System Configuration</h1>
      <p className={cx("ros-desc")}>Manage the Review of Systems categories shown in the note.</p>

      <div className={cx("ros-bar")}>
        <p>Configure which systems appear in the ROS drawer and manage their symptom checklists. Inactive systems are hidden from doctors.</p>
        <button type="button" className={cx("ros-btn")} onClick={addSystem}><Plus size={13} /> Add System</button>
      </div>

      <div className={cx("ros-list")}>
        {systems.map((s, i) => {
          const isOpen = Boolean(open[s.id]);
          return (
            <div
              key={s.id}
              className={cx("ros-sys")}
              draggable={armed === s.id}
              onDragStart={() => { dragFrom.current = i; }}
              onDragOver={(e) => sysOver(e, i)}
              onDragEnd={() => { dragFrom.current = null; setArmed(null); }}
            >
              <div className={cx("ros-head")}>
                <span className={cx("ros-grip")} onMouseDown={() => setArmed(s.id)} onMouseUp={() => setArmed(null)}>
                  <GripVertical size={10} />
                </span>
                <input className={cx("ros-name")} value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} />
                <span className={cx("ros-code")}>{s.code}</span>
                <span className={cx("ros-count")}>{s.symptoms.length} symptoms</span>
                <Toggle size="large" color="softBlue" on={s.active} onChange={() => update(s.id, { active: !s.active })} label={`${s.name} active`} />
                <button type="button" className={cx("ros-ic")} onClick={() => setOpen((o) => ({ ...o, [s.id]: !isOpen }))} aria-label={isOpen ? "Collapse" : "Expand"}>
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                <button type="button" className={cx("ros-ic ros-del")} onClick={() => change((p) => p.filter((x) => x.id !== s.id))} aria-label={`Delete ${s.name}`}>
                  <Trash2 size={12} />
                </button>
              </div>

              {isOpen && (
                <div className={cx("ros-body")}>
                  {s.symptoms.map((y, k) => (
                    <div
                      key={y.id}
                      className={cx("ros-sym")}
                      draggable
                      onDragStart={(e) => { e.stopPropagation(); symDrag.current = { sysId: s.id, index: k }; }}
                      onDragOver={(e) => symOver(e, s, k)}
                      onDragEnd={(e) => { e.stopPropagation(); symDrag.current = null; }}
                    >
                      <GripVertical size={9} className={cx("ros-sym-grip")} />
                      <input
                        autoFocus={!y.text}
                        placeholder="Symptom name..."
                        value={y.text}
                        onChange={(e) => setSymptoms(s, s.symptoms.map((x) => (x.id === y.id ? { ...x, text: e.target.value } : x)))}
                      />
                      <button type="button" onClick={() => setSymptoms(s, s.symptoms.filter((x) => x.id !== y.id))} aria-label={`Remove ${y.text}`}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className={cx("ros-add-sym")} onClick={() => setSymptoms(s, [...s.symptoms, blankSymptom()])}>
                    <Plus size={11} /> Add symptom
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={cx("ros-foot")}>
        {saved ? <span className={cx("ros-saved")}><CircleCheck size={12} /> Configuration saved</span> : <span />}
        <button type="button" className={cx("ros-btn ros-save")} onClick={() => setSaved(true)}><Save size={13} /> Save Configuration</button>
      </div>
    </div>
  );
};

export default RosConfig;