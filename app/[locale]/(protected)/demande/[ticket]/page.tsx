import { prefetchGetDemandeByTicketAdminQuery } from "@/features/demande/queries/demande-detail.query";
import { DemandeDetail } from "@/features/demande/components/demande-detail";

interface Props {
  params: Promise<{
    ticket: Promise<string>;
  }>;
}
export default async function DemandeDetailPage(props: Props) {
  const params = await props.params;
  const ticket = await params.ticket;

  await prefetchGetDemandeByTicketAdminQuery(ticket);

  return (
    <div className="container min-h-screen bg-background">
      <DemandeDetail ticket={ticket} />
    </div>
  );
}
