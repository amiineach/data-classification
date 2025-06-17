import { getFirstStepByOrganizationId } from "@/actions/steps";
import Step1 from "@/components/forms/step1";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProgressSteps } from "@/components/step-progress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const data = await getFirstStepByOrganizationId(id);

  return (
    <>
      <MaxWidthWrapper>
        <ProgressSteps projectId={id} />

        <Step1
          //@ts-expect-error this is a typo error
          initialData={data?.data ?? null}
          organizationId={id}
        />
      </MaxWidthWrapper>
    </>
  );
}
