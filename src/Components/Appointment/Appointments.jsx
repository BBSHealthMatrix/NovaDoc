import { classNames as cx } from '../../utils/classNames.js';
import { useState } from "react";
import useClock from "../../hooks/useClock";
import {
  CalendarDays,
  Stethoscope,
  Columns2,
  Printer,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Heart,
  Activity,
  ClipboardList,
} from "lucide-react";
import { DOCTORS, TYPES, ymd, addDays, mondayOf } from "../../data/appointments";
import Calendar from "../Calendar/Calendar";
import DoctorColumns from "../DoctorColumns/DoctorColumns";
import SlotPicker from "../SlotPicker/SlotPicker";
import BookAppointment from "../BookAppointment/BookAppointment";
import DoctorPicker from "../DoctorPicker/DoctorPicker";
import TodayList from "../TodayList/TodayList";
import StylingApp from "./Appointments.module.css";


const ROLES = {
  frontdesk: {
    chip: "Front Desk",
    icon: CalendarDays,
    tone: "",
    view2: "Doctor",
    icon2: Columns2,
  },
  nursing: {
    chip: "Nursing",
    icon: Heart,
    tone: "nurse",
    view2: "Priority View",
    icon2: Activity,
    emptyIcon: Activity,
    emptyTitle: "No checked-in patients",
    emptySub: "Patients will appear here once they check in.",
  },
  doctor: {
    chip: "Doctor",
    icon: Stethoscope,
    tone: "doc",
    view2: "Counselling View",
    icon2: ClipboardList,
    emptyIcon: ClipboardList,
    emptyTitle: "No appointments today",
    emptySub: "No patients are scheduled for today's consultations.",
  },
};

const RANK = { Emergency: 0, Urgent: 1, Routine: 2 };

