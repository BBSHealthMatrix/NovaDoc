const RESET_OPTIONS = ["Daily", "Manual"];

const FORMATS = ["Padded", "Plain"];

const DEFAULTS = { prefix: "C", start: "1", reset: "Daily", format: "Padded", manual: false };

// prefix + number, padded to 3 digits when the format is "Padded"
const formatToken = (prefix, num, format) => `${prefix}${format === "Padded" ? String(num).padStart(3, "0") : num}`;

export { RESET_OPTIONS, FORMATS, DEFAULTS, formatToken };