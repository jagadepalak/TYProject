export default {
  name: "feedback",
  title: "Feedback",
  type: "document",

  fields: [
    {
      name: "feedback_text",
      title: "Feedback",
      type: "text",
      validation: (Rule: any) => Rule.required().max(1000),
    },

    {
      name: "startup_id",
      title: "Startup ID",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "startup_name",
      title: "Startup Name",
      type: "string",
    },

    {
      name: "investor_email",
      title: "Investor Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};