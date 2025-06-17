export type Step1DatabaseEntry = {
  step: 1;
  title: "Understand Organization & Stakeholders";
  timestamp: string; // ISO date string
  data: {
    primaryObjectives: {
      selected: string[];
      other: string[];
    };
    organizationSize: string;
    stakeholders: {
      selected: string[];
      other: string[];
    };
    regulations: {
      selected: string[];
      other: string[];
    };
  };
};

export type Step2DatabaseEntry = {
  step: 2;
  title: "Data Landscape";
  timestamp: string; // ISO date string
  data: {
    hasInventory: "yes" | "no";
    selectedDataTypes: string[];
    customDataTypes: string[];
    dataTypeDetails: Record<
      string,
      {
        sensitivity: "none" | "low" | "medium" | "high";
        businessImpact: "none" | "low" | "medium" | "high";
        hasRegulatory: "yes" | "no";
        regulations: string[];
        storage: string[];
        storageOther: string[];
      }
    >;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inventoryData?: any; // Can be refined if the structure is known
  };
};

export type Step3DatabaseEntry = {
  step: 3;
  title: "Classification Levels and Categories";
  timestamp: string; // ISO date string
  data: {
    classificationLevels: {
      defaultLevels: string[]; // e.g., ["Public", "Internal", "Confidential"]
      customLevels: string[]; // Any custom levels added by the user
      definitions: Record<string, string>; // Definitions for each level
    };
    dataCategories: {
      name: string;
      description: string;
      examples: string;
      classification: string; // One of the available classification levels
    }[];
  };
};

export type Step4DatabaseEntry = {
  step: 4;
  title: "Data Access and Controls";
  timestamp: string; // ISO date string
  data: {
    accessPolicies: {
      level: string; // e.g., "Confidential"
      policy: string; // description or name of the policy
    }[];
    accessMethods: {
      method: string; // e.g., "VPN", "Direct", "Third-party"
      description: string;
    }[];
    rolesWithAccess: {
      role: string; // e.g., "Data Analyst", "Admin"
      dataTypes: string[]; // the types of data the role can access
    }[];
    accessApprovalProcess: string; // description of the process
    thirdPartyAccess: {
      hasThirdPartyAccess: "yes" | "no";
      thirdParties?: {
        name: string;
        purpose: string;
        dataAccessed: string[];
      }[];
    };
  };
};
