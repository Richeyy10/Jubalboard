export type Topic = {
  id: string;
  label: string;
  subtopics?: Topic[];
};

export const topics: Topic[] = [
  {
    id: "deadline",
    label: "⏰ Deadline",
    subtopics: [
      { id: "deadline-extension", label: "Request extension" },
      { id: "deadline-confirm", label: "Confirm deadline" },
      { id: "deadline-missed", label: "Missed deadline" },
      { id: "deadline-rush", label: "Rush delivery" },
    ],
  },
  {
    id: "deliverables",
    label: "📦 Deliverables",
    subtopics: [
      { id: "deliv-files", label: "File formats" },
      { id: "deliv-scope", label: "Scope of work" },
      { id: "deliv-revisions", label: "Number of revisions" },
      { id: "deliv-final", label: "Final delivery" },
    ],
  },
  {
    id: "timeline",
    label: "🗓️ Timeline",
    subtopics: [
      { id: "timeline-milestones", label: "Milestones" },
      { id: "timeline-phases", label: "Project phases" },
      { id: "timeline-update", label: "Progress update" },
    ],
  },
  {
    id: "payment",
    label: "💰 Payment",
    subtopics: [
      { id: "pay-deposit", label: "Deposit" },
      { id: "pay-invoice", label: "Invoice" },
      { id: "pay-method", label: "Payment method" },
      { id: "pay-dispute", label: "Payment dispute" },
    ],
  },
  {
    id: "revisions",
    label: "✏️ Revisions",
    subtopics: [
      { id: "rev-request", label: "Request a revision" },
      { id: "rev-limit", label: "Revision limit" },
      { id: "rev-feedback", label: "Provide feedback" },
    ],
  },
  {
    id: "brief",
    label: "📋 Brief",
    subtopics: [
      { id: "brief-unclear", label: "Unclear instructions" },
      { id: "brief-update", label: "Updated brief" },
      { id: "brief-confirm", label: "Confirm understanding" },
    ],
  },
  {
    id: "feedback",
    label: "💬 Feedback",
    subtopics: [
      { id: "feedback-approval", label: "Approval" },
      { id: "feedback-changes", label: "Request changes" },
      { id: "feedback-rating", label: "Rating/review" },
    ],
  },
  {
    id: "contract",
    label: "📝 Contract",
    subtopics: [
      { id: "contract-terms", label: "Terms & conditions" },
      { id: "contract-nda", label: "NDA" },
      { id: "contract-dispute", label: "Dispute" },
    ],
  },
];