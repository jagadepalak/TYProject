export default {
  name: "investment",
  title: "Investment",
  type: "document",
  fields: [

    // ⭐ Reference to Startup (Main relation)
    {
      name: "startup",
      title: "Startup",
      type: "reference",
      to: [{ type: "startup" }],
      validation: (Rule: any) => Rule.required(),
    },

    // ⭐ Snapshot fields (FAST UI + REPORTING)
    {
      name: "startup_name",
      title: "Startup Name Snapshot",
      type: "string",
    },

    {
      name: "startup_industry",
      title: "Startup Industry Snapshot",
      type: "string",
    },

    {
      name: "entrepreneur_email",
      title: "Entrepreneur Email Snapshot",
      type: "string",
    },

    // ⭐ Investor Info
    {
      name: "investorEmail",
      title: "Investor Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },

    // ⭐ Investment Details
    {
      name: "amount",
      title: "Investment Amount",
      type: "number",
      validation: (Rule: any) => Rule.required().min(1),
    },

    {
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule: any) => Rule.max(500),
    },

    // ⭐ Status
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Pending", "Approved", "Rejected"],
      },
      initialValue: "Pending",
    },

    // ⭐ Rejection Tracking
    {
      name: "rejection_reason",
      title: "Rejection Reason",
      type: "string",
    },

    {
      name: "rejected_by",
      title: "Rejected By",
      type: "string",
    },

    {
      name: "rejected_at",
      title: "Rejected At",
      type: "datetime",
    },

    // ⭐ Resubmit Control
    {
      name: "resubmit_count",
      title: "Resubmit Count",
      type: "number",
      initialValue: 0,
    },

    {
      name: "max_resubmit",
      title: "Max Resubmit Limit",
      type: "number",
      initialValue: 2,
    },

    // ⭐ Created Date
    {
      name: "created_at",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};