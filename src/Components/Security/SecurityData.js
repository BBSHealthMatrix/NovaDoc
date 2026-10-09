export const ROLES = [
  { name: "Admin", color: "#4982cf" },
  { name: "Senior Doctor", color: "#7c3aed" },
  { name: "Doctor", color: "#10b981" },
  { name: "Nurse", color: "#f97316" },
  { name: "Front Desk", color: "#0ea5e9" },
  { name: "Billing", color: "#f59e0b" },
];

export const PERMISSIONS = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "sign", label: "Sign" },
  { key: "cosign", label: "Co-sign" },
  { key: "void", label: "Void" },
];

const p = (view, create, edit, sign, cosign, voidP) => ({
  view,
  create,
  edit,
  sign,
  cosign,
  void: voidP,
});

const basePerms = (doctorCosign) => ({
  Admin: p(true, true, true, true, true, true),
  "Senior Doctor": p(true, true, true, true, true, false),
  Doctor: p(true, true, true, true, doctorCosign, false),
  Nurse: p(true, true, true, false, false, false),
  "Front Desk": p(true, false, false, false, false, false),
  Billing: p(true, false, false, false, false, false),
});

export const ACCESS_DATA = [
  { id: "soap", name: "SOAP Note", perms: basePerms(false) },
  { id: "referral", name: "Referral", perms: basePerms(true) },
  { id: "lab", name: "Lab Order", perms: basePerms(false) },
  { id: "procedure", name: "Procedure Order", perms: basePerms(false) },
  { id: "prescription", name: "Prescription", perms: basePerms(false) },
  { id: "sick", name: "Sick Leave", perms: basePerms(true) },
];

export const SIGNING_DATA = [
  {
    id: "soap",
    name: "SOAP Note",
    sign: ["Senior Doctor", "Nurse", "Billing"],
    cosign: ["Admin", "Senior Doctor", "Front Desk"],
    coSignRequired: false,
    discardAfter: true,
    autoLock: "24",
    custom: false,
  },
  {
    id: "referral",
    name: "Referral",
    sign: ["Admin", "Senior Doctor", "Doctor"],
    cosign: ["Admin", "Senior Doctor"],
    coSignRequired: true,
    discardAfter: false,
    autoLock: "",
    custom: false,
  },
  {
    id: "lab",
    name: "Lab Order",
    sign: ["Admin", "Senior Doctor", "Doctor"],
    cosign: ["Admin", "Senior Doctor"],
    coSignRequired: false,
    discardAfter: false,
    autoLock: "",
    custom: false,
  },
  {
    id: "procedure",
    name: "Procedure Order",
    sign: ["Admin", "Senior Doctor", "Doctor"],
    cosign: ["Admin", "Senior Doctor"],
    coSignRequired: false,
    discardAfter: false,
    autoLock: "",
    custom: false,
  },
  {
    id: "prescription",
    name: "Prescription",
    sign: ["Admin", "Senior Doctor", "Doctor"],
    cosign: ["Admin", "Senior Doctor"],
    coSignRequired: false,
    discardAfter: false,
    autoLock: "",
    custom: false,
  },
  {
    id: "sick",
    name: "Sick Leave",
    sign: ["Admin", "Senior Doctor", "Doctor"],
    cosign: ["Admin", "Senior Doctor"],
    coSignRequired: true,
    discardAfter: false,
    autoLock: "",
    custom: false,
  },
];