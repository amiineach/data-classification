import { getCurrentUserAction } from "@/actions/user";
import PageViewProjects from "./page.view";

export default async function Page() {
  const data = await getCurrentUserAction();

  if (data.user) {
    return <PageViewProjects userId={data.user?.id} />;
  } else {
    return <div>error when fetching the projects</div>;
  }
}
