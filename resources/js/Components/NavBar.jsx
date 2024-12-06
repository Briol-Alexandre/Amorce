import BackArrowIcon from "@/Components/icons/BackArrowIcon.jsx";
import AmorceLogo from "@/Components/icons/AmorceLogo.jsx";
import FondIcon from "@/Components/icons/FondIcon.jsx";
import DetenteIcon from "@/Components/icons/DetenteIcon.jsx";
import EventIcon from "@/Components/icons/EventIcon.jsx";
import UserIcon from "@/Components/icons/UserIcon.jsx";
import LogoutIcon from "@/Components/icons/LogoutIcon.jsx";
import DashboardIcon from "@/Components/icons/DashboardIcon.jsx";
import {Link, router} from "@inertiajs/react";

function NavBar({isOpened, isClosed, logOut}) {
    let navigation;
    if (isOpened) {
        navigation =
            <nav
                className="flex flex-col justify-between border-2 rounded-xl w-14 h-full p-2 border-gray-300 border-solid">
                <h3 className="sr-only">Navigation Principale</h3>
                <ul>
                    <li className="flex justify-center my-5 min-h-10">
                        <svg className="cursor-pointer" onClick={isClosed} width="24" height="24" viewBox="0 0 24 24"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M4 6H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </li>
                    <li>
                        <ul className="flex-col pl-2">
                            <li className="mb-4">
                                <Link href="/dashboard">
                                    <DashboardIcon/>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/fonds">
                                    <FondIcon/>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/detente">
                                    <DetenteIcon/>
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/evenement">
                                    <EventIcon/>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="flex-col pl-2">
                    <li className="mb-4">
                        <Link href='/compte'>
                            <UserIcon/>
                        </Link>
                    </li>
                    <li className="mb-4 hover:cursor-pointer" onClick={logOut}>
                        <LogoutIcon/>
                    </li>
                </ul>
            </nav>
    } else {
        navigation =
            <nav
                className="flex flex-col justify-between border-2 rounded-xl w-52 h-full p-2 border-gray-300 border-solid px-4 text-black font-bold">
                <h3 className="sr-only">Navigation Principale</h3>
                <ul>
                    <li className="flex w-full justify-center align-middle my-5 min-h-10">
                        <AmorceLogo/>
                        <div onClick={isClosed} className="hover:cursor-pointer">
                            <BackArrowIcon/>
                        </div>
                    </li>
                    <li>
                        <Link href="/dashboard"
                              className="flex mb-4 items-center gap-2">
                            <DashboardIcon/>
                            <p>
                                Dashboard
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/fonds"
                              className="flex mb-4 items-center gap-2">
                            <FondIcon/>
                            <p>
                                Fonds
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/detente"
                              className="flex mb-4 items-center gap-2">
                            <DetenteIcon/>
                            <p>
                                Détente
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/evenement"
                              className="flex mb-4 items-center gap-2">
                            <EventIcon/>
                            <p>
                                Évenements
                            </p>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link href='/compte' className="flex mb-4 items-center gap-2">
                            <UserIcon/>
                            <p>Utilisateurs</p>
                        </Link>
                    </li>
                    <li className="flex mb-4 items-center gap-2" onClick={logOut}>
                        <LogoutIcon/>
                        <p>Se déconnecter</p>
                    </li>
                </ul>
            </nav>
    }


    return (
        <aside className="h-screen">
            <h2 className="sr-only">Navigation</h2>
        {navigation}
        </aside>
    );
}

export default NavBar;
