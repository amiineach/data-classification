interface TableRow {
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

interface props {
  purpose: string;
  Scope: string;
  RolesAndResponsabilites: string;
  dataClassificationLevels: TableRow[];
  classificationReference: ClassificationReferenceRow[];
  dataCategories: DataCategoryRow[];
}

export default function Document({
  RolesAndResponsabilites,
  Scope,
  purpose,
  dataClassificationLevels,
  classificationReference,
  dataCategories,
}: props) {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Data Classification Policy
          </h1>
          <div className="h-1 w-24 bg-purple-700 mx-auto rounded-full"></div>
        </header>

        <PolicySection title="Purpose">
          <p className="text-gray-700 leading-relaxed">{purpose}</p>
        </PolicySection>

        <PolicySection title="Scope">
          <p className="text-gray-700 leading-relaxed">{Scope}</p>
        </PolicySection>

        <PolicySection title="Roles and Responsibilities">
          <p className="text-gray-700 leading-relaxed">
            {RolesAndResponsabilites}
          </p>
        </PolicySection>

        <div className="mt-12">
          <SectionHeader title="Policy Roles" />
        </div>

        {/* Data Classification Level Table */}
        <PolicyTable
          title="Data Classification Level"
          headers={["Level", "Definition"]}
          colSpan={[1, 1]}
        >
          <tbody>
            {dataClassificationLevels.map((item, index) => (
              <TableRow key={index}>
                <td className="font-semibold text-purple-900">{item.level}</td>
                <td className="text-gray-700">{item.definition}</td>
              </TableRow>
            ))}
          </tbody>
        </PolicyTable>

        <ClassificationGuidelines />

        {/* Classification Reference Table */}
        <PolicyTable
          title="Classification Reference Table"
          headers={[
            "Classification Level",
            "Characteristics",
            "Description",
            "Example",
          ]}
          colSpan={[1, 3, 1, 1]}
          subHeaders={["sensativity Level", "business Impact", "Regulation"]}
        >
          <tbody>
            {classificationReference.map((item, index) => (
              <TableRow key={index}>
                <td className="font-semibold text-purple-900">{item.level}</td>
                <td>{item.sensativityLevel || ""}</td>
                <td>{item.businessImpact || ""}</td>
                <td>{item.Regulation || ""}</td>
                <td className="text-gray-700">{item.description}</td>
                <td className="text-gray-700">{item.example}</td>
              </TableRow>
            ))}
          </tbody>
        </PolicyTable>

        <PolicySection title="Description">
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam
            neque et doloremque impedit nam itaque cupiditate in optio voluptate
            ut explicabo quasi est possimus accusamus totam similique, magni
            illo veniam.
          </p>
        </PolicySection>

        {/* Data Categories Table */}
        <PolicyTable
          title="Data Categories"
          headers={["Category", "Description", "Examples", "Classification"]}
          colSpan={[1, 1, 1, 1]}
        >
          <tbody>
            {dataCategories.map((item, index) => (
              <TableRow key={index}>
                <td className="font-semibold text-purple-900">
                  {item.category}
                </td>
                <td className="text-gray-700">{item.description}</td>
                <td className="text-gray-700">{item.examples}</td>
                <td>{item.classification}</td>
              </TableRow>
            ))}
          </tbody>
        </PolicyTable>

        <PolicySection title="Process Data Rules">
          <p className="text-gray-700 leading-relaxed">
            Process to data must be controlled according to it&apos;s class the
            table below outlines
          </p>
        </PolicySection>

        {/* Access Control Matrix Table */}
        <PolicyTable
          title="Access Control Matrix"
          headers={[
            "Classification Level",
            "Access Rights",
            "Approval Required",
            "Authentication",
            "Access Review Frequency",
          ]}
          colSpan={[1, 1, 1, 1, 1]}
        >
          <tbody>
            <TableRow>
              <td className="font-semibold text-purple-900">Public</td>
              <td className="text-gray-700">Everyone (incl. external)</td>
              <td className="text-gray-700">None</td>
              <td className="text-gray-700">None</td>
              <td className="text-gray-700">Not applicable</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Internal</td>
              <td className="text-gray-700">All employees</td>
              <td className="text-gray-700">Manager (optional)</td>
              <td className="text-gray-700">Username/password</td>
              <td className="text-gray-700">Annually</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Confidential</td>
              <td className="text-gray-700">Specific roles only</td>
              <td className="text-gray-700">Data Owner</td>
              <td className="text-gray-700">MFA recommended</td>
              <td className="text-gray-700">Every 6 months</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Restricted</td>
              <td className="text-gray-700">Minimal personnel</td>
              <td className="text-gray-700">Data Owner + CISO</td>
              <td className="text-gray-700">MFA required</td>
              <td className="text-gray-700">Quarterly</td>
            </TableRow>
          </tbody>
        </PolicyTable>

        <PolicySection title="4.3 Encryption and Data Protection">
          <p className="text-gray-700 leading-relaxed">
            Encryption must be applied to protect data from unauthorized access,
            especially during storage and transmission. The level of encryption
            required depends on the data classification as outlined below:
          </p>
        </PolicySection>

        {/* Encryption Requirements Table */}
        <PolicyTable
          title="Encryption Requirements"
          headers={[
            "Classification Level",
            "Encryption at Rest",
            "Encryption in Transit",
          ]}
          colSpan={[1, 1, 1]}
        >
          <tbody>
            <TableRow>
              <td className="font-semibold text-purple-900">Public</td>
              <td className="text-gray-700">Not required</td>
              <td className="text-gray-700">Not required</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Internal</td>
              <td className="text-gray-700">Recommended</td>
              <td className="text-gray-700">Required (e.g., HTTPS)</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Confidential</td>
              <td className="text-gray-700">Required</td>
              <td className="text-gray-700">Required</td>
            </TableRow>
            <TableRow>
              <td className="font-semibold text-purple-900">Restricted</td>
              <td className="text-gray-700">
                Strong encryption required (e.g., AES-256)
              </td>
              <td className="text-gray-700">Enforced via TLS 1.2+</td>
            </TableRow>
          </tbody>
        </PolicyTable>
      </div>
    </div>
  );
}

