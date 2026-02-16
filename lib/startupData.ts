export type Startup = {
  id: number;
  name: string;
  description: string;
  founder: string;
  status: "Pending" | "Approved" | "Rejected";
};

export const startups: Startup[] = [];
