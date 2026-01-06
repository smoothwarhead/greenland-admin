import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Breadcrumbs } from "../../app/Breadcrumbs";
import { findRouteByPathname } from "../../app/routeMeta";
import { FARMS, STORES } from "../../app/orgMap";
import { buildTo } from "../../app/routeRegistry";
import { useContextSwitch } from "../../app/SwitcherGuard";
import "./topbar.scss";
import { IoIosArrowDown } from "react-icons/io";
import UserDropdown from "./UserDropdown";
import FormSelect from "../ui/forms/form-select/FormSelect";
import { ContextSelect } from "../ui/forms/context-select/ContextSelect";

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function getFarmName(id) {
  return FARMS.find((f) => f.id === id)?.name || id;
}
function getStoreName(id) {
  return STORES.find((s) => s.id === id)?.name || id;
}

function StatusChip({ label, status, detail }) {
  const cls =
    status === "loading"
      ? "isLoading"
      : status === "error"
      ? "isError"
      : status === "ready"
      ? "isReady"
      : "isIdle";

  return (
    <div className={cx("tbChip", cls)} title={detail || ""}>
      <span className="tbChipDot" aria-hidden="true" />
      <span className="tbChipLabel">{label}</span>
      {detail ? <span className="tbChipDetail">{detail}</span> : null}
    </div>
  );
}

function IconBtn({ title, onClick, children }) {
  return (
    <button className="tbIconBtn" title={title} onClick={onClick}>
      {children}
    </button>
  );
}

export function Topbar() {
  const [userDrop, setUserDrop] = useState(false);

  const nav = useNavigate();
  const loc = useLocation();

  const { user, inFarmScope, inStoreScope, activeFarmId, activeStoreId } =
    useAuth();

  const { farmState, storeState } = useData();

  const routeInfo = useMemo(
    () => findRouteByPathname(loc.pathname),
    [loc.pathname]
  );
  const pageTitle = routeInfo?.route?.label || "Dashboard";

  const accessibleFarms = FARMS.filter((f) => inFarmScope(f.id));
  const accessibleStores = STORES.filter((s) => inStoreScope(s.id));
  const hasAnyStoreScope = accessibleStores.length > 0;

  const { requestSwitch, ReAuthModal } = useContextSwitch({
    onSwitched: ({ type, id }) => {
      if (type === "farm")
        nav(buildTo("FARM_OVERVIEW", { farmId: id }), { replace: true });
      if (type === "store")
        nav(buildTo("STORE_OVERVIEW", { storeId: id }), { replace: true });
    },
  });

  // const farmChipDetail =
  //   farmState.status === "ready"
  //     ? `${getFarmName(activeFarmId)} • ${
  //         farmState.fromCache ? "cached" : "fresh"
  //       }`
  //     : farmState.status === "error"
  //     ? farmState.error
  //     : activeFarmId
  //     ? getFarmName(activeFarmId)
  //     : "No farm";

  // const storeChipDetail =
  //   storeState.status === "ready"
  //     ? `${getStoreName(activeStoreId)} • ${
  //         storeState.fromCache ? "cached" : "fresh"
  //       }`
  //     : storeState.status === "error"
  //     ? storeState.error
  //     : activeStoreId
  //     ? getStoreName(activeStoreId)
  //     : "No store";

  return (
    <>
      <header className="topbarPro">
        <div className="tb-top">
          {/* Right: user + context switchers */}
          <div className="tbRight">
            <div className="tbControls">
              <div className="tbFields">
                <ContextSelect
                  label="Farm"
                  value={activeFarmId}
                  placeholder="Choose farm"
                  options={accessibleFarms.map((f) => ({
                    value: f.id,
                    label: f.name,
                  }))}
                  onSelect={(id) => requestSwitch({ type: "farm", id })}
                />
              </div>

              {/* <div className="tbField">
                <label>Farm</label>
                <select
                  value={activeFarmId || ""}
                  onChange={(e) => {
                    const id = e.target.value || null;
                    if (!id) return;
                    requestSwitch({ type: "farm", id });
                  }}
                >
                  <option value="">(none)</option>
                  {accessibleFarms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {hasAnyStoreScope ? (
                <div className="tbFields">
                  <ContextSelect
                    label="Store"
                    value={activeStoreId}
                    placeholder="Choose store"
                    options={accessibleStores.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    onSelect={(id) => requestSwitch({ type: "store", id })}
                  />
                </div>
              ) : null}
            </div>

            <div className="tbUser">
              <div className="tbAvatar" aria-hidden="true">
                {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
              <div className="tbUserText">
                <div className="tbUserName">{user?.name || "User"}</div>
                <div className="tbUserRole">{user?.role || ""}</div>
              </div>

              <IoIosArrowDown onClick={() => setUserDrop(!userDrop)} />

              {userDrop && <UserDropdown />}
            </div>
          </div>
        </div>

        {/* Middle: statuses */}
        {/* <div className="tbCenter">
          <StatusChip label="Farm Sync" status={farmState.status} detail={farmChipDetail} />
          {hasAnyStoreScope ? (
            <StatusChip label="Store Sync" status={storeState.status} detail={storeChipDetail} />
          ) : null}
        </div> */}
      </header>
      <div className="sub-header">
        {/* Left: page title + breadcrumbs */}
        <div className="tbLeft">         
          <div className="tbCrumbs">
            <Breadcrumbs />
          </div>

           {/* <div className="tbTitleRow">
            <div className="tbTitle">{pageTitle}</div>
          </div> */}
        </div>
      </div>

      {ReAuthModal}
    </>
  );
}
