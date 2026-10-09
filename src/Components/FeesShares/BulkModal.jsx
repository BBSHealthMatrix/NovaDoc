import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X } from "lucide-react";

import { num, TYPE_OPTS, SVC_MAP } from "./FeesSharesData.js";

import FeeSelect from "../Shared/Select";

import styles from "./BulkModal.module.css";

const cx = createClassNames(styles);

const BulkModal = ({ rows, onClose, onApply }) => {
  const [applyTo, setApplyTo] = useState("all");
  const [svcType, setSvcType] = useState("");
  const [shareMode, setShareMode] = useState("%");
  const [amount, setAmount] = useState("");
  const [adjust, setAdjust] = useState(false);
  const [adjMode, setAdjMode] = useState("%");
  const [adjVal, setAdjVal] = useState("");

  const selCount = rows.filter((r) => r.sel).length;
  const applyOpts = [
    { v: "all", label: "All Assigned Services" },
    { v: "type", label: "By Service Type" },
    { v: "selected", label: `Selected Only (${selCount})`, disabled: selCount === 0 },
  ];

  const canApply =
    (amount !== "" || (adjust && adjVal !== "")) &&
    (applyTo !== "type" || svcType) &&
    (applyTo !== "selected" || selCount > 0);

  const apply = () => {
    const hit = (r) =>
      applyTo === "all" ||
      (applyTo === "type" && SVC_MAP[r.id].type === svcType) ||
      (applyTo === "selected" && r.sel);

    onApply(
      rows.map((r) => {
        if (!hit(r)) return r;
        const n = { ...r };
        if (amount !== "") {
          n.shareType = shareMode;
          n.shareVal = amount;
        }
        if (adjust && adjVal !== "") {
          const base = SVC_MAP[r.id].price;
          const v = num(adjVal);
          n.useBase = false;
          n.adjusted = String(Math.round(adjMode === "%" ? base * (1 + v / 100) : base + v));
        }
        return n;
      })
    );
  };

  return (
    <div className={cx("fee-overlay")} onMouseDown={onClose}>
      <div className={cx("fee-modal fee-modal-bulk")} onMouseDown={(e) => e.stopPropagation()}>
        <button className={cx("fee-x")} onClick={onClose}><X size={14} /></button>
        <h3 className={cx("fee-m-title")}>Bulk Update Services</h3>

        <div className={cx("fee-b-label")}>Apply To</div>
        <FeeSelect variant="fee" label="Apply to" value={applyTo} options={applyOpts} onChange={setApplyTo} />

        {applyTo === "type" && (
          <>
            <div className={cx("fee-b-label")}>Service Type</div>
            <FeeSelect
              variant="fee"
              value={svcType}
              options={TYPE_OPTS}
              placeholder="Select type..."
              onChange={setSvcType}
            />
          </>
        )}

        <div className={cx("fee-b-box")}>
          <div className={cx("fee-b-boxlabel")}>Set Doctor Share</div>
          <div className={cx("fee-b-line")}>
            <div className={cx("fee-b-seg")}>
              <button className={cx(shareMode === "%" ? "fee-b-on" : "")} onClick={() => setShareMode("%")}>%</button>
              <button className={cx(shareMode === "Rs" ? "fee-b-on" : "")} onClick={() => setShareMode("Rs")}>Rs.</button>
            </div>
            <input
              type="number"
              className={cx("fee-b-inp fee-nospin")}
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className={cx("fee-b-box")}>
          <div className={cx("fee-b-row")}>
            <span className={cx("fee-b-boxlabel fee-b-nomb")}>Adjust Prices</span>
            <button
              className={cx("fee-sw" + (adjust ? " fee-sw-on" : ""))}
              onClick={() => setAdjust((a) => !a)}
            />
          </div>
          {adjust && (
            <div className={cx("fee-b-line fee-b-mt")}>
              <div className={cx("fee-b-seg")}>
                <button className={cx(adjMode === "%" ? "fee-b-on" : "")} onClick={() => setAdjMode("%")}>
                  % increase
                </button>
                <button className={cx(adjMode === "Rs" ? "fee-b-on" : "")} onClick={() => setAdjMode("Rs")}>
                  Rs. increase
                </button>
              </div>
              <input
                type="number"
                autoFocus
                className={cx("fee-b-inp")}
                placeholder="Value"
                value={adjVal}
                onChange={(e) => setAdjVal(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className={cx("fee-b-foot")}>
          <button className={cx("fee-b-cancel")} onClick={onClose}>Cancel</button>
          <button className={cx("fee-b-apply")} disabled={!canApply} onClick={apply}>
            Apply Bulk Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkModal;
