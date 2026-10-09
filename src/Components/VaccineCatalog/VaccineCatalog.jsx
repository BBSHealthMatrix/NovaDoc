import { createClassNames } from "../../utils/classNames.js";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Syringe } from "lucide-react";
import VaccineMasterList from "./VaccineMasterList";
import VaccinePartners from "./VaccinePartners";
import { SECTIONS, PARTNERS } from "./VaccineCatalogData.js";
import styles from "./VaccineCatalog.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/vaccine-master-list", label: "Vaccine Master List" },
  { to: "/admin/vaccine-partners", label: "Vaccine Partners" },
];

const VaccineCatalog = () => {
  const { pathname } = useLocation();
  const [sections, setSections] = useState(SECTIONS);
  const [partners, setPartners] = useState(PARTNERS);

  const isPartners = pathname === "/admin/vaccine-partners";
  const total = sections.reduce((n, s) => n + s.vaccines.length, 0);

  return (
    <div className={cx("vc-wrap")}>
      <div className={cx("vc-head")}>
        <div>
          <h1 className={cx("vc-title")}><Syringe size={16} /> Vaccine Catalog</h1>
          <p className={cx("vc-sub")}>
            {total} vaccines across {sections.length} sections · {partners.length} partners
          </p>
        </div>
        <div className={cx("vc-tabs")}>
          {TABS.map((t) => {
            const on = isPartners ? t.to === "/admin/vaccine-partners" : t.to === "/admin/vaccine-master-list";
            return (
              <Link key={t.to} to={t.to} className={cx(`vc-tab ${on ? "vc-tab-on" : ""}`)}>{t.label}</Link>
            );
          })}
        </div>
      </div>

      {isPartners
        ? <VaccinePartners sections={sections} partners={partners} setPartners={setPartners} />
        : <VaccineMasterList sections={sections} setSections={setSections} />}
    </div>
  );
};

export default VaccineCatalog;