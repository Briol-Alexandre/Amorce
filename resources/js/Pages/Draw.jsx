import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {router, usePage} from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import React from "react";

export default function Draw() {
    const {detente} = usePage().props;

    function removeParticipant(donatorId, name, participation) {
        router.delete(route('detente.destroy'), {
            data: {donator_id: donatorId, name: name, participation: participation}
        });
    }

    function handleSubmit() {
        router.post(route('detente.participation-update'));
    }



    return (
        <MainStructure pageTitle={'Tirage Détente'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan onClick={() => router.visit(route('detente.draw'))} title={'Tirage'}/>
                <section>
                    <h2 className="small-title-style mx-8 mt-4">Liste des donateurs pouvant être tirés</h2>
                    <div className='flex justify-center'>
                        <ul className='w-3/4 mt-4'>
                            {detente.map((participant) => (
                                <li className='border-2 p-2 flex justify-between m-2' key={participant.donator_id}>
                                    <p>{participant.name}</p>
                                    <button
                                        className='bg-red-500 text-white px-2 rounded'
                                        onClick={() => removeParticipant(participant.donator_id, participant.name, participant.participation)}
                                    >
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <button
                            className='bg-black text-white py-2 px-4 rounded'
                            onClick={handleSubmit}
                        >
                            Tirer au sort
                        </button>
                    </div>
                </section>
            </section>
        </MainStructure>
    )
}
