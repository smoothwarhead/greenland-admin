import { PERMS } from "../auth/perms";

export const buildNav = (base, role) => {
  return [
    {
      section: "Overview",
      links: [
        {
          label: "Overview",
          to: `${base}`,
          con: false,
        },
      ],
      auth: "GLOBAL",
    },
    {
      section: "Admin",
      links: [
        {
          label: "Farms",
          to: `${base}/admin/farms`,
          perm: PERMS.FARM_READ_OWN,
          con: () => {
            if (role === "SUPER_ADMIN" && this.to.includes("farms")) {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          label: "Zones",
          to: `${base}/admin/zones`,
          perm: PERMS.ZONE_READ_OWN,
          con: false
        },
      ],
      auth: PERMS.FARM_READ_OWN,
    },
    {
      section: "Poultry",
      links: [
        {
          label: "Houses",
          to: `${base}/poultry/houses`,
          perm: PERMS.POULTRY_READ_OWN,
          con: false

        },
        {
          label: "Flocks",
          to: `${base}/poultry/flocks`,
          perm: PERMS.POULTRY_READ_OWN,
          con: false

        },
        {
          label: "Daily Records",
          to: `${base}/poultry/daily`,
          perm: PERMS.POULTRY_READ_OWN,
          con: false

        },
      ],
      auth: PERMS.POULTRY_READ_OWN,
    },
    {
      section: "Crops",
      links: [
        {
          label: "Blocks",
          to: `${base}/crops/blocks`,
          perm: PERMS.CROPS_READ_OWN,
          con: false

        },
        {
          label: "Cycles",
          to: `${base}/crops/cycles`,
          perm: PERMS.CROPS_READ_OWN,
          con: false

        },
        {
          label: "Field Operations",
          to: `${base}/crops/operations`,
          perm: PERMS.CROPS_READ_OWN,
          con: false

        },
        {
          label: "Harvest",
          to: `${base}/crops/harvest`,
          perm: PERMS.CROPS_READ_OWN,
          con: false

        },
      ],
      auth: PERMS.CROPS_READ_OWN,
    },
    {
      section: "Inventory",
      links: [
        {
          label: "Items / SKUs",
          to: `${base}/inventory/items`,
          perm: PERMS.INVENTORY_READ_OWN,
          con: false

        },
        {
          label: "Warehouses",
          to: `${base}/inventory/warehouses`,
          perm: PERMS.INVENTORY_READ_OWN,
          con: false

        },
        {
          label: "Receive",
          to: `${base}/inventory/receive`,
          perm: PERMS.INVENTORY_READ_OWN,
          con: false

        },
        {
          label: "Issue",
          to: `${base}/inventory/issue`,
          perm: PERMS.INVENTORY_APPROVE_OWN,
          con: false

        },
      ],
      auth: PERMS.INVENTORY_READ_OWN,
    },
    {
      section: "staff & Finance",
      links: [
        {
          label: "Customers",
          to: `${base}/sales/customers`,
          perm: PERMS.SALES_READ_OWN,
          con: false

        },
        {
          label: "Sales Orders",
          to: `${base}/sales/orders`,
          perm: PERMS.SALES_READ_OWN,
          con: false

        },
        {
          label: "Finance Transactions",
          to: `${base}/finance/expenses`,
          perm: PERMS.FINANCE_READ_OWN,
          con: false

        },
      ],
      auth: PERMS.SALES_READ_OWN,
    },
    {
      section: "People & Assets",
      links: [
        {
          label: "Staff Directory",
          to: `${base}/staff/directory`,
          perm: PERMS.STAFF_READ_OWN,
          con: false

        },
        {
          label: "Attendance",
          to: `${base}/staff/attendance`,
          perm: PERMS.STAFF_READ_OWN,
          con: false

        },
        {
          label: "Task Logs",
          to: `${base}/staff/tasks`,
          perm: PERMS.STAFF_READ_OWN,
          con: false

        },

        {
          label: "Assets",
          to: `${base}/assets/register`,
          perm: PERMS.ASSETS_READ_OWN,
          con: false

        },
        {
          label: "Maintenance",
          to: `${base}/assets/maintenance`,
          perm: PERMS.ASSETS_READ_OWN,
          con: false

        },
        {
          label: "Fuel",
          to: `${base}/assets/fuel`,
          perm: PERMS.ASSETS_READ_OWN,
          con: false

        },
      ],
      auth: PERMS.STAFF_READ_OWN,
    },

    {
      section: "Reports",
      links: [
        {
          label: "KPIs",
          to: `${base}/reports/kpis`,
          perm: PERMS.REPORTS_READ_OWN,
          con: false

        },
      ],
      auth: PERMS.REPORTS_READ_OWN,
    },
  ];
};
