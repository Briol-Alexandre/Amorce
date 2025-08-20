import { Head, router, usePage } from '@inertiajs/react';
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import React from "react";
import EventDisplay from '@/Components/EventDisplay';
import DetenteDisplay from '@/Components/DetenteDisplay';

export default function Dashboard() {
    const { user } = usePage().props
    return (
        <MainStructure pageTitle={'Dashboard'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan onClick={() => router.visit(route('dashboard'))} title={'DashBoard'} />
                <p className='small-title-style m-4'>Bienvenue {user.name}</p>
                <div className="px-10">
                    <EventDisplay />
                </div>
                <div className="mt-10 px-10">
                    <DetenteDisplay />
                </div>
                {/* TODO: Ajouter la visualisation de la détente actuelle */}

            </section>
        </MainStructure>

    );
}
