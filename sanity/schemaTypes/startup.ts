export default {
  name: "startup",
  title: "Startup",
  type: "document",
  fields: [
    {
      name: "startup_name",
      title: "Startup Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "industry",
      title: "Industry",
      type: "string",
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
      name: "entrepreneur_id",
      title: "Entrepreneur ID",
      type: "string",
    },
   {
  name: "rejection_reason",
  title: "Rejection Reason",
  type: "text",
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


  ],
};
