import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Plus, X, Save, CircleCheck } from "lucide-react";
import { VISIT_COLS, STATUSES, COLOURS, SEED, newCustomVital } from "./VitalSignsData.js";
import styles from "./VitalSigns.module.css";

const cx = createClassNames(styles);

const STATUS_CLASS = { Required: "vs-req", Optional: "vs-opt", Skip: "vs-skip" };

const VitalSigns = () => {
  const [vitals, setVitals] = useState(SEED);
  const [saved, setSaved] = useState(false);

  const patch = (id, fn) => {
    setVitals((vs) => vs.map((v) => (v.id === id ? fn(v) : v)));
    setSaved(false);
  };

  const cycle = (id, col) =>
    patch(id, (v) => {
      const next = STATUSES[(STATUSES.indexOf(v.status[col]) + 1) % STATUSES.length];
      return { ...v, status: { ...v.status, [col]: next } };
    });

  const addCustom = () => {
    setVitals((vs) => [...vs, newCustomVital()]);
    setSaved(false);
  };

  const removeCustom = (id) => {
    setVitals((vs) => vs.filter((v) => v.id !== id));
    setSaved(false);
  };

  return (
    <div className={cx("vs-page")}>
      <h1 className={cx("vs-title")}>Vital Signs Configuration</h1>
      <p className={cx("vs-sub")}>Set which vitals are required per visit type and configure normal reference ranges.</p>
      <p className={cx("vs-hint")}>
        Set each vital as Required, Optional, or Skip per visit type. Enter normal reference ranges — readings outside these limits will be highlighted in the note.
      </p>

      <div className={cx("vs-card")}>
        <div className={cx("vs-row vs-head")}>
          <span />
          <span className={cx("vs-left")}>Vital</span>
          <span>Unit</span>
          {VISIT_COLS.map((c) => <span key={c.key}>{c.label}</span>)}
          <span>Ref Min</span>
          <span>Ref Max</span>
          <span>Colour</span>
          <span />
        </div>

        {vitals.map((v) => (
          <div key={v.id} className={cx("vs-row")}>
            <span className={cx("vs-dot")} style={{ background: v.colour }} />

            {v.custom ? (
              <input
                className={cx("vs-name-in")}
                value={v.name}
                aria-label="Vital name"
                onChange={(e) => patch(v.id, (x) => ({ ...x, name: e.target.value }))}
              />
            ) : (
              <b className={cx("vs-name")}>{v.name}</b>
            )}

            {v.custom ? (
              <input
                className={cx("vs-unit-in")}
                placeholder="unit"
                value={v.unit}
                aria-label="Unit"
                onChange={(e) => patch(v.id, (x) => ({ ...x, unit: e.target.value }))}
              />
            ) : (
              <span className={cx("vs-unit")}>{v.unit}</span>
            )}

            {VISIT_COLS.map((c) => (
              <button
                key={c.key}
                className={cx(`vs-pill ${STATUS_CLASS[v.status[c.key]]}`)}
                title="Click to change"
                onClick={() => cycle(v.id, c.key)}
              >
                {v.status[c.key]}
              </button>
            ))}

            <input
              className={cx("vs-ref")}
              placeholder="—"
              value={v.min}
              aria-label={`${v.name} reference minimum`}
              onChange={(e) => patch(v.id, (x) => ({ ...x, min: e.target.value }))}
            />
            <input
              className={cx("vs-ref")}
              placeholder="—"
              value={v.max}
              aria-label={`${v.name} reference maximum`}
              onChange={(e) => patch(v.id, (x) => ({ ...x, max: e.target.value }))}
            />

            <div className={cx("vs-colours")}>
              {COLOURS.map((col) => (
                <button
                  key={col}
                  className={cx(`vs-swatch ${v.colour === col ? "vs-swatch-on" : ""}`)}
                  style={{ background: col }}
                  aria-label={`Colour ${col}`}
                  onClick={() => patch(v.id, (x) => ({ ...x, colour: col }))}
                />
              ))}
            </div>

            {v.custom ? (
              <button className={cx("vs-remove")} title="Remove vital" onClick={() => removeCustom(v.id)}>
                <X size={12} />
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>

      <button className={cx("vs-add")} onClick={addCustom}>
        <Plus size={12} /> Add Custom Vital
      </button>

      <div className={cx("vs-legend")}>
        <b>Visit type status:</b>
        <span className={cx("vs-pill vs-req vs-pill-static")}>Required</span>
        <span>must always be captured</span>
        <span className={cx("vs-pill vs-opt vs-pill-static")}>Optional</span>
        <span>captured if available</span>
        <span className={cx("vs-pill vs-skip vs-pill-static")}>Skip</span>
        <span>not shown</span>
        <i>Click any cell to cycle through states</i>
      </div>

      <div className={cx("vs-foot")}>
        {saved && <span className={cx("vs-saved")}><CircleCheck size={13} /> Configuration saved</span>}
        <button className={cx("vs-save")} onClick={() => setSaved(true)}>
          <Save size={14} /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default VitalSigns;