import RaiseIcon from "@/Components/icons/RaiseIcon.jsx";

export default function Fond({foundName, foundAmount, foundRaise}) {
    const isNegative = foundRaise < 0;
    return (
        <>
            <article className={'hover:cursor-pointer'}>
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
            </article>
            <span className="bg-gray-300 w-0.5"></span>
        </>
    )
}
