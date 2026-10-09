import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import {
  Stethoscope, Pencil, ChevronDown, ChevronUp, Trash2, Activity, Plus, Check, X, Info,
  ShieldCheck, BadgeDollarSign, Pill,
} from "lucide-react";
import Toggle from "../Toggle/Toggle";
import ProcCustomComponent from "./ProcCustomComponent";
import { SYSTEM_LIBRARY, newId, newCustom } from "./ProcedureTemplatesData.js";
import styles from "./ProcTemplateCard.module.css";

const cx = createClassNames(styles);

const SYS_ICONS = { vitals: Activity, medications: Pill, consent: ShieldCheck, billing: BadgeDollarSign };

const ProcTemplateCard = ({ tpl, open, isFirst, isLast, onMoveUp, onMoveDown, onToggleOpen, update, onRename, onDelete, onAddField, onEditField }) => {
  const [cfg, setCfg] = useState({});
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState([]);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const pickRef = useRef(null);

  // close the system-component picker when clicking anywhere outside it
  useEffect(() => {
    if (!picking) return;
    const dismiss = (e) => {
      if (!pickRef.current?.contains(e.target)) {
        setPicking(false);
        setPicked([]);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [picking]);

  const n = tpl.comps.length;
  const sysCount = tpl.comps.filter((c) => c.kind === "system").length;
  const available = SYSTEM_LIBRARY.filter(
    (s) => !tpl.comps.some((c) => c.kind === "system" && c.key === s.key)
  );

  const setComps = (fn, toast = true) => update((t) => ({ ...t, comps: fn(t.comps) }), toast);

  const move = (i, dir) =>
    setComps((cs) => {
      const j = i + dir;
      if (j < 0 || j >= cs.length) return cs;
      const next = [...cs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const patchComp = (id, fn, toast = true) =>
    setComps((cs) => cs.map((c) => (c.id === id ? fn(c) : c)), toast);

  const renameComp = (c) => {
    const name = window.prompt("Component name", c.name);
    if (name && name.trim()) patchComp(c.id, (x) => ({ ...x, name: name.trim() }));
  };

  const togglePick = (key) =>
    setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const closePicker = () => {
    setPicking(false);
    setPicked([]);
  };

  const addSystem = () => {
    if (!picked.length) return;
    setComps((cs) => [...cs, ...picked.map((key) => ({ id: newId("c"), kind: "system", key }))]);
    closePicker();
  };

  const closeCustom = () => {
    setAddingCustom(false);
    setCustomName("");
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    const comp = newCustom(name);
    setComps((cs) => [...cs, comp]);
    setCfg((o) => ({ ...o, [comp.id]: true }));
    closeCustom();
  };

  return (
    <div className={cx("ptb-trow")}>
    <div className={cx("ptb-tmove")}>
      <button disabled={isFirst} title="Move up" onClick={onMoveUp}><ChevronUp size={11} /></button>
      <button disabled={isLast} title="Move down" onClick={onMoveDown}><ChevronDown size={11} /></button>
    </div>
    <div className={cx(`ptb-card ${tpl.on ? "" : "ptb-card-off"}`)}>
      <div className={cx("ptb-head")}>
        <span className={cx("ptb-icon")}><Stethoscope size={14} /></span>
        <div className={cx("ptb-head-info")}>
          <h3>
            {tpl.name}
            <button className={cx("ptb-pen")} title="Rename template" onClick={onRename}><Pencil size={11} /></button>
          </h3>
          <span>{n} components · {sysCount} system, {n - sysCount} custom</span>
        </div>

        <button className={cx(`ptb-edit ${open ? "ptb-edit-open" : ""}`)} onClick={onToggleOpen}>
          {open ? "Collapse" : "Edit"}
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
        <Toggle
          size="large"
          color="softBlue"
          label={`Enable ${tpl.name}`}
          on={tpl.on}
          onChange={() => update((t) => ({ ...t, on: !t.on }))}
        />
        <button className={cx("ptb-trash")} title="Delete template" onClick={onDelete}><Trash2 size={12} /></button>
      </div>

      {open && (
        <div className={cx("ptb-body")}>
          {tpl.comps.map((c, i) => {
            const lib = c.kind === "system" ? SYSTEM_LIBRARY.find((s) => s.key === c.key) : null;
            const SysIcon = lib ? SYS_ICONS[lib.key] || Activity : null;
            return (
              <div key={c.id} className={cx("ptb-crow")}>
                <div className={cx("ptb-move")}>
                  <button className={cx(i === 0 ? "ptb-hide" : "")} title="Move up" onClick={() => move(i, -1)}>
                    <ChevronUp size={10} />
                  </button>
                  <button className={cx(i === n - 1 ? "ptb-hide" : "")} title="Move down" onClick={() => move(i, 1)}>
                    <ChevronDown size={10} />
                  </button>
                </div>

                {lib ? (
                  <div className={cx("ptb-sys")}>
                    <span className={cx(`ptb-sys-ic ptb-tone-${lib.tone}`)}><SysIcon size={12} /></span>
                    <div className={cx("ptb-sys-info")}>
                      <div className={cx("ptb-sys-name")}>
                        <b>{lib.name}</b>
                        <em className={cx("ptb-badge")}>System</em>
                      </div>
                      <small>{lib.desc}</small>
                    </div>
                    <button className={cx("ptb-trash")} title="Remove component" onClick={() => setComps((cs) => cs.filter((x) => x.id !== c.id))}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <ProcCustomComponent
                    comp={c}
                    open={!!cfg[c.id]}
                    onToggle={() => setCfg((o) => ({ ...o, [c.id]: !o[c.id] }))}
                    onChange={(fn, toast) => patchComp(c.id, fn, toast)}
                    onRename={() => renameComp(c)}
                    onRemove={() => setComps((cs) => cs.filter((x) => x.id !== c.id))}
                    onAddField={() => onAddField(c.id)}
                    onEditField={(field) => onEditField(c.id, field)}
                  />
                )}
              </div>
            );
          })}

          <div className={cx("ptb-adds")}>
            <div className={cx("ptb-pick-wrap")} ref={pickRef}>
              <button className={cx("ptb-add")} onClick={() => (picking ? closePicker() : setPicking(true))}>
                <Activity size={12} /> Add System Component
              </button>

              {picking && (
                <div className={cx("ptb-pick")}>
                  <p>Select Procedure System Components</p>
                  {available.length === 0 ? (
                    <span className={cx("ptb-pick-none")}>All system components are already added.</span>
                  ) : (
                    <div className={cx("ptb-chips")}>
                      {available.map((s) => {
                        const on = picked.includes(s.key);
                        return (
                          <button key={s.key} className={cx(`ptb-chip ${on ? "ptb-chip-on" : ""}`)} onClick={() => togglePick(s.key)}>
                            {on && <Check size={10} />} {s.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className={cx("ptb-pick-foot")}>
                    <button className={cx("ptb-pick-add")} disabled={!picked.length} onClick={addSystem}>
                      Add {picked.length || ""} {picked.length === 1 ? "component" : "components"}
                    </button>
                    <button className={cx("ptb-pick-cancel")} onClick={closePicker}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {addingCustom ? (
              <div className={cx("ptb-newc")}>
                <input
                  autoFocus
                  placeholder="Component name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addCustom();
                    if (e.key === "Escape") closeCustom();
                  }}
                />
                <button className={cx("ptb-newc-ok")} title="Add" onClick={addCustom}><Check size={13} /></button>
                <button className={cx("ptb-newc-x")} title="Cancel" onClick={closeCustom}><X size={13} /></button>
              </div>
            ) : (
              <button className={cx("ptb-add")} onClick={() => setAddingCustom(true)}>
                <Plus size={12} /> Add Custom Component
              </button>
            )}
          </div>

          <div className={cx("ptb-info")}>
            <Info size={12} />
            <span>System components are built-in procedure modules (vitals, medications, consent, billing). Custom components add nursing-specific fields.</span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProcTemplateCard;