import Document from "@/components/document";

export default function Page() {
  return (
    <Document
      purpose="This policy outlines the classification of organizational data based on its sensitivity."
      Scope="All data assets owned, processed, or stored by the organization."
      RolesAndResponsabilites="Data owners are responsible for classifying data. IT ensures security measures align with classification."
      dataClassificationLevels={[
        {
          level: "Public",
          definition: "Information intended for public disclosure.",
        },
        {
          level: "Internal",
          definition: "Internal-use information with low sensitivity.",
        },
        {
          level: "Confidential",
          definition: "Sensitive data limited to specific roles.",
        },
        {
          level: "Restricted",
          definition: "Highly sensitive data with strict controls.",
        },
      ]}
      classificationReference={[
        {
          level: "Public",
          sensativityLevel: "None",
          businessImpact: "None",
          Regulation: "None",
          description: "Freely available information",
          example: "Marketing brochures",
        },
        {
          level: "Internal",
          sensativityLevel: "Low",
          businessImpact: "Low",
          Regulation: "Minimal",
          description: "Internal-only data",
          example: "Internal announcements",
        },
        {
          level: "Confidential",
          sensativityLevel: "Medium",
          businessImpact: "Medium",
          Regulation: "Moderate",
          description: "Restricted to specific departments",
          example: "Financial records",
        },
        {
          level: "Restricted",
          sensativityLevel: "High",
          businessImpact: "High",
          Regulation: "Strict",
          description: "Highly confidential data",
          example: "Customer PII",
        },
      ]}
      dataCategories={[
        {
          category: "Employee Data",
          description: "Information about employees",
          examples: "Names, salaries, addresses",
          classification: "Confidential",
        },
        {
          category: "Customer Data",
          description: "Details of customers",
          examples: "Emails, phone numbers",
          classification: "Restricted",
        },
      ]}
    />
  );
}
