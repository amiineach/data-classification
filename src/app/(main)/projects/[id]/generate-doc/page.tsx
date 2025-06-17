import MaxWidthWrapper from "@/components/max-width-wrapper";
import GeneratePolicy from "@/components/policy-generator";
import { ProgressSteps } from "@/components/step-progress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <MaxWidthWrapper>
      <ProgressSteps projectId={id} />
      <GeneratePolicy orgId={id} />
    </MaxWidthWrapper>
  );
}
