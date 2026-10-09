import { Banknote, Shield, Building2, Heart } from "lucide-react";

const FIELD_TYPES = ["Text", "Number", "Dropdown", "Checkbox", "Radio", "Date", "Textarea", "File Upload", "Signature"];

let uid = 0;

const fld = (label, type, placeholder = "") => ({
  id: "f" + ++uid, label, type, placeholder, on: true, req: false,
});

const TYPES = [
  { key: "cash", name: "Cash", icon: Banknote, color: "green", on: true, configurable: false, fields: [] },
  {
    key: "insurance", name: "Insurance", icon: Shield, color: "blue", on: true, configurable: true,
    fields: [
      fld("Insurance Company", "Dropdown", "Select..."),
      fld("Insurance Number", "Text", "Policy number"),
      fld("Emergency Contact", "Text", "Phone"),
      fld("Notes", "Textarea", "Any additional notes..."),
    ],
  },
  {
    key: "corporate", name: "Corporate", icon: Building2, color: "orange", on: true, configurable: true,
    fields: [
      fld("Company Name", "Dropdown", "Select..."),
      fld("Employee ID", "Text", "ID / Number"),
      fld("Emergency Contact", "Text", "Phone"),
      fld("Notes", "Textarea", "Any additional notes..."),
    ],
  },
  { key: "welfare", name: "Welfare", icon: Heart, color: "red", on: false, configurable: false, fields: [] },
];

const slug = (t) => t.toLowerCase().replace(/\s+/g, "-");

const nextUid = () => ++uid;

export { TYPES, slug, nextUid, FIELD_TYPES };
