import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { TABS, DEFAULT_RELS, CONDITIONS, GENETIC } from "./FamilyHistoryData.js";
import styles from "./FamilyHistory.module.css";

const cx = createClassNames(styles);

const FamilyHistory = () => {
  const [tab, setTab] = useState("conditions");
  const [conditions, setConditions] = useState(CONDITIONS);
  const [genetic, setGenetic] = useState(GENETIC);
  const [text, setText] = useState("");
  const [rels, setRels] = useState(DEFAULT_RELS);

  const current = TABS.find((t) => t.key === tab);

  const switchTab = (key) => {
    setTab(key);
    setText("");
  };

  const add = () => {
    const v = text.trim();
    if (!v) return;
    if (tab === "conditions") {
      setConditions((p) => [...p, { id: Date.now(), name: v, rels: rels.trim() }]);
    } else {
      if (genetic.includes(v)) return;
      setGenetic((p) => [...p, v]);
    }
    setText("");
  };

  return (
    <div className={cx("fh-wrap")}>
      <h1 className={cx("fh-title")}>Family History</h1>
      <p className={cx("fh-desc")}>Manage family history conditions and genetic disease lists.</p>

      <div className={cx("fh-tabs")}>
        {TABS.map((t) => (
          <button type="button" key={t.key} className={cx(`fh-tab ${tab === t.key ? "fh-tab-on" : ""}`)} onClick={() => switchTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={cx("fh-add")}>
        <input
          className={cx("fh-input")}
          placeholder={current.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
        />
        {tab === "conditions" && (
          <input
            className={cx("fh-input")}
            placeholder="Relationships (comma separated)"
            value={rels}
            onChange={(e) => setRels(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          />
        )}
        <button type="button" className={cx("fh-btn")} onClick={add}>Add</button>
      </div>

      {tab === "conditions" ? (
        <div className={cx("fh-table")}>
          <div className={cx("fh-head")}>
            <span>Condition</span>
            <span>Default Relationships</span>
            <span />
          </div>
          {conditions.map((c) => (
            <div className={cx("fh-row")} key={c.id}>
              <span className={cx("fh-name")}>{c.name}</span>
              <span className={cx("fh-rels")}>{c.rels}</span>
              <span className={cx("fh-acts")}>
                <button type="button" onClick={() => setConditions((p) => p.filter((x) => x.id !== c.id))} aria-label={`Delete ${c.name}`}>
                  <Trash2 size={10} />
                </button>
              </span>
            </div>
          ))}
          {conditions.length === 0 && <p className={cx("fh-empty")}>No conditions added.</p>}
        </div>
      ) : (
        <div className={cx("fh-list")}>
          {genetic.map((g) => (
            <div className={cx("fh-item")} key={g}>
              <span>{g}</span>
              <span className={cx("fh-acts")}>
                <button type="button" onClick={() => setGenetic((p) => p.filter((x) => x !== g))} aria-label={`Delete ${g}`}>
                  <Trash2 size={10} />
                </button>
              </span>
            </div>
          ))}
          {genetic.length === 0 && <p className={cx("fh-empty")}>No genetic diseases added.</p>}
        </div>
      )}
    </div>
  );
};

export default FamilyHistory;