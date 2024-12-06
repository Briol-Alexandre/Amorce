import React, {useState} from "react";
import {usePage} from "@inertiajs/react";
import MainStructure from "@/Components/MainStructure.jsx";
import TitleAndSpan from "@/Components/TitleAndSpan.jsx";
import {FondList} from "@/Components/FondList.jsx";
import FondAction from "@/Components/FondAction.jsx";

export default function Fonds() {
    const {fonds} = usePage().props;

    const [form, setForm] = useState();
    const {errors} = usePage().props.errors;
    return (
        <MainStructure pageTitle="Fonds">
            <div className='flex flex-col w-full'>
                <div className="p-3 ">
                    <TitleAndSpan title="Fonds"/>
                    <FondList fonds={fonds} errors={errors}/>
                </div>
                <FondAction/>
            </div>
        </MainStructure>
    );
}
