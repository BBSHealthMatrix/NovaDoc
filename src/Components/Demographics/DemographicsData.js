const f = (name, type) => ({ name, type, req: false, on: true, builtIn: true });

const SEED = [
  f("Language Spoken", "Text"),
  f("Ethnic Background", "Text"),
  f("Locality of Residence", "Text"),
  f("City of Residence", "Text"),
  f("Education", "Dropdown"),
  f("Type of Dwelling", "Dropdown"),
  f("Profession / Job", "Text"),
  f("Living Arrangement", "Dropdown"),
  f("Household Members", "Number"),
  f("Water Provision", "Dropdown"),
  f("Sanitation", "Dropdown"),
  f("Bathroom Availability", "Dropdown"),
  f("Mode of Transport", "Dropdown"),
  f("Meals Per Day", "Number"),
].map((x, i) => ({ ...x, id: i + 1 }));

const TYPES = ["Text", "Dropdown", "Number"];

const BADGE = { Text: "dmg-b-blue", Dropdown: "dmg-b-amber", Number: "dmg-b-purple" };

export { TYPES, SEED, BADGE };
