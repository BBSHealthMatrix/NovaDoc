import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { Users, Search, Eye, Pencil, Trash2 } from "lucide-react";

import { PATIENTS, SELECTS, HEADERS, initials } from "./PatientsData.js";

import styles from "./Patients.module.css";

const cx = createClassNames(styles);

const Patients = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})

  const rows = PATIENTS.filter(([mrn, name, phone, , type, status]) =>
    (mrn + name + phone).toLowerCase().includes(search.toLowerCase()) &&
    (!filters['Patient Type'] || filters['Patient Type'] === type) &&
    (!filters['Patient Status'] || filters['Patient Status'] === status)
  )

  return (
    <div className={cx("page")}>
      <div className={cx("page-head")}>
        <span className={cx("page-icon")}><Users size={16} /></span>
        <div>
          <h1 className={cx("page-title")}>Patients</h1>
          <p className={cx("sub")}>{rows.length} of {PATIENTS.length} patient records</p>
        </div>
      </div>

      <div className={cx("box filters")}>
        <label className={cx("search")}>
          <Search size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, MR number, or phone number..."
          />
        </label>

        <div className={cx("filter-grid")}>
          <label className={cx("field")}><span className={cx("label")}>Date From</span><input type="date" /></label>
          <label className={cx("field")}><span className={cx("label")}>Date To</span><input type="date" /></label>
          {SELECTS.map(([label, options]) => (
            <label key={label} className={cx("field")}>
              <span className={cx("label")}>{label}</span>
              <select
                value={filters[label] || ''}
                onChange={(e) => setFilters({ ...filters, [label]: e.target.value })}
              >
                <option value="">Select Entry</option>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className={cx("box table-wrap")}>
        <table>
          <thead>
            <tr>{HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([mrn, name, phone, gender, type, status, color], i) => (
              <tr key={mrn}>
                <td>{i + 1}</td>
                <td className={cx("bold")}>{mrn}</td>
                <td>
                  <span className={cx("person")}>
                    <span className={cx("avatar")} style={{ background: color }}>{initials(name)}</span>
                    <b>{name}</b>
                  </span>
                </td>
                <td>{phone}</td>
                <td>{gender}</td>
                <td>{type}</td>
                <td><span className={cx(`badge ${status.toLowerCase()}`)}>{status}</span></td>
                <td className={cx("actions")}><Eye size={14} /><Pencil size={13} /><Trash2 size={13} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Patients;
