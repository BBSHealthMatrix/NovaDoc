import { DOCTORS, slotsFor, ymd } from "../../data/appointments";
import SlotList from "../SlotList/SlotList";
import DoctorColumnsStyles from "./DoctorColumns.module.css";

const DoctorColumns = ({ date, at, visible = [], onSlot }) => {
  const dateKey = ymd(date);

  return (
    <div className={DoctorColumnsStyles["doc-cols"]}>
      {DOCTORS.map((doctor) => {
        const slots = slotsFor(doctor, date) ?? [];
        const booked = visible.filter(
          (appointment) =>
            appointment.doctorId === doctor.id && appointment.date === dateKey,
        ).length;

        return (
          <div key={doctor.id} className={DoctorColumnsStyles["cal"]}>
            <div className={DoctorColumnsStyles["day-head"]}>
              <b>{doctor.name}</b>
              <small>{doctor.specialty}</small>
              <em>{booked} booked · {slots.length} slots</em>
            </div>

            {slots.length > 0 ? (
              <div className={DoctorColumnsStyles["doc-col-body"]}>
                <SlotList doctor={doctor} date={date} at={at} onSlot={onSlot} />
              </div>
            ) : (
              <p className={DoctorColumnsStyles["no-sched"]}>No schedule today</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DoctorColumns;
