import { classNames as cx } from '../../utils/classNames.js';
import { X } from "lucide-react";
import { slotsFor, weekday, endOf } from "../../data/appointments";
import SlotPickerStyles from "./SlotPicker.module.css";


const SlotPicker = ({ date, doctor, at, onClose, onPick }) => {
  const isValidDate = date instanceof Date && !Number.isNaN(date.getTime());
  const slots = doctor && isValidDate ? (slotsFor(doctor, date) ?? []) : [];

  return (
    <>
      <div
        className={cx(SlotPickerStyles["overlay"], SlotPickerStyles["light"])}
        onClick={onClose}
      />

      <div
        className={SlotPickerStyles["picker"]}
        role="dialog"
        aria-modal="true"
        aria-label="Pick a time slot"
      >
        <div className={SlotPickerStyles["picker-head"]}>
          <div>
            <b>Pick a time slot</b>
            <small>
              {isValidDate
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a valid date"}
            </small>
          </div>

          <button
            type="button"
            className={SlotPickerStyles["icon-only"]}
            onClick={onClose}
            aria-label="Close time slot picker"
          >
            <X size={13} />
          </button>
        </div>

        <div className={SlotPickerStyles["picker-list"]}>
          {!doctor ? (
            <p className={cx(SlotPickerStyles["d-note"], SlotPickerStyles["center"])}>
              Select a doctor to view available slots.
            </p>
          ) : !isValidDate ? (
            <p className={cx(SlotPickerStyles["d-note"], SlotPickerStyles["center"])}>
              Select a valid date to view available slots.
            </p>
          ) : slots.length === 0 ? (
            <p className={cx(SlotPickerStyles["d-note"], SlotPickerStyles["center"])}>
              No slots configured for {weekday(date)}.
            </p>
          ) : null}

          {slots.map((time) => {
            const booked = at(doctor.id, date, time);

            return (
              <button
                key={time}
                type="button"
                className={SlotPickerStyles["picker-row"]}
                disabled={Boolean(booked)}
                onClick={() => onPick(time)}
              >
                <span className={SlotPickerStyles["mono"]}>
                  <b>{time}</b> → <i>{endOf(time)}</i>
                </span>

                <span
                  className={cx(
                    SlotPickerStyles["open-pill"],
                    booked && SlotPickerStyles["booked"],
                  )}
                >
                  {booked ? "Booked" : "Open"}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={SlotPickerStyles["any-time"]}
          disabled={!doctor || !isValidDate}
          onClick={() => onPick("Any time")}
        >
          Book at any time
        </button>
      </div>
    </>
  );
};

export default SlotPicker;
