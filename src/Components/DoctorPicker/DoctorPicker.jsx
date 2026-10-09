import { useState, useEffect, useRef } from "react";
import { Stethoscope, ChevronDown, Check } from "lucide-react";
import { DOCTORS, SPECIALTIES } from "../../data/appointments";
import StylingApp from "./DoctorPicker.module.css";

const DoctorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = DOCTORS.find((doctor) => doctor.id === value);

  return (
    <div className={StylingApp["doc-picker"]} ref={ref}>
      <button
        type="button"
        className={StylingApp["doc-picker-btn"]}
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
      >
        <Stethoscope size={12} />
        <span>{current?.name ?? "Select doctor"}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className={StylingApp["doc-menu"]}>
          {SPECIALTIES.map((specialty) => (
            <div key={specialty}>
              <p className={StylingApp["doc-menu-title"]}>{specialty}</p>

              {DOCTORS.filter((doctor) => doctor.specialty === specialty).map(
                (doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    className={StylingApp["doc-menu-item"]}
                    onClick={() => {
                      onChange(doctor.id);
                      setOpen(false);
                    }}
                  >
                    <span>
                      <b>{doctor.name}</b>
                      {doctor.sub && <small>{doctor.sub}</small>}
                    </span>
                    {doctor.id === value && <Check size={12} />}
                  </button>
                ),
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPicker;