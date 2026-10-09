import { classNames as cx } from '../../utils/classNames.js';
import { useState } from "react";
import { ChevronDown, FileText, X, Check } from "lucide-react";
import AddFieldModalStyles from "./AddFieldModal.module.css";

const TYPES = [
  "Text",
  "Number",
  "Dropdown",
  "Checkbox",
  "Radio",
  "Date",
  "Textarea",
  "File Upload",
  "Signature",
];


const AddFieldModal = ({ onClose, onAdd }) => {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("Text");
  const [ph, setPh] = useState("");
  const [req, setReq] = useState(false);
  const [open, setOpen] = useState(false);

  const add = () => {
    if (!label.trim()) return;

    onAdd({
      id: "c" + Date.now(),
      label: label.trim(),
      type,
      placeholder: ph.trim(),
      on: true,
      req,
      builtIn: false,
    });
  };

  return (
    <div className={AddFieldModalStyles["bif-overlay"]} onMouseDown={onClose}>
      <div
        className={AddFieldModalStyles["bif-modal"]}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={AddFieldModalStyles["bif-x"]}
          onClick={onClose}
        >
          <X size={14} />
        </button>

        <div className={AddFieldModalStyles["bif-m-title"]}>
          <FileText size={14} />
          <h3>Add Field</h3>
        </div>

        <div className={AddFieldModalStyles["bif-m-label"]}>Label *</div>
        <input
          className={AddFieldModalStyles["bif-m-inp"]}
          placeholder="Field label..."
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />

        <div className={AddFieldModalStyles["bif-m-label"]}>Type</div>
        <div className={AddFieldModalStyles["bif-sel"]}>
          <button
            type="button"
            className={cx(
              AddFieldModalStyles["bif-sel-btn"],
              open && AddFieldModalStyles["bif-sel-open"],
            )}
            onClick={() => setOpen((previous) => !previous)}
          >
            <span>{type}</span>
            <ChevronDown size={13} />
          </button>

          {open && (
            <>
              <div
                className={AddFieldModalStyles["bif-sel-shield"]}
                onMouseDown={() => setOpen(false)}
              />
              <div className={AddFieldModalStyles["bif-sel-menu"]}>
                {TYPES.map((fieldType) => (
                  <button
                    key={fieldType}
                    type="button"
                    className={cx(
                      AddFieldModalStyles["bif-sel-opt"],
                      fieldType === type && AddFieldModalStyles["bif-sel-cur"],
                    )}
                    onClick={() => {
                      setType(fieldType);
                      setOpen(false);
                    }}
                  >
                    <span>{fieldType}</span>
                    {fieldType === type && <Check size={13} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={AddFieldModalStyles["bif-m-label"]}>Placeholder</div>
        <input
          className={AddFieldModalStyles["bif-m-inp"]}
          placeholder="Placeholder text..."
          value={ph}
          onChange={(event) => setPh(event.target.value)}
        />

        <div className={AddFieldModalStyles["bif-m-req"]}>
          <button
            type="button"
            className={cx(
              AddFieldModalStyles["bif-sw"],
              req && AddFieldModalStyles["bif-sw-on"],
            )}
            onClick={() => setReq((previous) => !previous)}
          />
          <span>Required field</span>
        </div>

        <div className={AddFieldModalStyles["bif-m-foot"]}>
          <button
            type="button"
            className={AddFieldModalStyles["bif-m-cancel"]}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={AddFieldModalStyles["bif-m-add"]}
            disabled={!label.trim()}
            onClick={add}
          >
            <Check size={13} /> Add Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;
