import { create } from "zustand";

export interface BriefFormData {
  jobTitle: string;
  projectCategory: string;
  specificSkills: string;
  jobDescription: string;
  referenceFile: File | null;
  referenceFileName: string;
  numCreatives: string;
  currency: string;
  budgetRange: string;
  timeline: string;
  deliveryDate: string;
  modeOfProject: string;
  location: string;
}

interface BriefStore {
  form: BriefFormData;
  setField: (field: keyof BriefFormData, value: string | File | null) => void;
  reset: () => void;
}

const defaultForm: BriefFormData = {
  jobTitle: "",
  projectCategory: "",
  specificSkills: "",
  jobDescription: "",
  referenceFile: null,
  referenceFileName: "",
  numCreatives: "1 creative",
  currency: "Dollars ($)",
  budgetRange: "$50-$100",
  timeline: "Less than 24 hours",
  deliveryDate: "",
  modeOfProject: "Virtual",
  location: "",
};

export const useBriefStore = create<BriefStore>((set) => ({
  form: defaultForm,
  setField: (field, value) =>
    set((state) => ({ form: { ...state.form, [field]: value } })),
  reset: () => set({ form: defaultForm }),
}));