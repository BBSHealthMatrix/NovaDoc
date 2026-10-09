import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Home/Home'
import Patients from './Components/Patients/Patients'
import Info from './Components/Info/Info'
import Queue from './Components/Queue/Queue'
import Counter from './Components/Counter/Counter'
import Appointments from './Components/Appointment/Appointments'
import HealthRecords from './Components/HealthRecords/HealthRecords'
import Messaging from './Components/Messaging/Messaging'
import Reports from './Components/Reports/Reports'
import Admin from './Components/Admin/Admin'
import styles from './App.module.css'
import Branches from './Components/Branches/Branches'
import Departments from './Components/Departments/Departments'
import Specialties from './Components/Specialties/Specialties'
import DoctorProfiles from './Components/DoctorProfiles/DoctorProfiles'
import FeesShares from './Components/FeesShares/FeesShares'
import BasicInfo from './Components/BasicInfo/BasicInfo'
import PatientTypes from './Components/PatientTypes/PatientTypes'
import Demographics from './Components/Demographics/Demographics'
import CustomSections from './Components/CustomSections/CustomSections'
import WorkflowBuilder from './Components/WorkflowBuilder/WorkflowBuilder'
import QuickRegistration from './Components/QuickRegistration/QuickRegistration'
import Triage from './Components/Triage/Triage'
import SpecialtyForms from './Components/Specialtyforms/Specialtyforms'
import HealthEd from './Components/HealthEd/HealthEd'
import History from './Components/History/History'
import VitalSigns from './Components/VitalSigns/VitalSigns'
import NoteStructure from './Components/NoteStructure/NoteStructure'
import ChiefComplaints from './Components/ChiefComplaints/ChiefComplaints'
import HpiTemplates from './Components/HpiTemplates/HpiTemplates'
import Allergies from './Components/Allergies/Allergies'
import Comorbidities from './Components/Comorbidities/Comorbidities'
import SurgicalProcedures from './Components/SurgicalProcedures/SurgicalProcedures'
import FamilyHistory from './Components/FamilyHistory/FamilyHistory'
import SocialHistory from './Components/SocialHistory/SocialHistory'
import RosConfig from './Components/RosConfig/RosConfig'
import PeBuilder from './Components/PeBuilder/PeBuilder'
import PocTests from './Components/PocTests/PocTests'
import Icd10Codes from './Components/Icd10Codes/Icd10Codes'
import PatientGoals from './Components/PatientGoals/PatientGoals'
import ReferralDestinations from './Components/ReferralDestinations/ReferralDestinations'
import TemplateManager from './Components/TemplateManager/TemplateManager'
import VisitTypes from './Components/VisitTypes/VisitTypes'
import WorkflowConfig from './Components/WorkflowConfig/WorkflowConfig'
import CounterTypes from './Components/CounterTypes/CounterTypes'
import Counters from './Components/Counters_admin/Counters'
import TokenSettings from './Components/TokenSettings/TokenSettings'
import QueueBehavior from './Components/QueueBehavior/QueueBehavior'
import Locking from './Components/Locking/Locking'  
import DisplaySettings from './Components/DisplaySettings/DisplaySettings'
import DoctorPartition from './Components/DoctorPartition/DoctorPartition'
import RoutingRules from './Components/RoutingRules/RoutingRules'
import ServiceTypes from './Components/ServiceTypes/ServiceTypes'
import ServicePricing from './Components/ServicePricing/ServicePricing'
import Packages from './Components/Packages/Packages'
import LabTestMasterList from './Components/LabTestMasterList/LabTestMasterList'
import LabProviders from './Components/LabProviders/LabProviders'
import ResultTemplates from './Components/ResultTemplates/ResultTemplates'
import LabOrderSets from './Components/LabOrderSets/LabOrderSets'
import ProcedureMasterList from './Components/ProcedureMasterList/ProcedureMasterList'
import ProcedurePartners from './Components/ProcedurePartners/ProcedurePartners'
import ProcedureTemplates from './Components/ProcedureTemplates/ProcedureTemplates'
import ImagingTestList from './Components/ImagingTestList/ImagingTestList'
import ReasonTemplates from './Components/ReasonTemplates/ReasonTemplates'
import ImagingPartners from './Components/ImagingPartners/ImagingPartners'
import ImagingOrderSets from './Components/ImagingOrderSets/ImagingOrderSets'
import VaccineMasterList from './Components/VaccineMasterList/VaccineMasterList'
import VaccinePartners from './Components/VaccinePartners/VaccinePartners'
import MedicineCatalogue from './Components/MedicineCatalogue/MedicineCatalogue'
import PrescriptionDefaults from './Components/prescriptiondefaults/PrescriptionDefaults'
import Bundles from './Components/Bundles/Bundles'
import Interactions from './Components/Interactions/Interactions'
import PediDosing from './Components/PediDosing/PediDosing'
import NonFormulary from './Components/NonFormulary/NonFormulary'
import PharmacyPartners from './Components/PharmacyPartners/PharmacyPartners'
import ConsumableItems from './Components/ConsumableItems/ConsumableItems'
import ConsumableProviders from './Components/ConsumableProviders/ConsumableProviders'
import InsurancePricing from './Components/InsurancePricing/InsurancePricing'
import CorporatePricing from './Components/CorporatePricing/CorporatePricing'
import WelfareSchemes from './Components/WelfareSchemes/WelfareSchemes'
import UsersCounters from './Components/UsersCounters/UsersCounters'
import SecurityPage from './Components/Security/Security.jsx'
import ProfileSettings from './Components/ProfileSettings/ProfileSettings'



