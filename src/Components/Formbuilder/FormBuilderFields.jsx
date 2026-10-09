import { Layers } from "lucide-react";
import styles from "./FormBuilderFields.module.css";

const FormBuilderFields = ({ sections }) => sections.length === 0 ? (
  <div className={styles.empty}>
    <Layers size={26} />
    Add a section from the left panel to start building.
  </div>
) : (
  <>
    {sections.map((section) => (
      <div className={styles.section} key={section.id}>
        <Layers size={12} /> {section.name} <em>{section.fields.length} fields</em>
      </div>
    ))}
  </>
);

export default FormBuilderFields;
