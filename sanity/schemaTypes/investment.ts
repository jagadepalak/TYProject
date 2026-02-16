export default {
  name: "investment",
  title: "Investment",
  type: "document",
  fields: [

    {
      name: "startup",
      title: "Startup",
      type: "reference",
      to: [{ type: "startup" }],
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "investorEmail",
      title: "Investor Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },

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

    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Pending", "Approved", "Rejected"],
      },
      initialValue: "Pending",
    },

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

    {
      name: "created_at",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },

  ],
};
