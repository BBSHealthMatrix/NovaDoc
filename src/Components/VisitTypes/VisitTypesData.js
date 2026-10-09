const QUEUE_MODES = ["Single Queue", "Partitioned Queue", "Multi-Step Visit"];

const PARTITIONS = ["None", "Doctor"];

// helper line shown under the queue mode on a card
const MODE_HINTS = {
  "Multi-Step Visit": "Patient follows ordered steps through counters",
  "Partitioned Queue": "Queue is split across counters",
};

const COLORS = ["#4982cf", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"];

const VISIT_TYPES = [
  { id: 1, name: "Normal Consultation", code: "NORM", prefix: "C", color: "#4982cf", mode: "Multi-Step Visit", partition: "None", active: true },
  { id: 2, name: "Urgent / Emergency", code: "EMER", prefix: "U", color: "#ef4444", mode: "Single Queue", partition: "None", active: true },
  { id: 3, name: "Follow-up Visit", code: "FLUP", prefix: "F", color: "#10b981", mode: "Single Queue", partition: "None", active: false },
];

const BLANK = { name: "", code: "", prefix: "", color: COLORS[0], mode: QUEUE_MODES[0], partition: PARTITIONS[0], active: true };

export { QUEUE_MODES, PARTITIONS, MODE_HINTS, COLORS, VISIT_TYPES, BLANK };