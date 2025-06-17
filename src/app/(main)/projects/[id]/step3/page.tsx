import {
  getSecondStepByOrganizationId,
  getThirdStepByOrganizationId,
} from "@/actions/steps";
import Step3 from "@/components/forms/step3";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProgressSteps } from "@/components/step-progress";
import { groupDataTypesByDetail } from "@/lib/groupe-datatypes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [step2, step3] = await Promise.all([
    getSecondStepByOrganizationId(id),
    getThirdStepByOrganizationId(id),
  ]);

  //@ts-expect-error this is a type error
  const myData = groupDataTypesByDetail(step2?.data.data);

  return (
    <MaxWidthWrapper>
      <ProgressSteps projectId={id} />
      <Step3
        categoryData={myData}
        //@ts-expect-error this is a type error
        initialData={step3?.data?.data}
        organizationId={id}
      />
    </MaxWidthWrapper>
  );
}
