import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { FileText, Eye, Trash2 } from "lucide-react";

import { RECORDS, HEADERS } from "./HealthRecordsData.js";

import styles from "./HealthRecords.module.css";

const cx = createClassNames(styles);

const HealthRecords = () => {
  const [records, setRecords] = useState(RECORDS)

  const remove = (mrn) => {
    if (window.confirm(`Delete health record ${mrn}?`)) {
      setRecords(records.filter((r) => r[0] !== mrn))
    }
  }

  return (
    <div className={cx("hr-page")}>
      <div className={cx("hr-head")}>
        <span className={cx("hr-icon")}><FileText size={16} /></span>
        <div>
          <h1>Health Records</h1>
          <small>{records.length} health records</small>
        </div>
      </div>

      <div className={cx("hr-card")}>
        <table className={cx("hr-table")}>
          <thead>
            <tr>{HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {records.map(([mrn, name, doctor, nurse, created, type], i) => (
              <tr key={mrn}>
                <td className={cx("hr-muted")}>{i + 1}</td>
                <td className={cx("hr-strong")}>{mrn}</td>
                <td className={cx("hr-strong")}>{name}</td>
                <td>{doctor}</td>
                <td>{nurse}</td>
                <td>{created}</td>
                <td><span className={cx(`hr-type ${type.toLowerCase()}`)}>{type}</span></td>
                <td className={cx("hr-actions")}>
                  <button title="View"><Eye size={13} /></button>
                  <button title="Delete" onClick={() => remove(mrn)}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default HealthRecords;
