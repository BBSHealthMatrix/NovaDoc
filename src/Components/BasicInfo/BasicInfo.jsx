import { useState } from "react";
import { Plus, Info } from "lucide-react";
import FieldRow from "../FieldRow/FieldRow";
import AddFieldModal from "../AddFieldModal/AddFieldModal";
import BasicInfoStyles from "./BasicInfo.module.css";

const fld = (id, label, type, placeholder = "", on = true, req = false) => ({
  id, label, type, placeholder, on, req, builtIn: true,
});

const CORE = [
  fld("first", "First Name", "Text", "First name"),
  fld("last", "Last Name", "Text", "Last name"),
  fld("dob", "Date of Birth", "Date", "", true, true),
  fld("gender", "Gender", "Dropdown", "", false),
  fld("phone", "Phone Number", "Text", "+92 300 000-0000", true, true),
  fld("cnic", "CNIC", "Text", "00000-0000000-0", false),
  fld("ref", "Referred By", "Text", "Referrer name"),
  fld("addr", "Complete Address", "Textarea", "Street, area, city..."),
  fld("rel", "Relationship Type", "Dropdown"),
];

const RELATED = [
  fld("rname", "Related Person Name", "Text", "Full name"),
  fld("rcontact", "Related Person Contact", "Text", "Phone"),
  fld("rcnic", "Related Person CNIC", "Text", "00000-0000000-0"),
  fld("rdob", "Related Person DOB", "Date"),
];

const moveItem = (list, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const n = [...list];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
};
const patchItem = (list, id, patch) => list.map((f) => (f.id === id ? { ...f, ...patch } : f));

const BasicInfo = () => {
  const [core, setCore] = useState(CORE);
  const [related, setRelated] = useState(RELATED);
  const [addOpen, setAddOpen] = useState(false);

  const enabled = core.filter((f) => f.on).length;

  const renderList = (list, setList, cond) =>
    list.map((fd, i) => (
      <FieldRow
        key={fd.id}
        fd={fd}
        cond={cond}
        isFirst={i === 0}
        isLast={i === list.length - 1}
        onUp={() => setList((l) => moveItem(l, i, -1))}
        onDown={() => setList((l) => moveItem(l, i, 1))}
        onReq={() => setList((l) => patchItem(l, fd.id, { req: !fd.req }))}
        onOn={() => setList((l) => patchItem(l, fd.id, { on: !fd.on }))}
        onDelete={() => setList((l) => l.filter((f) => f.id !== fd.id))}
      />
    ));

  return (
    <div className={BasicInfoStyles["bif-page"]}>
      <h1 className={BasicInfoStyles["bif-title"]}>Basic Information</h1>
      <p className={BasicInfoStyles["bif-sub"]}>Configure the core patient identity fields shown in the registration form.</p>

      <div className={BasicInfoStyles["bif-card"]}>
        <div className={BasicInfoStyles["bif-card-head"]}>
          <h3>Core Fields</h3>
          <span>{enabled} of {core.length} enabled</span>
        </div>

        {renderList(core, setCore, false)}

        <button type="button" className={BasicInfoStyles["bif-add"]} onClick={() => setAddOpen(true)}>
          <Plus size={11} /> Add Field
        </button>
      </div>

      <div className={BasicInfoStyles["bif-cond-card"]}>
        <div className={BasicInfoStyles["bif-cond-head"]}>
          <Info size={13} />
          <div>
            <h4>Conditional Rule</h4>
            <p>
              When <b>Relationship Type</b> is <b>parent / spouse / guardian</b>, the fields below are shown
              to collect details about the related person.
            </p>
          </div>
        </div>

        <div className={BasicInfoStyles["bif-cond-list"]}>{renderList(related, setRelated, true)}</div>
      </div>

      {addOpen && (
        <AddFieldModal
          onClose={() => setAddOpen(false)}
          onAdd={(f) => {
            setCore((l) => [...l, f]);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default BasicInfo;
