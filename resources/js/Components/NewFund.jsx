import React from "react";
import TextAndLabel from "@/Components/TextAndLabel.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {router, useForm} from "@inertiajs/react";
import InputError from "@/Components/InputError.jsx";

export default function NewFund({ onClose }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: 0,
        raise: 0,
    });

    const customErrors = {
        ...errors,
        name: errors.name ? "Le nom est obligatoir et doit comporter au moins 3 caractères" : null,
    }

    function submit(e) {
        e.preventDefault();
        post('/fonds', {
            onSuccess: () => {
                onClose();
            },
        });
    }

    function handleChange(e) {
        setData(e.target.name, e.target.value);
    }

    return (
        <div className="flex flex-col items-center">
            <form className="flex flex-col gap-8 w-full max-w-sm" onSubmit={submit}>
                <legend className="text-lg font-semibold">Créer un nouveau fond</legend>
                <input type="hidden" name="_token" value={csrfToken} />

                <TextAndLabel
                    type="text"
                    value={data.name}
                    idAndFor="name"
                    errors={errors?.name}
                    labelName="Nom du fond"
                    inputName="name"
                    containerClassName="flex items-center gap-4"
                    labelClassName="text-sm"
                    onChange={handleChange}
                />

                <input
                    type="hidden"
                    name="amount"
                    value={data.amount}
                />
                <input
                    type="hidden"
                    name="raise"
                    value={data.raise}
                />
                <InputError message={customErrors.name}/>

                <div className="flex justify-end">
                    <PrimaryButton children="Créer le fond" className="normal-case text-sm" />
                </div>
            </form>
        </div>
    );
}
