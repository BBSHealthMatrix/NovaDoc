import styles from "./FormBuilderDoctors.module.css";

const initials = (name) => name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();

const FormBuilderDoctors = ({ doctors, selected, onToggle }) => (
  <>
    <h2 className={styles.title}>Doctor Assignment</h2>
    <p className={styles.description}>Select which doctors will have access to this specialty form during consultations.</p>
    {[true, false].map((active) => (
      <div key={String(active)}>
        <div className={styles.caption}>{active ? "Active Doctors" : "Inactive Doctors"}</div>
        {doctors.filter((doctor) => doctor.active === active).map((doctor) => (
          <label className={[styles.row, !active && styles.disabled].filter(Boolean).join(" ")} key={doctor.name}>
            <input
              type="checkbox"
              disabled={!active}
              checked={selected.includes(doctor.name)}
              onChange={() => onToggle(doctor.name)}
            />
            <span className={styles.avatar}>{initials(doctor.name)}</span>
            <div>
              <div className={styles.name}>{doctor.name}</div>
              <div className={styles.specialty}>{doctor.spec}</div>
            </div>
          </label>
        ))}
      </div>
    ))}
  </>
);

export default FormBuilderDoctors;
