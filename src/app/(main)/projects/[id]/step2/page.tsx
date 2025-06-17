import {
  getFirstStepByOrganizationId,
  getSecondStepByOrganizationId,
} from "@/actions/steps";
import Step2 from "@/components/forms/step2";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProgressSteps } from "@/components/step-progress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [step1, step2] = await Promise.all([
    getFirstStepByOrganizationId(id),
    getSecondStepByOrganizationId(id),
  ]);

  return (
    <MaxWidthWrapper>
      <ProgressSteps projectId={id} />

      <Step2
        // Fix: Pass step2 directly, not step2?.data
        //@ts-expect-error this is an error
        initialData={{ step1: step1?.data, step2: step2?.data }}
        organizationId={id}
      />
    </MaxWidthWrapper>
  );
}
