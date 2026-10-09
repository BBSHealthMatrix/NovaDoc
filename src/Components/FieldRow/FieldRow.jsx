import { classNames as cx } from '../../utils/classNames.js';
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import FieldRowStyles from "./FieldRow.module.css";

const slug = (text) => text.toLowerCase().replace(/\s+/g, "-");

const FieldRow = ({
  fd,
  cond,
  isFirst,
  isLast,
  onUp,
  onDown,
  onReq,
  onOn,
  onDelete,
}) => {
  return (
    <div
      className={cx(
        FieldRowStyles["bif-row"],
        cond && FieldRowStyles["bif-row-cond"],
        !fd.on && FieldRowStyles["bif-row-off"],
      )}
    >
      <div className={FieldRowStyles["bif-move"]}>
        <button
          type="button"
          className={isFirst ? FieldRowStyles["bif-hide"] : undefined}
          onClick={onUp}
          title="Move up"
        >
          <ChevronUp size={10} />
        </button>
        <button
          type="button"
          className={isLast ? FieldRowStyles["bif-hide"] : undefined}
          onClick={onDown}
          title="Move down"
        >
          <ChevronDown size={10} />
        </button>
      </div>

      <div className={FieldRowStyles["bif-main"]}>
        <div className={FieldRowStyles["bif-name"]}>
          <span>{fd.label}</span>
          <em
            className={cx(
              FieldRowStyles["bif-type"],
              FieldRowStyles["bif-t-" + slug(fd.type)],
            )}
          >
            {fd.type}
          </em>
          {cond && <em className={FieldRowStyles["bif-condtag"]}>Conditional</em>}
          {fd.builtIn && <em className={FieldRowStyles["bif-built"]}>Built-in</em>}
        </div>
        {fd.placeholder && <small>Placeholder: {fd.placeholder}</small>}
      </div>

      {!fd.builtIn && (
        <button
          type="button"
          className={FieldRowStyles["bif-del"]}
          onClick={onDelete}
          title="Delete field"
        >
          <Trash2 size={12} />
        </button>
      )}

      <div
        className={cx(
          FieldRowStyles["bif-req"],
          fd.req && FieldRowStyles["bif-req-on"],
        )}
      >
        <button
          type="button"
          className={cx(
            FieldRowStyles["bif-rsw"],
            fd.req && FieldRowStyles["bif-rsw-on"],
          )}
          disabled={!fd.on}
          onClick={onReq}
        />
        <span>Req'd</span>
      </div>

      <button
        type="button"
        className={cx(
          FieldRowStyles["bif-sw"],
          fd.on && FieldRowStyles["bif-sw-on"],
        )}
        onClick={onOn}
      />
    </div>
  );
};

export default FieldRow;
