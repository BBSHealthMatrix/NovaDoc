import FieldStyles from "./Field.module.css";

const Field = ({ label, req = false, plain = false, children }) => {
  const className = [FieldStyles["d-field"], plain && FieldStyles["plain"]]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={className}>
      <span>
        {label}
        {req && <i className={FieldStyles["req"]}> *</i>}
      </span>
      {children}
    </label>
  );
};

export default Field;
