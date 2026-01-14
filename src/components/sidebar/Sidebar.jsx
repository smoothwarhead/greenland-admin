import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { buildSidebarTreeExact } from "../../app/sidebarRules";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.scss";
import NavLogo from "../../assets/logos/G-LOGO-CLEAN-LIGHT.png";
import { farmSelectData } from "../../pages/farm-selection/farm-select-data";

import { FARMS, STORES } from "../../app/orgMap";
import { MdHome, MdOutlineCorporateFare, MdOutlineDashboard } from "react-icons/md";
import { FaDotCircle, FaStoreAlt } from "react-icons/fa";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { TbCurrencyNaira } from "react-icons/tb";
import { AiOutlineAudit } from "react-icons/ai";
import { BiSolidDownArrow, BiSolidRightArrow } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useData } from "../../context/DataContext";

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function getFarmName(id) {
  return FARMS.find((f) => f.id === id)?.name || null;
}
function getStoreName(id) {
  return STORES.find((s) => s.id === id)?.name || null;
}

function Icon({ name }) {
  // Minimal “icons” (no lib). Add more as needed.
  const map = {
    dash: <MdOutlineDashboard />,
    farms: <MdHome />,
    stores: <FaStoreAlt />,
    ops: <RiArrowLeftRightFill />,
    hr: <MdOutlineCorporateFare />,
    fin: <TbCurrencyNaira />,
    audit: <AiOutlineAudit />,
    chevDown: <BiSolidDownArrow />,
    chevRight: <BiSolidRightArrow />,
    search: <FiSearch />,
  };
  return (
    <span className="sbIcon" aria-hidden="true">
      {map[name] || <FaDotCircle />}
    </span>
  );
}

function GroupIconName(group) {
  if (group === "Overview") return "dash";
  if (group === "Farms") return "farms";
  if (group === "Stores") return "stores";
  if (group === "Operations") return "ops";
  if (group === "HR") return "hr";
  if (group.startsWith("Finance")) return "fin";
  if (group === "Audit") return "audit";
  return "dash";
}

function Section({ label, children, defaultOpen = true, compact }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="sbSection">
      <div
        className={cx("sbSectionBtn", compact && "isCompact")}
        onClick={() => setOpen((v) => !v)}
        title={compact ? label : undefined}
      >
        {!compact ? (
          <span className="sbSectionLabel">{label}</span>
        ) : (
          <span className="sbCompactDot" />
        )}
        <span className="sbChevron" aria-hidden="true">
          <Icon name={open ? "chevDown" : "chevRight"} />
        </span>
      </div>

      {open ? <div className="sbSectionChildren">{children}</div> : null}
    </div>
  );
}

function RouteItem({ label, to, compact }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx("sbItem", isActive && "active", compact && "isCompact")
      }
      title={compact ? label : undefined}
      end
    >
      <span className="sbItemAccent" aria-hidden="true" />
      <span className="sbItemLabel">{label}</span>
    </NavLink>
  );
}

function Node({ node, compact, query }) {
  const q = (query || "").trim().toLowerCase();

  if (node.type === "route") {
    if (q && !node.label.toLowerCase().includes(q)) return null;
    return <RouteItem label={node.label} to={node.to} compact={compact} />;
  }

  if (node.type === "section") {
    // Filter: only show section if any child matches query
    const filteredKids = node.children
      .map((c, idx) => (
        <Node key={idx} node={c} compact={compact} query={query} />
      ))
      .filter(Boolean);

    if (q && filteredKids.length === 0) return null;

    return (
      <Section label={node.label} compact={compact} defaultOpen={!q}>
        {filteredKids}
      </Section>
    );
  }

  return null;
}

export function Sidebar() {
  const loc = useLocation();
  const { can, inFarmScope, inStoreScope, activeFarmId, activeStoreId, user } =  useAuth();

  // const { activeContext } = useData();


  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const tree = useMemo(() => {
    return buildSidebarTreeExact({
      can,
      inFarmScope,
      inStoreScope,
      activeFarmId,
      activeStoreId,
    });
  }, [can, inFarmScope, inStoreScope, activeFarmId, activeStoreId]);

  // const filtered = filterSidebarForUser(SIDEBAR, { can, activeFarmId, activeStoreId });

  const farmName = activeFarmId ? getFarmName(activeFarmId) : null;
  const storeName = activeStoreId ? getStoreName(activeStoreId) : null;

  const contextText = farmName
    ? farmName
    : storeName
    ? storeName
    : "No context";
  const contextType = farmName ? "Farm" : storeName ? "Store" : "—";

  return (
    <aside className={cx("sidebarPro", collapsed && "collapsed")}>
      {/* Header */}
      <div className="sbHeader">
        <div className="sbBrand">
          <div className="sbLogo">
            <img src={NavLogo} alt="company-logo" />
          </div>
          {!collapsed ? (
            <div className="sbBrandText">
              <div className="sbBrandTitle">Greenland Admin</div>
              {/* <div className="sbBrandSub">Operations Console</div> */}
            </div>
          ) : null}
        </div>

        <button
          className="sbCollapseBtn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "⟫" : "⟪"}
        </button>
      </div>

      {/* Context pill */}
      <div className="sbContext">
        {!collapsed ? (
          <>
            <div className="sbContextTop">
              {/* <span className="sbContextTag">{contextType}</span> */}
              <span className="sbContextName"  title={contextText}>{contextText}</span>
            </div>
           
          </>
        ) : (
          <div className="sbContextMini" title={contextText}>
            {contextType === "Farm" ? "⌂" : contextType === "Store" ? "⌁" : "•"}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="sbSearch">
        {!collapsed ? (
          <div className="sbSearchBox">
            <Icon name="search" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sbSearchInput"
              placeholder="Search menu…"
            />
          </div>
        ) : (
          <div
            className="sbSearchMini"
            title="Search is available when expanded"
          >
            <Icon name="search" />
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="sbScroll">
        {tree.map((g) => (
          <div key={g.group} className="sbGroup">
            <div className={cx("sbGroupTitle", collapsed && "isCompact")}>
              <Icon name={GroupIconName(g.group)} />
              {!collapsed ? <span>{g.group}</span> : null}
            </div>

            <div className="sbGroupBody">
              {g.items.map((node, idx) => (
                <Node key={idx} node={node} compact={collapsed} query={query} />
              ))}
            </div>
          </div>
        ))}
      </div>


    </aside>
  );
}
