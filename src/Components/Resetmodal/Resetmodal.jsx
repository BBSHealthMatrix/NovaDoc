import Styles from "./Resetmodal.module.css";
import { Trash2 } from "lucide-react";


const ResetModal = ({ onCancel, onConfirm }) => {
  return (
    <div className={Styles["adm-overlay"]} onClick={onCancel}>
      <div className={Styles["adm-modal"]} onClick={(e) => e.stopPropagation()}>
        <h3><Trash2 size={15} /> Reset All Application Data?</h3>
        <p>
          This will permanently erase <b>all</b> data stored in this browser — doctors, patients,
          appointments, queue state, lab &amp; imaging catalogs, billing, SOAP notes, and every other setting.
        </p>
        <p className={Styles["adm-modal-warn"]}>
          This action cannot be undone. The page will reload and return to factory defaults.
        </p>
        <div className={Styles["adm-modal-btns"]}>
          <button className={Styles["adm-modal-cancel"]} onClick={onCancel}>Cancel</button>
          <button className={Styles["adm-modal-ok"]} onClick={onConfirm}>Yes, reset everything</button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
