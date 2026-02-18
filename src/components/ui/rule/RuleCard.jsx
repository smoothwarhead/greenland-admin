import React, { useMemo } from "react";
import "./rule-card.scss";
import { Button } from "../buttons/Buttons";
import { GoDotFill } from "react-icons/go";

const pretty = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ngn = (n) => {
  const v = Number(n);
  if (Number.isNaN(v)) return "—";
  return `₦${v.toLocaleString()}`;
};

function renderConditions(cond = {}) {
  const pills = [];

  if (cond.minNet != null) pills.push({ k: "Min Net", v: ngn(cond.minNet) });
  if (cond.minQty != null) pills.push({ k: "Min Qty", v: String(cond.minQty) });
  if (cond.minMonthlyQty != null) pills.push({ k: "Monthly Qty", v: String(cond.minMonthlyQty) });
  if (cond.minMonthlyNet != null) pills.push({ k: "Monthly Net", v: ngn(cond.minMonthlyNet) });

  if (Array.isArray(cond.channel) && cond.channel.length) {
    pills.push({ k: "Channel", v: cond.channel.join(", ") });
  }

  return pills;
}

export default function RuleCard({ rule, onEdit, onToggle, onDelete }) {
  const {
    id,
    name,
    status,
    basis,
    rateType,
    rate,
    appliesTo,
    conditions,
    bonus,
    effectiveFrom,
    priority,
  } = rule || {};

  const baseLabel = useMemo(() => {
    if (rateType === "PERCENT") return `${Number(rate || 0)}%`;
    if (rateType === "FLAT") return ngn(rate);
    return "—";
  }, [rateType, rate]);

  const appliesSummary = useMemo(() => {
    const sku = appliesTo?.skuPrefixes?.length ? `SKU: ${appliesTo.skuPrefixes.join(", ")}` : null;
    const cat = appliesTo?.categories?.length ? `Category: ${appliesTo.categories.join(", ")}` : null;
    return [sku, cat].filter(Boolean);
  }, [appliesTo]);

  const baseConds = useMemo(() => renderConditions(conditions), [conditions]);
  const bonusConds = useMemo(() => renderConditions(bonus?.conditions), [bonus?.conditions]);

  const hasBonus = !!bonus && bonus?.type === "PERCENT" && bonus?.rate != null;

  return (
    <div className="ruleCard">
      {/* HEADER */}
      <div className="ruleHeader">
        <div className="ruleTitleBlock">
          <div className="ruleTitle">{name}</div>
          <div className="ruleSub">
            {/* <span className="ruleId">{id}</span> */}
            <GoDotFill />
            <span>{pretty(basis)}</span>
            <GoDotFill />
            <span>Priority: {priority ?? 0}</span>
          </div>
        </div>

        <span className={`statusPill ${String(status || "").toLowerCase()}`}>
          {status}
        </span>
      </div>

      {/* APPLIES TO */}
      <div className="ruleApplies">
        <div className="label">Applies To</div>
        <div className="value">
          {appliesSummary.length ? appliesSummary.join(" • ") : "All Products"}
        </div>
      </div>

      <div className="divider" />

      {/* BASE COMMISSION */}
      <div className="ruleBlock">
        <div className="blockTop">
          <div className="blockTitle">Base Commission</div>
          <div className="blockValue">
            <span className={`badge ${rateType === "PERCENT" ? "percent" : "flat"}`}>
              {rateType === "PERCENT" ? "%" : "₦"}
            </span>
            <span className="strong">{baseLabel}</span>
          </div>
        </div>

        {baseConds.length ? (
          <div className="condGrid">
            {baseConds.map((c) => (
              <div className="condPill" key={`${c.k}-${c.v}`}>
                <span className="k">{c.k}:</span> <span className="v">{c.v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">No base conditions.</div>
        )}
      </div>

      {/* BONUS COMMISSION */}
      <div className="ruleBlock bonusBlock">
        <div className="blockTop">
          <div className="blockTitle">Performance Bonus</div>
          <div className="blockValue">
            {hasBonus ? (
              <>
                <span className="badge bonus">+%</span>
                <span className="strong">+{Number(bonus.rate)}%</span>
              </>
            ) : (
              <span className="muted">No bonus</span>
            )}
          </div>
        </div>

        {hasBonus ? (
          <>
            <div className="mutedSmall">
              Bonus Basis: <strong>{pretty(bonus?.basis || "NET_SALES")}</strong>
            </div>

            {bonusConds.length ? (
              <div className="condGrid">
                {bonusConds.map((c) => (
                  <div className="condPill bonus" key={`b-${c.k}-${c.v}`}>
                    <span className="k">{c.k}:</span> <span className="v">{c.v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted">No bonus conditions.</div>
            )}
          </>
        ) : null}
      </div>

      <div className="divider" />

      {/* FOOTER META */}
      <div className="ruleFooter">
        <div className="metaLine">
          <span className="metaKey">Effective:</span>{" "}
          <span className="metaVal">{effectiveFrom || "—"}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <Button variant="ghost" text="Edit" action={onEdit} />
        <Button variant="ghost" text="Delete" action={onDelete} />
        <Button
          variant={`btn ${status === "ACTIVE" ? "danger" : "success"}`}
          text={status === "ACTIVE" ? "Disable" : "Activate"}
          action={onToggle}
        />
      </div>
    </div>
  );
}
