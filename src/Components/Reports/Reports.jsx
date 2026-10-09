import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect, useRef } from "react";

import { Filter, ChevronDown, Check, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { FILTERS, EMPTY, STATS, TRANSACTIONS } from "./ReportsData.js";

import TransactionCard from "./TransactionCard";

import styles from "./Reports.module.css";

const cx = createClassNames(styles);

const Reports = () => {
  const [draft, setDraft] = useState(EMPTY)       
  const [applied, setApplied] = useState(EMPTY)   
  const [open, setOpen] = useState(null)          
  const [page, setPage] = useState(1)
  const barRef = useRef()

   
  useEffect(() => {
    const close = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setOpen(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const list = TRANSACTIONS.filter((t) =>
    ['dept', 'sub', 'doctor', 'mode', 'status', 'visit'].every((k) => !applied[k] || t[k] === applied[k]) &&
    t.proc.toLowerCase().includes(applied.proc.toLowerCase())
  )

  const set = (k, v) => setDraft({ ...draft, [k]: v })
  const apply = () => { setApplied(draft); setOpen(null) }
  const clear = () => { setDraft(EMPTY); setApplied(EMPTY) }

  return (
    <div className={cx("rp-wrap")}>
      
      <div className={cx("rp-top")}>
        <div className={cx("rp-filters")}>
          <div className={cx("rp-filters-head")}>
            <b><Filter size={13} /> Transaction Filters</b>
            <div className={cx("rp-btns")}>
              <button className={cx("rp-clear")} onClick={clear}>Clear All</button>
              <button className={cx("rp-apply")} onClick={apply}>Apply Filters</button>
            </div>
          </div>

          <div className={cx("rp-filter-row")} ref={barRef}>
            {FILTERS.map(([key, placeholder, options]) => (
              <div key={key} className={cx("rp-select")}>
                <button className={cx(`rp-select-btn ${draft[key] ? 'has' : ''}`)} onClick={() => setOpen(open === key ? null : key)}>
                  <span>{draft[key] || placeholder}</span>
                  <ChevronDown size={13} />
                </button>
                {open === key && (
                  <div className={cx("rp-menu")}>
                    {options.map((o) => (
                      <button key={o} className={cx(draft[key] === o ? 'on' : '')}
                        onClick={() => { set(key, draft[key] === o && key !== 'date' ? '' : o); setOpen(null) }}>
                        {o}
                        {draft[key] === o && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <input
              className={cx("rp-proc")}
              value={draft.proc}
              onChange={(e) => set('proc', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apply()}
              placeholder="Search Procedure..."
            />
          </div>
        </div>

        <div className={cx("rp-stats")}>
          {STATS.map(([label, value, Icon, change]) => (
            <div key={label} className={cx("rp-stat")}>
              <div>
                <small>{label}</small>
                <b>{value}</b>
              </div>
              <div className={cx("rp-stat-right")}>
                <span className={cx("rp-stat-icon")}><Icon size={13} /></span>
                <em className={cx(change.startsWith('-') ? 'down' : 'up')}>{change}</em>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className={cx("rp-body")}>
        <div className={cx("rp-head rp-cols")}>
          <span>Visit Information</span>
          <span>Billing &amp; Status</span>
          <span>Shares &amp; Revenue</span>
          <span>Actions</span>
        </div>

        {list.length === 0 && (
          <div className={cx("empty-state rp-empty")}>
            <Search size={24} />
            <b>No transactions found</b>
            <small>Try changing or clearing the filters</small>
          </div>
        )}

        {list.map((t) => <TransactionCard key={t.trx} t={t} />)}

        <div className={cx("rp-foot")}>
          <span>
            Showing <b>{list.length ? 1 : 0}</b> to <b>{list.length}</b> of{' '}
            <b>{list.length === TRANSACTIONS.length ? 124 : list.length}</b> transactions
          </span>
          <div className={cx("rp-pages")}>
            <button onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={12} /></button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={cx(page === n ? 'on' : '')} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button onClick={() => setPage(Math.min(3, page + 1))}><ChevronRight size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Reports;
