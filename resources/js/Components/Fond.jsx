import RaiseIcon from "@/Components/icons/RaiseIcon.jsx";
import {Link} from "@inertiajs/react";

export default function Fond({foundName, foundAmount, foundRaise, displayFund, fond}) {
    const isNegative = foundRaise < 0;
    return (
        <>
            <article>
                <Link href={route('fond.show', fond)} onClick={displayFund}>
                    <h4>
                        {foundName}
                    </h4>
                    <div className="flex gap-6">
                        <p className="found-name-style">
                            {foundAmount} €
                        </p>
                        <div className="flex items-center gap-2">
                            <p className={isNegative ? "transform -scale-y-100" : ""}>
                                <RaiseIcon/>
                            </p>
                            {foundRaise}%
                        </div>
                    </div>
                </Link>
            </article>
            <span className="bg-gray-300 w-0.5"></span>
        </>
    )
}
