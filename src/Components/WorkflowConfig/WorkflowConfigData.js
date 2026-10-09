const VISIT_TYPES = ["Normal Consultation", "Urgent / Emergency", "Follow-up Visit"];

const COUNTER_TYPES = ["Registration Counter", "Nursing Counter", "Doctor Room", "Lab Counter", "Pharmacy Counter"];

let n = 0;
const step = (name, counter, avg, mandatory, allowSkip) => ({ id: ++n, name, counter, avg, mandatory, allowSkip });

// ordered steps per visit type
const WORKFLOWS = {
  "Normal Consultation": [
    step("Patient Registration", "Registration Counter", 5, true, false),
    step("Vitals", "Nursing Counter", 5, true, false),
    step("Doctor Consultation", "Doctor Room", 20, true, false),
    step("Lab / Sample Collection", "Lab Counter", 10, false, true),
    step("Pharmacy / Dispensing", "Pharmacy Counter", 8, false, true),
  ],
  "Urgent / Emergency": [
    step("Vitals", "Nursing Counter", 5, true, false),
    step("Doctor Consultation", "Doctor Room", 15, true, false),
  ],
  "Follow-up Visit": [
    step("Patient Registration", "Registration Counter", 5, true, false),
    step("Doctor Consultation", "Doctor Room", 10, true, false),
  ],
};

export { VISIT_TYPES, COUNTER_TYPES, WORKFLOWS };