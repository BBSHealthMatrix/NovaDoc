import { Building2, MapPin, HeartHandshake, Baby, Cross, Ambulance, Activity, Brain, Stethoscope, Video, Users, House, Dna, Handshake, Ribbon, Globe, Blocks, HeartPulse, Database, CircleDollarSign } from "lucide-react";

const PAGES = {
  scope: {
    eyebrow: 'Connected Care for Every Community',
    title: 'Long Term Scope for Healthcare',
    sub: 'One connected health ecosystem designed to make quality care accessible across every stage of life, every location, and every level of need.',
    items: [
      ['Primary Healthcare (Urban)', 'Accessible, coordinated care for growing cities', Building2, 'blue'],
      ['Primary Healthcare (Rural)', 'Connected care that reaches underserved communities', MapPin, 'green'],
      ['Maternal Healthcare', 'Continuous support from pregnancy through postpartum', HeartHandshake, 'pink'],
      ['Pediatric Healthcare', 'Preventive and responsive care for every child', Baby, 'purple'],
      ['Urgent Care', 'Timely treatment for immediate health concerns', Cross, 'orange'],
      ['Emergency Care', 'Rapid clinical response when every minute matters', Ambulance, 'red'],
      ['Preventive Health and Wellness (NCD)', 'Proactive screening and long-term disease prevention', Activity, 'green'],
      ['Mental Healthcare', 'Integrating mental healthcare to primary care', Brain, 'purple'],
      ['Specialty Care', 'Ambulatory specialist care for complex health needs', Stethoscope, 'cyan'],
      ['Telemedicine and Digital Clinic', 'Access to healthcare in remote areas', Video, 'teal'],
      ['Community Outreach Healthcare', 'Healthcare services based in community', Users, 'amber'],
      ['Home Health and Palliative Care', 'Dignified, personalized care in the comfort of home', House, 'orange'],
      ['Genetic Disease Clinic', 'Specialize genetic disease evaluation and management', Dna, 'purple'],
      ['Social Determinants of Health', 'Addresses the root cause of disease via community health social workers', Handshake, 'blue'],
      ['Population Health', 'Data led population health, research leading to innovation of care', Ribbon, 'red'],
    ],
  },
  vision: {
    eyebrow: 'The Future We Are Building',
    title: 'Our Vision for Healthcare',
    sub: 'A globally relevant, integrated healthcare platform shaped by its users and centered on every patient.',
    items: [
      ['Not Local But Global', 'Healthcare technology designed to scale across communities, regions, and borders.', Globe, 'blue'],
      ['User Led Design', 'Built around the real needs and experiences of patients, clinicians, and care teams.', Users, 'purple'],
      ['Modular Integrated', 'Flexible modules working together as one connected healthcare ecosystem.', Blocks, 'cyan'],
      ['Patient Centric', 'Every workflow and decision keeps the patient at the center of care.', HeartPulse, 'pink'],
      ['Robust DB Design for Longitudinal Care & Research & Innovation', 'A dependable data foundation supporting lifelong records, meaningful research, and continuous innovation.', Database, 'green'],
      ['Cost Effective', 'Practical digital healthcare that delivers sustainable value without compromising quality.', CircleDollarSign, 'amber'],
    ],
  },
}

export { PAGES };
