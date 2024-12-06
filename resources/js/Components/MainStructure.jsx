import {Head, router} from "@inertiajs/react";
import NavBar from "@/Components/NavBar.jsx";
import {useState} from "react";

export default function MainStructure({children, pageTitle}) {
    const [navVisibility, setNavVisibility] = useState(true);

    function toggleNavOppening() {
        setNavVisibility((state) => !state);
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
