import {Head, Link} from '@inertiajs/react';
import DangerButton from "@/Components/DangerButton.jsx";
import WelcomeForm from "@/Components/WelcomeForm.jsx";
import AmorceLogo from "@/Components/icons/AmorceLogo.jsx";

export default function Welcome({auth, laravelVersion, phpVersion}) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <section className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center w-fit border-gray-100 border-2 rounded-xl p-10">
                    <Head title="Bienvenue"/>
                    <AmorceLogo width={260} height={62}/>
                    <WelcomeForm className="flex flex-col gap-5 mt-4"/>
                </div>
            </section>
        </>
    );
}
