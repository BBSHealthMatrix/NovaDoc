import Styles from "./Formbuilder.module.css";
import { useState } from "react";
import { ChevronLeft, Eye, Send, Layers, Users } from "lucide-react";
import { COMPONENTS, DOCTORS } from "./FormBuilderData";
import FormBuilderLayout from "./FormBuilderLayout";
import FormBuilderFields from "./FormBuilderFields";
import FormBuilderDoctors from "./FormBuilderDoctors";
import FormBuilderPalette from "./FormBuilderPalette";

const cx = (...names) => names.filter(Boolean).map((name) => Styles[name]).join(" ");

const FormBuilder = ({ form, onBack, onSave }) => {
  const [f, setF] = useState(form);
  const [tab, setTab] = useState("fields");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleIn = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const addSection = () =>
    set("sections", [...f.sections, { id: Date.now(), name: `Section ${f.sections.length + 1}`, fields: [] }]);
  const save = (status) => onSave({ ...f, name: f.name.trim() || "Untitled Form", status });

  const layout = [
    ...f.components.map((id) => COMPONENTS.find((c) => c.id === id)),
    ...f.sections.map((s) => ({ id: s.id, label: s.name, icon: Layers, color: "#64748b" })),
  ];

  return (
    <div className={Styles["adm-bld"]}>
      <div className={Styles["adm-bld-head"]}>
        <button className={Styles["adm-back"]} onClick={onBack}><ChevronLeft size={13} /> Forms</button>
        <input className={Styles["adm-name-in"]} value={f.name} onChange={(event) => set("name", event.target.value)} />
        <div className={Styles["adm-head-btns"]}>
          <button className={Styles["adm-btn-o"]}><Eye size={13} /> Preview</button>
          <button className={Styles["adm-btn-o"]} onClick={() => save("Draft")}>Save Draft</button>
          <button className={Styles["adm-btn-pub"]} onClick={() => save("Published")}><Send size={12} /> Publish</button>
        </div>
      </div>
      <div className={Styles["adm-bld-body"]}>
        <FormBuilderLayout items={layout} onAddSection={addSection} />
        <div className={Styles["adm-pane"]}>
          <div className={Styles["adm-tabs"]}>
            <button className={cx("adm-tab", tab === "fields" && "adm-tab-on")} onClick={() => setTab("fields")}>
              <Layers size={12} /> Fields
            </button>
            <button className={cx("adm-tab", tab === "doctors" && "adm-tab-on")} onClick={() => setTab("doctors")}>
              <Users size={12} /> Doctor Assignments
            </button>
            <button className={cx("adm-tab", tab === "comp" && "adm-tab-on")} onClick={() => setTab("comp")}>
              <Layers size={12} /> System Components
              {f.components.length > 0 && <span className={Styles["adm-tab-count"]}>{f.components.length}</span>}
            </button>
          </div>
          <div className={Styles["adm-pane-body"]}>
            {tab === "fields" && <FormBuilderFields sections={f.sections} />}
            {tab === "doctors" && <FormBuilderDoctors doctors={DOCTORS} selected={f.doctors} onToggle={(name) => toggleIn("doctors", name)} />}
            {tab === "comp" && <FormBuilderPalette components={COMPONENTS} selected={f.components} onToggle={(id) => toggleIn("components", id)} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
