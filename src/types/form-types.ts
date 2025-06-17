import { z } from "zod";

export const formSchema = z.object({
  // Step 1
  objective: z.string().min(10, "Objective must be at least 10 characters"),
  stakeholders: z.array(z.string()).min(1, "Select at least one stakeholder"),
  businessProcesses: z
    .array(z.string())
    .min(1, "Select at least one business process"),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  departments: z.array(z.string()).min(1, "Select at least one department"),

  // Step 2
  hasDataInventory: z.boolean().nullable(),
  dataInventoryLink: z.string().optional(),
  needsGuidance: z.boolean().nullable(),

  // Step 3
  dataValueAssessment: z
    .array(z.string())
    .min(1, "Select at least one assessment method"),
  businessImpacts: z.record(z.string()),
  sensitivityLevels: z
    .array(z.string())
    .min(1, "Select at least one sensitivity level"),
  customClassification: z.object({
    public: z.object({
      name: z.string(),
      description: z.string(),
      examples: z.string(),
    }),
    internal: z.object({
      name: z.string(),
      description: z.string(),
      examples: z.string(),
    }),
    confidential: z.object({
      name: z.string(),
      description: z.string(),
      examples: z.string(),
    }),
    restricted: z.object({
      name: z.string(),
      description: z.string(),
      examples: z.string(),
    }),
  }),

  // Step 4
  organizationName: z.string().min(1, "Organization name is required"),
  version: z.string().default("1.0"),
  approvalRoles: z
    .array(z.string())
    .min(1, "Select at least one approval role"),
});

export type FormSchema = z.infer<typeof formSchema>;
