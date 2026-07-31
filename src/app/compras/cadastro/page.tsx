import BuyForm from "@/components/organisms/BuyForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function pageFormBuy() {
    return <LayoutDesktop children={
        <main className="mx-auto max-w-7xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6" >Cadastro de compra</h1>
            <BuyForm></BuyForm>
        </main>
    }>
    </LayoutDesktop>
}