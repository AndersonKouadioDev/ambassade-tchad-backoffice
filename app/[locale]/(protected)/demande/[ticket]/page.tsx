import { getAllFilteredDemandRequestsAction } from "@/features/demande/actions/demande.action";
import { prefetchGetDemandeByTicketAdminQuery } from "@/features/demande/queries/demande-detail.query";
import { DemandeDetail } from "@/features/demande/components/demande-detail";

interface Props {
  params: {
    ticket: Promise<string>;
  };
}
export const revalidate = 60; // 1 minute

// Génère des paramètres statiques pour les tickets
export const generateStaticParams = async () => {
  try {
    const tickets = await getAllFilteredDemandRequestsAction({
      page: 1,
      limit: 50,
    });
    return tickets.data.map((ticket) => ({ ticket }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
};

export default async function DemandeDetailPage({ params }: Props) {
  const ticket = await params.ticket;

  await prefetchGetDemandeByTicketAdminQuery(ticket);

  return (
    <div className="container min-h-screen bg-background">
      <DemandeDetail ticket={ticket} />
    </div>
  );
}
