import {Head, router, usePage} from '@inertiajs/react';
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import React from "react";

export default function Dashboard() {
    const {user} = usePage().props
    return (
        <MainStructure pageTitle={'Dashboard'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan onClick={() => router.visit(route('dashboard'))} title={'DashBoard'}/>
                <p className='small-title-style m-4'>Bienvenue {user.name}</p>
                <section>
                    <h2 className="small-title-style mx-8">Évènements à venir</h2>
                </section>
            </section>
        </MainStructure>

    );
}
