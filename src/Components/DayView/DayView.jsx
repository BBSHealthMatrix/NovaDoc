import { CalendarDays } from "lucide-react";
import { weekday, slotsFor } from "../../data/appointments";
import SlotList from "../SlotList/SlotList";
import ComponentStyles from "./DayView.module.css";

const cx = (...names) =>
  names.filter(Boolean).map((name) => ComponentStyles[name]).join(" ");

const DayView = ({ cursor, doctor, at, onSlot }) => {
  if (!doctor) {
    return (
      <div className={ComponentStyles.cal}>
        <div className={cx("empty-state", "day-empty")}>
          Select a doctor to view the schedule.
        </div>
      </div>
    );
  }

  const hasSlots = slotsFor(doctor, cursor).length > 0;

  return (
    <div className={ComponentStyles.cal}>
      <div className={ComponentStyles["day-head"]}>
        <b>{doctor.name}</b>
        <small>
          {cursor.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </small>
      </div>

      {hasSlots ? (
        <SlotList doctor={doctor} date={cursor} at={at} onSlot={onSlot} />
      ) : (
        <div className={cx("empty-state", "day-empty")}>
          <CalendarDays size={22} />
          <b>No schedule on {weekday(cursor)}</b>
          <small>This doctor has no timings configured for this day.</small>
        </div>
      )}
    </div>
  );
};

export default DayView;
