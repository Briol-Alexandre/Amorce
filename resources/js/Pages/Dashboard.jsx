import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import NavBar from "@/Components/NavBar.jsx";
import {useState} from "react";
import InputLabel from "@/Components/InputLabel.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import MainStructure from "@/Components/MainStructure.jsx";

export default function Dashboard() {
    return (
        <MainStructure pageTitle={'Dashboard'}>
            <section className={"flex-grow p-3"}>
                <TitleAndSpan title={'DashBoard'}/>
            </section>
        </MainStructure>

    );
}
