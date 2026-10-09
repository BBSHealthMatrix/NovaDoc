import useClock from "../../hooks/useClock";
import { WEEK, ymd, addDays, mondayOf, toTime, rows, slotsFor } from "../../data/appointments";
import ComponentStyles from "./WeekView.module.css";

const cx = (...names) =>
  names.filter(Boolean).map((name) => ComponentStyles[name]).join(" ");

const WeekView = ({ cursor, doctor, at, onSlot }) => {
  const now = useClock();

  if (!doctor) {
    return (
      <div className={cx("cal", "fill")}>
        Select a doctor to view the schedule.
      </div>
    );
  }

  const start = mondayOf(cursor);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const todayKey = ymd(now);
  const nowRow = Math.floor((now.getHours() * 60 + now.getMinutes()) / 30) * 30;
  const hasToday = days.some((date) => ymd(date) === todayKey);

  return (
    <div className={cx("cal", "fill")}>
      <div className={cx("week-grid", "head")}>
        <div />

        {days.map((date) => {
          const slots = slotsFor(doctor, date);
          const booked = slots.filter((time) => at(doctor.id, date, time)).length;
          const key = ymd(date);

          return (
            <div
              key={key}
              className={cx(
                "wk-head",
                slots.length === 0 && "off",
                key === todayKey && "today"
              )}
            >
              <small>{WEEK[(date.getDay() + 6) % 7]}</small>
              <b>{date.getDate()}</b>

              {slots.length > 0 ? (
                <em>
                  {slots.length} total ·{" "}
                  <i className={ComponentStyles["c-blue"]}>{booked} booked</i>
                  {" "}·{" "}
                  <i className={ComponentStyles["c-green"]}>
                    {slots.length - booked} free
                  </i>
                </em>
              ) : (
                <span className={ComponentStyles["off-pill"]}>Off</span>
              )}
            </div>
          );
        })}
      </div>

      {rows(doctor).map((minutes) => (
        <div
          key={minutes}
          className={cx(
            "week-grid",
            "row",
            hasToday && minutes === nowRow && "now"
          )}
        >
          <div className={ComponentStyles["wk-time"]}>{toTime(minutes)}</div>

          {days.map((date) => {
            const time = toTime(minutes);
            const open = slotsFor(doctor, date).includes(time);
            const appointment = at(doctor.id, date, time);
            const key = ymd(date);

            return (
              <div
                key={key}
                className={cx(
                  "wk-cell",
                  open ? "open" : "off",
                  key === todayKey && "today"
                )}
                onClick={() => open && !appointment && onSlot(key, time)}
              >
                {appointment && (
                  <span className={ComponentStyles["wk-appt"]}>
                    {appointment.patient}
                    <small>{appointment.type}</small>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekView;
