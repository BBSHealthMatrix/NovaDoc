import MonthView from "../MonthView/MonthView";
import WeekView from "../WeekView/WeekView";
import DayView from "../DayView/DayView";
import styles from "./Calendar.module.css";

const Calendar = ({ view, cursor, doctor, visible = [], at, picked, onPick, onSlot }) => (
  <div className={styles.calendar}>
    {view === "month" ? (
      <MonthView cursor={cursor} visible={visible} picked={picked} onPick={onPick} />
    ) : view === "week" ? (
      <WeekView cursor={cursor} doctor={doctor} at={at} onSlot={onSlot} />
    ) : (
      <DayView cursor={cursor} doctor={doctor} at={at} onSlot={onSlot} />
    )}
  </div>
);

export default Calendar;
