import { DollarSign, Users, Wallet, CreditCard, Landmark, Banknote } from "lucide-react";

const FILTERS = [
  ['date', 'Date', ['Today', 'Yesterday', 'This Week', 'This Month']],
  ['dept', 'Department', ['Cardiology', 'Orthopedics', 'Neurology']],
  ['sub', 'Sub-dept', ['Outpatient', 'Inpatient', 'Emergency']],
  ['doctor', 'Consultant', ['Dr. Robert Chen', 'Dr. Emily Wong']],
  ['mode', 'Payment Mode', ['Cash', 'Card', 'Online', 'Insurance']],
  ['status', 'Status', ['Paid', 'Pending', 'Partial']],
  ['visit', 'Visit Type', ['New Visit', 'Follow-up']],
]

const EMPTY = { date: 'Today', dept: '', sub: '', doctor: '', mode: '', status: '', visit: '', proc: '' }

const STATS = [
  ['Total Revenue', '$142,500.00', DollarSign, '+12.5%'],
  ['Total Patients', '2,845', Users, '+5.2%'],
  ['Cash Payments', '$45,200.00', Wallet, '-2.4%'],
  ['Online/Card', '$97,300.00', CreditCard, '+18.1%'],
]

const TRANSACTIONS = [
  { name: 'Sarah Jenkins', mrn: 'MR-40291', doctor: 'Dr. Emily Wong', proc: 'Echocardiogram', dept: 'Cardiology', sub: 'Outpatient', visit: 'New Visit',
    total: 1150, status: 'Paid', mode: 'Insurance', trx: 'TRX-847291', subtotal: 1200, discount: 50, copay: 200,
    clinic: 750, doctorRev: 400, date: '2023-10-24', by: 'j.smith' },
  { name: 'Michael Chang', mrn: 'MR-39102', doctor: 'Dr. James Wilson', proc: 'Knee Arthroscopy', dept: 'Orthopedics', sub: 'Inpatient', visit: 'New Visit',
    total: 4300, status: 'Pending', mode: 'Pending', trx: 'TRX-847292', subtotal: 4500, discount: 200, copay: 0,
    clinic: 2800, doctorRev: 1500, date: '-', by: 'a.davis' },
  { name: 'Elena Rodriguez', mrn: 'MR-50192', doctor: 'Dr. Sarah Connor', proc: 'Initial Consult', dept: 'Neurology', sub: 'Outpatient', visit: 'Follow-up',
    total: 350, status: 'Paid', mode: 'Card', trx: 'TRX-847293', subtotal: 350, discount: 0, copay: 70,
    clinic: 200, doctorRev: 150, date: '2023-10-24', by: 'm.johnson' },
  { name: 'David Kim', mrn: 'MR-22019', doctor: 'Dr. Lisa Cuddy', proc: 'Annual Checkup', dept: 'Pediatrics', sub: 'Outpatient', visit: 'Follow-up',
    total: 200, status: 'Partial', mode: 'Cash', trx: 'TRX-847294', subtotal: 200, discount: 0, copay: 20,
    clinic: 120, doctorRev: 80, date: '2023-10-24', by: 'j.smith' },
  { name: 'Marcus Johnson', mrn: 'MR-60211', doctor: 'Dr. Allison Cameron', proc: 'Blood Panel Comprehensive', dept: 'Immunology', sub: 'Emergency', visit: 'New Visit',
    total: 750, status: 'Paid', mode: 'Online', trx: 'TRX-847295', subtotal: 850, discount: 100, copay: 150,
    clinic: 650, doctorRev: 100, date: '2023-10-24', by: 'k.williams' },
]

const MODE_ICON = { Insurance: Landmark, Card: CreditCard, Online: CreditCard, Cash: Banknote }

const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export { FILTERS, EMPTY, STATS, TRANSACTIONS, MODE_ICON, money };
