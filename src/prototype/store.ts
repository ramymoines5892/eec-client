// PROTOTYPE 01 — CLIENT-ONLY MOCK STORE
// Zustand + localStorage are TEMPORARY prototype tools. Not production architecture.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "ar" | "en";

export interface CompanyDetails {
  legalName: string;
  displayName: string;
  country: string;
  timeZone: string;
  functionalCurrency: string;
  companyCode: string;
  transactionCurrencies: string[];
  logoDataUrl?: string;
  taxRegistrationNumber?: string;
  commercialRegistrationNumber?: string;
}

export interface MainBranch {
  name: string;
  code: string;
  isMain: true;
  country: string;
  city: string;
  address?: string;
  telephone?: string;
  email?: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  parentId?: string;
}

export interface EmployeeProfile {
  fullName: string;
  employeeCode: string;
  primaryBranchCode: string;
  organizationalUnitId: string;
  jobTitle: string;
  positionEffectiveStartDate: string;
}

// Independent state dimensions — kept separate per the approved model.
// UI may display a derived friendly status but MUST NOT collapse these.
export interface StateModel {
  userIdentity: "NONE" | "REGISTERED";
  emailVerification: "UNVERIFIED" | "VERIFIED";
  credential: "UNSET" | "SET";
  approval: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";
  access: "INACTIVE" | "PENDING_ACTIVATION" | "ACTIVE";
  employee: "NONE" | "ACTIVE";
  invitation: "NONE" | "SENT" | "ACCEPTED";
  workspace: "NEW" | "IN_SETUP" | "READY_TO_ACTIVATE" | "ACTIVE";
}

interface PrototypeState {
  language: Language;
  ownerEmail: string;
  passwordSet: boolean;
  state: StateModel;
  company?: CompanyDetails;
  mainBranch?: MainBranch;
  orgUnits: OrgUnit[];
  employee?: EmployeeProfile;
  positionAssigned: boolean;
  setLanguage: (l: Language) => void;
  setOwnerEmail: (e: string) => void;
  markEmailVerified: () => void;
  markPasswordCreated: () => void;
  setCompany: (c: CompanyDetails) => void;
  setMainBranch: (b: MainBranch) => void;
  setOrgUnits: (u: OrgUnit[]) => void;
  setEmployee: (e: EmployeeProfile) => void;
  assignPosition: () => void;
  activateWorkspace: () => void;
  reset: () => void;
}

const initialState: StateModel = {
  userIdentity: "NONE",
  emailVerification: "UNVERIFIED",
  credential: "UNSET",
  approval: "NOT_REQUIRED", // System Owner bootstrap: no approval required
  access: "INACTIVE",
  employee: "NONE",
  invitation: "NONE",
  workspace: "NEW",
};

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    (set) => ({
      language: "en",
      ownerEmail: "",
      passwordSet: false,
      state: initialState,
      orgUnits: [],
      positionAssigned: false,
      setLanguage: (language) => set({ language }),
      setOwnerEmail: (ownerEmail) =>
        set((s) => ({
          ownerEmail,
          state: { ...s.state, userIdentity: "REGISTERED" },
        })),
      markEmailVerified: () =>
        set((s) => ({ state: { ...s.state, emailVerification: "VERIFIED" } })),
      markPasswordCreated: () =>
        set((s) => ({
          passwordSet: true,
          state: {
            ...s.state,
            credential: "SET",
            workspace: "IN_SETUP",
          },
        })),
      setCompany: (company) => set({ company }),
      setMainBranch: (mainBranch) => set({ mainBranch }),
      setOrgUnits: (orgUnits) => set({ orgUnits }),
      setEmployee: (employee) => set({ employee }),
      assignPosition: () =>
        set((s) => ({
          positionAssigned: true,
          state: { ...s.state, employee: "ACTIVE" },
        })),
      activateWorkspace: () =>
        set((s) => ({
          state: {
            ...s.state,
            workspace: "ACTIVE",
            access: "ACTIVE",
          },
        })),
      reset: () =>
        set({
          language: "en",
          ownerEmail: "",
          passwordSet: false,
          state: initialState,
          company: undefined,
          mainBranch: undefined,
          orgUnits: [],
          employee: undefined,
          positionAssigned: false,
        }),
    }),
    { name: "eec_prototype_v1" },
  ),
);

export function readinessChecklist(s: PrototypeState) {
  return [
    { id: "email", done: s.state.emailVerification === "VERIFIED", route: "/auth/email" },
    { id: "password", done: s.state.credential === "SET", route: "/auth/create-password" },
    { id: "company", done: !!s.company?.legalName, route: "/wizard/company" },
    { id: "branch", done: !!s.mainBranch?.name, route: "/wizard/branch" },
    { id: "employee", done: !!s.employee?.fullName, route: "/wizard/employee" },
    { id: "position", done: s.positionAssigned, route: "/wizard/position" },
  ];
}
