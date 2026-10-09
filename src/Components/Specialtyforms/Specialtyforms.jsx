import { useState } from "react";
import FormList from "../Formlist/Formlist";
import FormBuilder from "../Formbuilder/Formbuilder";

import { SEED } from "./SpecialtyFormsData";
import styles from "./Specialtyforms.module.css";

/* ---------- specialty forms (list + builder) ---------- */
const SpecialtyForms = () => {
  const [forms, setForms] = useState(SEED);
  const [editing, setEditing] = useState(null);

  const newForm = () =>
    setEditing({ id: Date.now(), name: "Untitled Form", status: "Draft", doctors: [], components: [], sections: [] });

  const save = (form) => {
    setForms((p) => (p.some((x) => x.id === form.id) ? p.map((x) => (x.id === form.id ? form : x)) : [...p, form]));
    setEditing(null);
  };

  const copy = (f) => setForms((p) => [...p, { ...f, id: Date.now(), name: f.name + " (Copy)" }]);

  const del = (id) => {
    if (window.confirm("Delete this form?")) setForms((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className={styles.page}>
      {editing ? (
    <FormBuilder form={editing} onBack={() => setEditing(null)} onSave={save} />
  ) : (
    <FormList forms={forms} onNew={newForm} onEdit={setEditing} onCopy={copy} onDelete={del} />
      )}
    </div>
  );
};

export default SpecialtyForms;