// Helper Components
const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="bg-gray-50 rounded-xl p-6 shadow-sm">
    <h2 className="text-2xl font-semibold text-purple-900 mb-4">{title}</h2>
    {children}
  </section>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-2xl font-bold text-purple-900 border-b-2 border-purple-300 pb-2">
    {title}
  </h2>
);

const PolicyTable = ({
  title,
  headers,
  colSpan,
  subHeaders,
  children,
}: {
  title: string;
  headers: string[];
  colSpan: number[];
  subHeaders?: string[];
  children: React.ReactNode;
}) => (
  <div className="mt-10">
    <h3 className="text-2xl font-bold text-purple-900 text-center mb-6">
      {title}
    </h3>
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-purple-900 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-5 py-3 text-left font-semibold"
                colSpan={colSpan[index]}
              >
                {header}
              </th>
            ))}
          </tr>
          {subHeaders && (
            <tr className="bg-purple-800 text-white">
              <th className="px-5 py-2"></th>
              {subHeaders.map((subHeader, index) => (
                <th key={index} className="px-5 py-2 text-sm font-medium">
                  {subHeader}
                </th>
              ))}
              <th className="px-5 py-2"></th>
              <th className="px-5 py-2"></th>
            </tr>
          )}
        </thead>
        {children}
      </table>
    </div>
  </div>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
    {children}
  </tr>
);

const ClassificationGuidelines = () => (
  <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
    <h4 className="font-bold text-purple-900 mb-3 text-lg">
      Classification Level Guidelines
    </h4>
    <p className="text-gray-700 mb-4">
      Recommended classification assignment based on standard norms:
    </p>
    <ul className="space-y-2">
      <li className="flex">
        <span className="font-medium text-purple-800 w-28">Public:</span>
        <span>None/Low sensitivity, None/Low impact, No regulations</span>
      </li>
      <li className="flex">
        <span className="font-medium text-purple-800 w-28">Internal:</span>
        <span>
          Low/Medium sensitivity, Low/Medium impact, minimal/no regulations
        </span>
      </li>
      <li className="flex">
        <span className="font-medium text-purple-800 w-28">Confidential:</span>
        <span>
          Medium/High sensitivity, Medium/High impact, regulatory protection
        </span>
      </li>
      <li className="flex">
        <span className="font-medium text-purple-800 w-28">Restricted:</span>
        <span>
          High sensitivity, High impact, critical regulations or
          business-critical
        </span>
      </li>
    </ul>
  </div>
);
