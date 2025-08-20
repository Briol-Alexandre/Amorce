import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import EventDisplay from "@/Components/EventDisplay.jsx";

export default function Evenement() {
    return (
        <MainStructure pageTitle={'Événements'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan title={'Événements'} />
            </section>
            <section className="px-6 mt-5">
                <EventDisplay />
            </section>
        </MainStructure>

    );
}
