import { classNames as cx } from '../../utils/classNames.js';
import { useState } from "react";
import {
  GitBranch, Layers, FlaskConical, Stethoscope, ScanLine, Package, Pill, Syringe,
  Plus, Search, Globe, Clock, Pencil, Trash2,
} from "lucide-react";
import BranchModal from "../BranchModal/BranchModal";
import Toggle from "../Toggle/Toggle";
import { MODES, SEED } from "../../data/branches";
import BranchesStyles from "./Branches.module.css";

const TABS = [
  ["Branches", GitBranch], ["Queue Visit Types", Layers], ["Lab Assignment", FlaskConical],
  ["Procedure Partners", Stethoscope], ["Imaging Partners", ScanLine], ["Consumable Providers", Package],
  ["Pharmacy Partners", Pill], ["Vaccine Partners", Syringe],
];


const fmt = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const Branches = () => {
  const [tab, setTab] = useState("Branches");
  const [branches, setBranches] = useState(SEED);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null);

  const list = branches.filter((b) => `${b.name} ${b.code}`.toLowerCase().includes(q.toLowerCase()));

  const save = (b) => {
    setBranches((p) => (p.some((x) => x.id === b.id) ? p.map((x) => (x.id === b.id ? b : x)) : [...p, b]));
    setModal(null);
  };

  const toggle = (id) => setBranches((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  const del = (b) => {
    if (window.confirm(`Delete ${b.name}?`)) setBranches((p) => p.filter((x) => x.id !== b.id));
  };

  return (
    <div className={BranchesStyles["br-wrap"]}>
      <div className={BranchesStyles["br-top"]}>
        <div>
          <h1 className={BranchesStyles["br-title"]}>Branch Management</h1>
          <p className={BranchesStyles["br-desc"]}>Configure clinic branches, working hours, and service assignments.</p>
        </div>
        <button type="button" className={BranchesStyles["br-btn-add"]} onClick={() => setModal({ branch: null })}><Plus size={15} /> Add Branch</button>
      </div>

      <div className={BranchesStyles["br-tabs"]}>
        {TABS.map(([label, Icon]) => (
          <button type="button" key={label} className={cx(BranchesStyles["br-tab"], tab === label && BranchesStyles["br-tab-on"])} onClick={() => setTab(label)}>
            <Icon size={11} /> <span>{label}</span>
          </button>
        ))}
      </div>

      {tab !== "Branches" ? (
        <p className={BranchesStyles["br-soon"]}>This tab is not built yet.</p>
      ) : (
        <>
          <label className={BranchesStyles["br-search"]}>
            <Search size={14} />
            <input placeholder="Search branches..." value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <div className={BranchesStyles["br-table"]}>
            <div className={cx(BranchesStyles["br-row"], BranchesStyles["br-head"])}>
              <span>Branch Name</span><span>Code</span><span>Queue Mode</span><span>Timezone</span>
              <span>Working Hours</span><span>Token Reset</span><span>Status</span><span>Created</span><span />
            </div>

            {list.map((b) => {
              const m = MODES[b.mode];
              const queue = b.mode !== "appt";
              return (
                <div className={BranchesStyles["br-row"]} key={b.id}>
                  <div>
                    <b className={BranchesStyles["br-name"]}>{b.name}</b>
                    <span className={cx(BranchesStyles["br-badge"], BranchesStyles[m.cls])}>{m.label}</span>
                  </div>
                  <span><code className={BranchesStyles["br-code"]}>{b.code}</code></span>
                  <span>{queue ? <em className={BranchesStyles["br-single"]}>Single</em> : <i className={BranchesStyles["br-dash"]}>—</i>}</span>
                  <span className={BranchesStyles["br-ico"]}><Globe size={11} /> {b.tz}</span>
                  <span className={cx(BranchesStyles["br-ico"], BranchesStyles["br-hours"])}><Clock size={11} /> <span>{fmt(b.start)} – {fmt(b.end)}</span></span>
                  <span>{queue ? <code className={BranchesStyles["br-reset"]}>{fmt(b.reset)}</code> : <i className={BranchesStyles["br-dash"]}>—</i>}</span>
                  <span className={BranchesStyles["br-status"]}>
                    <Toggle on={b.active} onChange={() => toggle(b.id)} label={`Status for ${b.name}`} />
                    <small className={b.active ? BranchesStyles["br-on"] : undefined}>{b.active ? "Active" : "Inactive"}</small>
                  </span>
                  <span className={BranchesStyles["br-created"]}>{b.created}</span>
                  <span className={BranchesStyles["br-act"]}>
                    <button type="button" onClick={() => setModal({ branch: b })}><Pencil size={12} /></button>
                    <button type="button" onClick={() => del(b)}><Trash2 size={12} /></button>
                  </span>
                </div>
              );
            })}

            {list.length === 0 && <p className={BranchesStyles["br-empty"]}>No branches found.</p>}
          </div>
        </>
      )}

      {modal && <BranchModal branch={modal.branch} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default Branches;
