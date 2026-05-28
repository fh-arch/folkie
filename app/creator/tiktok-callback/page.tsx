import { redirect } from "next/navigation";
import { connectTiktok } from "./actions";

interface Props {
  searchParams: { code?: string; state?: string; error?: string; error_description?: string };
}

export default async function TiktokCallbackPage({ searchParams }: Props) {
  const redirectUri =
    (process.env.NEXT_PUBLIC_APP_URL ?? "https://folkie.com.tr") +
    "/creator/tiktok-callback";

  if (searchParams.error) {
    const msg = searchParams.error_description ?? searchParams.error;
    redirect(`/creator/profile?tiktok=error&msg=${encodeURIComponent(msg)}`);
  }

  if (!searchParams.code) {
    redirect("/creator/profile");
  }

  const result = await connectTiktok(searchParams.code, redirectUri);

  if (result.ok) {
    redirect("/creator/profile?tiktok=connected");
  } else {
    redirect(`/creator/profile?tiktok=error&msg=${encodeURIComponent(result.error)}`);
  }
}
