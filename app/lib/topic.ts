
export type Topic = {
  id: string;
  label: string;
  response?: string;
  subtopics?: Topic[];
};

// 👇 Creative → Client (you can expand later)
export const topics: Topic[] = [
  {
    id: "job_details",
    label: "Job Details",
    subtopics: [
      {
        id: "clarification",
        label: "Need clarification",
        response: "Can you clarify the exact deliverables for this project?",
      },
      {
        id: "scope",
        label: "Scope of work",
        response: "Does this include revisions or just one delivery?",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    subtopics: [
      {
        id: "budget",
        label: "Discuss budget",
        response: "Is your budget flexible for higher quality work?",
      },
      {
        id: "payment",
        label: "Payment terms",
        response: "Will payment be milestone-based or upfront?",
      },
    ],
  },
  {
    id: "deadline",
    label: "Deadline",
    subtopics: [
      {
        id: "extension",
        label: "Request extension",
        response: "Would it be possible to extend the deadline?",
      },
      {
        id: "timeline",
        label: "Clarify timeline",
        response: "What’s your expected turnaround time?",
      },
    ],
  },
];