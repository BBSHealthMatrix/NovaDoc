import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Info } from "lucide-react";
import Select from "../Shared/Select";
import { DOCTOR_COUNTERS, DOCTORS } from "./DoctorPartitionData.js";
import styles from "./DoctorPartition.module.css";

const cx = createClassNames(styles);

const DoctorPartition = () => {
  const [doctors, setDoctors] = useState(DOCTORS);

  const assign = (id, counter) => setDoctors((p) => p.map((d) => (d.id === id ? { ...d, counter } : d)));

  return (
    <div className={cx("dp-wrap")}>
      <h1 className={cx("dp-title")}>Doctor / Partition Configuration</h1>
      <p className={cx("dp-desc")}>Map doctors to counters for partitioned queues. Used when Queue Mode = Partitioned by Doctor.</p>

      <div className={cx("dp-info")}>
        <Info size={13} />
        <p>
          This mapping is active when a visit type has <b>Queue Mode = Partitioned</b> and <b>Partition By = Doctor</b>.
          {" "}Each token generated will carry a <code>doctor_id</code> and be routed to the mapped counter.
        </p>
      </div>

      <div className={cx("dp-card")}>
        <div className={cx("dp-row dp-th")}>
          <span>Doctor</span>
          <span>Specialty</span>
          <span>Assigned Counter</span>
        </div>
        {doctors.map((d) => (
          <div className={cx("dp-row dp-tr")} key={d.id}>
            <span className={cx("dp-name")}>{d.name}</span>
            <span className={cx("dp-spec")}>{d.specialty}</span>
            <div className={cx("dp-sel")}>
              <Select value={d.counter} options={DOCTOR_COUNTERS} onChange={(v) => assign(d.id, v)} label={`Counter for ${d.name}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorPartition;