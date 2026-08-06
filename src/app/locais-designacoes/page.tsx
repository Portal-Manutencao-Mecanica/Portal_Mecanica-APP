import PageHeader from "@/components/molecules/PageHeader";
import DesignationManagementSection from "@/components/organisms/DesignationManagementSection";
import PlaceManagementSection from "@/components/organisms/PlaceManagementSection";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function PlacesAndDesignationsPage() {
  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Locais e designações"
          description="Gerencie os espaços físicos e setores disponíveis nos fluxos do portal."
        />
        <PlaceManagementSection />
        <div className="border-t border-gray-200 pt-6">
          <DesignationManagementSection />
        </div>
      </section>
    </LayoutDesktop>
  );
}
