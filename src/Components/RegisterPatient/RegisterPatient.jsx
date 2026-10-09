import { classNames as cx } from '../../utils/classNames.js';
import { useState } from 'react'
import { Hash, Banknote, Shield, Building2, Heart, HeartHandshake, UserPlus } from 'lucide-react'
import RegisterStyles from "./RegisterPatient.module.css";
import Field from "../Field/Field";
import Drawer from "../Drawer/Drawer";
import DrawerHeader from "../DrawerHeader/DrawerHeader";
import DrawerBody from "../DrawerBody/DrawerBody";
import DrawerFooter from "../DrawerFooter/DrawerFooter";
import FormGrid from "../FormGrid/FormGrid";


const PATIENT_TYPES = [
  ['Cash', Banknote, 'green'],
  ['Insurance', Shield, 'blue'],
  ['Corporate', Building2, 'orange'],
  ['Welfare', Heart, 'red'],
]
const RELATIONS = ['Self', 'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Other']
const INSURERS = ['State Life', 'Jubilee Health', 'Adamjee Insurance', 'EFU Health']
const SCHEMES = ['Sehat Card', 'Zakat Fund', 'Bait-ul-Maal', 'Hospital Welfare Fund']



const RegisterPatient = ({ onBack, onClose, onDone, standalone, wide, onToggleWide }) => {
  const [mrn] = useState(() => 'MR-' + (45000 + Math.floor(Math.random() * 1000)))
  const [dobMode, setDobMode] = useState('dob')
  const [p, setP] = useState({
    first: '', last: '', dob: '', years: 0, months: 0, days: 0, gender: '',
    phone: '', cnic: '', referred: '', address: '', relation: '', type: 'Cash',
    company: '', policy: '', emergency: '', notes: '', employer: '', employeeId: '', scheme: '',
  })
  const set = (k, v) => setP((previous) => ({ ...previous, [k]: v }))

  const hasAge = dobMode === 'dob' ? p.dob : Number(p.years) + Number(p.months) + Number(p.days) > 0
  const valid = p.first.trim() && p.phone.trim() && hasAge

  const content = (
    <>
      <DrawerHeader
        title="Register Patient"
        subtitle="Fill in details — patient will be added to the appointment"
        onBack={onBack}
        onClose={onClose}
        wide={wide}
        onToggleWide={onToggleWide}
      />

      <DrawerBody>
        <div className={RegisterStyles["mrn-box"]}>
          <Hash size={13} />
          <div><small>Patient ID / MR No</small><b>{mrn} (auto-generated)</b></div>
        </div>

        <FormGrid>
          <Field label="First Name" req>
            <input value={p.first} onChange={(e) => set('first', e.target.value)} placeholder="First name" />
          </Field>
          <Field label="Last Name">
            <input value={p.last} onChange={(e) => set('last', e.target.value)} placeholder="Last name" />
          </Field>
        </FormGrid>

        
        <div className={RegisterStyles["d-field"]}>
          <div className={RegisterStyles["row-between"]}>
            <span>Date of Birth <i className={RegisterStyles["req"]}>*</i></span>
            <div className={RegisterStyles["mini-seg"]}>
              <button type="button" className={dobMode === 'dob' ? RegisterStyles.on : undefined} onClick={() => setDobMode('dob')}>DOB</button>
              <button type="button" className={dobMode === 'age' ? RegisterStyles.on : undefined} onClick={() => setDobMode('age')}>Age</button>
            </div>
          </div>
          {dobMode === 'dob' ? (
            <input type="date" value={p.dob} onChange={(e) => set('dob', e.target.value)} />
          ) : (
            <div className={RegisterStyles["age-grid"]}>
              {[['years', 'Years'], ['months', 'Months'], ['days', 'Days']].map(([k, l]) => (
                <label key={k}>
                  <input type="number" min="0" value={p[k]} onChange={(e) => set(k, e.target.value)} />
                  <small>{l}</small>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={RegisterStyles["d-field"]}>
          <span>Gender</span>
          <div className={RegisterStyles["gender-seg"]}>
            {['Male', 'Female', 'Other'].map((g) => (
              <button type="button" key={g} className={p.gender === g ? RegisterStyles.on : undefined} onClick={() => set('gender', g)}>{g}</button>
            ))}
          </div>
        </div>

        <FormGrid>
          <Field label="Phone Number" req>
            <input value={p.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+92 300 000-0000" />
          </Field>
          <Field label="CNIC">
            <input value={p.cnic} onChange={(e) => set('cnic', e.target.value)} placeholder="00000-0000000-0" />
          </Field>
        </FormGrid>

        <Field label="Referred By">
          <input value={p.referred} onChange={(e) => set('referred', e.target.value)} placeholder="Referrer name" />
        </Field>

        <Field label="Complete Address">
          <textarea value={p.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, area, city..." />
        </Field>

        <Field label="Relationship Type">
          <select value={p.relation} onChange={(e) => set('relation', e.target.value)}>
            <option value="">Select...</option>
            {RELATIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        
        <div className={RegisterStyles["d-field"]}>
          <span>Type of Patient</span>
          <div className={RegisterStyles["ptype"]}>
            {PATIENT_TYPES.map(([t, Icon, tone]) => (
              <button type="button" key={t} className={cx(p.type === t && RegisterStyles.on, p.type === t && RegisterStyles[tone])} onClick={() => set('type', t)}>
                <Icon size={13} />{t}
              </button>
            ))}
          </div>
        </div>

        {p.type === 'Insurance' && (
          <div className={RegisterStyles["extra-box"]}>
            <p className={RegisterStyles["d-label"]}>Insurance Details</p>
            <FormGrid>
              <Field label="Insurance Company">
                <select value={p.company} onChange={(e) => set('company', e.target.value)}>
                  <option value="">Select...</option>
                  {INSURERS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Insurance Number">
                <input value={p.policy} onChange={(e) => set('policy', e.target.value)} placeholder="Policy number" />
              </Field>
            </FormGrid>
            <Field label="Emergency Contact">
              <input value={p.emergency} onChange={(e) => set('emergency', e.target.value)} placeholder="Phone" />
            </Field>
            <Field label="Notes">
              <textarea value={p.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any additional notes..." />
            </Field>
          </div>
        )}

        {p.type === 'Corporate' && (
          <div className={RegisterStyles["extra-box"]}>
            <p className={RegisterStyles["d-label"]}>Corporate Details</p>
            <FormGrid>
              <Field label="Company Name">
                <input value={p.employer} onChange={(e) => set('employer', e.target.value)} placeholder="Employer name" />
              </Field>
              <Field label="Employee ID">
                <input value={p.employeeId} onChange={(e) => set('employeeId', e.target.value)} placeholder="Employee number" />
              </Field>
            </FormGrid>
          </div>
        )}

        {p.type === 'Welfare' && (
          <div className={cx(RegisterStyles["extra-box"], RegisterStyles["welfare"])}>
            <p className={RegisterStyles["extra-title"]}><HeartHandshake size={13} /> Welfare Scheme Enrollment</p>
            <Field label="Select Scheme" plain>
              <select value={p.scheme} onChange={(e) => set('scheme', e.target.value)}>
                <option value="">— Choose welfare scheme —</option>
                {SCHEMES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        )}
      </DrawerBody>

      <DrawerFooter single>
        <button type="button" className={RegisterStyles["btn-book"]} disabled={!valid} onClick={() => onDone(`${p.first} ${p.last}`.trim())}>
          <UserPlus size={13} /> Register Patient
        </button>
      </DrawerFooter>
    </>
  )

  if (!standalone) return content
  return (
    <Drawer wide={wide} onClose={onClose} label="Register patient">{content}</Drawer>
  )
};

export default RegisterPatient;
