import { useState } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { BLANK, MODES, ZONES } from "../../data/branches";
import BranchModalStyles from "./BranchModal.module.css";

const today = () =>
  new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

const BranchModal = ({ branch, onClose, onSave }) => {
  const [f, setF] = useState(() => ({ ...(branch || BLANK) }));
  const [tzOpen, setTzOpen] = useState(false);
  const [tried, setTried] = useState(false);
  const appt = f.mode === "appt";

  const set = (key, value) => {
    setF((previous) => ({ ...previous, [key]: value }));
  };

  const save = () => {
    setTried(true);

    if (!f.name.trim() || !f.code.trim() || !f.start || !f.end) {
      return;
    }

    onSave({
      ...f,
      name: f.name.trim(),
      code: f.code.trim().toUpperCase(),
      id: branch ? branch.id : Date.now(),
      created: branch ? branch.created : today(),
    });
  };

  const err = (value) =>
    tried && !String(value).trim() ? BranchModalStyles["br-err"] : "";

  const statusField = (
    <div>
      <label className={BranchModalStyles["br-lbl"]}>Status</label>
      <div className={BranchModalStyles["br-status-row"]}>
        <Toggle
          variant="modal"
          on={f.active}
          onChange={() =>
            setF((previous) => ({ ...previous, active: !previous.active }))
          }
        />
        <span>{f.active ? "Active" : "Inactive"}</span>
      </div>
    </div>
  );

  return (
    <div className={BranchModalStyles["br-overlay"]} onClick={onClose}>
      <div
        className={BranchModalStyles["br-modal"]}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={BranchModalStyles["br-x"]}
          onClick={onClose}
          aria-label="Close branch dialog"
        >
          <X size={14} />
        </button>
        <h3>{branch ? "Edit Branch" : "Add Branch"}</h3>

        <label className={BranchModalStyles["br-lbl"]}>
          Branch Name <i>*</i>
        </label>
        <input
          className={`${BranchModalStyles["br-in"]} ${err(f.name)}`}
          autoFocus
          placeholder="e.g. Main Branch — Lahore"
          value={f.name}
          onChange={(event) => set("name", event.target.value)}
        />

        <div className={BranchModalStyles["br-grid2"]}>
          <div>
            <label className={BranchModalStyles["br-lbl"]}>
              Branch Code <i>*</i>
            </label>
            <input
              className={`${BranchModalStyles["br-in"]} ${BranchModalStyles["br-mono"]} ${err(f.code)}`}
              placeholder="e.g. LHR-MAIN"
              value={f.code}
              onChange={(event) => set("code", event.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className={BranchModalStyles["br-lbl"]}>Timezone</label>
            <div className={BranchModalStyles["br-sel"]}>
              <button
                type="button"
                className={`${BranchModalStyles["br-in"]} ${BranchModalStyles["br-sel-btn"]}`}
                onClick={() => setTzOpen((previous) => !previous)}
                aria-expanded={tzOpen}
              >
                {f.tz} <ChevronDown size={14} />
              </button>
              {tzOpen && (
                <div className={BranchModalStyles["br-sel-list"]}>
                  {ZONES.map((zone) => (
                    <button
                      type="button"
                      key={zone}
                      onClick={() => {
                        set("tz", zone);
                        setTzOpen(false);
                      }}
                    >
                      {zone} {f.tz === zone && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={BranchModalStyles["br-lbl"]}>
              Working Hours — Start <i>*</i>
            </label>
            <input
              type="time"
              className={`${BranchModalStyles["br-in"]} ${err(f.start)}`}
              value={f.start}
              onChange={(event) => set("start", event.target.value)}
            />
          </div>
          <div>
            <label className={BranchModalStyles["br-lbl"]}>
              Working Hours — End <i>*</i>
            </label>
            <input
              type="time"
              className={`${BranchModalStyles["br-in"]} ${err(f.end)}`}
              value={f.end}
              onChange={(event) => set("end", event.target.value)}
            />
          </div>

          {appt ? (
            statusField
          ) : (
            <>
              <div>
                <label className={BranchModalStyles["br-lbl"]}>
                  Token Reset Time
                </label>
                <input
                  type="time"
                  className={BranchModalStyles["br-in"]}
                  value={f.reset}
                  onChange={(event) => set("reset", event.target.value)}
                />
                <small className={BranchModalStyles["br-hint"]}>
                  Tokens reset daily at this time.
                </small>
              </div>
              {statusField}
            </>
          )}
        </div>

        <label className={BranchModalStyles["br-lbl"]}>
          Operational Mode <i>*</i>
        </label>
        <div className={BranchModalStyles["br-modes"]}>
          {Object.entries(MODES).map(([key, mode]) => (
            <button
              type="button"
              key={key}
              className={`${BranchModalStyles["br-mode"]} ${f.mode === key ? BranchModalStyles["br-mode-on"] : ""}`}
              onClick={() => set("mode", key)}
            >
              <b>
                {mode.label} {f.mode === key && <Check size={11} />}
              </b>
              <small>{mode.desc}</small>
            </button>
          ))}
        </div>

        <div className={BranchModalStyles["br-m-btns"]}>
          <button
            type="button"
            className={BranchModalStyles["br-btn-c"]}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={BranchModalStyles["br-btn-b"]}
            onClick={save}
          >
            <Check size={14} /> {branch ? "Save Changes" : "Add Branch"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchModal;
