const feedback = {
  name: "feedback",
  title: "Feedback",
  type: "document",
  fields: [
    {
      name: "message",
      title: "Feedback Message",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "startup",
      title: "Startup",
      type: "reference",
      to: [{ type: "startup" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "investor_email",
      title: "Investor Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};

export default feedback;
