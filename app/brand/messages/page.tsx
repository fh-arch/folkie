import { PageHeader } from "@/components/shared/PageHeader";
import { MessagingClient } from "@/components/messaging/MessagingClient";

export default function BrandMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        description="Direct messaging with creators."
        breadcrumbs={[{ label: "Messages" }]}
      />
      <MessagingClient />
    </div>
  );
}
