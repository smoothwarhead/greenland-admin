import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./edit-product.scss";
import "../create-products/create-product.scss";

import { FaArrowLeft, FaCheck, FaTrash } from "react-icons/fa6";
// import { useData } from "../../../../context/DataContext";
import { Button, ButtonWithLefttIcon } from "../../../../components/ui/buttons/Buttons";

import FormInput from "../../../../components/ui/forms/form-input/FormInput";
import FormSelect from "../../../../components/ui/forms/form-select/FormSelect";
import { createProductData } from "../../../../data/others";
import { useData } from "../../../../context/DataContext";




const makeSku = (name) => {
  const base = String(name || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `COMM-${base}` : "COMM-";
};

// Map schema field names → form keys used in this page
const FIELD_KEY_MAP = {
  productName: "name",
  sku: "sku",
  category: "category",
  unit: "unit",
  flatAmount: "flatAmountNGN",
};

function validateSku(sku) {
  const s = String(sku || "").trim().toUpperCase();
  if (!s) return "SKU is required.";
  if (!/^COMM-[A-Z0-9-]+$/.test(s)) return "SKU must look like COMM-TOMATOES.";
  return "";
}

export default function EditProduct() {
  const nav = useNavigate();
  const { id } = useParams();
  const { commissionState, setCommissionState } = useData();

  const products = useMemo(
    () => commissionState?.data?.commission?.products || [],
    [commissionState?.data]
  );

  const product = useMemo(
    () => products.find((p) => p.id === id) || null,
    [products, id]
  );

  const [form, setForm] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");

  // hydrate form
  useEffect(() => {
    if (!product) return;

    const commissionType =
      product?.commission?.type === "PERCENT_BANDED" ? "PERCENT_BANDED" : "FLAT";

    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "CROPS",
      unit: product.unit || "KG",
      status: product.status || "ACTIVE",
      commissionType,
      flatAmountNGN:
        commissionType === "FLAT"
          ? String(product?.commission?.flatAmountNGN ?? "")
          : "",
    });

    setTouched({});
    setSubmitError("");
  }, [product]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const markTouched = (key) => setTouched((p) => ({ ...p, [key]: true }));

  const onAutoSku = () => form && setField("sku", makeSku(form.name));

  const errors = useMemo(() => {
    if (!form) return {};
    const e = {};

    if (!String(form.name || "").trim()) e.name = "Product name is required.";
    if (!form.category) e.category = "Category is required.";
    if (!form.unit) e.unit = "Unit is required.";

    const skuErr = validateSku(form.sku);
    if (skuErr) e.sku = skuErr;

    if (!form.status) e.status = "Status is required.";
    if (!form.commissionType) e.commissionType = "Commission type is required.";

    if (form.commissionType === "FLAT") {
      const n = Number(form.flatAmountNGN);
      if (form.flatAmountNGN === "") e.flatAmountNGN = "Flat amount is required.";
      else if (Number.isNaN(n)) e.flatAmountNGN = "Flat amount must be a number.";
      else if (n < 0) e.flatAmountNGN = "Flat amount cannot be negative.";
    }

    return e;
  }, [form]);

  const canSubmit = !!form && Object.keys(errors).length === 0;

  const schema = useMemo(() => {
    if (!form) return [];
    return createProductData
      .filter((f) => {
        const key = FIELD_KEY_MAP[f.name] || f.name;
        if (key === "flatAmountNGN" && form.commissionType !== "FLAT") return false;
        return true;
      })
      .map((f) => ({
        ...f,
        formKey: FIELD_KEY_MAP[f.name] || f.name,
      }));
  }, [form]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!form || !product) return;

    setSubmitError("");

    // mark all touched
    setTouched({
      name: true,
      sku: true,
      category: true,
      unit: true,
      status: true,
      commissionType: true,
      flatAmountNGN: true,
    });

    if (!canSubmit) return;

    const now = new Date().toISOString();

    const next = {
      ...product,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      unit: form.unit,
      status: form.status,
      updatedAt: now,
      commission:
        form.commissionType === "FLAT"
          ? { type: "FLAT", flatAmountNGN: Number(form.flatAmountNGN) }
          : { type: "PERCENT_BANDED" },
    };

    try {
      setCommissionState((prev) => {
        const prevData = prev?.data || {};
        const commission = prevData.commission || {};
        const list = commission.products || [];

        // prevent SKU duplicates (except current)
        const skuUpper = next.sku.toUpperCase();
        const dup = list.some(
          (p) => p.id !== next.id && String(p.sku || "").toUpperCase() === skuUpper
        );
        if (dup) throw new Error("Another product already uses this SKU.");

        return {
          ...prev,
          status: prev?.status || "ready",
          data: {
            ...prevData,
            commission: {
              ...commission,
              products: list.map((p) => (p.id === next.id ? next : p)),
            },
          },
        };
      });

      nav(-1);
    } catch (err) {
      setSubmitError(String(err?.message || err));
    }
  };

  const handleDelete = () => {
    if (!product) return;
    const ok = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!ok) return;

    setCommissionState((prev) => {
      const prevData = prev?.data || {};
      const commission = prevData.commission || {};
      const list = commission.products || [];

      return {
        ...prev,
        status: prev?.status || "ready",
        data: {
          ...prevData,
          commission: {
            ...commission,
            products: list.filter((p) => p.id !== product.id),
          },
        },
      };
    });

    nav(-1);
  };

  // Loading states
  if (commissionState?.status === "loading") {
    return (
      <div className="page editProductPage">
        <div className="pageHeader">
          <ButtonWithLefttIcon
            icon={<FaArrowLeft />}
            text="Back"
            variant="ghost"
            action={() => nav(-1)}
          />
        </div>
        <div className="page-body">
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  if (commissionState?.status === "error") {
    return (
      <div className="page editProductPage">
        <div className="pageHeader">
          <ButtonWithLefttIcon
            icon={<FaArrowLeft />}
            text="Back"
            variant="ghost"
            action={() => nav(-1)}
          />
        </div>
        <div className="page-body">
          <p style={{ color: "crimson" }}>{commissionState?.error}</p>
        </div>
      </div>
    );
  }

  if (!product || !form) {
    return (
      <div className="page editProductPage">
        <div className="pageHeader">
          <ButtonWithLefttIcon
            icon={<FaArrowLeft />}
            text="Back"
            variant="ghost"
            action={() => nav(-1)}
          />
        </div>
        <div className="page-body">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page editProductPage">
      <div className="pageHeader">
        <div className="headerLeft">
          <ButtonWithLefttIcon
            icon={<FaArrowLeft />}
            text="Back"
            variant="ghost"
            action={() => nav(-1)}
          />
          <div className="headerTitle">
            <h2>Edit Product</h2>
            <p>Update product details and commission rules.</p>
          </div>
        </div>

        <div className="headerActions">
          <ButtonWithLefttIcon
            icon={<FaTrash />}
            text="Delete"
            variant="danger"
            action={handleDelete}
          />
          <ButtonWithLefttIcon
            icon={<FaCheck />}
            text="Save Changes"
            variant="primary"
            action={handleSubmit}
          />
        </div>
      </div>

      <div className="page-body editProductBody">
        <form className="formCard" onSubmit={handleSubmit}>
          <div className="formGrid">
            {/* Schema-driven fields (Product Name, SKU, Category, Unit, Flat Amount) */}
            {schema.map((field) => {
              const key = field.formKey;
              const showErr = touched[key] ? errors[key] : "";
              const baseProps = {
                name: key,
                label: field.label,
                placeholder: field.placeholder,
                hint: field.hint,
              };

              // selects
              if (field.options) {
                return (
                  <div className="field" key={key}>
                    <FormSelect
                      {...baseProps}
                      options={field.options}
                      value={form[key]}
                      onChange={(val) => {
                        setField(key, val);
                        markTouched(key);
                      }}
                      error={showErr}
                      cName="product-select"

                    />
                  </div>
                );
              }

              // inputs
              const handleValueChange = (e) => {
                const next = e?.target?.value ?? "";
                if (key === "sku") setField(key, next.toUpperCase());
                else setField(key, next);
              };

              if (key === "sku") {
                return (
                  <div className="field" key={key}>
                    <div className="row">
                      <FormInput
                        {...baseProps}
                        cName="input"
                        inputType="text"
                        value={form[key] ?? ""}
                        validate={field.validate}
                        errorMessage={showErr || field.errorMessage}
                        error={!!showErr}
                        handleChange={handleValueChange}
                        onBlur={() => markTouched(key)}
                      />
                      <button type="button" className="miniBtn" onClick={onAutoSku}>
                        Auto
                      </button>
                    </div>
                    <div className="hint">Keep SKU unique across all commission products.</div>
                  </div>
                );
              }

              return (
                <div className="field" key={key}>
                  <FormInput
                    {...baseProps}
                    cName="input"
                    inputType="text"
                    inputMode={key === "flatAmountNGN" ? "numeric" : undefined}
                    value={form[key] ?? ""}
                    validate={field.validate}
                    errorMessage={showErr || field.errorMessage}
                    error={!!showErr}
                    handleChange={handleValueChange}
                    onBlur={() => markTouched(key)}
                  />
                </div>
              );
            })}

            {/* Status (seg buttons) */}
            <div className="field">
              <label>Status *</label>
              <div className="seg">
                <button
                  type="button"
                  className={`segBtn ${form.status === "ACTIVE" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("status", "ACTIVE");
                    markTouched("status");
                  }}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`segBtn ${form.status === "INACTIVE" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("status", "INACTIVE");
                    markTouched("status");
                  }}
                >
                  Inactive
                </button>
              </div>
              {touched.status && errors.status ? <div className="err">{errors.status}</div> : null}
            </div>

            {/* Commission Type (keep as segment like your original) */}
            <div className="field">
              <label>Commission Type *</label>
              <div className="seg">
                <button
                  type="button"
                  className={`segBtn ${form.commissionType === "FLAT" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("commissionType", "FLAT");
                    markTouched("commissionType");
                  }}
                >
                  Flat
                </button>
                <button
                  type="button"
                  className={`segBtn ${form.commissionType === "PERCENT_BANDED" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("commissionType", "PERCENT_BANDED");
                    markTouched("commissionType");
                  }}
                >
                  Percent (Banded)
                </button>
              </div>

              {touched.commissionType && errors.commissionType ? (
                <div className="err">{errors.commissionType}</div>
              ) : null}

              <div className="hint">
                Use “Percent (Banded)” for products like Yams with range-based payout rules.
              </div>
            </div>

            {/* Optional: If you want commission type as select instead */}
            {/* <div className="field">
              <FormSelect
                label="Commission Type *"
                placeholder="Choose type"
                options={COMMISSION_TYPES}
                value={form.commissionType}
                onChange={(val) => {
                  setField("commissionType", val);
                  markTouched("commissionType");
                }}
                error={touched.commissionType ? errors.commissionType : ""}
              />
            </div> */}
          </div>

          {submitError ? <div className="submitErr">{submitError}</div> : null}

          <div className="formActions">
            <Button text="Cancel" variant="secondary" action={() => nav(-1)} />
            <Button
              text="Save Changes"
              variant="primary"
              action={handleSubmit}
              disabled={!canSubmit}
            />
          </div>

          <div className="smallNote">
            Last updated: <strong>{new Date(product.updatedAt).toLocaleString()}</strong>
          </div>
        </form>
      </div>
    </div>
  );
}
