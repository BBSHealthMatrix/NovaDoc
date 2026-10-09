import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import {
  Heart, Pencil, ChevronDown, ChevronUp, Trash2, Activity, Plus, Check, X, Info,
} from "lucide-react";
import Toggle from "../Toggle/Toggle";
import CustomComponent from "./CustomComponent";
import { SYSTEM_LIBRARY, newId, newCustom } from "./HistoryData.js";
import styles from "./TemplateCard.module.css";

const cx = createClassNames(styles);

const TemplateCard = ({ tpl, open, onToggleOpen, update, onRename, onDelete, onAddField, onEditField }) => {
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
    <div className={cx(`hist-card ${tpl.on ? "" : "hist-card-off"}`)}>
      <div className={cx("hist-head")}>
        <span className={cx("hist-icon")}><Heart size={14} /></span>
        <div className={cx("hist-head-info")}>
          <h3>
            {tpl.name}
            <button className={cx("hist-pen")} title="Rename template" onClick={onRename}><Pencil size={11} /></button>
          </h3>
          <span>{n} components · {sysCount} system, {n - sysCount} custom</span>
        </div>

        <button className={cx(`hist-edit ${open ? "hist-edit-open" : ""}`)} onClick={onToggleOpen}>
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
        <button className={cx("hist-trash")} title="Delete template" onClick={onDelete}><Trash2 size={12} /></button>
      </div>

      {open && (
        <div className={cx("hist-body")}>
          {tpl.comps.map((c, i) => {
            const lib = c.kind === "system" ? SYSTEM_LIBRARY.find((s) => s.key === c.key) : null;
            return (
              <div key={c.id} className={cx("hist-crow")}>
                <div className={cx("hist-move")}>
                  <button className={cx(i === 0 ? "hist-hide" : "")} title="Move up" onClick={() => move(i, -1)}>
                    <ChevronUp size={10} />
                  </button>
                  <button className={cx(i === n - 1 ? "hist-hide" : "")} title="Move down" onClick={() => move(i, 1)}>
                    <ChevronDown size={10} />
                  </button>
                </div>

                {lib ? (
                  <div className={cx("hist-sys")}>
                    <span className={cx("hist-sys-ic")}><Activity size={12} /></span>
                    <div className={cx("hist-sys-info")}>
                      <div className={cx("hist-sys-name")}>
                        <b>{lib.name}</b>
                        <em className={cx("hist-badge")}>System</em>
                      </div>
                      <small>{lib.desc}</small>
                    </div>
                    <button className={cx("hist-trash")} title="Remove component" onClick={() => setComps((cs) => cs.filter((x) => x.id !== c.id))}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <CustomComponent
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

          <div className={cx("hist-adds")}>
            <div className={cx("hist-pick-wrap")} ref={pickRef}>
              <button className={cx("hist-add")} onClick={() => (picking ? closePicker() : setPicking(true))}>
                <Activity size={12} /> Add System Component
              </button>

              {picking && (
                <div className={cx("hist-pick")}>
                  <p>Select System Components</p>
                  {available.length === 0 ? (
                    <span className={cx("hist-pick-none")}>All system components are already added.</span>
                  ) : (
                    <div className={cx("hist-chips")}>
                      {available.map((s) => {
                        const on = picked.includes(s.key);
                        return (
                          <button key={s.key} className={cx(`hist-chip ${on ? "hist-chip-on" : ""}`)} onClick={() => togglePick(s.key)}>
                            {on && <Check size={10} />} {s.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className={cx("hist-pick-foot")}>
                    <button className={cx("hist-pick-add")} disabled={!picked.length} onClick={addSystem}>
                      Add {picked.length || ""} {picked.length === 1 ? "component" : "components"}
                    </button>
                    <button className={cx("hist-pick-cancel")} onClick={closePicker}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {addingCustom ? (
              <div className={cx("hist-newc")}>
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
                <button className={cx("hist-newc-ok")} title="Add" onClick={addCustom}><Check size={13} /></button>
                <button className={cx("hist-newc-x")} title="Cancel" onClick={closeCustom}><X size={13} /></button>
              </div>
            ) : (
              <button className={cx("hist-add")} onClick={() => setAddingCustom(true)}>
                <Plus size={12} /> Add Custom Component
              </button>
            )}
          </div>

          <div className={cx("hist-info")}>
            <Info size={12} />
            <span>System components reference centralized library data. Custom components are nursing-specific and configured here.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;