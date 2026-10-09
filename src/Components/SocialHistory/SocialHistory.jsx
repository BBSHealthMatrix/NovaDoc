import { createClassNames } from "../../utils/classNames.js";
import { useRef, useState } from "react";
import { Plus, GripVertical, Trash2, X, Eye } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { Q_TYPES, F_TYPES, CHOICE, SEED, blankQuestion, blankFollowup } from "./SocialHistoryData.js";
import styles from "./SocialHistory.module.css";

const cx = createClassNames(styles);

const SocialHistory = () => {
  const [questions, setQuestions] = useState(SEED);
  const [selId, setSelId] = useState(null);
  const dragFrom = useRef(null);

  const sel = questions.find((q) => q.id === selId);

  const update = (id, patch) => setQuestions((p) => p.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const updateSel = (patch) => update(selId, patch);
  const updateFollow = (fid, patch) =>
    updateSel({ followups: sel.followups.map((f) => (f.id === fid ? { ...f, ...patch } : f)) });

  const addQuestion = () => {
    const q = blankQuestion();
    setQuestions((p) => [...p, q]);
    setSelId(q.id);
  };

  const removeQuestion = () => {
    setQuestions((p) => p.filter((q) => q.id !== selId));
    setSelId(null);
  };

  const dragOver = (e, i) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === i) return;
    setQuestions((p) => {
      const next = [...p];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
    dragFrom.current = i;
  };

  /* editable option list (used by questions and follow-ups) */
  const optionList = (options, onChange, big = false) => {
    const addFrom = (input) => {
      const v = input.value.trim();
      if (v && !options.includes(v)) onChange([...options, v]);
      input.value = "";
    };
    return (
      <div className={cx(`shb-opts ${big ? "shb-opts-big" : ""}`)}>
        {options.map((o, i) => (
          <div className={cx("shb-opt")} key={i}>
            <input value={o} onChange={(e) => onChange(options.map((x, k) => (k === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(options.filter((_, k) => k !== i))} aria-label={`Remove ${o}`}><X size={9} /></button>
          </div>
        ))}
        <div className={cx("shb-opt shb-opt-add")}>
          <input placeholder="Add option..." onKeyDown={(e) => { if (e.key === "Enter") addFrom(e.target); }} />
          <button type="button" onClick={(e) => addFrom(e.currentTarget.previousSibling)} aria-label="Add option"><Plus size={9} /></button>
        </div>
      </div>
    );
  };

  /* preview input for a field/question type */
  const previewInput = (f, multiName) => {
    if (f.type === "Single Dropdown") {
      return (
        <select className={cx("shb-p-select")}>
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    }
    if (f.type === "Multi Dropdown") {
      return (
        <div className={cx("shb-p-checks")}>
          {f.options.map((o) => (
            <label key={o}><input type="checkbox" name={multiName} /> {o}</label>
          ))}
        </div>
      );
    }
    if (f.type === "Number Input") {
      return <input type="number" className={cx("shb-p-num")} placeholder={f.placeholder || "0"} />;
    }
    return <input className={cx("shb-p-text")} placeholder={f.placeholder || "Type..."} />;
  };

  return (
    <div className={cx("shb-wrap")}>
      <h1 className={cx("shb-title")}>Social History Builder</h1>
      <p className={cx("shb-desc")}>Design dynamic social history questions with conditional logic and live preview.</p>

      <div className={cx("shb-grid")}>
        {/* question list */}
        <div>
          <button type="button" className={cx("shb-link")} onClick={addQuestion}><Plus size={11} /> Add Question</button>
          <div className={cx("shb-list")}>
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={cx(`shb-q ${q.id === selId ? "shb-q-on" : ""}`)}
                onClick={() => setSelId(q.id)}
                draggable
                onDragStart={() => { dragFrom.current = i; }}
                onDragOver={(e) => dragOver(e, i)}
                onDragEnd={() => { dragFrom.current = null; }}
              >
                <GripVertical size={10} className={cx("shb-grip")} />
                <span className={cx(`shb-q-name ${q.label.trim() ? "" : "shb-q-empty"}`)}>{q.label.trim() || "Untitled"}</span>
                <span onClick={(e) => e.stopPropagation()}>
                  <Toggle size="compact" color="softBlue" on={q.enabled} onChange={() => update(q.id, { enabled: !q.enabled })} label={`Show ${q.label || "question"}`} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* settings */}
        {!sel ? (
          <div className={cx("shb-none")}>
            <Eye size={32} />
            <p>Select a question to edit</p>
          </div>
        ) : (
          <div className={cx("shb-card")}>
            <div className={cx("shb-card-head")}>
              <span>Question Settings</span>
              <button type="button" onClick={removeQuestion} aria-label="Delete question"><Trash2 size={13} /></button>
            </div>

            <div className={cx("shb-row2")}>
              <label>
                <span className={cx("shb-lbl")}>Question / Label</span>
                <input className={cx("shb-input")} placeholder="e.g. Tobacco / Smoking" value={sel.label} onChange={(e) => updateSel({ label: e.target.value })} />
              </label>
              <label>
                <span className={cx("shb-lbl")}>Display Type</span>
                <select className={cx("shb-input shb-select")} value={sel.type} onChange={(e) => updateSel({ type: e.target.value })}>
                  {Q_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
            </div>

            {sel.type === "Yes/No Radio" && (
              <>
                <div className={cx("shb-fu-head")}>
                  <span>If Yes → Follow-up Fields</span>
                  <button type="button" onClick={() => updateSel({ followups: [...sel.followups, blankFollowup()] })}>
                    <Plus size={10} /> Add Follow-up
                  </button>
                </div>
                {sel.followups.map((f) => (
                  <div className={cx("shb-fu")} key={f.id}>
                    <div className={cx("shb-fu-top")}>
                      <input className={cx("shb-fu-label")} placeholder="Field label..." value={f.label} onChange={(e) => updateFollow(f.id, { label: e.target.value })} />
                      <select className={cx("shb-fu-type")} value={f.type} onChange={(e) => updateFollow(f.id, { type: e.target.value })}>
                        {F_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <button type="button" className={cx("shb-x")} onClick={() => updateSel({ followups: sel.followups.filter((x) => x.id !== f.id) })} aria-label="Remove follow-up">
                        <X size={11} />
                      </button>
                    </div>
                    {CHOICE.includes(f.type)
                      ? optionList(f.options, (options) => updateFollow(f.id, { options }))
                      : <input className={cx("shb-fu-label shb-fu-ph")} placeholder="Placeholder..." value={f.placeholder} onChange={(e) => updateFollow(f.id, { placeholder: e.target.value })} />}
                  </div>
                ))}
              </>
            )}

            {CHOICE.includes(sel.type) && (
              <>
                <span className={cx("shb-lbl shb-lbl-gap")}>Options</span>
                {optionList(sel.options, (options) => updateSel({ options }), true)}
              </>
            )}

            {(sel.type === "Number Input" || sel.type === "Text Input") && (
              <label>
                <span className={cx("shb-lbl shb-lbl-gap")}>Placeholder</span>
                <input className={cx("shb-input")} placeholder="Placeholder..." value={sel.placeholder} onChange={(e) => updateSel({ placeholder: e.target.value })} />
              </label>
            )}
          </div>
        )}

        {/* preview */}
        <aside className={cx("shb-prev")}>
          <div className={cx("shb-prev-head")}><Eye size={11} /> Preview</div>
          {questions.filter((q) => q.enabled).map((q) => (
            <div className={cx("shb-p-q")} key={q.id}>
              <p className={cx("shb-p-label")}>{q.label.trim() || "Untitled Question"}</p>
              {q.type === "Yes/No Radio" ? (
                <>
                  <div className={cx("shb-p-radios")}>
                    <label><input type="radio" name={q.id} /> Yes</label>
                    <label><input type="radio" name={q.id} /> No</label>
                  </div>
                  {q.followups.length > 0 && (
                    <div className={cx("shb-p-if")}>
                      <span className={cx("shb-p-if-lbl")}>If Yes...</span>
                      {q.followups.map((f) => (
                        <div className={cx("shb-p-fu")} key={f.id}>
                          {f.label.trim() && <p className={cx("shb-p-fu-label")}>{f.label}</p>}
                          {previewInput(f, f.id)}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={cx("shb-p-own")}>{previewInput(q, q.id)}</div>
              )}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default SocialHistory;