const FOOTER = {
  '/our-scope': 'A connected vision for healthier communities',
  '/our-vision': 'Designing the future of connected care',
}

// pages that use the full screen (no footer)
const NO_FOOTER = ['/queue', '/appointments', '/health-records', '/messaging', '/reports', '/admin', '/profile']

const App = () => {
  const { pathname } = useLocation()
  const hideFooter = NO_FOOTER.some((p) => pathname.startsWith(p))

  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-scope" element={<Info key="scope" type="scope" />} />
          <Route path="/our-vision" element={<Info key="vision" type="vision" />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/financial" element={<Reports />} />
                    <Route path="/profile" element={<ProfileSettings />} />

          {/* admin: Admin = sidebar layout, child routes render inside it */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="branch-list" replace />} />
            <Route path="branch-list" element={<Branches />} />
            <Route path="departments-sub" element={<Departments />} />
            <Route path="specialties" element={<Specialties />} />
            <Route path="doctor-profiles" element={<DoctorProfiles />} />
            <Route path="fees-shares" element={<FeesShares />} />
            <Route path="basic-info" element={<BasicInfo />} />
            <Route path="patient-types" element={<PatientTypes />} />
            <Route path="demographics" element={<Demographics />} />
            <Route path="custom-sections" element={<CustomSections />} />
            <Route path="workflow-builder" element={<WorkflowBuilder />} />
            <Route path="quick-registration" element={<QuickRegistration />} />
            <Route path="triage" element={<Triage />} />
            <Route path="specialty-forms" element={<SpecialtyForms />} />
            <Route path="health-ed-library" element={<HealthEd />} />
            <Route path="history" element={<History />} />
            <Route path="vital-signs" element={<VitalSigns />} />
            <Route path="note-structure" element={<NoteStructure />} />
            <Route path="chief-complaints" element={<ChiefComplaints />} />
            <Route path="hpi-templates" element={<HpiTemplates />} />
            <Route path="allergies" element={<Allergies />} />
            <Route path="comorbidities" element={<Comorbidities />} />
            <Route path="surgical-procedures" element={<SurgicalProcedures />} />
            <Route path="family-history" element={<FamilyHistory />} />
            <Route path="social-history" element={<SocialHistory />} />
            <Route path="ros-config" element={<RosConfig />} />
            <Route path="pe-builder" element={<PeBuilder />} />
            <Route path="poc-tests" element={<PocTests />} />
            <Route path="icd-10-codes" element={<Icd10Codes />} />
            <Route path="patient-goals" element={<PatientGoals />} />
            <Route path="referral-destinations" element={<ReferralDestinations />} />
            <Route path="template-manager" element={<TemplateManager />} />
            <Route path="visit-types" element={<VisitTypes />} />
            <Route path="workflow-config" element={<WorkflowConfig />} />
            <Route path="counter-types" element={<CounterTypes />} />
            <Route path="counters" element={<Counters />} />
            <Route path="token-settings" element={<TokenSettings />} />
            <Route path="queue-behavior" element={<QueueBehavior />} />
            <Route path="locking" element={<Locking />} />
            <Route path="display" element={<DisplaySettings />} />
            <Route path="doctor-partition" element={<DoctorPartition />} />
            <Route path="routing-rules" element={<RoutingRules />} />
            <Route path="service-types" element={<ServiceTypes />} />
            <Route path="service-pricing" element={<ServicePricing />} />
            <Route path="packages-bundles" element={<Packages />} />
            <Route path="lab-test-master-list" element={<LabTestMasterList />} />
            <Route path="lab-providers" element={<LabProviders />} />
            <Route path="result-templates" element={<ResultTemplates />} />
            <Route path="lab-order-sets" element={<LabOrderSets />} />
            <Route path="procedure-master-list" element={<ProcedureMasterList />} />
            <Route path="procedure-partners" element={<ProcedurePartners />} />
            <Route path="templates" element={<ProcedureTemplates />} />
            <Route path="imaging-test-list" element={<ImagingTestList />} />
            <Route path="reason-templates" element={<ReasonTemplates />} />
            <Route path="imaging-partners" element={<ImagingPartners />} />
            <Route path="imaging-order-sets" element={<ImagingOrderSets />} />
            <Route path="vaccine-master-list" element={<VaccineMasterList />} />
            <Route path="vaccine-partners" element={<VaccinePartners />} />
            <Route path="medicine-catalogue" element={<MedicineCatalogue />} />
                        <Route path="prescription-defaults" element={<PrescriptionDefaults />} />
            <Route path="bundles" element={<Bundles />} />
            <Route path="drug-interactions" element={<Interactions />} />
            <Route path="pedi-dosing-guidelines" element={<PediDosing />} />
            <Route path="non-formulary" element={<NonFormulary />} />
            <Route path="pharmacy-partners" element={<PharmacyPartners />} />
            <Route path="consumable-items" element={<ConsumableItems />} />
            <Route path="consumable-providers" element={<ConsumableProviders />} />
            <Route path="insurance-pricing" element={<InsurancePricing />} />
            <Route path="corporate-pricing" element={<CorporatePricing />} />
            <Route path="welfare-schemes" element={<WelfareSchemes />} />
            <Route path="users-counters" element={<UsersCounters />} />
            <Route path="security" element={<SecurityPage />} />
                        
            <Route path="*" element={<div className={styles.placeholder}>This section is not built yet.</div>} />
          </Route>

          <Route path="/appointments/frontdesk" element={<Appointments key="frontdesk" role="frontdesk" />} />
          <Route path="/appointments/nursing" element={<Appointments key="nursing" role="nursing" />} />
          <Route path="/appointments/doctor/doc-1" element={<Appointments key="doc-1" role="doctor" fixedDoctor="emily" />} />
          <Route path="/appointments/doctor/doc-asif" element={<Appointments key="doc-asif" role="doctor" fixedDoctor="asif" />} />

          <Route path="/queue/token/single" element={<Queue key="single" mode="single" />} />
          <Route path="/queue/token/partitioned" element={<Queue key="partitioned" mode="partitioned" />} />
          <Route path="/queue/token/multistep" element={<Queue key="multistep" mode="multistep" />} />

          <Route path="/queue/frontdesk" element={<Counter key="frontdesk" role="frontdesk" />} />
          <Route path="/queue/nursing" element={<Counter key="nursing" role="nursing" />} />
          <Route path="/queue/doctor" element={<Counter key="doctor" role="doctor" />} />
          <Route path="/queue/lab" element={<Counter key="lab" role="lab" />} />

          <Route path="*" element={<div className="page"><h1 className="page-title">Coming soon</h1></div>} />
        </Routes>
      </main>

      {!hideFooter && (
        <footer className={styles.footer}>
          <span>NovaDoc EHR · {FOOTER[pathname] || 'Healthcare Management System'}</span>
          <span>v1.0.0</span>
        </footer>
      )}
    </div>
  )
}

export default App