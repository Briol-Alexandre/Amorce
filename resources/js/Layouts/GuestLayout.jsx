import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import AmorceLogo from "@/Components/icons/AmorceLogo.jsx";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center w-full sm:w-1/2 p-6 bg-white sm:justify-center border border-gray-300 sm:rounded-lg">
                <div>
                    <Link href="/">
                        <AmorceLogo height={68} width={260} />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
