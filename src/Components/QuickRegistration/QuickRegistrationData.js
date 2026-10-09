const FIELD_TYPES = ["Text", "Number", "Date", "Dropdown", "Textarea"];

const QUEUES = {
  general: [
    { key: "single", name: "Single Queue", sub: "Walk-in, auto-increment tokens" },
    { key: "partitioned", name: "Partitioned Queue", sub: "Per-doctor, multi-partition" },
  ],
  multi: [{ key: "norm", name: "Normal Consultation", sub: "NORM · multi-step" }],
};

let uid = 0;

const newId = (p) => p + ++uid + "_" + Date.now();

const defaultFields = () => [
  { id: "name", label: "Name", builtIn: true, visible: true, required: true },
  { id: "phone", label: "Phone", builtIn: true, visible: true, required: true },
  { id: "cnic", label: "CNIC", builtIn: true, visible: false, required: false },
  { id: "dob", label: "Date of Birth", builtIn: true, visible: false, required: false },
];

const BLANK_FORM = { label: "", type: "Text", placeholder: "", required: true };

export { FIELD_TYPES, QUEUES, newId, defaultFields, BLANK_FORM };
