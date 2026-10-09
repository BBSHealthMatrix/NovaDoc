import { createClassNames } from "../../utils/classNames.js";
import { Info } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import { DOCTORS, PROVIDER_GROUPS, VISIT_TYPES, rs } from "./CorporatePricingData.js";
import styles from "./CorporateServicesTab.module.css";

const cx = createClassNames(styles);

const CorporateServicesTab = ({ corporate, onPatch }) => {
  const { doctors, providers, overrides, inactive } = corporate;

  const docs = DOCTORS.filter((d) => doctors.includes(d.id));
  const consultItems = docs.flatMap((d) => d.specialties.flatMap((s) => VISIT_TYPES.map(([k, label]) => ({
    id: `doc${d.id}-${s.name}-${k}`, name: `${d.name} — ${s.name} · ${label}`, base: s[k],
  }))));

  const sections = [
    { key: "consult", title: "Consultations", color: "#4982cf", via: `${docs.length} of ${DOCTORS.length} doctors`, linked: true, items: consultItems },
    ...PROVIDER_GROUPS.map((g) => {
      const o = g.options.find((x) => x.id === providers[g.key]);
      return { key: g.key, title: g.label, color: g.color, via: o ? o.name : "None", linked: Boolean(o), items: o ? o.items : [] };
    }),
  ];

  const setOverride = (id, v) => onPatch((x) => ({ ...x, overrides: { ...x.overrides, [id]: v } }));
  const toggleActive = (id) => onPatch((x) => ({
    ...x, inactive: x.inactive.includes(id) ? x.inactive.filter((i) => i !== id) : [...x.inactive, id],
  }));

  return (
    <>
      <div className={cx("crs-info")}>
        <Info size={13} />
        <span>Base prices are pulled from linked providers. You can override any price for this corporate, or toggle items inactive to exclude them from billing.</span>
      </div>

      {sections.map((s) => (
        <div key={s.key} className={cx("crs-sec")}>
          <div className={cx("crs-shead")}>
            <i className={cx("crs-dot")} style={{ background: s.color }} />
            <span className={cx("crs-stitle")}>{s.title}</span>
            <span className={cx("crs-via")}>via <b>{s.via}</b> · {s.items.length} items</span>
          </div>

          {s.items.length === 0 ? (
            <p className={cx("crs-empty")}>{s.linked ? "No items configured for this provider." : "No provider linked."}</p>
          ) : (
            <div className={cx("crs-scroll")}>
              <div className={cx("crs-row crs-thead")}>
                <span />
                <span>Item</span>
                <span>Base Price</span>
                <span>Corporate Price</span>
              </div>
              {s.items.map((it) => {
                const on = !inactive.includes(it.id);
                return (
                  <div key={it.id} className={cx(`crs-row ${on ? "" : "crs-row-off"}`)}>
                    <Toggle on={on} onChange={() => toggleActive(it.id)} size="tiny" color="softBlue" className={cx("crs-tg")} label={`Toggle ${it.name}`} />
                    <span className={cx("crs-name")}>{it.name}</span>
                    <span className={cx("crs-base")}>{rs(it.base)}</span>
                    <input
                      type="number" min="0" step="any" className={cx("crs-in")}
                      placeholder={String(it.base)}
                      value={overrides[it.id] ?? ""}
                      onChange={(e) => setOverride(it.id, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CorporateServicesTab;