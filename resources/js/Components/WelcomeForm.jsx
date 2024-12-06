import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import Checkbox from "@/Components/Checkbox.jsx";
import TextAndLabel from "@/Components/TextAndLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import React from "react";

export default function WelcomeForm({className}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    return (
        <form action="/" method='post' className={className}>
            <input type="hidden" name="_token" value={csrfToken}/>

            <div>
                <TextAndLabel type={'email'} placeholder={'example@domaine.com'} containerClassName={"flex flex-col"}
                              idAndFor={'email'} inputClassName={'rounded-md border-neutral-300'} inputName={'email'}
                              labelName={'Email'}/>
            </div>
            <div>
                <TextAndLabel type={'password'} placeholder={'******'} containerClassName={"flex flex-col"}
                              idAndFor={'password'} inputClassName={'rounded-md border-neutral-300'}
                              inputName={'password'}
                              labelName={'Mot de passe'}/>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Checkbox id={'remember'}/>
                <InputLabel labelName={'Se souvenir de moi'} htmlFor={'remember'}/>
            </div>
            <div className="flex gap-40">
                <a href="/" className="underline">Mot de passe oublié ?</a>
                <PrimaryButton children={"Se connecter"}
                               className={'flex justify-center hover:rotate-3 hover:scale-110 focus:rotate-3 focus:scale-110'}/>
            </div>
        </form>
    );
}
