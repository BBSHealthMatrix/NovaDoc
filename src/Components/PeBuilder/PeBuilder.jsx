import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useRef, useState } from "react";
import {
  Stethoscope, Save, Settings, ShieldCheck, GripVertical, ChevronRight, ChevronDown, CircleCheck, Pencil, X,
} from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { SPECIALTIES, SYSTEMS } from "./PeBuilderData.js";
import styles from "./PeBuilder.module.css";

const cx = createClassNames(styles);

const sectionOpts = (s) => s.findings.reduce((t, fd) => t + fd.opts.length, 0);
const systemOpts = (y) => y.sections.reduce((t, s) => t + sectionOpts(s), 0);

const PeBuilder = () => {
  const [spec, setSpec] = useState(SPECIALTIES[0]);
  const [configs, setConfigs] = useState({});
  const [openSys, setOpenSys] = useState({});
  const [openSec, setOpenSec] = useState({});
  const [edit, setEdit] = useState(null); // { fid, i, value }
  const [saved, setSaved] = useState(false);
  const dragFrom = useRef(null);
  const [armed, setArmed] = useState(null);

  const systems = configs[spec] || SYSTEMS;
  const enabled = systems.filter((y) => y.on).length;

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const setSystems = (next) => {
    setConfigs((p) => ({ ...p, [spec]: next }));
    setSaved(false);
  };

  const updateFinding = (fid, fn) => setSystems(systems.map((y) => ({
    ...y,
    sections: y.sections.map((s) => ({
      ...s,
      findings: s.findings.map((fd) => (fd.id === fid ? fn(fd) : fd)),
    })),
  })));

  const addOpt = (fid, input) => {
    const v = input.value.trim();
    if (v) updateFinding(fid, (fd) => (fd.opts.includes(v) ? fd : { ...fd, opts: [...fd.opts, v] }));
    input.value = "";
  };

  const saveEdit = () => {
    const v = edit.value.trim();
    updateFinding(edit.fid, (fd) => ({
      ...fd,
      opts: v ? fd.opts.map((o, k) => (k === edit.i ? v : o)) : fd.opts.filter((_, k) => k !== edit.i),
    }));
    setEdit(null);
  };

  const dragOver = (e, i) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === i) return;
    const next = [...systems];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    setSystems(next);
    dragFrom.current = i;
  };

  const finding = (fd) => (
    <div className={cx("pe-fd")} key={fd.id}>
      <p className={cx("pe-fd-label")}>{fd.label}</p>
      <div className={cx("pe-normal")}>
        <CircleCheck size={10} />
        <span className={cx("pe-mini")}>Normal Text</span>
        <input value={fd.normal} onChange={(e) => updateFinding(fd.id, (x) => ({ ...x, normal: e.target.value }))} />
      </div>
      <span className={cx("pe-mini pe-mini-block")}>Abnormal Options</span>
      <div className={cx("pe-pills")}>
        {fd.opts.map((o, i) => (edit?.fid === fd.id && edit.i === i ? (
          <input
            key={i}
            className={cx("pe-pill pe-pill-edit")}
            autoFocus
            value={edit.value}
            onChange={(e) => setEdit({ ...edit, value: e.target.value })}
            onBlur={saveEdit}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEdit(null); }}
          />
        ) : (
          <span className={cx("pe-pill")} key={i}>
            {o}
            <span className={cx("pe-pill-acts")}>
              <button type="button" onClick={() => setEdit({ fid: fd.id, i, value: o })} aria-label={`Edit ${o}`}><Pencil size={8} /></button>
              <button type="button" onClick={() => updateFinding(fd.id, (x) => ({ ...x, opts: x.opts.filter((_, k) => k !== i) }))} aria-label={`Remove ${o}`}><X size={8} /></button>
            </span>
          </span>
        )))}
        <input
          className={cx("pe-add")}
          placeholder="+ Add option"
          onKeyDown={(e) => { if (e.key === "Enter") addOpt(fd.id, e.target); }}
          onBlur={(e) => addOpt(fd.id, e.target)}
        />
      </div>
      {fd.opts.length === 0 && <p className={cx("pe-hint")}>No options yet — type above to add</p>}
    </div>
  );

  return (
    <div className={cx("pe-page")}>
      <div className={cx("pe-header")}>
        <div>
          <h1 className={cx("pe-title")}><Stethoscope size={15} /> Physical Exam Builder</h1>
          <p className={cx("pe-sub")}>{enabled} of {systems.length} systems enabled · configure abnormal options per finding</p>
        </div>
        <button type="button" className={cx("pe-save")} onClick={() => setSaved(true)}>
          {saved ? <CircleCheck size={12} /> : <Save size={12} />} {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className={cx("pe-specs")}>
        <span className={cx("pe-spec-lbl")}><Settings size={11} /> Specialty:</span>
        <div className={cx("pe-spec-pills")}>
          {SPECIALTIES.map((s) => (
            <button type="button" key={s} className={cx(`pe-spec ${spec === s ? "pe-spec-on" : ""}`)} onClick={() => { setSpec(s); setEdit(null); }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={cx("pe-banner")}>
        <ShieldCheck size={11} />
        Expand a body system → then expand a section → configure each finding&apos;s abnormal options. Doctors see these as clickable pills in the examination drawer.
      </div>

      <div className={cx("pe-body")}>
        {systems.map((y, i) => {
          const isOpen = Boolean(openSys[y.id]);
          const total = systemOpts(y);
          return (
            <div
              key={y.id}
              className={cx("pe-sys")}
              draggable={armed === y.id}
              onDragStart={() => { dragFrom.current = i; }}
              onDragOver={(e) => dragOver(e, i)}
              onDragEnd={() => { dragFrom.current = null; setArmed(null); }}
            >
              <div className={cx("pe-sys-head")}>
                <span className={cx("pe-grip")} onMouseDown={() => setArmed(y.id)} onMouseUp={() => setArmed(null)}>
                  <GripVertical size={10} />
                </span>
                <button type="button" className={cx("pe-sys-btn")} onClick={() => setOpenSys((o) => ({ ...o, [y.id]: !isOpen }))}>
                  <span className={cx("pe-sys-name")}>{y.name}</span>
                  <span className={cx("pe-code")}>{y.code}</span>
                  {total > 0 && <span className={cx("pe-badge")}>{total} options</span>}
                  <span className={cx("pe-count")}>{y.sections.length} sections</span>
                  {isOpen ? <ChevronDown size={12} className={cx("pe-chev")} /> : <ChevronRight size={12} className={cx("pe-chev")} />}
                </button>
                <Toggle size="large" color="softBlue" on={y.on} onChange={() => setSystems(systems.map((x) => (x.id === y.id ? { ...x, on: !x.on } : x)))} label={`${y.name} enabled`} />
              </div>

              {isOpen && (
                <div className={cx("pe-secs")}>
                  {y.sections.map((s) => {
                    const secOpen = Boolean(openSec[s.id]);
                    const opts = sectionOpts(s);
                    return (
                      <div className={cx(`pe-sec ${secOpen ? "pe-sec-open" : ""}`)} key={s.id}>
                        <button type="button" className={cx("pe-sec-head")} onClick={() => setOpenSec((o) => ({ ...o, [s.id]: !secOpen }))}>
                          <span className={cx("pe-sec-name")}>{s.name}</span>
                          {opts > 0 && <span className={cx("pe-obadge")}>{opts} options</span>}
                          <span className={cx("pe-items")}>{s.findings.length} items</span>
                          {secOpen ? <ChevronDown size={10} className={cx("pe-chev")} /> : <ChevronRight size={10} className={cx("pe-chev")} />}
                        </button>
                        {secOpen && <div className={cx("pe-fds")}>{s.findings.map(finding)}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeBuilder;