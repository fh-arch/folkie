import { PageHeader } from "@/components/shared/PageHeader";
import { MessagingClient } from "@/components/messaging/MessagingClient";

export default function BrandMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Mesajlar"
        description="Creator'larla doğrudan canlı mesajlaşma."
        breadcrumbs={[{ label: "Mesajlar" }]}
      />
      <MessagingClient />
    </div>
  );
}
