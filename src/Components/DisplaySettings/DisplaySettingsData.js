const SCREEN_TYPES = ["Main Lobby", "Counter", "Doctor Room"];

const COUNTERS = [
  "All Counters", "Registration Desk 1", "Registration Desk 2", "Dr. Room A", "Dr. Room B",
  "Lab Desk 1", "Pharmacy Desk", "Vitals Desk 1",
];

const THEMES = [
  { key: "Dark", dot: "#0f172b" },
  { key: "Light", dot: "#fff" },
  { key: "Branded", dot: "#4982cf" },
];

const ELEMENTS = [
  { key: "token", label: "Current Token" },
  { key: "counterName", label: "Counter Name" },
  { key: "queueCount", label: "Queue Count" },
  { key: "sound", label: "Sound Alert" },
  { key: "clock", label: "Show Clock" },
];

const FORMATS = ["Token + Counter", "Token Only"];

// demo values shown in every preview
const NOW_SERVING = 42;
const IN_QUEUE = 12;

const SCREENS = [
  {
    id: 1, name: "Main Lobby Display", type: "Main Lobby", counter: "All Counters", theme: "Dark",
    elements: { token: true, counterName: true, queueCount: true, sound: true, clock: true },
    format: "Token + Counter", showLast: "5", ticker: "Welcome to NovaDoc. Please wait for your token to be called.", active: true,
  },
  {
    id: 2, name: "Dr. Room A Screen", type: "Doctor Room", counter: "Dr. Room A", theme: "Dark",
    elements: { token: true, counterName: true, queueCount: false, sound: true, clock: false },
    format: "Token Only", showLast: "3", ticker: "", active: true,
  },
  {
    id: 3, name: "Registration Desk Screen", type: "Counter", counter: "Registration Desk 1", theme: "Light",
    elements: { token: true, counterName: false, queueCount: true, sound: false, clock: true },
    format: "Token + Counter", showLast: "3", ticker: "", active: true,
  },
];

const BLANK = {
  name: "New Screen", type: "Main Lobby", counter: "All Counters", theme: "Dark",
  elements: { token: true, counterName: true, queueCount: false, sound: true, clock: true },
  format: "Token + Counter", showLast: "5", ticker: "", active: true,
};

export { SCREEN_TYPES, COUNTERS, THEMES, ELEMENTS, FORMATS, NOW_SERVING, IN_QUEUE, SCREENS, BLANK };