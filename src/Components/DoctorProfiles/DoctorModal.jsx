import { createClassNames } from '../../utils/classNames.js';
import { useState } from "react";

import { X, GraduationCap, CircleHelp, CalendarDays, BookOpen } from "lucide-react";

import { DEPTS, CONSULT, OTHER, DAYS, TABS, blank, slotCount } from "./DoctorProfilesData.js";

import Select from "../Shared/Select";

import ListHead from "./ListHead";

import Empty from "./Empty";

import ItemHead from "./ItemHead";

import styles from "./DoctorModal.module.css";

const cx = createClassNames(styles);

const DoctorModal = ({ doctor, onClose, onSave }) => {
  const [f, setF] = useState(doctor || blank());
  const [tab, setTab] = useState("bio");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const setPro = (k, v) => set("pro", { ...f.pro, [k]: v });

  const toggleDept = (d) => {
    if (f.depts.includes(d.name)) {
      const subs = { ...f.subs };
      delete subs[d.name];
      setF((p) => ({ ...p, depts: p.depts.filter((x) => x !== d.name), subs, specs: p.specs.filter((s) => !d.specs.includes(s)) }));
    } else {
      set("depts", [...f.depts, d.name]);
    }
  };
  const toggleSub = (d, s) => {
    const cur = f.subs[d] || [];
    set("subs", { ...f.subs, [d]: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
  };

  const addItem = (k, item) => set(k, [...f[k], { id: Date.now(), ...item }]);
  const updItem = (k, id, key, v) => set(k, f[k].map((x) => (x.id === id ? { ...x, [key]: v } : x)));
  const delItem = (k, id) => set(k, f[k].filter((x) => x.id !== id));

  const addQual = () => addItem("quals", { name: "", start: "", end: "" });
  const addDay = () => addItem("days", { day: "Monday", start: "09:00", end: "13:00", slot: 30, multi: false });
  const addFaq = () => addItem("faqs", { q: "", a: "" });

  const valid = f.name.trim() && f.gender && f.shift;
  const idx = TABS.findIndex((t) => t[0] === tab);
  const checkedDepts = DEPTS.filter((d) => f.depts.includes(d.name));

  const save = () => {
    if (!valid) return;
    onSave({ ...f, name: f.name.trim(), id: doctor ? doctor.id : Date.now() });
  };

  return (
    <div className={cx("dp-overlay")} onClick={onClose}>
      <div className={cx("dp-modal")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("dp-m-head")}>
          <button className={cx("dp-x")} onClick={onClose}><X size={15} /></button>
          <h3>{doctor ? "Edit Doctor" : "Add Doctor"}</h3>
          <p>Fill in the details across all sections and save when done.</p>
        </div>

        <div className={cx("dp-tabs")}>
          {TABS.map(([key, label, Icon]) => (
            <button key={key} className={cx(`dp-tab ${tab === key ? "dp-tab-on" : ""}`)} onClick={() => setTab(key)}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        <div className={cx("dp-m-body")}>
          
          {tab === "bio" && (
            <>
              <p className={cx("dp-cap")}>Basic Information</p>
              <div className={cx("dp-grid2")}>
                <div>
                  <label className={cx("dp-lbl")}>Full Name <i>*</i></label>
                  <input className={cx("dp-in")} placeholder="Dr. Full Name" value={f.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label className={cx("dp-lbl")}>Gender <i>*</i></label>
                  <Select variant="doctor" value={f.gender} placeholder="Select gender" options={["Male", "Female", "Other"]} onChange={(v) => set("gender", v)} />
                </div>
                <div>
                  <label className={cx("dp-lbl")}>Phone</label>
                  <input className={cx("dp-in")} placeholder="+1 (555) 000-0000" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div>
                  <label className={cx("dp-lbl")}>Email</label>
                  <input className={cx("dp-in")} placeholder="doctor@clinic.com" value={f.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <label className={cx("dp-lbl")}>Password</label>
                  <input className={cx("dp-in")} type="password" placeholder="Set initial password" value={f.password} onChange={(e) => set("password", e.target.value)} />
                </div>
                <div>
                  <label className={cx("dp-lbl")}>Shift <i>*</i></label>
                  <Select variant="doctor" value={f.shift} placeholder="Select shift" options={["Morning", "Afternoon", "Evening", "Night"]} onChange={(v) => set("shift", v)} />
                </div>
              </div>

              <hr className={cx("dp-hr")} />
              <p className={cx("dp-cap")}>Doctor Type</p>
              <div className={cx("dp-types")}>
                {[["Appointment", "Appointment-Based", "Pre-booked appointments"], ["Token-Based", "Token-Based", "Walk-in queue tokens"]].map(([val, title, sub]) => (
                  <button type="button" key={val} className={cx(`dp-type ${f.type === val ? "dp-type-on" : ""}`)} onClick={() => set("type", val)}>
                    <span className={cx("dp-radio")} />
                    <span><b>{title}</b><small>{sub}</small></span>
                  </button>
                ))}
              </div>

              <hr className={cx("dp-hr")} />
              <p className={cx("dp-cap")}>Department &amp; Sub-Department Mapping</p>
              {DEPTS.map((d) => {
                const on = f.depts.includes(d.name);
                return (
                  <div key={d.name} className={cx(`dp-map ${on ? "dp-map-on" : ""}`)}>
                    <label className={cx("dp-check")}>
                      <input type="checkbox" checked={on} onChange={() => toggleDept(d)} />
                      <b>{d.name}</b>
                    </label>
                    {on && (
                      <div className={cx("dp-subs")}>
                        {d.subs.map((s) => (
                          <label key={s} className={cx("dp-sub")}>
                            <input type="checkbox" checked={(f.subs[d.name] || []).includes(s)} onChange={() => toggleSub(d.name, s)} />
                            {s}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <hr className={cx("dp-hr")} />
              <p className={cx("dp-cap")}>Specialties</p>
              {checkedDepts.length === 0 && <p className={cx("dp-note")}>Select a department above to choose its specialties.</p>}
              {checkedDepts.map((d) => (
                <div key={d.name} className={cx("dp-spec-group")}>
                  <p className={cx("dp-spec-lbl")}>{d.name}</p>
                  <div className={cx("dp-pills")}>
                    {d.specs.map((s) => (
                      <button type="button" key={s} className={cx(`dp-pill ${f.specs.includes(s) ? "dp-pill-on" : ""}`)} onClick={() => toggleArr("specs", s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <hr className={cx("dp-hr")} />
              <label className={cx("dp-check dp-statement")}>
                <input type="checkbox" checked={f.statement} onChange={() => set("statement", !f.statement)} />
                <b>Add Professional Statement</b>
              </label>
              {f.statement && (
                <div className={cx("dp-pro")}>
                  <p className={cx("dp-cap")}>Professional Details</p>
                  <div className={cx("dp-grid2")}>
                    <div>
                      <label className={cx("dp-lbl")}>PMDC Number</label>
                      <input className={cx("dp-in")} placeholder="PMDC Number" value={f.pro.pmdc || ""} onChange={(e) => setPro("pmdc", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Years of Experience</label>
                      <input className={cx("dp-in")} placeholder="Years of Experience" value={f.pro.years || ""} onChange={(e) => setPro("years", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Languages Spoken</label>
                      <input className={cx("dp-in")} placeholder="Languages Spoken" value={f.pro.langs || ""} onChange={(e) => setPro("langs", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Awards &amp; Recognition</label>
                      <textarea className={cx("dp-in dp-ta")} placeholder="Awards & Recognition" value={f.pro.awards || ""} onChange={(e) => setPro("awards", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Areas of Expertise</label>
                      <textarea className={cx("dp-in dp-ta")} placeholder="Areas of Expertise" value={f.pro.areas || ""} onChange={(e) => setPro("areas", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Professional Memberships</label>
                      <textarea className={cx("dp-in dp-ta")} placeholder="Professional Memberships" value={f.pro.members || ""} onChange={(e) => setPro("members", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              <hr className={cx("dp-hr")} />
              <p className={cx("dp-cap")}>Specialty Forms</p>
              <div className={cx("dp-forms-note")}>
                {f.form
                  ? <span className={cx("dp-form-link")}><BookOpen size={11} /> {f.form}</span>
                  : "Save the doctor first, then assign specialty forms in the Specialty Forms module."}
              </div>
            </>
          )}

          
          {tab === "qual" && (
            <>
              <ListHead title="Academic Qualifications" sub="Add all degrees and certifications." btn="Add Qualification" onAdd={addQual} />
              {f.quals.length === 0 ? (
                <Empty icon={GraduationCap} text="No qualifications added yet" link="Add first qualification" onAdd={addQual} />
              ) : f.quals.map((q, i) => (
                <div className={cx("dp-item")} key={q.id}>
                  <ItemHead n={i + 1} onRemove={() => delItem("quals", q.id)} />
                  <label className={cx("dp-lbl")}>Qualification Name</label>
                  <input className={cx("dp-in")} placeholder="e.g. MBBS, MD Cardiology, FRCS" value={q.name} onChange={(e) => updItem("quals", q.id, "name", e.target.value)} />
                  <div className={cx("dp-grid3")}>
                    <div>
                      <label className={cx("dp-lbl")}>Start Year</label>
                      <input className={cx("dp-in")} placeholder="2004" value={q.start} onChange={(e) => updItem("quals", q.id, "start", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Completion Year</label>
                      <input className={cx("dp-in")} placeholder="2010" value={q.end} onChange={(e) => updItem("quals", q.id, "end", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          
          {tab === "svc" && (
            <>
              {[
                ["Consultation Services", <>Enabled services here will be available across <b>all sub-departments</b> assigned to this doctor.</>, CONSULT, true],
                ["Other Services", "Additional services offered by this doctor outside of consultation types.", OTHER, false],
              ].map(([title, sub, opts, blue]) => (
                <div className={cx("dp-svc")} key={title}>
                  <div className={cx("dp-svc-head")}>
                    <b className={cx(blue ? "dp-blue" : "")}>{title}</b>
                    <small>{sub}</small>
                  </div>
                  <div className={cx("dp-svc-grid")}>
                    {opts.map((o) => {
                      const on = f.services.includes(o);
                      return (
                        <label key={o} className={cx(`dp-opt ${on ? "dp-opt-on" : ""}`)}>
                          <input type="checkbox" checked={on} onChange={() => toggleArr("services", o)} /> {o}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {f.services.length > 0 && (
                <div className={cx("dp-svc-sum")}>
                  <b>{f.services.length} service{f.services.length === 1 ? "" : "s"} selected</b>
                  <div>
                    {f.services.map((s) => (
                      <span key={s} className={cx(`dp-chip ${CONSULT.includes(s) ? "dp-chip-blue" : ""}`)}>
                        {s} <button type="button" onClick={() => toggleArr("services", s)}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          
          {tab === "time" && (
            <>
              <ListHead title="Availability & Schedule" sub="Set working hours and slot configuration per day." btn="Add Day" onAdd={addDay} />
              {f.days.length === 0 ? (
                <Empty icon={CalendarDays} text="No schedule set" link="Add first day" onAdd={addDay} />
              ) : f.days.map((d, i) => (
                <div className={cx("dp-item")} key={d.id}>
                  <ItemHead n={i + 1} label="Day schedule" onRemove={() => delItem("days", d.id)} />
                  <div className={cx("dp-grid4")}>
                    <div>
                      <label className={cx("dp-lbl")}>Day</label>
                      <Select variant="doctor" label="Schedule day" value={d.day} options={DAYS} onChange={(v) => updItem("days", d.id, "day", v)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Start Time</label>
                      <input type="time" className={cx("dp-in")} value={d.start} onChange={(e) => updItem("days", d.id, "start", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>End Time</label>
                      <input type="time" className={cx("dp-in")} value={d.end} onChange={(e) => updItem("days", d.id, "end", e.target.value)} />
                    </div>
                    <div>
                      <label className={cx("dp-lbl")}>Slot (mins)</label>
                      <input type="number" min="5" className={cx("dp-in")} value={d.slot} onChange={(e) => updItem("days", d.id, "slot", e.target.value)} />
                    </div>
                  </div>
                  <div className={cx("dp-slots")}>
                    <span><b>{slotCount(d)} slots available</b> ({d.start} – {d.end}, {d.slot} min each)</span>
                    <label>
                      <input type="checkbox" checked={d.multi} onChange={() => updItem("days", d.id, "multi", !d.multi)} />
                      Allow multiple bookings per slot
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}

          
          {tab === "faq" && (
            <>
              <ListHead title="Frequently Asked Questions" sub="Add FAQs patients can read before booking." btn="Add FAQ" onAdd={addFaq} />
              {f.faqs.length === 0 ? (
                <Empty icon={CircleHelp} text="No FAQs added yet" link="Add first FAQ" onAdd={addFaq} />
              ) : f.faqs.map((q, i) => (
                <div className={cx("dp-item")} key={q.id}>
                  <ItemHead n={i + 1} label="Q&A pair" onRemove={() => delItem("faqs", q.id)} />
                  <label className={cx("dp-lbl")}>Question</label>
                  <input className={cx("dp-in")} placeholder="e.g. What conditions do you treat?" value={q.q} onChange={(e) => updItem("faqs", q.id, "q", e.target.value)} />
                  <label className={cx("dp-lbl")}>Answer</label>
                  <textarea className={cx("dp-in dp-ta dp-ta-lg")} placeholder="Write a clear, helpful answer..." value={q.a} onChange={(e) => updItem("faqs", q.id, "a", e.target.value)} />
                </div>
              ))}
            </>
          )}
        </div>

        <div className={cx("dp-m-foot")}>
          <div className={cx("dp-dots")}>
            {TABS.map((t, i) => <span key={t[0]} className={cx(i === idx ? "dp-dot-on" : "")} />)}
          </div>
          <button className={cx("dp-btn-c")} onClick={onClose}>Cancel</button>
          <button className={cx("dp-btn-b")} disabled={!valid} onClick={save}>{doctor ? "Save Changes" : "Add Doctor"}</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorModal;
