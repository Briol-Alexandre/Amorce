import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router, usePage} from '@inertiajs/react';
import NavBar from "@/Components/NavBar.jsx";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";
import Edit from "@/Pages/Profile/Edit.jsx";

export default function Compte() {
     const {user} = usePage().props;
    return (
        <MainStructure pageTitle={'Compte'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan title={'Compte'}/>
                <section>
                    <h3 className="m-4 small-title-style">Votre Profil</h3>
                    <Edit/>
                </section>
            </section>
        </MainStructure>

    );
}
