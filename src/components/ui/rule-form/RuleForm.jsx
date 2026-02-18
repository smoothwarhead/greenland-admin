import React, { useMemo, useState } from "react";
import "./rule-form.scss";
import { Button } from "../buttons/Buttons";

const BASIS = [{ value: "NET_SALES", label: "Net Sales" }];
const RATE_TYPES = [
  { value: "PERCENT", label: "Percent" },
  { value: "FLAT", label: "Flat" },
];

const CHANNELS = ["WHATSAPP", "REFERRALS", "INSTAGRAM", "FACEBOOK", "DIRECT", "WEBSITE"];

const makeIdFromName = (name) => {
  const base = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `rule-${base}` : `rule-${Math.random().toString(16).slice(2, 8)}`;
};

const splitCsv = (s) =>
  String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const joinCsv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

export default function RuleForm({ mode = "create", initial, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    id: initial?.id || "",
    name: initial?.name || "",
    status: initial?.status || "ACTIVE",
    basis: initial?.basis || "NET_SALES",
    rateType: initial?.rateType || "PERCENT",
    rate: initial?.rate ?? 0,
    appliesSkuPrefixes: joinCsv(initial?.appliesTo?.skuPrefixes || []),
    appliesCategories: joinCsv(initial?.appliesTo?.categories || []),
    minNet: initial?.conditions?.minNet ?? "",
    channels: new Set(initial?.conditions?.channel || []),
    effectiveFrom: initial?.effectiveFrom || "",
    priority: initial?.priority ?? 0,
  }));

  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const mark = (k) => setTouched((p) => ({ ...p, [k]: true }));

  const toggleChannel = (ch) => {
    setForm((prev) => {
      const next = new Set(prev.channels);
      next.has(ch) ? next.delete(ch) : next.add(ch);
      return { ...prev, channels: next };
    });
  };

  const errors = useMemo(() => {
    const e = {};
    if (mode === "edit" && !form.id) e.id = "Rule ID is required.";
    if (mode === "create" && !form.id.trim() && !form.name.trim())
      e.id = "Provide a name or an ID.";

    if (form.id && !/^rule-[a-z0-9-]+$/.test(form.id)) e.id = "ID must look like rule-egg-crates.";
    if (!form.name.trim()) e.name = "Rule name is required.";
    if (!form.basis) e.basis = "Basis is required.";
    if (!form.rateType) e.rateType = "Rate type is required.";

    const rateNum = Number(form.rate);
    if (Number.isNaN(rateNum)) e.rate = "Rate must be a number.";
    else {
      if (form.rateType === "PERCENT" && (rateNum < 0 || rateNum > 100))
        e.rate = "Percent must be between 0 and 100.";
      if (form.rateType === "FLAT" && rateNum < 0) e.rate = "Flat amount cannot be negative.";
    }

    if (form.minNet !== "") {
      const n = Number(form.minNet);
      if (Number.isNaN(n) || n < 0) e.minNet = "minNet must be a valid number.";
    }

    if (form.effectiveFrom && !/^\d{4}-\d{2}-\d{2}$/.test(form.effectiveFrom))
      e.effectiveFrom = "Use YYYY-MM-DD format.";

    const pr = Number(form.priority);
    if (Number.isNaN(pr)) e.priority = "Priority must be a number.";

    return e;
  }, [form, mode]);

  const canSave = Object.keys(errors).length === 0;

  const handleAutoId = () => {
    const nextId = makeIdFromName(form.name);
    setField("id", nextId);
  };

  const handleSubmit = () => {
    setSubmitError("");
    setTouched({
      id: true,
      name: true,
      basis: true,
      rateType: true,
      rate: true,
      minNet: true,
      effectiveFrom: true,
      priority: true,
    });

    if (!canSave) return;

    const idFinal = form.id.trim() || makeIdFromName(form.name);

    const rule = {
      id: idFinal,
      name: form.name.trim(),
      status: form.status,
      basis: form.basis,
      rateType: form.rateType,
      rate: Number(form.rate),
      appliesTo: {
        skuPrefixes: splitCsv(form.appliesSkuPrefixes),
        categories: splitCsv(form.appliesCategories),
      },
      conditions: {
        minNet: form.minNet === "" ? undefined : Number(form.minNet),
        channel: Array.from(form.channels),
      },
      effectiveFrom: form.effectiveFrom || undefined,
      priority: Number(form.priority) || 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      onSave(rule);
    } catch (e) {
      setSubmitError(String(e?.message || e));
    }
  };

  return (
    <div className="ruleForm">
      <div className="grid">
        <div className="field">
          <label>Rule ID *</label>
          <div className="row">
            <input
              value={form.id}
              onChange={(e) => setField("id", e.target.value)}
              onBlur={() => mark("id")}
              placeholder="rule-egg-crates"
            />
            <button type="button" className="miniBtn" onClick={handleAutoId}>
              Auto
            </button>
          </div>
          {touched.id && errors.id ? <div className="err">{errors.id}</div> : null}
        </div>

        <div className="field">
          <label>Rule Name *</label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => mark("name")}
            placeholder="Egg Crates Commission"
          />
          {touched.name && errors.name ? <div className="err">{errors.name}</div> : null}
        </div>

        <div className="field">
          <label>Status</label>
          <div className="seg">
            <button
              type="button"
              className={`segBtn ${form.status === "ACTIVE" ? "is-on" : ""}`}
              onClick={() => setField("status", "ACTIVE")}
            >
              Active
            </button>
            <button
              type="button"
              className={`segBtn ${form.status === "INACTIVE" ? "is-on" : ""}`}
              onClick={() => setField("status", "INACTIVE")}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="field">
          <label>Basis</label>
          <select value={form.basis} onChange={(e) => setField("basis", e.target.value)} onBlur={() => mark("basis")}>
            {BASIS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {touched.basis && errors.basis ? <div className="err">{errors.basis}</div> : null}
        </div>

        <div className="field">
          <label>Rate Type</label>
          <select
            value={form.rateType}
            onChange={(e) => setField("rateType", e.target.value)}
            onBlur={() => mark("rateType")}
          >
            {RATE_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {touched.rateType && errors.rateType ? <div className="err">{errors.rateType}</div> : null}
        </div>

        <div className="field">
          <label>{form.rateType === "PERCENT" ? "Rate (%)" : "Rate (NGN)"}</label>
          <input
            value={form.rate}
            onChange={(e) => setField("rate", e.target.value)}
            onBlur={() => mark("rate")}
            inputMode="numeric"
            placeholder={form.rateType === "PERCENT" ? "e.g. 2.0" : "e.g. 200"}
          />
          {touched.rate && errors.rate ? <div className="err">{errors.rate}</div> : null}
        </div>

        <div className="field">
          <label>Applies To: SKU Prefixes</label>
          <input
            value={form.appliesSkuPrefixes}
            onChange={(e) => setField("appliesSkuPrefixes", e.target.value)}
            placeholder="EGG-, BROILER-"
          />
          <div className="hint">Comma-separated. Example: EGG-</div>
        </div>

        <div className="field">
          <label>Applies To: Categories</label>
          <input
            value={form.appliesCategories}
            onChange={(e) => setField("appliesCategories", e.target.value)}
            placeholder="Eggs, Poultry Outputs"
          />
          <div className="hint">Comma-separated category labels used in your rules system.</div>
        </div>

        <div className="field">
          <label>Condition: Minimum Net (NGN)</label>
          <input
            value={form.minNet}
            onChange={(e) => setField("minNet", e.target.value)}
            onBlur={() => mark("minNet")}
            placeholder="50000"
            inputMode="numeric"
          />
          {touched.minNet && errors.minNet ? <div className="err">{errors.minNet}</div> : null}
        </div>

        <div className="field">
          <label>Condition: Channels</label>
          <div className="chips">
            {CHANNELS.map((ch) => (
              <button
                type="button"
                key={ch}
                className={`chip ${form.channels.has(ch) ? "is-on" : ""}`}
                onClick={() => toggleChannel(ch)}
              >
                {ch}
              </button>
            ))}
          </div>
          <div className="hint">Select one or more channels.</div>
        </div>

        <div className="field">
          <label>Effective From</label>
          <input
            type="date"
            value={form.effectiveFrom}
            onChange={(e) => setField("effectiveFrom", e.target.value)}
            onBlur={() => mark("effectiveFrom")}
          />
          {touched.effectiveFrom && errors.effectiveFrom ? <div className="err">{errors.effectiveFrom}</div> : null}
        </div>

        <div className="field">
          <label>Priority</label>
          <input
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            onBlur={() => mark("priority")}
            inputMode="numeric"
            placeholder="10"
          />
          {touched.priority && errors.priority ? <div className="err">{errors.priority}</div> : null}
          <div className="hint">Higher priority runs first when multiple rules match.</div>
        </div>
      </div>

      {submitError ? <div className="submitErr">{submitError}</div> : null}

      <div className="actions">
        <Button text="Cancel" variant="secondary" action={onCancel} />
        <Button text="Save Rule" variant="primary" action={handleSubmit} disabled={!canSave} />
      </div>
    </div>
  );
}
