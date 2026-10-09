import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Eye } from "lucide-react";
import styles from "./HpiPreview.module.css";

const cx = createClassNames(styles);

const HpiPreview = ({ complaint, name, fields }) => {
  const [answers, setAnswers] = useState({});
  const shown = fields.filter((fl) => fl.label.trim());
  const hasConditions = shown.some((fl) => fl.cond);
  const empty = !complaint && !name.trim();

  const set = (id, value) => setAnswers((p) => ({ ...p, [id]: value }));

  const toggleMulti = (id, o) => {
    const cur = answers[id] || [];
    set(id, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
  };

  // conditional fields appear only when one of their trigger values is picked
  const visible = (fl) => {
    if (!fl.cond) return true;
    const a = answers[fl.cond.field];
    const picked = Array.isArray(a) ? a : a ? [a] : [];
    return fl.cond.values.some((v) => picked.includes(v));
  };

  const input = (fl) => {
    if (fl.type === "Free Text") {
      return <textarea className={cx("hpi-p-text")} placeholder={fl.placeholder || "Type here..."} />;
    }
    if (fl.type === "Number") {
      return <input type="number" className={cx("hpi-p-num")} placeholder={fl.placeholder || "0"} />;
    }
    const multi = fl.type === "Multi-select";
    return (
      <div className={cx("hpi-p-opts")}>
        {fl.opts.map((o) => {
          const on = multi ? (answers[fl.id] || []).includes(o) : answers[fl.id] === o;
          return (
            <button type="button" key={o} className={cx(`hpi-p-opt ${on ? "hpi-p-on" : ""}`)} onClick={() => (multi ? toggleMulti(fl.id, o) : set(fl.id, on ? undefined : o))}>
              {o}
            </button>
          );
        })}
        {!fl.opts.length && <span className={cx("hpi-p-none")}>No options yet</span>}
      </div>
    );
  };

  return (
    <aside className={cx("hpi-prev")}>
      <div className={cx(`hpi-p-head ${empty ? "hpi-p-head-line" : ""}`)}>
        <Eye size={12} /> Preview
        {!empty && <span className={cx("hpi-p-badge")}>Interactive</span>}
      </div>

      {empty ? (
        <p className={cx("hpi-p-empty")}>Fill in template details to see preview</p>
      ) : (
        <>
          <p className={cx("hpi-p-lbl")}>Chief Complaint</p>
          <p className={cx("hpi-p-cc")}>{complaint || "—"}</p>
          <p className={cx("hpi-p-lbl")}>HPI — {name.trim() || "Untitled"}</p>
          {shown.length === 0 && <p className={cx("hpi-p-none")}>Add fields to see them here</p>}
          {shown.filter(visible).map((fl) => (
            <div className={cx("hpi-p-field")} key={fl.id}>
              <p className={cx("hpi-p-flbl")}>{fl.label}{fl.req && <b>*</b>}</p>
              {input(fl)}
            </div>
          ))}
          {hasConditions && <p className={cx("hpi-p-tip")}>↑ Click options above to reveal conditional fields</p>}
        </>
      )}
    </aside>
  );
};

export default HpiPreview;