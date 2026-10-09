import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Plus, Search, BookOpen, Eye, Pencil, Trash2 } from "lucide-react";

import { CATS, BADGE, SEED } from "./HealthEdData.js";

import DocModal from "./DocModal";

import styles from "./HealthEd.module.css";

const cx = createClassNames(styles);

const HealthEd = () => {
  const [docs, setDocs] = useState(SEED);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null);

  const list = docs.filter((d) =>
    (cat === "All" || d.cat === cat) &&
    (d.title + " " + d.desc).toLowerCase().includes(q.toLowerCase()));

  const save = (d) => {
    setDocs((p) => (p.some((x) => x.id === d.id) ? p.map((x) => (x.id === d.id ? d : x)) : [...p, d]));
    setModal(null);
  };

  const del = (id) => {
    if (window.confirm("Delete this document?")) setDocs((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className={cx("hel-wrap")}>
      <div className={cx("hel-top")}>
        <div>
          <h1 className={cx("hel-title")}>Health Education Library</h1>
          <p className={cx("hel-desc")}>Manage handouts, patient education documents, and non-pharma guidance available in the SOAP drawer.</p>
        </div>
        <button className={cx("hel-btn-add")} onClick={() => setModal({ mode: "add" })}><Plus size={14} /> Add Document</button>
      </div>

      <div className={cx("hel-pills")}>
        {["All", ...CATS].map((c) => (
          <button key={c} className={cx(`hel-pill ${cat === c ? "hel-pill-on" : ""}`)} onClick={() => setCat(c)}>
            {c} <span>{c === "All" ? docs.length : docs.filter((d) => d.cat === c).length}</span>
          </button>
        ))}
      </div>

      <div className={cx("hel-search")}>
        <Search size={13} />
        <input placeholder="Search by title or description..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <p className={cx("hel-count")}>{list.length} documents</p>

      {list.map((d) => (
        <div className={cx("hel-row")} key={d.id}>
          <div className={cx("hel-row-ic")}><BookOpen size={15} /></div>
          <div className={cx("hel-row-info")}>
            <div className={cx("hel-row-name")}>
              {d.title} <span className={cx(`hel-badge ${BADGE[d.cat]}`)}>{d.cat}</span>
            </div>
            <div className={cx("hel-row-desc")}>{d.desc}</div>
          </div>
          <div className={cx("hel-row-act")}>
            <button onClick={() => setModal({ mode: "view", item: d })}><Eye size={13} /></button>
            <button onClick={() => setModal({ mode: "edit", item: d })}><Pencil size={13} /></button>
            <button onClick={() => del(d.id)}><Trash2 size={13} /></button>
          </div>
        </div>
      ))}

      {list.length === 0 && <p className={cx("hel-empty")}>No documents found.</p>}

      {modal && <DocModal mode={modal.mode} item={modal.item} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default HealthEd;
