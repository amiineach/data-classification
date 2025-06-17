import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  UnderlineType,
} from "docx";

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

export async function generateDataClassificationPolicy(
  data: DataClassificationPolicyProps
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Data Classification Policy",
                bold: true,
                size: 32,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Purpose Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Purpose",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun(data.purpose)],
            spacing: { after: 300 },
          }),

          // Scope Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Scope",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun(data.Scope)],
            spacing: { after: 300 },
          }),

          // Roles and Responsibilities Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Roles and Responsibilities",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun(data.RolesAndResponsabilites)],
            spacing: { after: 300 },
          }),

          // Policy Roles Header
          new Paragraph({
            children: [
              new TextRun({
                text: "Policy Roles",
                bold: true,
                size: 24,
                color: "663399",
                underline: {
                  type: UnderlineType.SINGLE,
                },
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 400 },
          }),

          // Data Classification Level Table
          new Paragraph({
            children: [
              new TextRun({
                text: "Data Classification Level",
                bold: true,
                size: 20,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Level",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Definition",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: {
                      size: 70,
                      type: WidthType.PERCENTAGE,
                    },
                  }),
                ],
              }),
              // Data rows
              ...data.dataClassificationLevels.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.level,
                                bold: true,
                                color: "663399",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.definition)],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),

          // Classification Guidelines
          new Paragraph({
            children: [
              new TextRun({
                text: "Classification Level Guidelines",
                bold: true,
                size: 18,
                color: "663399",
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Recommended classification assignment based on standard norms:"
              ),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Public: ",
                bold: true,
                color: "663399",
              }),
              new TextRun(
                "None/Low sensitivity, None/Low impact, No regulations"
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Internal: ",
                bold: true,
                color: "663399",
              }),
              new TextRun(
                "Low/Medium sensitivity, Low/Medium impact, minimal/no regulations"
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Confidential: ",
                bold: true,
                color: "663399",
              }),
              new TextRun(
                "Medium/High sensitivity, Medium/High impact, regulatory protection"
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Restricted: ",
                bold: true,
                color: "663399",
              }),
              new TextRun(
                "High sensitivity, High impact, critical regulations or business-critical"
              ),
            ],
            spacing: { after: 400 },
          }),

          // Classification Reference Table
          new Paragraph({
            children: [
              new TextRun({
                text: "Classification Reference Table",
                bold: true,
                size: 20,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Classification Level",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Sensitivity Level",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "7A4CB8",
                    },
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Business Impact",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "7A4CB8",
                    },
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Regulation",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "7A4CB8",
                    },
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Description",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Example",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data rows
              ...data.classificationReference.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.level,
                                bold: true,
                                color: "663399",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun(item.sensativityLevel || ""),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.businessImpact || "")],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.Regulation || "")],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.description)],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.example)],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),

          // Description Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Description",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam neque et doloremque impedit nam itaque cupiditate in optio voluptate ut explicabo quasi est possimus accusamus totam similique, magni illo veniam."
              ),
            ],
            spacing: { after: 300 },
          }),

          // Data Categories Table
          new Paragraph({
            children: [
              new TextRun({
                text: "Data Categories",
                bold: true,
                size: 20,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Category",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Description",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Examples",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Classification",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Data rows
              ...data.dataCategories.map(
                (item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: item.category,
                                bold: true,
                                color: "663399",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.description)],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.examples)],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun(item.classification)],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),

          // Process Data Rules Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Process Data Rules",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Process to data must be controlled according to it's class the table below outlines"
              ),
            ],
            spacing: { after: 300 },
          }),

          // Access Control Matrix Table
          new Paragraph({
            children: [
              new TextRun({
                text: "Access Control Matrix",
                bold: true,
                size: 20,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Classification Level",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Access Rights",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Approval Required",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Authentication",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Access Review Frequency",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Static data rows
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Public",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Everyone (incl. external)")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("None")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("None")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Not applicable")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Internal",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("All employees")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Manager (optional)")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Username/password")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Annually")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Confidential",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Specific roles only")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Data Owner")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("MFA recommended")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Every 6 months")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Restricted",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Minimal personnel")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Data Owner + CISO")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("MFA required")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Quarterly")],
                      }),
                    ],
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),

          // Encryption and Data Protection Section
          new Paragraph({
            children: [
              new TextRun({
                text: "4.3 Encryption and Data Protection",
                bold: true,
                size: 24,
                color: "663399",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Encryption must be applied to protect data from unauthorized access, especially during storage and transmission. The level of encryption required depends on the data classification as outlined below:"
              ),
            ],
            spacing: { after: 300 },
          }),

          // Encryption Requirements Table
          new Paragraph({
            children: [
              new TextRun({
                text: "Encryption Requirements",
                bold: true,
                size: 20,
                color: "663399",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Classification Level",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 33, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Encryption at Rest",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 33, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Encryption in Transit",
                            bold: true,
                            color: "FFFFFF",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: {
                      type: ShadingType.SOLID,
                      color: "663399",
                    },
                    width: { size: 34, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Static data rows
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Public",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Not required")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Not required")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Internal",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Recommended")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Required (e.g., HTTPS)")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Confidential",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Required")],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Required")],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Restricted",
                            bold: true,
                            color: "663399",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun(
                            "Strong encryption required (e.g., AES-256)"
                          ),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun("Enforced via TLS 1.2+")],
                      }),
                    ],
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
          }),
        ],
      },
    ],
  });

  // Generate and return the document as a Blob
  const buffer = await Packer.toBuffer(doc);

  return new Blob([buffer as unknown as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

// Usage example:
/*
const sampleData = {
  purpose: "This policy establishes a framework for classifying data based on its sensitivity and importance to the organization.",
  Scope: "This policy applies to all employees, contractors, and third parties who handle organizational data.",
  RolesAndResponsabilites: "All personnel are responsible for identifying and classifying data according to this policy.",
  dataClassificationLevels: [
    {
      level: "Public",
      definition: "Information that can be freely shared without risk to the organization."
    },
    {
      level: "Internal",
      definition: "Information intended for use within the organization."
    }
  ],
  classificationReference: [
    {
      level: "Public",
      sensativityLevel: "None/Low",
      businessImpact: "None/Low",
      Regulation: "None",
      description: "No harm if disclosed",
      example: "Marketing materials"
    }
  ],
  dataCategories: [
    {
      category: "Personal Data",
      description: "Information relating to identifiable individuals",
      examples: "Names, email addresses, phone numbers",
      classification: "Confidential"
    }
  ]
};

// Generate document
generateDataClassificationPolicy(sampleData).then(blob => {
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Data_Classification_Policy.docx';
  a.click();
  URL.revokeObjectURL(url);
});
*/
