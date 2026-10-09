import { UserCheck, CircleCheck, Stethoscope, FlaskConical } from "lucide-react";

const ROLES = {
  frontdesk: {
    bar: 'Registration Counter',
    right: ['Billing:', 'Enabled'],
    queue: 'Registration Queue',
    queueSub: 'Step 1 tokens · Billing enabled',
    tone: 'blue',
    icon: UserCheck,
    empty: 'No tokens waiting at registration',
  },
  nursing: {
    bar: 'Nursing Counter',
    right: ['Step:', 'Vitals · 2 of 5'],
    queue: 'Vitals Queue',
    queueSub: 'Step 2 tokens · No billing',
    tone: 'red',
    icon: CircleCheck,
    empty: 'Patients will appear here after Front Desk registration.',
  },
  doctor: {     
    bar: 'Doctor Consultation',
    right: ['Step:', 'Doctor Consultation · 3 of 5'],
    queue: 'Consultation Queue',
    queueSub: 'Step 3 tokens · No billing',
    tone: 'blue',
    icon: Stethoscope,
    empty: 'No patients waiting for consultation',
    extra: ['Pending Lab', 'blue'],
    queueIcon: true,    
  },
  lab: {
    bar: 'Lab Counter',
    right: ['Step:', 'Lab / Sample · 4 of 5'],
    queue: 'Lab Queue',
    queueSub: 'Step 4 tokens · No billing',
    tone: 'blue',
    icon: FlaskConical,
    empty: 'Patients will appear here after they reach Step 4.',
    extra: ['Pending Results', 'teal'],
    queueIcon: true,
  },
}

export { ROLES };
