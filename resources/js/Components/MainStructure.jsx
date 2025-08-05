import {Head, router} from "@inertiajs/react";
import NavBar from "@/Components/NavBar.jsx";
import {useState, useEffect} from "react";

// Fonctions utilitaires pour les cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export default function MainStructure({children, pageTitle}) {
    // false = menu ouvert, true = menu fermé (selon la logique existante)
    const [navVisibility, setNavVisibility] = useState(false);

    // Charger l'état du menu depuis les cookies au montage du composant
    useEffect(() => {
        const savedState = getCookie('navVisibility');
        if (savedState !== null) {
            setNavVisibility(savedState === 'true');
        }
    }, []);

    function toggleNavOppening() {
        setNavVisibility((state) => {
            const newState = !state;
            // Sauvegarder le nouvel état dans les cookies
            setCookie('navVisibility', newState.toString());
            return newState;
        });
    }

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <div className={'flex'}>
            <Head title={pageTitle}/>
            <div>
                <NavBar
                    isOpened={navVisibility}
                    isClosed={toggleNavOppening}
                    logOut={handleLogout}
                />
            </div>
            {children}
        </div>
    );
}
