import { createClassNames } from "../../utils/classNames.js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Building2, ChevronDown, FileText, Layers, Pencil, Plus, ScanLine, Trash2 } from "lucide-react";
import Toggle from "../Toggle/Toggle";
import InlineInput from "./InlineInput";
import { MODALITIES, MODALITY_COLORS, newId } from "./ImagingTestListData.js";
import styles from "./ImagingTestList.module.css";

const cx = createClassNames(styles);

const TABS = [
  { to: "/admin/imaging-test-list", label: "Catalog", icon: Layers },
  { to: "/admin/reason-templates", label: "Reason Templates", icon: FileText },
  { to: "/admin/imaging-partners", label: "Imaging Partners", icon: Building2 },
];

const ImagingTestList = () => {
  const { pathname } = useLocation();
  const active = TABS.find((t) => t.to === pathname)?.to ?? TABS[0].to;
  const [mods, setMods] = useState(MODALITIES);
  const [closed, setClosed] = useState(() => new Set()); // collapsed modality / body-part ids
  const [editing, setEditing] = useState(null); // { kind: "addMod" | "addPart" | "addProto" | "renMod" | "renPart" | "renProto", id }

  const partCount = mods.reduce((n, m) => n + m.parts.length, 0);
  const protoCount = mods.reduce((n, m) => n + m.parts.reduce((k, b) => k + b.protocols.length, 0), 0);

  const toggleClosed = (id) => setClosed((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isEd = (kind, id) => editing?.kind === kind && editing?.id === id;
  const stop = () => setEditing(null);

  const patchMod = (mid, fn) => setMods((ms) => ms.map((m) => (m.id === mid ? fn(m) : m)));
  const patchPart = (mid, bid, fn) => patchMod(mid, (m) => ({ ...m, parts: m.parts.map((b) => (b.id === bid ? fn(b) : b)) }));

  const addModality = (name) => {
    const color = MODALITY_COLORS[mods.length % MODALITY_COLORS.length];
    setMods((ms) => [...ms, { id: newId("m"), name, color, on: true, parts: [] }]);
    stop();
  };
  const addPart = (mid, name) => { patchMod(mid, (m) => ({ ...m, parts: [...m.parts, { id: newId("b"), name, on: true, protocols: [] }] })); stop(); };
  const addProto = (mid, bid, name) => { patchPart(mid, bid, (b) => ({ ...b, protocols: [...b.protocols, { id: newId("p"), name }] })); stop(); };

  return (
    <div className={cx("it-wrap")}>
      <div className={cx("it-header")}>
        <div className={cx("it-hrow")}>
          <span className={cx("it-hicon")}><ScanLine size={15} /></span>
          <div>
            <h1 className={cx("it-title")}>Imaging Catalog</h1>
            <p className={cx("it-desc")}>Manage the imaging catalog, reason templates, and radiology partners</p>
          </div>
        </div>
        <div className={cx("it-tabs")}>
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className={cx(`it-tab ${active === t.to ? "it-tab-on" : ""}`)}>
                <Icon size={12} /> {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <>
        <div className={cx("it-bar")}>
          <p className={cx("it-stats")}>
            <b>{mods.length}</b> modalities · <b>{partCount}</b> body parts · <b>{protoCount}</b> protocols
          </p>
          <button type="button" className={cx("it-btn")} onClick={() => setEditing({ kind: "addMod", id: "top" })}>
            <Plus size={14} /> Add Modality
          </button>
        </div>

        <div className={cx("it-scroll")}>
          {isEd("addMod", "top") && (
            <InlineInput variant="top" placeholder="Modality name (e.g. Fluoroscopy)..." onSave={addModality} onCancel={stop} />
          )}

          <div className={cx("it-mods")}>
            {mods.map((m) => {
              const mOpen = !closed.has(m.id);
              return (
                <div className={cx(`it-mod ${m.on ? "" : "it-off"}`)} key={m.id}>
                  <div className={cx("it-mhead")}>
                    <button type="button" className={cx("it-chev")} onClick={() => toggleClosed(m.id)} aria-label={mOpen ? "Collapse" : "Expand"}>
                      <ChevronDown size={14} className={cx(mOpen ? "" : "it-chev-closed")} />
                    </button>
                    <i className={cx("it-dot")} style={{ background: m.color }} />
                    {isEd("renMod", m.id) ? (
                      <InlineInput
                        variant="flat"
                        initial={m.name}
                        placeholder="Modality name..."
                        onSave={(name) => { patchMod(m.id, (x) => ({ ...x, name })); stop(); }}
                        onCancel={stop}
                      />
                    ) : (
                      <span className={cx("it-mname")}>{m.name}</span>
                    )}
                    <span className={cx("it-mcount")}>{m.parts.length} body parts</span>
                    <Toggle size="large" color="softBlue" className={cx("it-tg")} on={m.on} onChange={() => patchMod(m.id, (x) => ({ ...x, on: !x.on }))} label={`${m.name} active`} />
                    <button type="button" className={cx("it-ico")} onClick={() => setEditing({ kind: "renMod", id: m.id })} aria-label={`Rename ${m.name}`}><Pencil size={13} /></button>
                    <button type="button" className={cx("it-ico it-ico-del")} onClick={() => setMods((ms) => ms.filter((x) => x.id !== m.id))} aria-label={`Delete ${m.name}`}><Trash2 size={13} /></button>
                  </div>

                  {mOpen && (
                    <>
                      {m.parts.map((b) => {
                        const bOpen = !closed.has(b.id);
                        return (
                          <div className={cx(`it-part ${b.on ? "" : "it-off"}`)} key={b.id}>
                            <div className={cx("it-phead")}>
                              <button type="button" className={cx("it-chev it-chev-sm")} onClick={() => toggleClosed(b.id)} aria-label={bOpen ? "Collapse" : "Expand"}>
                                <ChevronDown size={12} className={cx(bOpen ? "" : "it-chev-closed")} />
                              </button>
                              {isEd("renPart", b.id) ? (
                                <InlineInput
                                  variant="flat"
                                  initial={b.name}
                                  placeholder="Body part name..."
                                  onSave={(name) => { patchPart(m.id, b.id, (x) => ({ ...x, name })); stop(); }}
                                  onCancel={stop}
                                />
                              ) : (
                                <span className={cx("it-pname")}>{b.name}</span>
                              )}
                              <span className={cx("it-pcount")}>{b.protocols.length}</span>
                              <Toggle size="small" color="softBlue" className={cx("it-tg")} on={b.on} onChange={() => patchPart(m.id, b.id, (x) => ({ ...x, on: !x.on }))} label={`${b.name} active`} />
                              <button type="button" className={cx("it-ico it-ico-sm")} onClick={() => setEditing({ kind: "renPart", id: b.id })} aria-label={`Rename ${b.name}`}><Pencil size={11} /></button>
                              <button type="button" className={cx("it-ico it-ico-sm it-ico-del")} onClick={() => patchMod(m.id, (x) => ({ ...x, parts: x.parts.filter((y) => y.id !== b.id) }))} aria-label={`Delete ${b.name}`}><Trash2 size={11} /></button>
                            </div>

                            {bOpen && (
                              <div className={cx("it-protos")}>
                                {b.protocols.map((p) => (
                                  isEd("renProto", p.id) ? (
                                    <InlineInput
                                      key={p.id}
                                      variant="proto"
                                      initial={p.name}
                                      placeholder="Protocol name..."
                                      onSave={(name) => { patchPart(m.id, b.id, (x) => ({ ...x, protocols: x.protocols.map((y) => (y.id === p.id ? { ...y, name } : y)) })); stop(); }}
                                      onCancel={stop}
                                    />
                                  ) : (
                                    <div className={cx("it-proto")} key={p.id}>
                                      <i className={cx("it-pdot")} />
                                      <span>{p.name}</span>
                                      <div className={cx("it-proto-acts")}>
                                        <button type="button" onClick={() => setEditing({ kind: "renProto", id: p.id })} aria-label={`Rename ${p.name}`}><Pencil size={11} /></button>
                                        <button type="button" className={cx("it-ico-del")} onClick={() => patchPart(m.id, b.id, (x) => ({ ...x, protocols: x.protocols.filter((y) => y.id !== p.id) }))} aria-label={`Delete ${p.name}`}><Trash2 size={11} /></button>
                                      </div>
                                    </div>
                                  )
                                ))}
                                {isEd("addProto", b.id) ? (
                                  <InlineInput variant="proto" placeholder="Protocol name (e.g. AP & Lateral)..." onSave={(name) => addProto(m.id, b.id, name)} onCancel={stop} />
                                ) : (
                                  <button type="button" className={cx("it-addlink it-addproto")} onClick={() => setEditing({ kind: "addProto", id: b.id })}>
                                    <Plus size={10} /> Add Protocol
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {isEd("addPart", m.id) && (
                        <InlineInput variant="part" placeholder="Body part name (e.g. Lumbar Spine)..." onSave={(name) => addPart(m.id, name)} onCancel={stop} />
                      )}
                      <div className={cx("it-mfoot")}>
                        <button type="button" className={cx("it-addlink")} onClick={() => setEditing({ kind: "addPart", id: m.id })}>
                          <Plus size={10} /> Add Body Part
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button type="button" className={cx("it-addmod")} onClick={() => setEditing({ kind: "addMod", id: "top" })}>
            <Plus size={13} /> Add Modality
          </button>
        </div>
      </>
    </div>
  );
};

export default ImagingTestList;