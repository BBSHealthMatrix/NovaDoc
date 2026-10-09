const FIELD_TYPES = ["Text", "Number", "Dropdown", "Checkbox", "Radio", "Date", "Textarea", "File Upload", "Signature"];

let uid = 0;

const newId = (p) => p + ++uid + "_" + Date.now();

const slug = (t) => t.toLowerCase().replace(/\s+/g, "-");

export { newId, slug, FIELD_TYPES };
