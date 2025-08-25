import BackArrowIcon from "@/Components/icons/BackArrowIcon.jsx";
import AmorceLogo from "@/Components/icons/AmorceLogo.jsx";
import FondIcon from "@/Components/icons/FondIcon.jsx";
import DetenteIcon from "@/Components/icons/DetenteIcon.jsx";
import EventIcon from "@/Components/icons/EventIcon.jsx";
import ProjectIcon from "@/Components/icons/ProjetIcon.jsx";
import UserIcon from "@/Components/icons/UserIcon.jsx";
import SettingsIcon from "@/Components/icons/SettingsIcon.jsx";
import LogoutIcon from "@/Components/icons/LogoutIcon.jsx";
import DashboardIcon from "@/Components/icons/DashboardIcon.jsx";
import { Link, usePage } from "@inertiajs/react";


function NavBar({ isOpened, isClosed, logOut }) {
    const { auth } = usePage().props;
    let navigation;
    if (isOpened) {
        navigation =
            <nav
                className="flex flex-col justify-between border-2 rounded-xl w-10 lg:h-[99%] h-[97%] p-0 lg:p-2 z-20 lg:w-14 border-gray-300 border-solid md:relative fixed bg-white max-lg:left-2 max-lg:top-2">
                <h3 className="sr-only">Navigation Principale</h3>
                <ul>
                    <li className="flex justify-center my-5 min-h-10">
                        <svg className="cursor-pointer" onClick={isClosed} width="24" height="24" viewBox="0 0 24 24"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M4 6H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </li>
                    <li>
                        <ul className="flex-col pl-2">
                            <li className="mb-4">
                                <Link href="/dashboard">
                                    <DashboardIcon />
                                </Link>
                            </li>
                            <li className="mb-4">
                                {auth.user && auth.user.permissions && auth.user.permissions.includes('access-funds') && (
                                    <Link href="/fonds">
                                        <FondIcon />
                                    </Link>
                                )}
                            </li>
                            <li className="mb-4">
                                {auth.user && auth.user.permissions && auth.user.permissions.includes('access-detente') && (
                                    <Link href="/detente">
                                        <DetenteIcon />
                                    </Link>
                                )}
                            </li>
                            <li className="mb-4">
                                {auth.user && auth.user.permissions && auth.user.permissions.includes('access-meetings') && (
                                    <Link href="/evenement">
                                        <EventIcon />
                                    </Link>
                                )}
                            </li>
                            <li className="mb-4">
                                {auth.user && auth.user.permissions && auth.user.permissions.includes('access-projects') && (
                                    <Link href="/project">
                                        <ProjectIcon />
                                    </Link>
                                )}
                            </li>
                            <li className="mb-4">
                                {auth.user && auth.user.permissions && auth.user.permissions.includes('create-users') && (
                                    <Link href='/users'>
                                        <UserIcon />
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="flex-col pl-2">
                    <li className="mb-4 hover:cursor-pointer">
                        <Link href='/compte'>
                            <SettingsIcon />
                        </Link>
                    </li>
                    <li className="mb-4 hover:cursor-pointer" onClick={logOut}>
                        <LogoutIcon />
                    </li>
                </ul>
            </nav>
    } else {
        navigation =
            <nav
                className="flex flex-col justify-between border-2 rounded-xl w-52 lg:h-[99%] h-[97%] z-20 p-2 border-gray-300 border-solid px-4 text-black font-bold md:relative fixed bg-white max-lg:left-2 max-lg:top-2">
                <h3 className="sr-only">Navigation Principale</h3>
                <ul>
                    <li className="flex w-full justify-center align-middle my-5 min-h-10">
                        <AmorceLogo />
                        <div onClick={isClosed} className="hover:cursor-pointer">
                            <BackArrowIcon />
                        </div>
                    </li>
                    <li>
                        <Link href="/dashboard"
                            className="flex mb-3 items-center gap-2">
                            <DashboardIcon />
                            <p>
                                Dashboard
                            </p>
                        </Link>
                    </li>
                    <li>
                        {auth.user && auth.user.permissions && auth.user.permissions.includes('access-funds') && (
                            <Link href="/fonds"
                                className="flex mb-3 items-center gap-2">
                                <FondIcon />
                                <p>
                                    Fonds
                                </p>
                            </Link>
                        )}
                    </li>
                    <li>
                        {auth.user && auth.user.permissions && auth.user.permissions.includes('access-detente') && (
                            <Link href="/detente"
                                className="flex mb-3 items-center gap-2">
                                <DetenteIcon />
                                <p>
                                    Détente
                                </p>
                            </Link>
                        )}
                    </li>
                    <li>
                        {auth.user && auth.user.permissions && auth.user.permissions.includes('access-meetings') && (
                            <Link href="/evenement"
                                className="flex mb-3 items-center gap-2">
                                <EventIcon />
                                <p>
                                    Évenements
                                </p>
                            </Link>
                        )}
                    </li>
                    <li>
                        {auth.user && auth.user.permissions && auth.user.permissions.includes('access-projects') && (
                            <Link href="/project"
                                className="flex mb-3 items-center gap-2">
                                <ProjectIcon />
                                <p>
                                    Projets
                                </p>
                            </Link>
                        )}
                    </li>
                    <li>
                        {auth.user && auth.user.permissions && auth.user.permissions.includes('create-users') && (
                            <Link href='/users' className="flex mb-3 items-center gap-2">
                                <UserIcon />
                                <p>Utilisateurs</p>
                            </Link>
                        )}
                    </li>
                </ul>
                <ul>
                    <li className="mb-4">
                        <Link href="/compte" className="flex items-center gap-2">
                            <SettingsIcon />
                            <p>Paramètres</p>
                        </Link>
                    </li>
                    <li className="flex mb-4 items-center gap-2" onClick={logOut}>
                        <LogoutIcon />
                        <p>Se déconnecter</p>
                    </li>
                </ul>
            </nav>
    }


    return (
        <aside className={`h-[98vh] ${isOpened ? 'w-14' : 'w-52'}`}>
            <h2 className="sr-only">Navigation</h2>
            {navigation}
            {/* Spacer div to ensure content doesn't overlap with the menu */}
            <div className={`hidden md:block ${isOpened ? 'w-14' : 'w-52'}`} aria-hidden="true"></div>
        </aside>
    );
}

export default NavBar;
