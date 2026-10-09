import useClock from "../../hooks/useClock";
import { WEEK, ymd, addDays, mondayOf } from "../../data/appointments";
import ComponentStyles from "./MonthView.module.css";

const cx = (...names) =>
  names.filter(Boolean).map((name) => ComponentStyles[name]).join(" ");

const MonthView = ({ cursor, visible = [], picked, onPick }) => {
  const now = useClock();
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const end = addDays(mondayOf(last), 6);
  const days = [];

  for (let date = mondayOf(first); date <= end; date = addDays(date, 1)) {
    days.push(date);
  }

  const todayKey = ymd(now);
  const pickedKey = picked ? ymd(picked) : "";

  return (
    <div className={cx("cal", "fill")}>
      <div className={cx("month-grid", "head")}>
        {WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={ComponentStyles["month-grid"]}>
        {days.map((date) => {
          const key = ymd(date);
          const outsideMonth = date.getMonth() !== cursor.getMonth();

          return (
            <div
              key={key}
              className={cx(
                "m-cell",
                outsideMonth && "out",
                key === todayKey && "today",
                key === pickedKey && "picked"
              )}
              onClick={() => onPick(date)}
            >
              <span className={ComponentStyles["m-num"]}>
                {date.getDate()}
              </span>

              {visible
                .filter((appointment) => appointment.date === key)
                .map((appointment) => (
                  <span
                    key={appointment.id}
                    className={ComponentStyles["m-appt"]}
                  >
                    {appointment.time} {appointment.patient}
                  </span>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
