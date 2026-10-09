import { createClassNames } from '../../utils/classNames.js';
import { useState, useEffect, useRef } from "react";

import { MessageSquare, Search, Send } from "lucide-react";

import { ROLES, STAFF } from "./MessagingData.js";

import Avatar from "./Avatar";

import styles from "./Messaging.module.css";

const cx = createClassNames(styles);

const Messaging = () => {
  const [staff, setStaff] = useState(STAFF)
  const [activeId, setActiveId] = useState('ew')
  const [role, setRole] = useState('All')
  const [query, setQuery] = useState('')
  const [text, setText] = useState('')
  const endRef = useRef()

  const active = staff.find((s) => s.id === activeId)
  const list = staff.filter((s) =>
    (role === 'All' || s.role === role) &&
    s.name.toLowerCase().includes(query.toLowerCase())
  )

   
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [activeId, active.messages.length])

  const send = () => {
    if (!text.trim()) return
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setStaff(staff.map((s) =>
      s.id === activeId ? { ...s, messages: [...s.messages, ['me', text.trim(), time]] } : s
    ))
    setText('')
  }

  return (
    <div className={cx("msg-wrap")}>
      
      <aside className={cx("msg-side")}>
        <div className={cx("msg-side-top")}>
          <div className={cx("msg-title")}>
            <span className={cx("msg-title-icon")}><MessageSquare size={14} /></span>
            Messaging
          </div>
          <label className={cx("msg-search")}>
            <Search size={13} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search staff..." />
          </label>
          <div className={cx("msg-roles")}>
            {ROLES.map((r) => (
              <button key={r} className={cx(role === r ? 'on' : '')} onClick={() => setRole(r)}>{r}</button>
            ))}
          </div>
        </div>

        <div className={cx("msg-list")}>
          {list.map((s) => {
            const last = s.messages[s.messages.length - 1]
            return (
              <button key={s.id} className={cx(`msg-contact ${s.id === activeId ? 'on' : ''}`)}
                onClick={() => { setActiveId(s.id); setText('') }}>
                <Avatar s={s} />
                <span className={cx("msg-contact-info")}>
                  <span className={cx("msg-row")}>
                    <b>{s.name}</b>
                    {last && <time>{last[2]}</time>}
                  </span>
                  <span className={cx("msg-row")}>
                    <small>{last ? last[1] : s.dept}</small>
                    <em>{s.role}</em>
                  </span>
                </span>
              </button>
            )
          })}
          {list.length === 0 && <p className={cx("msg-none")}>No staff found</p>}
        </div>
      </aside>

      
      <section className={cx("msg-chat")}>
        <div className={cx("msg-chat-head")}>
          <Avatar s={active} dot={false} />
          <div>
            <b>{active.name}</b>
            <small>
              {active.dept} · <span className={cx(active.online ? 'on' : 'off')}>{active.online ? 'Online' : 'Offline'}</span>
            </small>
          </div>
        </div>

        <div className={cx("msg-body")}>
          {active.messages.length > 0 ? (
            <>
              <span className={cx("msg-date")}>{active.date || 'Today'}</span>
              {active.messages.map(([from, body, time], i) => (
                    <div key={i} className={cx(`msg-bubble msg-${from}`)}>
                  <p>{body}</p>
                  <time>{time}</time>
                </div>
              ))}
            </>
          ) : (
            <div className={cx("empty-state")}>
              <MessageSquare size={26} />
              <b>No messages yet</b>
              <small>Send a message to start the conversation</small>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className={cx("msg-input")}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Message ${active.name.split(' ')[0]}...`}
          />
          <button disabled={!text.trim()} onClick={send}><Send size={13} /> Send</button>
        </div>
      </section>
    </div>
  )
};

export default Messaging;
