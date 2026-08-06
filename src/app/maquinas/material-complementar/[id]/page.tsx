import SupportMaterialDetails from "@/components/organisms/SupportMaterialDetails";

interface MaterialPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailsPage({ params }: MaterialPageProps) {
  const { id } = await params;
  return <SupportMaterialDetails id={id} />;
}
