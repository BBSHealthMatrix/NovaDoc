import { classNames as cx } from '../../utils/classNames.js';
import { useState } from "react";
import {
  Search,
  UserPlus,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { DOCTORS, SPECIALTIES, TYPES, slotsFor, weekday } from "../../data/appointments";
import RegisterPatient from "../RegisterPatient/RegisterPatient";
import Field from "../Field/Field";
import StylingBook from "./BookAppointment.module.css";
import Drawer from "../Drawer/Drawer";
import DrawerHeader from "../DrawerHeader/DrawerHeader";
import DrawerBody from "../DrawerBody/DrawerBody";
import DrawerFooter from "../DrawerFooter/DrawerFooter";
import FormGrid from "../FormGrid/FormGrid";

const ANY_TIME = "Any time";

const toDateInput = (value) => {
  if (!(value instanceof Date)) {
    return typeof value === "string" ? value : "";
  }

  if (Number.isNaN(value.getTime())) return "";

  const year = String(value.getFullYear()).padStart(4, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const BookAppointment = ({ initial = {}, appts = [], onClose, onBook }) => {
  const [wide, setWide] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [f, setF] = useState(() => {
    const initialDoctor =
      DOCTORS.find(
        (doctor) =>
          initial.doctorId != null &&
          String(doctor.id) === String(initial.doctorId),
      ) || DOCTORS[0];

    return {
      patient: "",
      doctorId: initialDoctor?.id ?? "",
      type: TYPES.includes("Consultation") ? "Consultation" : (TYPES[0] ?? ""),
      date: toDateInput(initial.date),
      time: initial.time ?? "",
      priority: "Routine",
      contagious: false,
      consent: false,
      repeat: false,
      comments: "",
    };
  });

  const setField = (key, value) => {
    setF((previous) => ({ ...previous, [key]: value }));
  };

  const toggleWide = () => setWide((previous) => !previous);
  const doctor = DOCTORS.find((item) => item.id === f.doctorId);
  const dateObj = f.date ? new Date(`${f.date}T00:00:00`) : null;
  const isValidDate = Boolean(
    dateObj &&
      !Number.isNaN(dateObj.getTime()) &&
      toDateInput(dateObj) === f.date,
  );

  const configuredSlots =
    doctor && isValidDate ? (slotsFor(doctor, dateObj) ?? []) : [];

  const free = configuredSlots.filter(
    (time) =>
      !appts.some(
        (appointment) =>
          appointment.doctorId === doctor.id &&
          appointment.date === f.date &&
          appointment.time === time,
      ),
  );

  const canBook = Boolean(
    f.patient.trim() &&
      doctor &&
      isValidDate &&
      TYPES.includes(f.type) &&
      (f.time === ANY_TIME || free.includes(f.time)),
  );

  const changeSpecialty = (specialty) => {
    const nextDoctor = DOCTORS.find((item) => item.specialty === specialty);
    if (!nextDoctor) return;

    setF((previous) => ({
      ...previous,
      doctorId: nextDoctor.id,
      time: "",
    }));
  };

  const changeDoctor = (value) => {
    const nextDoctor = DOCTORS.find((item) => String(item.id) === value);
    if (!nextDoctor) return;

    setF((previous) => ({
      ...previous,
      doctorId: nextDoctor.id,
      time: "",
    }));
  };

  const changeDate = (date) => {
    setF((previous) => ({ ...previous, date, time: "" }));
  };

  const handleBook = () => {
    if (!canBook) return;

    onBook({
      ...f,
      patient: f.patient.trim(),
      id: Date.now(),
    });
  };

  return (
    <Drawer wide={wide} onClose={onClose} label={registering ? "Register patient" : "Book appointment"}>
        {registering ? (
          <RegisterPatient
            onBack={() => setRegistering(false)}
            onClose={onClose}
            onDone={(name) => {
              setField("patient", name);
              setRegistering(false);
            }}
            wide={wide}
            onToggleWide={toggleWide}
          />
        ) : (
          <>
            <DrawerHeader
              title="Book Appointment"
              subtitle="Fill in the details below"
              onClose={onClose}
              wide={wide}
              onToggleWide={toggleWide}
            />

            <DrawerBody>
              <p className={StylingBook["d-label"]}>Patient</p>

              <div className={StylingBook["row"]}>
                <label className={cx(StylingBook["search"], StylingBook["grow"])}>
                  <Search size={13} />
                  <input
                    value={f.patient}
                    onChange={(event) => setField("patient", event.target.value)}
                    placeholder="Search by name, MRN, or phone..."
                    aria-label="Patient"
                  />
                </label>

                <button
                  type="button"
                  className={cx(StylingBook["btn-blue"], StylingBook["big"])}
                  onClick={() => setRegistering(true)}
                >
                  <UserPlus size={13} /> Register Patient
                </button>
              </div>

              <hr />
              <p className={StylingBook["d-label"]}>Appointment Details</p>

              <FormGrid>
                <Field label="Specialty">
                  <select
                    value={doctor?.specialty ?? ""}
                    onChange={(event) => changeSpecialty(event.target.value)}
                    disabled={DOCTORS.length === 0}
                  >
                    {!doctor && <option value="">Select a specialty</option>}
                    {SPECIALTIES.map((specialty) => (
                      <option
                        key={specialty}
                        value={specialty}
                        disabled={!DOCTORS.some((item) => item.specialty === specialty)}
                      >
                        {specialty}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Doctor">
                  <select
                    value={f.doctorId}
                    onChange={(event) => changeDoctor(event.target.value)}
                    disabled={!doctor}
                  >
                    {!doctor && <option value="">No doctors available</option>}
                    {DOCTORS.filter((item) => item.specialty === doctor?.specialty).map(
                      (item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ),
                    )}
                  </select>
                </Field>

                <Field label="Appointment Type">
                  <select
                    value={f.type}
                    onChange={(event) => setField("type", event.target.value)}
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Date">
                  <input
                    type="date"
                    value={f.date}
                    onChange={(event) => changeDate(event.target.value)}
                  />
                </Field>
              </FormGrid>

              <p className={StylingBook["d-sub"]}>Time Slot</p>

              {!doctor ? (
                <p className={StylingBook["d-note"]}>
                  Select a doctor to view available time slots.
                </p>
              ) : !isValidDate ? (
                <p className={StylingBook["d-note"]}>
                  Select a valid date to view available time slots.
                </p>
              ) : f.time === ANY_TIME ? (
                <p className={StylingBook["d-note"]}>
                  Booking at any time on this day.
                </p>
              ) : configuredSlots.length === 0 ? (
                <p className={StylingBook["d-note"]}>
                  No slots configured for {weekday(dateObj)}.
                </p>
              ) : free.length === 0 ? (
                <p className={StylingBook["d-note"]}>
                  All time slots are booked for this day.
                </p>
              ) : (
                <div className={StylingBook["slot-grid"]}>
                  {free.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={f.time === time ? StylingBook["on"] : undefined}
                      onClick={() => setField("time", time)}
                      aria-pressed={f.time === time}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              <hr />
              <p className={StylingBook["d-label"]}>Priority</p>

              <div className={StylingBook["prio"]}>
                {[
                  ["Routine", null],
                  ["Urgent", TriangleAlert],
                  ["Emergency", CircleAlert],
                ].map(([priority, Icon]) => (
                  <button
                    key={priority}
                    type="button"
                    className={cx(
                      f.priority === priority && StylingBook["on"],
                      f.priority === priority && StylingBook[priority.toLowerCase()],
                    )}
                    onClick={() => setField("priority", priority)}
                    aria-pressed={f.priority === priority}
                  >
                    {Icon && <Icon size={11} />} {priority}
                  </button>
                ))}
              </div>

              {[
                ["contagious", "Contagious Disease"],
                ["consent", "Consent"],
                ["repeat", "Repeat Appointment"],
              ].map(([key, label]) => (
                <div key={key} className={StylingBook["d-toggle"]}>
                  <span className={StylingBook["d-label"]}>{label}</span>

                  <label className={StylingBook["toggle"]}>
                    <small>{f[key] ? "Yes" : "No"}</small>
                    <input
                      type="checkbox"
                      checked={f[key]}
                      onChange={(event) => setField(key, event.target.checked)}
                      aria-label={label}
                    />
                    <span className={StylingBook["track"]} />
                  </label>
                </div>
              ))}

              <p className={StylingBook["d-label"]}>Comments</p>
              <textarea
                value={f.comments}
                onChange={(event) => setField("comments", event.target.value)}
                placeholder="Any additional notes..."
                aria-label="Comments"
              />
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                className={StylingBook["btn-cancel"]}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className={StylingBook["btn-book"]}
                disabled={!canBook}
                onClick={handleBook}
              >
                <CircleCheck size={13} /> Book Appointment
              </button>
            </DrawerFooter>
          </>
        )}
    </Drawer>
  );
};

export default BookAppointment;
