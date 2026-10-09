import { createClassNames } from "../../utils/classNames.js";
import { useEffect, useState } from "react";
import { Plus, Eye, Trash2, Monitor, Volume2, X } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import Select from "../Shared/Select";
import {
  SCREEN_TYPES, COUNTERS, THEMES, ELEMENTS, FORMATS, NOW_SERVING, IN_QUEUE, SCREENS, BLANK,
} from "./DisplaySettingsData.js";
import styles from "./DisplaySettings.module.css";

const cx = createClassNames(styles);

const token = (n) => `C${String(n).padStart(3, "0")}`;
const clockText = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const DisplaySettings = () => {
  const [screens, setScreens] = useState(SCREENS);
  const [selId, setSelId] = useState(SCREENS[0].id);
  const [full, setFull] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // keep the preview clock current
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Escape closes the full preview
  useEffect(() => {
    if (!full) return;
    const onKey = (e) => { if (e.key === "Escape") setFull(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [full]);

  const sel = screens.find((s) => s.id === selId) || screens[0];
  const update = (patch) => setScreens((p) => p.map((s) => (s.id === sel.id ? { ...s, ...patch } : s)));
  const setEl = (key) => update({ elements: { ...sel.elements, [key]: !sel.elements[key] } });

  const addScreen = () => {
    const s = { ...BLANK, elements: { ...BLANK.elements }, id: Date.now() };
    setScreens((p) => [...p, s]);
    setSelId(s.id);
  };

  const remove = (id) => {
    const rest = screens.filter((s) => s.id !== id);
    setScreens(rest);
    if (id === selId && rest.length) setSelId(rest[0].id);
  };

  // the patient-facing screen, used for the live preview and the full preview
  const renderScreen = (s, big) => {
    const recent = Array.from({ length: Math.min(Math.max(parseInt(s.showLast, 10) || 0, 0), 10) }, (_, i) => token(NOW_SERVING - 1 - i));
    return (
      <div className={cx(`ds-screen ds-${s.theme.toLowerCase()} ${big ? "ds-big" : ""}`)}>
        <div className={cx("ds-top")}>
          <span>{s.name}</span>
          <span className={cx("ds-topr")}>
            {s.elements.sound && <Volume2 size={big ? 16 : 11} />}
            {s.elements.clock && clockText(now)}
          </span>
        </div>
        <div className={cx("ds-center")}>
          <p className={cx("ds-ns")}>Now Serving</p>
          <div className={cx("ds-box")}>
            <span className={cx("ds-tok")}>{s.elements.token ? token(NOW_SERVING) : "—"}</span>
            {s.elements.counterName && s.format === "Token + Counter" && <span className={cx("ds-cnt")}>{s.counter}</span>}
          </div>
          {s.elements.queueCount && <p className={cx("ds-queue")}>{IN_QUEUE} patients in queue</p>}
        </div>
        {recent.length > 0 && (
          <div className={cx("ds-recent")}>
            <p>Recently Called</p>
            <div className={cx("ds-chips")}>
              {recent.map((r) => <span key={r}>{r}</span>)}
            </div>
          </div>
        )}
        {s.ticker.trim() && <div className={cx("ds-ticker")}>📢 {s.ticker}</div>}
      </div>
    );
  };

  return (
    <div className={cx("ds-page")}>
      <div className={cx("ds-head")}>
        <div>
          <h1 className={cx("ds-title")}>Display Settings</h1>
          <p className={cx("ds-desc")}>Design and configure patient-facing display screens for counters, lobbies, and doctor rooms.</p>
        </div>
        <button type="button" className={cx("ds-new")} onClick={addScreen}><Plus size={14} /> New Screen</button>
      </div>

      <div className={cx("ds-body")}>
        {/* screens list */}
        <div className={cx("ds-list")}>
          {screens.map((s) => (
            <div
              key={s.id}
              className={cx(`ds-item ${s.id === sel.id ? "ds-item-on" : ""}`)}
              onClick={() => setSelId(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setSelId(s.id); }}
            >
              <div className={cx(`ds-thumb ds-thumb-${s.theme.toLowerCase()}`)}>
                {token(NOW_SERVING)}
                <span className={cx("ds-iacts")}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelId(s.id); setFull(true); }} aria-label={`Preview ${s.name}`}><Eye size={10} /></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); remove(s.id); }} aria-label={`Delete ${s.name}`}><Trash2 size={10} /></button>
                </span>
              </div>
              <p className={cx("ds-iname")}>{s.name}</p>
              <div className={cx("ds-itags")}>
                <span className={cx("ds-itype")}>{s.type}</span>
                <span className={cx(s.active ? "ds-iact" : "ds-iinact")}>{s.active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* settings */}
        {sel && (
          <div className={cx("ds-cfgwrap")}>
            <div className={cx("ds-cfg")}>
              <section>
                <p className={cx("ds-sec")}>Screen Identity</p>
                <input className={cx("ds-in ds-name")} value={sel.name} onChange={(e) => update({ name: e.target.value })} aria-label="Screen name" />
              </section>

              <section>
                <p className={cx("ds-sec")}>Screen Type</p>
                <div className={cx("ds-seg3")}>
                  {SCREEN_TYPES.map((t) => (
                    <button type="button" key={t} className={cx(`ds-opt ${sel.type === t ? "ds-opt-on" : ""}`)} onClick={() => update({ type: t })}>{t}</button>
                  ))}
                </div>
                <p className={cx("ds-lbl")}>Associated Counter</p>
                <Select value={sel.counter} options={COUNTERS} onChange={(v) => update({ counter: v })} label="Associated Counter" />
              </section>

              <section>
                <p className={cx("ds-sec")}>Theme</p>
                <div className={cx("ds-seg3")}>
                  {THEMES.map((t) => (
                    <button type="button" key={t.key} className={cx(`ds-theme ${sel.theme === t.key ? "ds-opt-on" : ""}`)} onClick={() => update({ theme: t.key })}>
                      <i style={{ background: t.dot }} />
                      {t.key}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className={cx("ds-sec")}>Display Elements</p>
                {ELEMENTS.map((el) => (
                  <div className={cx("ds-el")} key={el.key}>
                    <span>{el.label}</span>
                    <Toggle size="medium" color="softBlue" className={cx("ds-tg")} on={sel.elements[el.key]} onChange={() => setEl(el.key)} label={el.label} />
                  </div>
                ))}
              </section>

              <section>
                <p className={cx("ds-sec")}>Token Format</p>
                <div className={cx("ds-seg2")}>
                  {FORMATS.map((f) => (
                    <button type="button" key={f} className={cx(`ds-opt ${sel.format === f ? "ds-opt-on" : ""}`)} onClick={() => update({ format: f })}>{f}</button>
                  ))}
                </div>
                <div className={cx("ds-last")}>
                  <span className={cx("ds-lastl")}>Show Last</span>
                  <input className={cx("ds-in ds-lastin")} inputMode="numeric" value={sel.showLast} onChange={(e) => update({ showLast: e.target.value.replace(/\D/g, "") })} aria-label="Show last tokens" />
                  <span className={cx("ds-lastt")}>tokens</span>
                </div>
              </section>

              <section>
                <p className={cx("ds-sec")}>Ticker / Announcement</p>
                <input className={cx("ds-in")} placeholder="Leave blank to disable..." value={sel.ticker} onChange={(e) => update({ ticker: e.target.value })} aria-label="Ticker text" />
              </section>

              <div className={cx("ds-foot")}>
                <label className={cx("ds-active")}>
                  <Toggle size="medium" color="green" className={cx("ds-tg ds-tg-green")} on={sel.active} onChange={() => update({ active: !sel.active })} label="Active" />
                  Active
                </label>
                <button type="button" className={cx("ds-prev")} onClick={() => setFull(true)}><Eye size={13} /> Preview</button>
              </div>
            </div>
          </div>
        )}

        {/* live preview */}
        {sel && (
          <div className={cx("ds-live")}>
            <div className={cx("ds-livehead")}>
              <span>Live Preview — {sel.name}</span>
              <button type="button" onClick={() => setFull(true)}><Monitor size={10} /> Full Preview</button>
            </div>
            {renderScreen(sel, false)}
          </div>
        )}
      </div>

      {full && sel && (
        <div className={cx("ds-overlay")} onMouseDown={(e) => { if (e.target === e.currentTarget) setFull(false); }}>
          <button type="button" className={cx("ds-oclose")} onClick={() => setFull(false)} aria-label="Close preview"><X size={18} /></button>
          <div className={cx("ds-ofull")}>{renderScreen(sel, true)}</div>
        </div>
      )}
    </div>
  );
};

export default DisplaySettings;