const Appointments = ({ role = "frontdesk", fixedDoctor }) => {
  const now = useClock();
  const r = ROLES[role] || ROLES.frontdesk;
  const ChipIcon = r.icon;
  const ViewIcon = r.icon2;

  const [mode, setMode] = useState("calendar");
  const [view, setView] = useState(role === "doctor" ? "week" : "month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState(fixedDoctor || "emily");
  const [types, setTypes] = useState([]);
  const [appts, setAppts] = useState([]);
  const [booking, setBooking] = useState(null);
  const [picker, setPicker] = useState(null);

  const doctorId = fixedDoctor || selectedDoctorId;
  const doctor = DOCTORS.find((d) => d.id === doctorId);
  const second = mode === "second";
  const allDoctors = second && role !== "doctor";
  const typeList = second ? TYPES : TYPES.slice(0, 2);
  const showSubBar = !second || role === "frontdesk";

  const visible = appts.filter(
    (a) =>
      (allDoctors || a.doctorId === doctorId) &&
      (types.length === 0 || types.includes(a.type)),
  );

  const at = (docId, date, time) =>
    visible.find(
      (a) =>
        a.doctorId === docId && a.date === ymd(date) && a.time === time,
    );

  const toggleType = (type) => {
    setTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type],
    );
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setTypes([]);
  };

  const openSlot = (date, time, docId) => {
    setBooking({ date, time, doctorId: docId || doctorId });
  };

  const move = (direction) => {
    setCursor((previous) => {
      if (view === "month") {
        return new Date(
          previous.getFullYear(),
          previous.getMonth() + direction,
          1,
        );
      }

      return addDays(previous, direction * (view === "week" ? 7 : 1));
    });
  };

  const weekStart = mondayOf(cursor);
  const short = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const label =
    view === "month"
      ? cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : view === "week"
        ? `${short(weekStart)} – ${short(addDays(weekStart, 6))}`
        : cursor.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });

  let body;

  if (second && role === "frontdesk") {
    body = (
      <DoctorColumns
        date={cursor}
        at={at}
        visible={visible}
        onSlot={openSlot}
      />
    );
  } else if (second) {
    const todayKey = ymd(now);
    const list = visible
      .filter((a) => a.date === todayKey)
      .sort((a, b) =>
        role === "nursing"
          ? (RANK[a.priority] ?? RANK.Routine) -
            (RANK[b.priority] ?? RANK.Routine)
          : a.time.localeCompare(b.time),
      );

    body = <TodayList list={list} r={r} />;
  } else {
    body = (
      <Calendar
        view={view}
        cursor={cursor}
        doctor={doctor}
        visible={visible}
        at={at}
        picked={picker}
        onPick={setPicker}
        onSlot={openSlot}
      />
    );
  }

  return (
    <div className={StylingApp["ap-wrap"]}>
      <div className={StylingApp["ap-bar"]}>
        <span
          className={cx(
            StylingApp["fd-chip"],
            r.tone && StylingApp[r.tone],
          )}
        >
          <ChipIcon size={11} /> {r.chip}
        </span>

        {!second && !fixedDoctor && (
          <DoctorPicker value={doctorId} onChange={setSelectedDoctorId} />
        )}

        {!second && fixedDoctor && (
          <span className={StylingApp["doc-fixed"]}>
            <Stethoscope size={12} /> {doctor?.name ?? "Unknown doctor"}
          </span>
        )}

        <span className={StylingApp["count-chip"]}>
          <CalendarDays size={11} /> {visible.length}
        </span>

        <span className={StylingApp["status-chip"]}>
          <span className={cx(StylingApp["dot"], StylingApp["gray"])} />
          {visible.length ? `${visible.length} booked` : "No appointments"}
        </span>

        <div className={StylingApp["ap-right"]}>
          <div className={StylingApp["seg"]}>
            <button
              type="button"
              className={!second ? StylingApp["on"] : undefined}
              onClick={() => switchMode("calendar")}
              aria-pressed={!second}
            >
              <CalendarDays size={11} /> Calendar
            </button>

            <button
              type="button"
              className={second ? StylingApp["on"] : undefined}
              onClick={() => switchMode("second")}
              aria-pressed={second}
            >
              <ViewIcon size={11} /> {r.view2}
            </button>
          </div>

          <button
            type="button"
            className={StylingApp["icon-only"]}
            onClick={() => window.print()}
            aria-label="Print appointments"
          >
            <Printer size={14} />
          </button>

          <button
            type="button"
            className={StylingApp["quick-add"]}
            onClick={() => openSlot(ymd(new Date()), "")}
          >
            <Plus size={14} /> Quick Add
          </button>
        </div>
      </div>

      {showSubBar && (
        <div className={cx(StylingApp["ap-bar"], StylingApp["sub"])}>
          {typeList.map((type) => (
            <button
              key={type}
              type="button"
              className={cx(
                StylingApp["type-chip"],
                types.includes(type) && StylingApp["on"],
              )}
              onClick={() => toggleType(type)}
              aria-pressed={types.includes(type)}
            >
              {type}
            </button>
          ))}

          {types.length > 0 && (
            <button
              type="button"
              className={StylingApp["clear-btn"]}
              onClick={() => setTypes([])}
            >
              <X size={10} /> Clear
            </button>
          )}

          <div className={StylingApp["ap-right"]}>
            <button
              type="button"
              className={StylingApp["arrow-btn"]}
              onClick={() => move(-1)}
              aria-label="Previous date range"
            >
              <ChevronLeft size={13} />
            </button>

            <span className={StylingApp["ap-label"]}>{label}</span>

            <button
              type="button"
              className={StylingApp["arrow-btn"]}
              onClick={() => move(1)}
              aria-label="Next date range"
            >
              <ChevronRight size={13} />
            </button>

            <button
              type="button"
              className={StylingApp["today-btn"]}
              onClick={() => setCursor(new Date())}
            >
              <RefreshCw size={11} /> Today
            </button>

            <div className={cx(StylingApp["seg"], StylingApp["small"])}>
              {["day", "week", "month"].map((nextView) => (
                <button
                  key={nextView}
                  type="button"
                  className={view === nextView ? StylingApp["on"] : undefined}
                  onClick={() => setView(nextView)}
                  aria-pressed={view === nextView}
                >
                  {nextView[0].toUpperCase() + nextView.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={StylingApp["ap-body"]}>{body}</div>

      {picker && (
        <SlotPicker
          date={picker}
          doctor={doctor}
          at={at}
          onClose={() => setPicker(null)}
          onPick={(time) => {
            openSlot(ymd(picker), time);
            setPicker(null);
          }}
        />
      )}

      {booking && (
        <BookAppointment
          initial={booking}
          appts={appts}
          onClose={() => setBooking(null)}
          onBook={(appointment) => {
            setAppts((previous) => [...previous, appointment]);
            setBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default Appointments;