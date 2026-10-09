import { createClassNames } from "../../utils/classNames.js";
import { Fragment, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, FlaskConical, Info, Plus, RotateCcw, Trash2, Zap } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import {
  EVENTS, ACTIONS, SERVICE_TYPES, STATUSES, SAVE_AS, FIELDS, OPERATORS,
  COUNTERS, AFTER_STEP, RULES, BLANK_CONDITION, BLANK_STEP, BLANK_RULE,
} from "./RoutingRulesData.js";
import styles from "./RoutingRules.module.css";

const cx = createClassNames(styles);

const STATUS_CLASS = { Active: "rr-c-green", Inactive: "rr-c-gray", Draft: "rr-c-amber" };

// event options carry a second description line in the menu
const EVENT_OPTIONS = EVENTS.map((e) => ({
  value: e.value,
  label: (
    <span className={cx("rr-evopt")}>
      <b>{e.value}</b>
      <small>{e.desc}</small>
    </span>
  ),
}));

const RoutingRules = () => {
  const [rules, setRules] = useState(RULES);
  const [activeId, setActiveId] = useState(RULES[0].id);
  const [saveAs, setSaveAs] = useState("Active");

  const rule = rules.find((r) => r.id === activeId) ?? rules[0];

  const update = (patch) => setRules((p) => p.map((r) => (r.id === rule.id ? { ...r, ...patch } : r)));

  // conditions
  const setCond = (id, patch) => update({ conditions: rule.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const setField = (c, field) => setCond(c.id, { field, values: [] });
  const setOp = (c, op) => setCond(c.id, { op, values: op === "equals" ? c.values.slice(0, 1) : c.values });
  const pickValue = (c, v) => {
    if (c.op === "equals") return setCond(c.id, { values: [v] });
    setCond(c.id, { values: c.values.includes(v) ? c.values.filter((x) => x !== v) : [...c.values, v] });
  };
  const addCond = () => update({ conditions: [...rule.conditions, { ...BLANK_CONDITION, id: Date.now() }] });
  const removeCond = (id) => update({ conditions: rule.conditions.filter((c) => c.id !== id) });

  // steps
  const setStep = (id, patch) => update({ steps: rule.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const addStep = () => update({ steps: [...rule.steps, { ...BLANK_STEP, id: Date.now() }] });
  const removeStep = (id) => update({ steps: rule.steps.filter((s) => s.id !== id) });
  const moveStep = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= rule.steps.length) return;
    const steps = [...rule.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    update({ steps });
  };

  const addRule = () => {
    const id = Date.now();
    setRules((p) => [...p, { ...BLANK_RULE, id }]);
    setActiveId(id);
  };

  const lastStep = rule.steps[rule.steps.length - 1];
  const afterName = rule.recallAfter === "auto" ? lastStep?.label || lastStep?.counter || "the last step" : rule.recallAfter;

  const stepChips = (r) =>
    r.steps.map((s, i) => (
      <Fragment key={s.id}>
        {i > 0 && <i className={cx("rr-arrow")}>→</i>}
        <span className={cx(`rr-chip ${s.payment ? "rr-c-amber" : "rr-c-green"}`)}>{s.label || s.counter}</span>
      </Fragment>
    ));

  return (
    <div className={cx("rr-wrap")}>
      <div className={cx("rr-head")}>
        <div>
          <h1 className={cx("rr-title")}>Queue Routing Rules</h1>
          <p className={cx("rr-desc")}>Define trigger-based rules that automatically route patients through the correct queue path.</p>
        </div>
        <button type="button" className={cx("rr-btn rr-new")} onClick={addRule}>
          <Plus size={14} /> New Rule
        </button>
      </div>

      <div className={cx("rr-grid")}>
        {/* ── rule list ── */}
        <div className={cx("rr-list")}>
          {rules.map((r, i) => (
            <button type="button" key={r.id} className={cx(`rr-item ${r.id === rule.id ? "rr-item-on" : ""}`)} onClick={() => setActiveId(r.id)}>
              <div className={cx("rr-item-head")}>
                <span className={cx("rr-num")}>{i + 1}</span>
                <p className={cx("rr-item-title")}>{r.name}</p>
              </div>
              <div className={cx("rr-chips")}>
                <span className={cx(`rr-chip ${STATUS_CLASS[r.status]}`)}><i className={cx("rr-dot")} />{r.status}</span>
                <span className={cx("rr-chip rr-c-purple rr-caps")}><Zap size={8} />{r.event}</span>
                <span className={cx("rr-chip rr-c-blue")}><FlaskConical size={8} />{r.service}</span>
              </div>
              {(r.steps.length > 0 || r.recall) && (
                <div className={cx("rr-chips")}>
                  {stepChips(r)}
                  {r.recall && (
                    <>
                      {r.steps.length > 0 && <i className={cx("rr-arrow")}>→</i>}
                      <span className={cx("rr-chip rr-c-red")}><RotateCcw size={8} />Recall</span>
                    </>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── rule editor ── */}
        <div className={cx("rr-detail")}>
          {/* summary */}
          <div className={cx("rr-card rr-sum")}>
            <div className={cx("rr-sum-head")}>
              <span className={cx("rr-num rr-num-lg")}>{rules.indexOf(rule) + 1}</span>
              <h2 className={cx("rr-sum-title")}>{rule.name}</h2>
              <div className={cx("rr-sel rr-xs rr-status")}>
                <Select value={rule.status} options={STATUSES} onChange={(v) => update({ status: v })} label="Rule status" />
              </div>
            </div>
            <textarea className={cx("rr-textarea")} value={rule.desc} onChange={(e) => update({ desc: e.target.value })} aria-label="Rule description" />
            <div className={cx("rr-chips rr-chips-lg")}>
              <span className={cx("rr-chip rr-c-purple rr-caps")}><Zap size={9} />{rule.event}</span>
              <i className={cx("rr-arrow")}>→</i>
              <span className={cx("rr-chip rr-c-blue")}>{rule.service}</span>
              {rule.steps.length > 0 && <i className={cx("rr-arrow")}>→</i>}
              {stepChips(rule)}
              {rule.recall && (
                <>
                  <i className={cx("rr-arrow")}>→</i>
                  <span className={cx("rr-chip rr-c-red")}><RotateCcw size={9} />Recall → {rule.recallTo}</span>
                </>
              )}
            </div>
          </div>

          {/* 1 · trigger */}
          <div className={cx("rr-card")}>
            <div className={cx("rr-shead rr-h-purple")}><Zap size={14} />1 · Trigger</div>
            <div className={cx("rr-body rr-trigger")}>
              <div>
                <p className={cx("rr-label")}>Event</p>
                <div className={cx("rr-sel rr-event")}>
                  <Select value={rule.event} options={EVENT_OPTIONS} onChange={(v) => update({ event: v })} label="Event" />
                </div>
              </div>
              <div>
                <p className={cx("rr-label")}>Action Type</p>
                <div className={cx("rr-sel")}>
                  <Select value={rule.action} options={ACTIONS} onChange={(v) => update({ action: v })} label="Action type" />
                </div>
              </div>
              <div>
                <p className={cx("rr-label")}>Service Type (Order Type)</p>
                <div className={cx("rr-sel rr-menu-up")}>
                  <Select value={rule.service} options={SERVICE_TYPES} onChange={(v) => update({ service: v })} label="Service type" />
                </div>
                <p className={cx("rr-help")}>
                  Matches the service type of the doctor's order. Service types are managed under <span>Billing &amp; Pricing → Service Types</span>.
                </p>
              </div>
            </div>
          </div>

          {/* 2 · conditions */}
          <div className={cx("rr-card")}>
            <div className={cx("rr-shead rr-h-blue")}><Info size={14} />2 · Conditions (Optional)</div>
            <div className={cx("rr-body")}>
              <div className={cx("rr-match")}>
                <span>Match</span>
                <div className={cx("rr-seg")}>
                  {["AND", "OR"].map((m) => (
                    <button type="button" key={m} className={cx(rule.match === m ? "rr-seg-on" : "")} onClick={() => update({ match: m })}>{m}</button>
                  ))}
                </div>
                <em>of the following conditions</em>
              </div>

              <div className={cx("rr-conds")}>
                {rule.conditions.map((c, i) => (
                  <div className={cx("rr-cond")} key={c.id}>
                    <span className={cx(`rr-cond-tag ${i > 0 ? "rr-cond-and" : ""}`)}>{i === 0 ? "IF" : rule.match}</span>
                    <div className={cx("rr-sel rr-sm rr-field")}>
                      <Select value={c.field} options={Object.keys(FIELDS)} onChange={(v) => setField(c, v)} label="Condition field" />
                    </div>
                    <div className={cx("rr-sel rr-sm rr-op")}>
                      <Select value={c.op} options={OPERATORS} onChange={(v) => setOp(c, v)} label="Condition operator" />
                    </div>
                    <div className={cx("rr-values")}>
                      {FIELDS[c.field].map((v) => (
                        <button type="button" key={v} className={cx(`rr-pill ${c.values.includes(v) ? "rr-pill-on" : ""}`)} onClick={() => pickValue(c, v)}>{v}</button>
                      ))}
                    </div>
                    <button type="button" className={cx("rr-trash")} onClick={() => removeCond(c.id)} aria-label="Remove condition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className={cx("rr-dashed")} onClick={addCond}><Plus size={12} /> Add Condition</button>
            </div>
          </div>

          {/* 3 · destination */}
          <div className={cx("rr-card")}>
            <div className={cx("rr-shead rr-h-green")}><ArrowRight size={14} />3 · Destination Queue Path</div>
            <div className={cx("rr-body")}>
              <p className={cx("rr-note-text")}>Define the ordered steps the patient will be routed through. Steps are executed in sequence — top to bottom.</p>

              <div className={cx("rr-steps")}>
                {rule.steps.map((s, i) => (
                  <div className={cx("rr-step")} key={s.id}>
                    <span className={cx(`rr-snum ${s.payment ? "rr-snum-pay" : ""}`)}>{i + 1}</span>
                    <div className={cx(`rr-sbox ${s.payment ? "rr-sbox-pay" : ""}`)}>
                      <span className={cx("rr-flabel")}>Route to</span>
                      <div className={cx("rr-sel rr-sm rr-route")}>
                        <Select value={s.counter} options={COUNTERS} onChange={(v) => setStep(s.id, { counter: v, label: v })} label="Route to" />
                      </div>
                      <span className={cx("rr-flabel rr-flabel-gap")}>Label</span>
                      <input className={cx("rr-input")} value={s.label} onChange={(e) => setStep(s.id, { label: e.target.value })} aria-label="Step label" />

                      <div className={cx("rr-tgl rr-tgl-first")}>
                        <Toggle size="small" color="amber" className={cx("rr-tg rr-tg-pay")} on={s.payment}
                          onChange={() => setStep(s.id, { payment: !s.payment, invoice: s.payment ? false : s.invoice })} label="Payment Step" />
                        <span>Payment Step</span>
                      </div>
                      {s.payment && (
                        <div className={cx("rr-tgl")}>
                          <Toggle size="small" color="softBlue" className={cx("rr-tg")} on={s.invoice} onChange={() => setStep(s.id, { invoice: !s.invoice })} label="Auto-Generate Invoice" />
                          <span>Auto-Generate Invoice</span>
                        </div>
                      )}
                      <div className={cx("rr-tgl")}>
                        <Toggle size="small" color="softBlue" className={cx("rr-tg")} on={s.skip} onChange={() => setStep(s.id, { skip: !s.skip })} label="Allow Skip" />
                        <span>Allow Skip</span>
                      </div>

                      {s.payment && s.invoice && (
                        <div className={cx("rr-invoice")}>
                          <Info size={11} />
                          <p>Invoice will be auto-generated with all ordered items and their prices from Service Pricing. The billing counter agent will see the full item list for this token.</p>
                        </div>
                      )}
                    </div>
                    <div className={cx("rr-sctl")}>
                      <button type="button" onClick={() => moveStep(i, -1)} aria-label="Move step up"><ChevronUp size={11} /></button>
                      <button type="button" onClick={() => moveStep(i, 1)} aria-label="Move step down"><ChevronDown size={11} /></button>
                      <button type="button" onClick={() => removeStep(s.id)} aria-label="Remove step"><Trash2 size={10} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {rule.steps.length > 1 && <p className={cx("rr-flow")}>patient moves to next step after completing previous</p>}

              <button type="button" className={cx("rr-dashed")} onClick={addStep}><Plus size={12} /> Add Step</button>
            </div>
          </div>

          {/* 4 · recall */}
          <div className={cx("rr-card")}>
            <div className={cx("rr-shead rr-h-red")}><RotateCcw size={14} />4 · Recall After Completion</div>
            <div className={cx("rr-body")}>
              <div className={cx("rr-rhead")}>
                <Toggle size="large" color="softBlue" className={cx("rr-tg rr-tg-red")} on={rule.recall} onChange={() => update({ recall: !rule.recall })} label="Enable Recall" />
                <div>
                  <p className={cx("rr-rtitle")}>Enable Recall</p>
                  <p className={cx("rr-rdesc")}>After the final destination step completes, automatically recall the patient back to a specific counter.</p>
                </div>
              </div>

              {rule.recall && (
                <div className={cx("rr-rblock")}>
                  <div className={cx("rr-rgrid")}>
                    <div>
                      <p className={cx("rr-label rr-label-b")}>After This Step Completes</p>
                      <div className={cx("rr-sel")}>
                        <Select value={rule.recallAfter} options={AFTER_STEP} onChange={(v) => update({ recallAfter: v })} label="After this step completes" />
                      </div>
                      <p className={cx("rr-help")}>Recall triggers when the patient finishes this counter type step.</p>
                    </div>
                    <div>
                      <p className={cx("rr-label rr-label-b")}>Recall Patient To</p>
                      <div className={cx("rr-sel")}>
                        <Select value={rule.recallTo} options={COUNTERS} onChange={(v) => update({ recallTo: v })} label="Recall patient to" />
                      </div>
                      <p className={cx("rr-help")}>The patient's token will re-enter the queue at this counter type.</p>
                    </div>
                  </div>
                  <div className={cx("rr-rnote")}>
                    <RotateCcw size={13} />
                    <p>After completing <b>{afterName}</b>, the patient will be automatically recalled to the <b>{rule.recallTo}</b> queue — preserving their original token.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* footer */}
          <div className={cx("rr-card rr-foot")}>
            <p>Changes are saved to local state. In production, rules are evaluated in priority order — highest priority (1) first.</p>
            <div className={cx("rr-sel rr-sm rr-saveas rr-menu-up")}>
              <Select value={saveAs} options={SAVE_AS} onChange={setSaveAs} label="Save as" />
            </div>
            <button type="button" className={cx("rr-btn rr-save")} onClick={() => update({ status: saveAs })}>Save Rule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutingRules;