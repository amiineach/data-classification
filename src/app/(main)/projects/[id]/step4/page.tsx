import {
  getFourthStepByOrganizationId,
  getThirdStepByOrganizationId,
} from "@/actions/steps";
import { Step3Data } from "@/components/forms/step3";

import Step4 from "@/components/forms/step4";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProgressSteps } from "@/components/step-progress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [step3, step4] = await Promise.all([
    getThirdStepByOrganizationId(id),
    getFourthStepByOrganizationId(id),
  ]);

  function getAllClassificationLevels(data: Step3Data): string[] {
    const { defaultLevels, customLevels } = data.classificationLevels;
    return [...defaultLevels, ...customLevels];
  }

  //@ts-expect-error this is a type error
  const classifications = getAllClassificationLevels(step3?.data.data);

  return (
    <MaxWidthWrapper>
      <ProgressSteps projectId={id} />
      <Step4
        //@ts-expect-error this is a type error
        initialData={step4?.data.data}
        organizationId={id}
        classifications={classifications ?? []}
      />
    </MaxWidthWrapper>
  );
}
