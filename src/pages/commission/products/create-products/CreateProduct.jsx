import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./create-product.scss";

import { Button, ButtonWithLefttIcon } from "../../../../components/ui/buttons/Buttons";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { useData } from "../../../../context/DataContext";


// import { ProductCard } from "../../../../components/ui/product/ProductCard";

import FormSelect from "../../../../components/ui/forms/form-select/FormSelect";
import { createProductData } from "../../../../data/others";
import FormInput from "../../../../components/ui/forms/form-input/FormInput";



// If your schema imports these already, remove below and use schema’s options.
// This is just here so the file compiles if you keep them local.
const COMMISSION_TYPES = [
  { value: "FLAT", label: "Flat" },
  { value: "PERCENT_BANDED", label: "Percent (Banded)" },
];

const makeSku = (name) => {
  const base = String(name || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base ? `COMM-${base}` : "COMM-";
};

const makeId = (name) => {
  const base = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const rand = Math.random().toString(16).slice(2, 8);
  return base ? `prd-${base}-${rand}` : `prd-${rand}`;
};

// Map your schema field names → actual form keys used in this page
const FIELD_KEY_MAP = {
  productName: "name",
  sku: "sku",
  category: "category",
  unit: "unit",
  flatAmount: "flatAmountNGN",
};

function validateSku(sku) {
  const s = String(sku || "").trim();
  if (!s) return "SKU is required.";
  if (!/^COMM-[A-Z0-9-]+$/.test(s)) return "SKU must look like COMM-TOMATOES.";
  return "";
}

export default function CreateProduct() {
  const nav = useNavigate();
  const { commissionState, setCommissionState } = useData();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "CROPS",
    unit: "KG",
    status: "ACTIVE",
    commissionType: "FLAT", // FLAT | PERCENT_BANDED
    flatAmountNGN: "",
  });

  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key) => setTouched((p) => ({ ...p, [key]: true }));

  const onAutoSku = () => setField("sku", makeSku(form.name));

  const errors = useMemo(() => {
    const e = {};

    // Schema-driven required fields
    if (!form.name.trim()) e.name = "Product name is required.";
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

  const canSubmit = Object.keys(errors).length === 0;

  const preview = useMemo(() => {
    const now = new Date().toISOString();
    const commission =
      form.commissionType === "FLAT"
        ? { type: "FLAT", flatAmountNGN: Number(form.flatAmountNGN || 0) }
        : { type: "PERCENT_BANDED" };

    return {
      id: "preview",
      name: form.name || "Product name…",
      sku: form.sku || makeSku(form.name || ""),
      category: form.category,
      unit: form.unit,
      status: form.status,
      updatedAt: now,
      commission,
    };
  }, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    // mark all touched
    const allTouched = {
      name: true,
      sku: true,
      category: true,
      unit: true,
      status: true,
      commissionType: true,
      flatAmountNGN: true,
    };
    setTouched(allTouched);

    if (!canSubmit) return;

    const now = new Date().toISOString();

    const newProduct = {
      id: makeId(form.name),
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
        const products = commission.products || [];

        const exists = products.some(
          (p) => String(p.sku || "").toUpperCase() === newProduct.sku
        );
        if (exists) throw new Error("A product with this SKU already exists.");

        return {
          ...prev,
          status: prev?.status || "ready",
          data: {
            ...prevData,
            commission: {
              ...commission,
              products: [newProduct, ...products],
            },
          },
        };
      });

      nav(-1);
    } catch (err) {
      setSubmitError(String(err?.message || err));
    }
  };

  // Build the render schema from createProductData:
  // - Map schema keys to form keys using FIELD_KEY_MAP
  // - Hide flatAmount if commissionType is not FLAT
  const schema = useMemo(() => {
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
  }, [form.commissionType]);

  return (
    <div className="page createProductPage">
      <div className="pageHeader">
        <div className="headerLeft">
          <ButtonWithLefttIcon
            icon={<FaArrowLeft />}
            text="Back"
            variant="ghost"
            action={() => nav(-1)}
          />
          <div className="headerTitle">
            <h2>Create Commission Product</h2>
            <p>Define product details and commission rules for marketplace agents.</p>
          </div>
        </div>

        <div className="headerActions">
          <ButtonWithLefttIcon
            icon={<FaCheck />}
            text="Save Product"
            variant="primary"
            action={handleSubmit}
          />
        </div>
      </div>

      <div className="page-body createProductBody">
        <form className="formCard" onSubmit={handleSubmit}>
          <div className="formGrid">
            {/* Schema-driven fields (Product Name, SKU, Category, Unit, Flat Amount) */}
            {schema.map((field) => {
              const key = field.formKey;
              const fieldError = touched[key] ? errors[key] : "";
              const common = {
                label: field.label,
                placeholder: field.placeholder,
                name: key,
                validate: field.validate,
                errorMessage: fieldError || field.errorMessage,
                cName: "input", // keep your styling hooks consistent
                value: form[key] ?? "",
                hint: field.hint,
              };

              // SKU: uppercase in input
              const handleValueChange = (eOrVal) => {
                if (field.options) {
                  // FormSelect gives value directly
                  setField(key, eOrVal);
                } else {
                  const next = eOrVal?.target?.value ?? "";
                  if (key === "sku") setField(key, next.toUpperCase());
                  else setField(key, next);
                }
              };

              const mark = () => markTouched(key);

              // Render select if options exists
              if (field.options) {
                return (
                  <div key={key} className="field">
                    <FormSelect
                      cName="product-select"
                      label={field.label}
                      placeholder={field.placeholder}
                      options={field.options}
                      value={form[key]}
                      onChange={(val) => {
                        setField(key, val);
                        markTouched(key);
                      }}
                      error={fieldError}
                      hint={field.hint}
                      name={key}
                    />
                  </div>
                );
              }

              // Render input otherwise
              return (
                <div key={key} className="field">
                  {/* Special case: SKU row includes Auto button */}
                  {key === "sku" ? (
                    <div className="row">
                      <FormInput
                        {...common}
                        inputType="text"
                        handleChange={handleValueChange}
                        onBlur={mark}
                      />
                      <button type="button" className="miniBtn" onClick={onAutoSku}>
                        Auto
                      </button>
                    </div>
                  ) : (
                    <FormInput
                      {...common}
                      inputType={key === "flatAmountNGN" ? "text" : "text"}
                      inputMode={key === "flatAmountNGN" ? "numeric" : undefined}
                      handleChange={handleValueChange}
                      onBlur={mark}
                    />
                  )}
                </div>
              );
            })}

            {/* Status (seg buttons) */}
            <div className="field">
              <label>Status *</label>
              <div className="seg">
                <div
                  type="div"
                  className={`segBtn ${form.status === "ACTIVE" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("status", "ACTIVE");
                    markTouched("status");
                  }}
                >
                  Active
                </div>
                <div
                  type="div"
                  className={`segBtn ${form.status === "INACTIVE" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("status", "INACTIVE");
                    markTouched("status");
                  }}
                >
                  Inactive
                </div>
              </div>
              {touched.status && errors.status ? <div className="err">{errors.status}</div> : null}
            </div>

            {/* Commission Type (select OR segment; here we keep segment but you can swap to FormSelect) */}
            <div className="field">
              <label>Commission Type *</label>
              <div className="seg">
                <div
                  type="div"
                  className={`segBtn ${form.commissionType === "FLAT" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("commissionType", "FLAT");
                    markTouched("commissionType");
                  }}
                >
                  Flat
                </div>
                <div
                  type="div"
                  className={`segBtn ${form.commissionType === "PERCENT_BANDED" ? "is-on" : ""}`}
                  onClick={() => {
                    setField("commissionType", "PERCENT_BANDED");
                    markTouched("commissionType");
                  }}
                >
                  Percent (Banded)
                </div>
              </div>

              {touched.commissionType && errors.commissionType ? (
                <div className="err">{errors.commissionType}</div>
              ) : null}

              <div className="hint">
                Use “Percent (Banded)” for products like Yams with range-based payout rules.
              </div>
            </div>

            {/* Optional alternative: make commission type a FormSelect */}
            {/* <FormSelect
              label="Commission Type *"
              placeholder="Choose"
              options={COMMISSION_TYPES}
              value={form.commissionType}
              onChange={(val) => setField("commissionType", val)}
              error={touched.commissionType ? errors.commissionType : ""}
            /> */}
          </div>

          {submitError ? <div className="submitErr">{submitError}</div> : null}

          <div className="formActions">
            <Button text="Cancel" variant="secondary" action={() => nav(-1)} />
            <Button
              text="Save Product"
              variant="primary"
              action={handleSubmit}
              disabled={!canSubmit}
            />
          </div>

          <div className="smallNote">
            Data source: <strong>{commissionState?.fromCache ? "Cache" : "Live"}</strong> • Status:{" "}
            <strong>{commissionState?.status || "idle"}</strong>
          </div>
        </form>

        {/* Preview (enable if you want) */}
        {/* <aside className="previewCard">
          <div className="previewHeader">
            <h3>Preview</h3>
            <p>This is how your product card will look in the list.</p>
          </div>
          <ProductCard product={preview} />
        </aside> */}
      </div>
    </div>
  );
}
