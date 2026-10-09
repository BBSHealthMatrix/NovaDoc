import { classNames as cx } from '../../utils/classNames.js';
import { DOCTORS } from "../../data/appointments";
import StylingApp from "./TodayList.module.css";


const TodayList = ({ list, r }) => {
  const Icon = r.emptyIcon;

  if (list.length === 0) {
    return (
      <div className={cx(StylingApp["empty-state"], StylingApp["big"])}>
        <Icon size={30} />
        <b>{r.emptyTitle}</b>
        <small>{r.emptySub}</small>
      </div>
    );
  }

  return (
    <div className={StylingApp["cal"]}>
      {list.map((appointment) => {
        const doctor = DOCTORS.find((d) => d.id === appointment.doctorId);
        const priority = appointment.priority || "Routine";

        return (
          <div key={appointment.id} className={StylingApp["today-row"]}>
            <b className={StylingApp["mono"]}>{appointment.time}</b>

            <span className={StylingApp["today-name"]}>
              <b>{appointment.patient}</b>
              <small>
                {doctor?.name ?? "Unknown doctor"} · {appointment.type}
              </small>
            </span>

            <span
              className={cx(
                StylingApp["prio-pill"],
                StylingApp[priority.toLowerCase()],
              )}
            >
              {priority}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TodayList;
