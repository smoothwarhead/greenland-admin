// src/components/ProductCard.jsx
import { Button } from "../buttons/Buttons";
import "./product-card.scss";
import { GoDotFill } from "react-icons/go";

export function ProductCard({ product, onView, onEdit, onToggle }) {
  const { name, sku, category, unit, status, commission, updatedAt } = product;

  return (
    <div className="productCard">
      <div className="productCardHeader">
        <div className="productTitle">{name}</div>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>

      <div className="productMeta">
        <span>{category}</span>
        <GoDotFill />
        <span>Unit: {unit}</span>
      </div>

      <div className="divider" />

      <div className="commissionBlock">
        <div className="sectionTitle">Commission</div>

        {commission.type === "FLAT" && (
          <div className="commissionValue">
            <span className="badge flat">Flat</span>
            <span>
              ₦{commission.flatAmountNGN.toLocaleString()} per {unit}
            </span>
          </div>
        )}

        {commission.type === "PERCENT_BANDED" && (
          <div className="commissionValue">
            <span className="badge percent">%</span>
            <span>Percentage (Band-based)</span>
          </div>
        )}
      </div>

      <div className="divider" />

      <div className="productFooter">
        <div className="sku">SKU: {sku}</div>
        <div className="updated">
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="actions">
        
        <Button variant="ghost" text="View" action={onView} />
        <Button variant="" text="Edit" action={onEdit} />
        <Button
          variant={`btn ${status === "ACTIVE" ? "danger" : "success"}`}
          text={status === "ACTIVE" ? "Disable" : "Activate"}
          action={onToggle}
        />
      
      </div>
    </div>
  );
}
