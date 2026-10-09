import { createClassNames } from "../../utils/classNames.js";
import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Store, Trash2, Upload } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import PartnerModal from "./PartnerModal";
import { ALL_GENERICS, PARTNERS } from "./PharmacyPartnersData.js";
import styles from "./PharmacyPartners.module.css";

const cx = createClassNames(styles);

const ALL_BRANDS = ALL_GENERICS.flatMap((g) => g.brands.map((b) => ({ g, b })));

const PharmacyPartners = () => {
  const [partners, setPartners] = useState(PARTNERS);
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // null | { partner } (partner = null for New)
  const [importFor, setImportFor] = useState(null);
  const fileRef = useRef(null);

  const patch = (id, fn) => setPartners((p) => p.map((x) => (x.id === id ? fn(x) : x)));
  const toggleOpen = (id) => setExpanded((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const save = (data) => {
    if (modal.partner) patch(modal.partner.id, (x) => ({ ...x, ...data }));
    else setPartners((p) => [...p, { id: Date.now(), active: true, ...data }]);
    setModal(null);
  };

  const remove = (id) => setPartners((p) => p.filter((x) => x.id !== id));

  /* ── Import CSV: columns brand, strength, selling price, dispensing fee ── */
  const pickCsv = (id) => { setImportFor(id); fileRef.current?.click(); };
  const importCsv = (e) => {
    const file = e.target.files?.[0];
    const id = importFor;
    e.target.value = "";
    if (!file || id == null) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result)
        .split(/\r?\n/)
        .map((line) => line.split(",").map((s) => s.trim().replace(/^"|"$/g, "")))
        .filter((cols) => cols.length >= 3);
      patch(id, (x) => {
        const selected = new Set(x.selected);
        const prices = { ...x.prices };
        rows.forEach(([brand = "", strength = "", price, fee]) => {
          const hit = ALL_BRANDS.find(({ b }) =>
            b.name.toLowerCase() === brand.toLowerCase() && b.strength.toLowerCase() === strength.toLowerCase());
          if (!hit || Number.isNaN(parseFloat(price))) return;
          selected.add(hit.g.id);
          prices[hit.b.id] = { price: Number(price).toFixed(2), fee: (Number(fee) || 0).toFixed(2) };
        });
        return { ...x, selected: [...selected], prices };
      });
      setExpanded((p) => new Set(p).add(id));
    };
    reader.readAsText(file);
  };

  return (
    <div className={cx("pp-wrap")}>
      <div className={cx("pp-bar")}>
        <p className={cx("pp-desc")}>Manage dispensaries and pharmacies — configure selling price and dispensing fee per brand.</p>
        <button type="button" className={cx("pp-new")} onClick={() => setModal({ partner: null })}>
          <Plus size={14} /> New Partner
        </button>
      </div>

      <div className={cx("pp-list")}>
        {partners.map((p) => {
          const open = expanded.has(p.id);
          const generics = ALL_GENERICS.filter((g) => p.selected.includes(g.id));
          const brandCount = generics.reduce((n, g) => n + g.brands.length, 0);
          return (
            <div key={p.id} className={cx("pp-card")}>
              <div className={cx("pp-head")}>
                <div className={cx("pp-ico")}><Store size={14} /></div>
                <div className={cx("pp-info")}>
                  <div className={cx("pp-top")}>
                    <span className={cx("pp-name")}>{p.name}</span>
                    <span className={cx(`pp-badge ${p.type === "External Pharmacy" ? "pp-ext" : "pp-int"}`)}>{p.type}</span>
                    {!p.active && <span className={cx("pp-badge pp-off")}>Inactive</span>}
                  </div>
                  <div className={cx("pp-sub")}>
                    {p.contact || "No contact"} · <span className={cx("pp-gcount")}>{generics.length} generics</span> · {brandCount} brands
                  </div>
                </div>
                <div className={cx("pp-acts")}>
                  <Toggle
                    on={p.active}
                    onChange={() => patch(p.id, (x) => ({ ...x, active: !x.active }))}
                    size="large"
                    color="softBlue"
                    className={cx("pp-tg")}
                    label={`Toggle ${p.name}`}
                  />
                  <button type="button" className={cx("pp-btn")} onClick={() => setModal({ partner: p })} aria-label="Edit partner"><Pencil size={13} /></button>
                  <button type="button" className={cx("pp-btn pp-del")} onClick={() => remove(p.id)} aria-label="Delete partner"><Trash2 size={13} /></button>
                  <button type="button" className={cx(`pp-btn pp-chev ${open ? "pp-chev-on" : ""}`)} onClick={() => toggleOpen(p.id)} aria-label={open ? "Collapse" : "Expand"}>
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                </div>
              </div>

              {open && (
                <div className={cx("pp-body")}>
                  <div className={cx("pp-bbar")}>
                    <span className={cx("pp-blabel")}>Brand Pricing</span>
                    <button type="button" className={cx("pp-import")} onClick={() => pickCsv(p.id)}><Upload size={11} /> Import CSV</button>
                  </div>

                  {generics.length === 0 ? (
                    <p className={cx("pp-none")}>No generics selected for this partner</p>
                  ) : (
                    <div className={cx("pp-tbl")}>
                      <div className={cx("pp-trow pp-thead")}>
                        <span>Brand</span><span>Strength</span><span>Selling Price (PKR)</span><span>Dispensing Fee</span>
                      </div>
                      {generics.map((g) => (
                        <div key={g.id}>
                          <div className={cx("pp-tgen")}>{g.name} <em>{g.brands.length} brands</em></div>
                          {g.brands.map((b) => (
                            <div key={b.id} className={cx("pp-trow")}>
                              <span className={cx("pp-tbrand")}>{b.name}</span>
                              <span className={cx("pp-tstr")}>{b.strength}</span>
                              <span className={cx("pp-tnum")}>{p.prices[b.id]?.price ?? "0.00"}</span>
                              <span className={cx("pp-tnum")}>{p.prices[b.id]?.fee ?? "0.00"}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {partners.length === 0 && <p className={cx("pp-empty")}>No partners yet.</p>}
      </div>

      <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={importCsv} />

      {modal && <PartnerModal partner={modal.partner} onClose={() => setModal(null)} onSave={save} />}
    </div>
  );
};

export default PharmacyPartners;