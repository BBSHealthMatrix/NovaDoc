import { slotsFor, ymd, endOf } from "../../data/appointments";
import SlotListStyles from "./SlotList.module.css";

const SlotList = ({ doctor, date, at, onSlot }) => {
  if (!doctor) return null;

  const slots = slotsFor(doctor, date) ?? [];

  return slots.map((time) => {
    const appointment = at(doctor.id, date, time);

    return (
      <div
        key={time}
        className={SlotListStyles["slot-row"]}
        onClick={() => !appointment && onSlot(ymd(date), time, doctor.id)}
      >
        <div className={SlotListStyles["slot-time"]}>
          <b>{time}</b>
          <small>{endOf(time)}</small>
        </div>

        {appointment && (
          <span className={SlotListStyles["slot-appt"]}>
            {appointment.patient} · {appointment.type}
          </span>
        )}
      </div>
    );
  });
};

export default SlotList;
