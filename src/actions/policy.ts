"use server";

import { db } from "@/lib/db";
import { sendPromptToAI } from "@/ai/actions";
import {
  Step1DatabaseEntry,
  Step2DatabaseEntry,
  Step3DatabaseEntry,
  Step4DatabaseEntry,
} from "@/types/steps";

// Type definitions for the policy data structure
interface TableRow2 {
  level: string;
  definition: string;
}

interface ClassificationReferenceRow {
  level: string;
  sensativityLevel?: string;
  businessImpact?: string;
  Regulation?: string;
  description: string;
  example: string;
}

interface DataCategoryRow {
  category: string;
  description: string;
  examples: string;
  classification: string;
}

interface DataClassificationPolicyProps {
  purpose: string;
  Scope: string;
  RolesAndResponsabilites: string;
  dataClassificationLevels: TableRow2[];
  classificationReference: ClassificationReferenceRow[];
  dataCategories: DataCategoryRow[];
}

/**
 * Create comprehensive policy data by aggregating all step data and using AI to generate content
 * @param organizationId - The organization ID to fetch data for
 * @returns Promise<DataClassificationPolicyProps> - The generated policy data object
 */
export const createPolicyData = async (
  organizationId: string
): Promise<DataClassificationPolicyProps> => {
  try {
    // Fetch all step data from the database
    const organization = await db.organization.findUnique({
      where: { id: organizationId },
      include: {
        firstStep: true,
        secondStep: true,
        thirdStep: true,
        fourthStep: true,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Extract data from each step with proper null checks
    const step1Data = organization.firstStep?.data as
      | Step1DatabaseEntry["data"]
      | undefined;
    const step2Data = organization.secondStep?.data as
      | Step2DatabaseEntry["data"]
      | undefined;
    const step3Data = organization.thirdStep?.data as
      | Step3DatabaseEntry["data"]
      | undefined;
    const step4Data = organization.fourthStep?.data as
      | Step4DatabaseEntry["data"]
      | undefined;

    // Generate AI prompts for different sections
    const policyPrompts = await generatePolicyContent(
      step1Data,
      step2Data,
      step3Data,
      step4Data,
      organization.title
    );

    // Construct the final policy data object
    const policyData: DataClassificationPolicyProps = {
      purpose: policyPrompts.purpose ?? "",
      Scope: policyPrompts.scope ?? "",
      RolesAndResponsabilites: policyPrompts.rolesAndResponsibilities ?? "",
      dataClassificationLevels: generateClassificationLevels(step3Data),
      dataCategories: generateDataCategories(step2Data, step3Data),
      classificationReference: await generateClassificationReference(
        step3Data,
        step2Data
      ),
    };

    return policyData;
  } catch (error) {
    console.error("Error creating policy data:", error);
    throw new Error(
      `Failed to create policy data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Generate AI-driven policy content for purpose, scope, and roles
 */
async function generatePolicyContent(
  step1Data: Step1DatabaseEntry["data"] | undefined,
  step2Data: Step2DatabaseEntry["data"] | undefined,
  step3Data: Step3DatabaseEntry["data"] | undefined,
  step4Data: Step4DatabaseEntry["data"] | undefined,
  organizationTitle: string
) {
  const contextPrompt = `
    Organization: ${organizationTitle}
    
    Context from assessment:
    - Primary Objectives: ${
      step1Data?.primaryObjectives?.selected?.join(", ") || "Not specified"
    }
    - Organization Size: ${step1Data?.organizationSize || "Not specified"}
    - Key Stakeholders: ${
      step1Data?.stakeholders?.selected?.join(", ") || "Not specified"
    }
    - Regulations: ${
      step1Data?.regulations?.selected?.join(", ") || "Not specified"
    }
    - Data Types: ${step2Data?.selectedDataTypes?.join(", ") || "Not specified"}
    - Has Data Inventory: ${step2Data?.hasInventory || "Not specified"}
    - Classification Levels: ${
      step3Data?.classificationLevels?.defaultLevels?.join(", ") ||
      "Not specified"
    }
    - Access Methods: ${
      step4Data?.accessMethods?.map((m) => m.method).join(", ") ||
      "Not specified"
    }
  `;

  // Generate purpose
  const purposeResponse = await sendPromptToAI(
    `${contextPrompt}
    
    Generate a clear, professional purpose statement for a data classification policy. 
    The purpose should explain why this policy exists and what it aims to achieve.
    Keep it concise (1-2 sentences) and professional.`,
    {
      model: "deepseek/deepseek-r1-0528:free",
      temperature: 0.7,
      maxTokens: 200,
    }
  );

  // Generate scope
  const scopeResponse = await sendPromptToAI(
    `${contextPrompt}
    
    Generate a comprehensive scope statement for a data classification policy.
    Define what data, systems, and personnel this policy covers.
    Keep it concise (1-2 sentences) and professional.`,
    {
      model: "deepseek/deepseek-r1-0528:free",
      temperature: 0.7,
      maxTokens: 200,
    }
  );

  // Generate roles and responsibilities
  const rolesResponse = await sendPromptToAI(
    `${contextPrompt}
    
    Generate a clear statement defining roles and responsibilities for data classification.
    Include data owners, IT teams, and other relevant stakeholders based on the context.
    Keep it concise (2-3 sentences) and professional.`,
    {
      model: "deepseek/deepseek-r1-0528:free",
      temperature: 0.7,
      maxTokens: 300,
    }
  );

  return {
    purpose: purposeResponse.success
      ? purposeResponse.data
      : "Data classification policy to ensure proper handling and protection of organizational data assets.",
    scope: scopeResponse.success
      ? scopeResponse.data
      : "All data assets owned, processed, or stored by the organization.",
    rolesAndResponsibilities: rolesResponse.success
      ? rolesResponse.data
      : "Data owners are responsible for classifying data. IT ensures security measures align with classification levels.",
  };
}

/**
 * Generate classification levels from Step 3 data
 */
function generateClassificationLevels(
  step3Data: Step3DatabaseEntry["data"] | undefined
): TableRow2[] {
  if (!step3Data?.classificationLevels) {
    // Return default classification levels
    return [
      {
        level: "Public",
        definition:
          "Information intended for public disclosure with no restrictions.",
      },
      {
        level: "Internal",
        definition:
          "Information for internal organizational use with low sensitivity.",
      },
      {
        level: "Confidential",
        definition:
          "Sensitive information limited to specific roles and departments.",
      },
      {
        level: "Restricted",
        definition:
          "Highly sensitive information requiring strict access controls.",
      },
    ];
  }

  const allLevels = [
    ...step3Data.classificationLevels.defaultLevels,
    ...step3Data.classificationLevels.customLevels,
  ];

  return allLevels.map((level) => ({
    level,
    definition:
      step3Data.classificationLevels.definitions[level] ||
      `${level} classification level`,
  }));
}

/**
 * Generate data categories from Step 2 and Step 3 data
 */
function generateDataCategories(
  step2Data: Step2DatabaseEntry["data"] | undefined,
  step3Data: Step3DatabaseEntry["data"] | undefined
): DataCategoryRow[] {
  const categories: DataCategoryRow[] = [];

  // Add categories from Step 3 if available
  if (step3Data?.dataCategories) {
    categories.push(
      ...step3Data.dataCategories.map((cat) => ({
        category: cat.name,
        description: cat.description,
        examples: cat.examples,
        classification: cat.classification,
      }))
    );
  }

  // Add data types from Step 2 as categories if not already covered
  if (step2Data?.selectedDataTypes) {
    const existingCategories = new Set(
      categories.map((c) => c.category.toLowerCase())
    );

    step2Data.selectedDataTypes.forEach((dataType) => {
      if (!existingCategories.has(dataType.toLowerCase())) {
        const details = step2Data.dataTypeDetails?.[dataType];
        categories.push({
          category: dataType,
          description: `Information related to ${dataType.toLowerCase()}`,
          examples: `Various ${dataType.toLowerCase()} records and data`,
          classification: mapSensitivityToClassification(
            details?.sensitivity || "low"
          ),
        });
      }
    });
  }

  // Return default categories if none found
  if (categories.length === 0) {
    return [
      {
        category: "Employee Data",
        description: "Information about organization employees",
        examples: "Names, employee IDs, contact information",
        classification: "Confidential",
      },
      {
        category: "Customer Data",
        description: "Information about customers and clients",
        examples: "Contact details, transaction history, preferences",
        classification: "Restricted",
      },
    ];
  }

  return categories;
}

/**
 * Generate classification reference table using AI
 */
async function generateClassificationReference(
  step3Data: Step3DatabaseEntry["data"] | undefined,
  step2Data: Step2DatabaseEntry["data"] | undefined
): Promise<ClassificationReferenceRow[]> {
  const classificationLevels = step3Data?.classificationLevels
    ?.defaultLevels || ["Public", "Internal", "Confidential", "Restricted"];

  const referencePrompt = `
    Generate a classification reference table for these data classification levels: ${classificationLevels.join(
      ", "
    )}
    
    For each level, provide:
    - Sensitivity Level (None, Low, Medium, High)
    - Business Impact (None, Low, Medium, High)  
    - Regulation requirements (None, Minimal, Moderate, Strict)
    - Brief description
    - Practical example
    
    Context: ${
      step2Data?.selectedDataTypes?.join(", ") || "General business data"
    }
    
    Respond in this exact JSON format:
    [
      {
        "level": "level_name",
        "sensativityLevel": "sensitivity",
        "businessImpact": "impact", 
        "Regulation": "regulation_level",
        "description": "description",
        "example": "example"
      }
    ]
  `;

  const aiResponse = await sendPromptToAI(referencePrompt, {
    model: "deepseek/deepseek-r1-0528:free",
    temperature: 0.3,
    maxTokens: 1000,
  });

  if (aiResponse.success) {
    try {
      const parsedResponse = JSON.parse(aiResponse?.data ?? "");
      if (Array.isArray(parsedResponse)) {
        return parsedResponse;
      }
    } catch (error) {
      console.error(
        "Failed to parse AI response for classification reference:",
        error
      );
    }
  }

  // Return default classification reference
  return [
    {
      level: "Public",
      sensativityLevel: "None",
      businessImpact: "None",
      Regulation: "None",
      description: "Information freely available to the public",
      example: "Marketing materials, public announcements",
    },
    {
      level: "Internal",
      sensativityLevel: "Low",
      businessImpact: "Low",
      Regulation: "Minimal",
      description: "Information for internal organizational use",
      example: "Internal policies, meeting notes",
    },
    {
      level: "Confidential",
      sensativityLevel: "Medium",
      businessImpact: "Medium",
      Regulation: "Moderate",
      description: "Sensitive information requiring role-based access",
      example: "Financial reports, employee records",
    },
    {
      level: "Restricted",
      sensativityLevel: "High",
      businessImpact: "High",
      Regulation: "Strict",
      description: "Highly sensitive information with strict controls",
      example: "Customer PII, trade secrets",
    },
  ];
}

/**
 * Map sensitivity levels to classification levels
 */
function mapSensitivityToClassification(sensitivity: string): string {
  switch (sensitivity.toLowerCase()) {
    case "none":
      return "Public";
    case "low":
      return "Internal";
    case "medium":
      return "Confidential";
    case "high":
      return "Restricted";
    default:
      return "Internal";
  }
}
