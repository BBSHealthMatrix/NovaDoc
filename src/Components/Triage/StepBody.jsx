import { createClassNames } from '../../utils/classNames.js';
import { Plus, X } from "lucide-react";

import { PATIENT_FIELDS, newId, OUTCOMES } from "./TriageData.js";

import ItemList from "./ItemList";

import TSelect from "../Shared/Select";

import styles from "./StepBody.module.css";

const cx = createClassNames(styles);

const StepBody = ({ step, patch }) => {
  switch (step.type) {
    case "complaint":
      return (
        <div className={cx("tri-box")}>
          <div className={cx("tri-label")}>About this step</div>
          <p className={cx("tri-box-text")}>
            This step displays the algorithm's presenting complaint to the responder. The step title above is used
            as the display label.
          </p>
        </div>
      );

    case "patient":
      return (
        <div className={cx("tri-box")}>
          <div className={cx("tri-label")}>Fixed Built-in Fields</div>
          <div className={cx("tri-chips")}>
            {PATIENT_FIELDS.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <p className={cx("tri-box-note")}>These fields are always collected in the patient details step.</p>
        </div>
      );

    case "qgroup":
    case "flag":
      return (
        <>
          <div className={cx("tri-label")}>{step.type === "qgroup" ? "Questions (Yes / No)" : "Flag Items (Yes / No)"}</div>
          <ItemList
            items={step.items}
            placeholder={step.type === "qgroup" ? "Add question..." : "Add flag item..."}
            onChange={(items) => patch({ items })}
          />
          <div className={cx("tri-route-grid")}>
            <div>
              <div className={cx("tri-label")}>If any = Yes →</div>
              <TSelect variant="triage" label="Outcome when any answer is yes" options={OUTCOMES} fallbackValue="continue" value={step.yes} onChange={(v) => patch({ yes: v })} />
            </div>
            <div>
              <div className={cx("tri-label")}>If all = No →</div>
              <TSelect variant="triage" label="Outcome when all answers are no" options={OUTCOMES} fallbackValue="continue" value={step.no} onChange={(v) => patch({ no: v })} />
            </div>
          </div>
        </>
      );

    case "character":
      return (
        <>
          <div className={cx("tri-label")}>Checklist Items (Descriptive — No Routing)</div>
          <ItemList items={step.items} placeholder="Add characteristic..." onChange={(items) => patch({ items })} />
        </>
      );

    case "outcome":
      return (
        <>
          <div className={cx("tri-label")}>Outcome Action</div>
          <TSelect variant="triage" label="Outcome action" options={OUTCOMES} fallbackValue="continue" value={step.outcome} onChange={(v) => patch({ outcome: v })} />
        </>
      );

    case "severity": {
      const setBand = (id, p) =>
        patch({ bands: step.bands.map((b) => (b.id === id ? { ...b, ...p } : b)) }, false);
      return (
        <>
          <div className={cx("tri-scale")}>
            <span className={cx("tri-label tri-label-inline")}>Scale Maximum</span>
            <input
              type="number"
              className={cx("tri-inp tri-inp-max")}
              value={step.max}
              onChange={(e) => patch({ max: e.target.value }, false)}
            />
          </div>

          <div className={cx("tri-label")}>Grade Bands</div>
          {step.bands.map((b) => (
            <div key={b.id} className={cx("tri-band")}>
              <label className={cx("tri-swatch")}>
                <span style={{ background: b.color }} />
                <input type="color" value={b.color} onChange={(e) => setBand(b.id, { color: e.target.value })} />
              </label>
              <input
                className={cx("tri-inp tri-band-name")}
                value={b.name}
                onChange={(e) => setBand(b.id, { name: e.target.value })}
              />
              <small>From</small>
              <input
                type="number"
                className={cx("tri-inp tri-band-num")}
                value={b.from}
                onChange={(e) => setBand(b.id, { from: e.target.value })}
              />
              <small>To</small>
              <input
                type="number"
                className={cx("tri-inp tri-band-num")}
                value={b.to}
                onChange={(e) => setBand(b.id, { to: e.target.value })}
              />
              <button
                className={cx("tri-x")}
                title="Remove band"
                onClick={() => patch({ bands: step.bands.filter((x) => x.id !== b.id) })}
              >
                <X size={11} />
              </button>
            </div>
          ))}
          <button
            className={cx("tri-addband")}
            onClick={() =>
              patch({ bands: [...step.bands, { id: newId("b"), name: "New Band", color: "#94a3b8", from: 1, to: 5 }] })
            }
          >
            <Plus size={12} /> Add Band
          </button>
        </>
      );
    }

    default:
      return null;
  }
};

export default StepBody;
