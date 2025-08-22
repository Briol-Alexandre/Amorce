import { router, usePage } from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import { FondList } from "@/Components/FondList.jsx";


export default function Funds() {
    const { funds } = usePage().props;
    const { transactions } = usePage().props;
    return (
        <MainStructure pageTitle="Fonds">
            <div className='flex flex-col w-full'>
                <div className="lg:p-3">
                    <TitleAndSpan title="Fonds" onClick={() => router.visit(route('fond.index'))} transactions={transactions} funds={funds} />
                    <FondList fonds={funds} />
                </div>
                <p className="text-center max-lg:text-xs">Veuillez cliquer sur un des fonds pour en voir les informations</p>
            </div>
        </MainStructure>
    );
}
