import React from "react";
import AddForm from '@/Pages/Profile/Partials/AddForm.jsx'
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import ArrowIcon from "@/Components/icons/ArrowIcon.jsx";
import {Inertia} from "@inertiajs/inertia";

export default function Add({}) {

    return (
        <MainStructure pageTitle={'Compte'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan title={'Créer un compte'}/>
                <section className='mt-10 flex'>
                    <h3 className='sr-only'>Formulaire de création</h3>
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <AddForm/>
                        </div>
                    </div>
                </section>
            </section>
        </MainStructure>
    );
}
