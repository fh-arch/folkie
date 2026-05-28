import { PageHeader } from "@/components/shared/PageHeader";
import { MessagingClient } from "@/components/messaging/MessagingClient";

export default function CreatorMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        description="Direct messaging with brands."
        breadcrumbs={[{ label: "Messages" }]}
      />
      <MessagingClient />
    </div>
  );
}
