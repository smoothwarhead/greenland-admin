import React, { useMemo, useState } from "react";
import "./rules.scss";
// import "../products/products.scss";
import { FaPlus } from "react-icons/fa6";
import { useData } from "../../../context/DataContext";

import { ButtonWithLefttIcon, Button } from "../../../components/ui/buttons/Buttons";
import Modal from "../../../components/ui/modal/Modal"; // ✅ new modal path
import RuleCard from "../../../components/ui/rule/RuleCard";
import RuleForm from "../../../components/ui/rule-form/RuleForm";




export default function Rules() {
  const { commissionState, setCommissionState } = useData();

  const rules = useMemo(() => {
    return commissionState?.data?.commission?.rules || [];
  }, [commissionState?.data]);

  const [openCreate, setOpenCreate] = useState(false);
  const [editRule, setEditRule] = useState(null);

  // We store the last draft coming from RuleForm, then commit on footer Save.
  const [draftRule, setDraftRule] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const closeCreate = () => {
    setOpenCreate(false);
    setDraftRule(null);
    setSubmitError("");
  };

  const closeEdit = () => {
    setEditRule(null);
    setDraftRule(null);
    setSubmitError("");
  };

  const toggleStatus = (ruleId) => {
    setCommissionState((prev) => {
      const prevData = prev?.data || {};
      const commission = prevData.commission || {};
      const list = commission.rules || [];

      return {
        ...prev,
        status: prev?.status || "ready",
        data: {
          ...prevData,
          commission: {
            ...commission,
            rules: list.map((r) =>
              r.id === ruleId
                ? { ...r, status: r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
                : r
            ),
          },
        },
      };
    });
  };

  const deleteRule = (ruleId) => {
    const ok = window.confirm("Delete this rule? This cannot be undone.");
    if (!ok) return;

    setCommissionState((prev) => {
      const prevData = prev?.data || {};
      const commission = prevData.commission || {};
      const list = commission.rules || [];

      return {
        ...prev,
        status: prev?.status || "ready",
        data: {
          ...prevData,
          commission: {
            ...commission,
            rules: list.filter((r) => r.id !== ruleId),
          },
        },
      };
    });
  };

  const commitCreate = () => {
    setSubmitError("");
    if (!draftRule) {
      setSubmitError("Fill the form before saving.");
      return;
    }

    setCommissionState((prev) => {
      const prevData = prev?.data || {};
      const commission = prevData.commission || {};
      const list = commission.rules || [];

      if (list.some((r) => r.id === draftRule.id)) {
        throw new Error("A rule with this ID already exists.");
      }

      const nextRules = [draftRule, ...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));

      return {
        ...prev,
        status: prev?.status || "ready",
        data: {
          ...prevData,
          commission: {
            ...commission,
            rules: nextRules,
          },
        },
      };
    });

    closeCreate();
  };

  const commitEdit = () => {
    setSubmitError("");
    if (!draftRule) {
      setSubmitError("No changes to save.");
      return;
    }

    setCommissionState((prev) => {
      const prevData = prev?.data || {};
      const commission = prevData.commission || {};
      const list = commission.rules || [];

      const nextRules = list
        .map((r) => (r.id === draftRule.id ? draftRule : r))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));

      return {
        ...prev,
        status: prev?.status || "ready",
        data: {
          ...prevData,
          commission: {
            ...commission,
            rules: nextRules,
          },
        },
      };
    });

    closeEdit();
  };

  const isLoading = commissionState?.status === "loading";
  const isError = commissionState?.status === "error";

  return (
    <div className="page commissionRulesPage">
      <div className="pageHeader">
        {/* <div className="headerTitle">
          <h2>Commission Rules</h2>
          <p>Define how agents earn commission by basis, conditions, and applicability.</p>
        </div> */}

        <div className="headerActions">
          <ButtonWithLefttIcon
            icon={<FaPlus />}
            text="Create Rule"
            variant="primary"
            action={() => {
              setOpenCreate(true);
              setDraftRule(null);
              setSubmitError("");
            }}
          />
        </div>
      </div>

      <div className="page-body">

        <div className="rules-con">
       
          {isLoading && <p>Loading rules…</p>}
          {isError && <p style={{ color: "crimson" }}>{commissionState?.error}</p>}

          {!isLoading && !isError && 

            (rules ? (
              rules.map((rule) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  onEdit={() => {
                    setEditRule(rule);
                    setDraftRule(rule); // start draft as existing
                    setSubmitError("");
                  }}
                  onToggle={() => toggleStatus(rule.id)}
                  onDelete={() => deleteRule(rule.id)}
                />
              )) 
            ) : (<p>No rules found at this time</p>))

           
          }

         </div>
      </div>

      {/* ✅ Create Modal (new custom modal API) */}
      <Modal
        isOpen={openCreate}
        title="Create Commission Rule"
        subtitle="Set basis, rate, conditions, applicability and priority."
        onClose={closeCreate}
        size="lg"
        // footer={
        //   <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        //     <Button text="Cancel" variant="secondary" action={closeCreate} />
        //     <Button text="Create Rule" variant="primary" action={commitCreate} disabled={!draftRule} />
        //   </div>
        // }
      >
        {submitError ? <div className="formBannerError">{submitError}</div> : null}

        <RuleForm
          mode="create"
          initial={null}
          onCancel={closeCreate}
          // ✅ RuleForm returns a valid rule object here
          onDraft={(ruleObj) => setDraftRule(ruleObj)}
        />
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal
        isOpen={!!editRule}
        title="Edit Commission Rule"
        subtitle={editRule ? `Editing: ${editRule.name}` : ""}
        onClose={closeEdit}
        size="lg"
        // footer={
        //   <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        //     <Button text="Cancel" variant="secondary" action={closeEdit} />
        //     <Button text="Save Changes" variant="primary" action={commitEdit} disabled={!draftRule} />
        //   </div>
        // }
      >
        {submitError ? <div className="formBannerError">{submitError}</div> : null}

        <RuleForm
          mode="edit"
          initial={editRule}
          onCancel={closeEdit}
          onDraft={(ruleObj) => setDraftRule(ruleObj)}
        />
      </Modal>
    </div>
  );
}
