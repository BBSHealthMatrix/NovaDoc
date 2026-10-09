import Styles from "./Formlist.module.css";
import { BookOpen, Plus, Pencil, Copy, Trash2 } from "lucide-react";

const cx = (...names) => names.filter(Boolean).map((name) => Styles[name]).join(" ");


const counts = (f) =>
  f.sections.length
    ? { sections: f.sections.length, fields: f.sections.reduce((n, s) => n + s.fields.length, 0) }
    : f.stats || { sections: 0, fields: 0 };


const FormList = ({ forms, onNew, onEdit, onCopy, onDelete }) => {
  const pub = forms.filter((f) => f.status === "Published").length;

  return (
    <div className={Styles["adm-wrap"]}>
      <div className={Styles["adm-top"]}>
        <div>
          <h1 className={Styles["adm-title"]}>Specialty Forms</h1>
          <p className={Styles["adm-desc"]}>Create custom clinical forms for doctors as an alternative to the standard SOAP Note.</p>
        </div>
        <button className={Styles["adm-btn-new"]} onClick={onNew}><Plus size={13} /> New Form</button>
      </div>

      <div className={Styles["adm-stats"]}>
        <div className={Styles["adm-stat"]}><span>Total Forms</span><b>{forms.length}</b></div>
        <div className={Styles["adm-stat"]}><span>Published</span><b className={Styles["adm-green"]}>{pub}</b></div>
        <div className={Styles["adm-stat"]}><span>Drafts</span><b className={Styles["adm-orange"]}>{forms.length - pub}</b></div>
      </div>

      {forms.map((f) => {
        const c = counts(f);
        return (
          <div className={Styles["adm-row"]} key={f.id}>
            <div className={Styles["adm-row-ic"]}><BookOpen size={15} /></div>
            <div className={Styles["adm-row-info"]}>
              <div className={Styles["adm-row-name"]}>
                {f.name}
                <span className={cx("adm-badge", f.status === "Draft" && "adm-badge-draft")}>{f.status}</span>
              </div>
              <div className={Styles["adm-row-meta"]}>
                {c.sections} sections <i>·</i> {c.fields} fields <i>·</i>
                {f.doctors.length
                  ? <span className={Styles["adm-doc"]}>{f.doctors.join(", ")}</span>
                  : <em>No doctors assigned</em>}
              </div>
            </div>
            <div className={Styles["adm-row-act"]}>
              <button onClick={() => onEdit(f)}><Pencil size={13} /></button>
              <button onClick={() => onCopy(f)}><Copy size={13} /></button>
              <button onClick={() => onDelete(f.id)}><Trash2 size={13} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormList;
