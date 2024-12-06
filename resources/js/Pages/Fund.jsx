import {FundInfo} from "@/Components/FundInfo.jsx";
import {usePage} from "@inertiajs/react";

export function Fund() {
    const {fond} = usePage().props
    console.log(fond)
    return (
        <p>{fond.name}</p>
    )
}
